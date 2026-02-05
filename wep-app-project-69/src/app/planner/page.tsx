// src/app/planner/page.tsx
// src/app/planner/page.tsx
import { db } from "@/lib/db";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Calendar, Coffee, Sun, Moon, Trash2, PlusCircle, Utensils } from 'lucide-react';
import Link from 'next/link';
import { removeMealFromPlan } from '@/app/actions/planner'; // เรียกใช้ Action

// ฟังก์ชันหาช่วงวันของสัปดาห์ปัจจุบัน (จันทร์ - อาทิตย์)
function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
  const numDay = today.getDate();

  const start = new Date(today);
  // ปรับให้เริ่มวันจันทร์ (ถ้าวันนี้วันอาทิตย์ dayOfWeek=0 ให้ลบ 6 วัน)
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const days = [];
  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    days.push({
      name: thaiDays[current.getDay()],
      dateDisplay: current.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
      fullDate: current,
      isToday: current.toDateString() === today.toDateString()
    });
  }
  return days;
}

export default async function MealPlanner() {
  // 1. ตรวจสอบ Login
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const session = await decrypt(sessionToken);
  if (!session?.userId) redirect('/login');

  const userId = Number(session.userId);
  const weekDays = getWeekDates();

  // 2. ดึงข้อมูล MealPlan ของ User คนนี้ เฉพาะในช่วงสัปดาห์นี้
  const startDate = weekDays[0].fullDate;
  const endDate = new Date(weekDays[6].fullDate);
  endDate.setHours(23, 59, 59, 999);

  const plans = await db.mealPlan.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      recipe: true // ดึงรายละเอียดสูตรอาหารมาด้วย (รูป, ชื่อ)
    }
  });

  // 3. จัดกลุ่มข้อมูลให้ใช้ง่ายขึ้น: plansMap['วันที่_มื้อ'] = plan
  const plansMap: Record<string, any> = {};
  plans.forEach(p => {
    const key = `${p.date.toDateString()}_${p.slot}`;
    plansMap[key] = p;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="text-orange-500 w-8 h-8" />
              ตารางอาหารรายสัปดาห์
            </h1>
            <p className="text-gray-500 mt-1 ml-11">วางแผนดี มีชัยไปกว่าครึ่ง!</p>
          </div>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weekDays.map((day, index) => (
            <div 
              key={day.name} 
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col
                ${day.isToday ? 'ring-2 ring-orange-400 ring-offset-2' : ''} 
              `}
            >
              {/* Card Header */}
              <div className={`p-3 flex justify-between items-center ${day.isToday ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                <span className="font-bold text-lg">{day.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${day.isToday ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {day.dateDisplay}
                </span>
              </div>

              {/* Meal Slots */}
              <div className="p-4 space-y-4 flex-1">
                <MealSlot 
                  dayDate={day.fullDate} 
                  slot="breakfast" 
                  label="เช้า" 
                  icon={<Coffee size={16} />} 
                  color="text-amber-600" 
                  bgColor="bg-amber-50" 
                  plan={plansMap[`${day.fullDate.toDateString()}_breakfast`]} 
                />
                <MealSlot 
                  dayDate={day.fullDate} 
                  slot="lunch" 
                  label="เที่ยง" 
                  icon={<Sun size={16} />} 
                  color="text-orange-600" 
                  bgColor="bg-orange-50" 
                  plan={plansMap[`${day.fullDate.toDateString()}_lunch`]} 
                />
                <MealSlot 
                  dayDate={day.fullDate} 
                  slot="dinner" 
                  label="เย็น" 
                  icon={<Moon size={16} />} 
                  color="text-indigo-600" 
                  bgColor="bg-indigo-50" 
                  plan={plansMap[`${day.fullDate.toDateString()}_dinner`]} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component ย่อย: แสดง Slot และปุ่มลบ (Server Action ผ่าน Form)
function MealSlot({ dayDate, slot, label, icon, color, bgColor, plan }: any) {
  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`${color} p-1 rounded-md ${bgColor}`}>{icon}</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      
      {plan ? (
        // กรณีมีเมนู: แสดงการ์ด + ปุ่มลบ
        <div className="relative bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm hover:border-orange-300 transition group-hover:shadow-md flex gap-2">
          {/* รูปเล็กๆ (ถ้ามี) */}
          {plan.recipe.imageUrl && (
             <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                <img src={plan.recipe.imageUrl} className="w-full h-full object-cover" />
             </div>
          )}
          
          <div className="flex-1 min-w-0">
            <Link href={`/recipes/${plan.recipe.id}`} className="text-sm font-medium text-gray-800 line-clamp-1 hover:text-orange-600">
               {plan.recipe.title}
            </Link>
            <p className="text-[10px] text-gray-400 truncate">{plan.recipe.category}</p>
          </div>

          {/* ปุ่มลบ (Server Action) */}
          <form action={async () => {
            'use server'
            await removeMealFromPlan(plan.id)
          }}>
            <button className="text-gray-300 hover:text-red-500 p-1">
              <Trash2 size={14} />
            </button>
          </form>
        </div>
      ) : (
        // กรณีว่าง: แสดงปุ่มเพิ่ม (ตอนนี้ให้เป็น Link เปล่าๆ หรือ Link ไปหน้าค้นหา)
        <Link 
          href={`/search?select_for=${slot}&date=${dayDate.toISOString()}`} // ในอนาคตเราจะทำหน้า Search ให้รองรับ param นี้
          className="w-full border border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition flex items-center justify-center gap-1 group/btn block"
        >
          <PlusCircle size={14} className="text-gray-400 group-hover/btn:text-orange-500" />
          <span className="text-xs text-gray-400 font-medium group-hover/btn:text-orange-600">เลือกเมนู</span>
        </Link>
      )}
    </div>
  );
}