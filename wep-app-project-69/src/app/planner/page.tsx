export default function MealPlanner() {
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">แผนอาหารรายสัปดาห์ 📅</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="border rounded-lg p-3 bg-white min-h-[200px]">
            <h3 className="font-bold text-center mb-4 bg-gray-100 py-1 rounded">{day}</h3>
            
            {/* Slot มื้ออาหาร */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase">เช้า</div>
              <div className="bg-orange-50 p-2 rounded text-sm border border-orange-100 cursor-pointer hover:bg-orange-100">
                + เพิ่มเมนู
              </div>
              
              <div className="text-xs text-gray-500 uppercase mt-2">เย็น</div>
              <div className="bg-blue-50 p-2 rounded text-sm border border-blue-100">
                แกงส้มชะอมกุ้ง
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}