"use client";

import React from 'react';
import { Search, User, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
// ลบ ChefHat, PlusCircle ออก เพราะย้ายไป Navbar แล้ว

export default function HomePage() {
  const menuItems = [
    { id: 1, name: "สปาเก็ตตี้คาโบนาร่า", author: "Chef A", liked: false },
    { id: 2, name: "ต้มยำกุ้งน้ำข้น", author: "Mom Cooking", liked: false },
    { id: 3, name: "ข้าวมันไก่ตอน", author: "Street Food", liked: false },
    { id: 4, name: "แกงเขียวหวาน", author: "Grandma Recipe", liked: false },
    { id: 5, name: "ผัดไทยกุ้งสด", author: "Thai Kitchen", liked: false },
    { id: 6, name: "บิงซูสตรอว์เบอร์รี", author: "Sweet Tooth", liked: true },
  ];

  return (
    // ลบ Navbar เดิมออก และเอา div wrapper เดิมออกบางส่วนได้เลย
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans selection:bg-orange-200">

      {/* Search Bar (Floating) */}
      <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 w-full max-w-2xl bg-white p-2 rounded-full shadow-lg border border-stone-100">
              <div className="pl-4 text-stone-400">
                  <Search size={20} />
              </div>
              <input 
              type="text" 
              placeholder="วันนี้คุณอยากทานอะไร?..." 
              className="w-full bg-transparent px-4 py-2 outline-none text-stone-700 placeholder:text-stone-400"
              />
              <button className="bg-orange-500 text-white px-8 py-2.5 rounded-full hover:bg-orange-600 shadow-md hover:shadow-orange-200 transition-all font-medium">
              ค้นหา
              </button>
          </div>
      </div>

      {/* --- Section 1: Popular Menu (Hero Section) --- */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
           <h2 className="text-3xl font-bold text-stone-800">เมนูยอดฮิตประจำสัปดาห์</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[380px]">
          
          {/* Left: Info Card */}
          <div className="bg-white p-10 flex flex-col justify-between rounded-3xl shadow-xl border border-stone-100 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>

            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full mb-4">
                  RECOMMENDED
              </span>
              <h1 className="text-5xl font-bold text-stone-800 mb-2 leading-tight">ข้าวผัด<br/>อเมริกัน</h1>
              <p className="text-stone-500 text-lg">โดย เชฟกระทะเหล็ก</p>
            </div>
            
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100">
                  <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map((s) => <Star key={s} fill="currentColor" size={20} />)}
                  </div>
                  <span className="text-xl font-bold text-stone-700">4.9</span>
              </div>
              <button className="text-orange-500 font-semibold hover:underline">ดูสูตรอาหาร →</button>
            </div>
          </div>

          {/* Right: Image Card (Placeholder) */}
          <div className="bg-stone-200 relative rounded-3xl shadow-inner border border-stone-300/50 flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 group-hover:scale-105 transition-transform duration-700"></div>
            <span className="relative z-10 text-stone-400 font-medium text-2xl tracking-widest bg-white/50 px-6 py-2 rounded-lg backdrop-blur-sm">
              Food Image
            </span>
            <button className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm p-3 rounded-full text-stone-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-20">
              <Heart size={28} />
            </button>
          </div>

        </div>
      </section>

      {/* --- Section 2: Grid List (Explore) --- */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-stone-700">สูตรอาหารทั้งหมด</h2>
           <button className="text-sm text-stone-500 hover:text-orange-500 transition-colors">ดูทั้งหมด</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          {menuItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100 cursor-pointer">
              {/* Image Area */}
              <div className="h-56 bg-stone-200 relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 <span className="text-stone-400 text-lg group-hover:scale-110 transition-transform duration-500">Image</span>
                 <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
                  {item.liked ? (
                     <Heart size={20} fill="#ef4444" className="text-red-500" />
                  ) : (
                     <Heart size={20} className="text-stone-400 hover:text-red-500" />
                  )}
                </button>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-stone-800 mb-1 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-stone-500 flex items-center gap-1">
                      <User size={14} /> {item.author}
                  </p>
                  <div className="flex text-yellow-400 gap-0.5">
                      <Star size={14} fill="currentColor"/>
                      <span className="text-xs text-stone-400 ml-1">(4.5)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
            <ChevronLeft size={20} />
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full font-medium shadow-md shadow-orange-200">1</button>
          <button className="w-10 h-10 flex items-center justify-center text-stone-600 rounded-full hover:bg-stone-100 transition-all">2</button>
          <span className="text-stone-300">...</span>
          <button className="w-10 h-10 flex items-center justify-center text-stone-600 rounded-full hover:bg-stone-100 transition-all">9</button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

    </main>
  );
}