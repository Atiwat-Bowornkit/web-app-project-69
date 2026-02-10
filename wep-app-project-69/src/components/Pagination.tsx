// src/components/Pagination.tsx
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string // เช่น "/dashboard"
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // ถ้ามีหน้าเดียว ไม่ต้องโชว์ปุ่ม
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* ปุ่มย้อนกลับ (Previous) */}
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-3 py-2 rounded-md bg-white border hover:bg-gray-100 text-gray-700"
        >
          &lt; ก่อนหน้า
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md bg-gray-100 border text-gray-400 cursor-not-allowed">
          &lt; ก่อนหน้า
        </span>
      )}

      {/* เลขหน้า (Page Numbers) */}
      <span className="text-sm font-medium text-gray-700">
        หน้า {currentPage} จาก {totalPages}
      </span>

      {/* ปุ่มถัดไป (Next) */}
      {currentPage < totalPages ? (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-3 py-2 rounded-md bg-white border hover:bg-orange-50 text-orange-600 border-orange-200"
        >
          ถัดไป &gt;
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md bg-gray-100 border text-gray-400 cursor-not-allowed">
          ถัดไป &gt;
        </span>
      )}
    </div>
  )
}