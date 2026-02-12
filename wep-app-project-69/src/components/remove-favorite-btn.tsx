'use client'

import { toggleFavorite } from '@/app/actions' // เรียกใช้ Action กลาง
import { useTransition } from 'react'

export default function RemoveFavoriteBtn({ recipeId }: { recipeId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => toggleFavorite(recipeId))}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full transition-colors border border-red-100"
    >
      {isPending ? 'กำลังลบ...' : '💔 เลิกถูกใจ'}
    </button>
  )
}