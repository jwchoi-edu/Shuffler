import React, { useState } from 'react'
import type { Seat } from '../App'

interface SeatItemProps {
  seat: Seat
  isShuffling: boolean
  onToggleExclude: (id: number) => void
  onTogglePin: (id: number) => void
  onDragAndDrop: (sourceId: number, targetId: number) => void
}

const SeatItem: React.FC<SeatItemProps> = ({
  seat,
  isShuffling,
  onToggleExclude,
  onTogglePin,
  onDragAndDrop,
}) => {
  const { id, displayNumber, isExcluded, isPinned } = seat
  const [isDragOver, setIsDragOver] = useState(false)

  const shuffleAnimationClass =
    isShuffling && !isPinned && !isExcluded ? 'animate-shuffle-shake' : ''

  const handleDragStart = (e: React.DragEvent) => {
    if (isExcluded || isShuffling) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', id.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isExcluded && !isShuffling) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const sourceId = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(sourceId) && !isExcluded) {
      onDragAndDrop(sourceId, id)
    }
  }

  let bgClass =
    'bg-white border-slate-200 hover:border-violet-300 cursor-grab active:cursor-grabbing'
  if (isExcluded)
    bgClass = 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
  else if (isPinned)
    bgClass =
      'bg-amber-50 border-amber-300 shadow-xs cursor-grab active:cursor-grabbing'

  const dragOverClass = isDragOver
    ? 'border-dashed border-violet-500 bg-violet-50/50 scale-102'
    : ''

  return (
    <div
      draggable={!isExcluded && !isShuffling}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      // 💡 aspect-square와 w-full을 통하여 부모 격자 크기에 100% 맞춰 반응하게 만듭니다.
      className={`relative w-full aspect-square border rounded-lg flex items-center justify-center select-none transition-all duration-150 ${bgClass} ${dragOverClass} ${shuffleAnimationClass}`}
    >
      {/* 상단 버튼 레이어 - 유연하게 고정 */}
      <div className="absolute top-1 left-1 right-1 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleExclude(id)
          }}
          disabled={isShuffling}
          className={`w-5 h-5 rounded-xs text-[12px] flex items-center justify-center font-extrabold transition-colors cursor-pointer disabled:cursor-not-allowed ${
            isExcluded
              ? 'bg-rose-500 text-white'
              : 'bg-slate-200 hover:bg-rose-100 text-slate-600'
          }`}
        >
          ✕
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onTogglePin(id)
          }}
          disabled={isShuffling || isExcluded}
          className={`w-5 h-5 rounded-xs text-[12px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed ${
            isPinned
              ? 'bg-amber-500 text-white'
              : 'bg-slate-200 hover:bg-amber-100 text-slate-600'
          }`}
        >
          📌
        </button>
      </div>

      {/* 중앙 메인 번호 - 글자가 아주 좁은 칸에서도 안 깨지도록 텍스트 크기 가변 유연성 유지 */}
      <span
        className={`pointer-events-none pt-2 font-bold transition-all duration-150 ${
          // 기본 모바일에서 text-2xl, 큰 화면(md)에서 최대 text-5xl까지 확장
          isExcluded
            ? 'text-2xl sm:text-3xl md:text-4xl text-rose-400'
            : isPinned
              ? 'text-2xl sm:text-3xl md:text-5xl text-amber-600'
              : 'text-2xl sm:text-3xl md:text-5xl text-slate-700'
        }`}
      >
        {displayNumber}
      </span>
    </div>
  )
}

export default SeatItem
