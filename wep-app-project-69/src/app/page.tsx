import { db } from "@/lib/db"; // เรียกใช้ตัวเชื่อม DB ที่เราสร้างไว้
import Link from "next/link";

export default async function Home() {
  // ดึงข้อมูลสูตรอาหารทั้งหมดจาก Database (รวมข้อมูลคนแต่งด้วย)
  const recipes = await db.recipe.findMany({
    include: {
      author: true,
      ingredients: {
        include: { ingredient: true }
      }
    },
    orderBy: { createdAt: 'desc' } // เรียงจากใหม่ไปเก่า
  });

  return (
    <div className="bg-[url('/images/BG.jpg')] bg-cover bg-center bg-no-repeat min-h-screen pt-6">
      <div  className="dashMain">
        <div className="min-h-screen bg-gray-50 pb-10 rounded-t-2xl overflow-hidden">
          {/* Hero Section */}
          <header className="bg-orange-500 text-white py-20 text-center shadow-lg">
            <h1 className="text-5xl font-bold mb-4">คลังสูตรอาหาร</h1>
            <p className="text-xl opacity-90 mb-8">
              รวบรวมและจัดการสูตรอาหาร
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/login" 
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </header>

          

          {/* Recipe Showcase */}
          <main className="container mx-auto px-4 mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
              สูตรอาหาร
            </h2>

            {recipes.length === 0 ? (
              <p className="text-gray-500 text-center py-10">ยังไม่มีสูตรอาหารในระบบ</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100">
                    {/* Image Placeholder */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      {recipe.imageUrl ? (
                        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover"/>
                      ) : (
                        <span className="text-4xl"></span>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{recipe.title}</h3>
                        <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                          {recipe.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {recipe.description}
                      </p>

                      {/* แสดงวัตถุดิบ 3 อย่างแรก */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">วัตถุดิบหลัก:</p>
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.slice(0, 3).map((item) => (
                            <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {item.ingredient.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 border-t pt-4">
                        <span className="text-xs text-gray-500">
                          โดย {recipe.author.name}
                        </span>
                        <Link 
                          href={`/recipes/${recipe.id}`} 
                          className="text-orange-500 font-semibold hover:text-orange-600 text-sm flex items-center gap-1"
                        >
                          ดูวิธีทำ &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}