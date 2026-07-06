import React from 'react'
import type { Seat } from '../App'
import SeatItem from './SeatItem'

interface SeatGridProps {
  seats: Seat[]
  rows: number
  cols: number
  isShuffling: boolean
  isJustFinished: boolean
  onToggleExclude: (id: number) => void
  onTogglePin: (id: number) => void
  onDragAndDrop: (sourceId: number, targetId: number) => void
}

const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  rows,
  cols,
  isShuffling,
  isJustFinished,
  onToggleExclude,
  onTogglePin,
  onDragAndDrop,
}) => {
  return (
    <div
      className={`grid gap-2.5 w-full h-full items-center justify-center justify-items-center transition-all ${
        isJustFinished ? 'animate-pop-success' : ''
      }`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        // 💡 좌우/상하 꽉 차게 조절하되, 좌석 배치 비율(가로/세로 비율)을 80vh 한도 내에서 극대화
        maxWidth: `calc(${cols} / ${rows} * 78vh)`,
        maxHeight: '100%',
      }}
    >
      {seats.map((seat) => (
        <SeatItem
          key={seat.id}
          seat={seat}
          isShuffling={isShuffling}
          onToggleExclude={onToggleExclude}
          onTogglePin={onTogglePin}
          onDragAndDrop={onDragAndDrop}
        />
      ))}
    </div>
  )
}

export default SeatGrid
