import React, { useCallback, useEffect, useState } from 'react'
import ConfettiEffect from './components/ConfettiEffect'
import SeatGrid from './components/SeatGrid'
import './App.css'

export interface Seat {
  id: number
  displayNumber: number | string
  isExcluded: boolean
  isPinned: boolean
}

const App: React.FC = () => {
  const [rows, setRows] = useState<string | number>(5)
  const [cols, setCols] = useState<string | number>(6)
  const [seats, setSeats] = useState<Seat[]>([])
  const [isShuffling, setIsShuffling] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(5)
  const [isJustFinished, setIsJustFinished] = useState<boolean>(false)

  const isRowsError = rows === '' || isNaN(Number(rows)) || Number(rows) < 1
  const isColsError = cols === '' || isNaN(Number(cols)) || Number(cols) < 1
  const hasValueError = isRowsError || isColsError

  const generateSeats = useCallback((r: number, c: number) => {
    const total = r * c
    const newSeats: Seat[] = []
    let currentNumber = 1

    for (let i = 1; i <= total; i++) {
      newSeats.push({
        id: i,
        displayNumber: currentNumber++,
        isExcluded: false,
        isPinned: false,
      })
    }
    setSeats(newSeats)
  }, [])
  useEffect(() => {
    if (!hasValueError) {
      generateSeats(Number(rows), Number(cols))
    }
  }, [rows, cols, hasValueError, generateSeats])

  const recalculateSeatNumbers = (currentSeats: Seat[]): Seat[] => {
    let currentNumber = 1
    return currentSeats.map((seat) => {
      if (seat.isExcluded) return { ...seat, displayNumber: 'X' }
      return { ...seat, displayNumber: currentNumber++ }
    })
  }

  const handleToggleExclude = (id: number) => {
    if (isShuffling) return
    const updated = seats.map((seat) =>
      seat.id === id
        ? { ...seat, isExcluded: !seat.isExcluded, isPinned: false }
        : seat,
    )
    setSeats(recalculateSeatNumbers(updated))
  }

  const handleTogglePin = (id: number) => {
    if (isShuffling) return
    const updated = seats.map((seat) =>
      seat.id === id && !seat.isExcluded
        ? { ...seat, isPinned: !seat.isPinned }
        : seat,
    )
    setSeats(updated)
  }

  const handleDragAndDrop = (sourceId: number, targetId: number) => {
    if (isShuffling || sourceId === targetId) return

    const sourceSeat = seats.find((s) => s.id === sourceId)
    const targetSeat = seats.find((s) => s.id === targetId)

    if (
      !sourceSeat ||
      !targetSeat ||
      sourceSeat.isExcluded ||
      targetSeat.isExcluded
    )
      return

    const updatedSeats = [...seats]
    const sourceIndex = seats.findIndex((s) => s.id === sourceId)
    const targetIndex = seats.findIndex((s) => s.id === targetId)

    updatedSeats[sourceIndex] = targetSeat
    updatedSeats[targetIndex] = sourceSeat

    setSeats(updatedSeats)
  }

  const startShuffle = () => {
    if (isShuffling || hasValueError) return
    setIsShuffling(true)
    setCountdown(5)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isShuffling && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    } else if (isShuffling && countdown === 0) {
      const nextSeats = [...seats]

      const targetIndices: number[] = []

      for (const [index, seat] of nextSeats.entries())
        if (!seat.isPinned && !seat.isExcluded) targetIndices.push(index)

      const targetNumbers = targetIndices.map(
        (idx) => nextSeats[idx].displayNumber,
      )

      for (let i = targetNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[targetNumbers[i], targetNumbers[j]] = [
          targetNumbers[j],
          targetNumbers[i],
        ]
      }

      targetIndices.forEach((targetIdx, i) => {
        nextSeats[targetIdx] = {
          ...nextSeats[targetIdx],
          displayNumber: targetNumbers[i],
        }
      })

      setSeats(nextSeats)
      setIsShuffling(false)
      setIsJustFinished(true)

      setTimeout(() => setIsJustFinished(false), 2500)
    }
    return () => clearTimeout(timer)
  }, [isShuffling, countdown, seats])

  return (
    <div className="h-screen max-h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden select-none relative">
      <ConfettiEffect active={isJustFinished} />
      <main className="flex-1 w-full flex items-center justify-center overflow-hidden p-6">
        {hasValueError ? (
          <div className="text-center text-slate-400 font-medium text-lg">
            하단에 올바른 행과 열의 숫자를 입력해 주세요 (1 이상)
          </div>
        ) : (
          <SeatGrid
            seats={seats}
            rows={Number(rows)}
            cols={Number(cols)}
            isShuffling={isShuffling}
            isJustFinished={isJustFinished}
            onToggleExclude={handleToggleExclude}
            onTogglePin={handleTogglePin}
            onDragAndDrop={handleDragAndDrop}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-sm flex items-center justify-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
              행
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={rows}
              disabled={isShuffling}
              onChange={(e) => setRows(e.target.value)}
              className={`w-16 px-2.5 py-1.5 border rounded-lg text-center text-sm font-semibold transition-all focus:outline-hidden focus:ring-2 disabled:bg-slate-100 ${
                isRowsError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-300 focus:ring-violet-500/20 focus:border-violet-500'
              }`}
              placeholder="행"
            />
          </div>

          <div className="min-w-45 min-h-9 flex justify-center">
            {isShuffling ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-violet-600 animate-count-bounce">
                  {countdown}
                </span>
              </div>
            ) : isJustFinished ? (
              <span className="text-sm font-bold text-emerald-600 animate-fade-in py-1">
                🎉 완료되었습니다!
              </span>
            ) : (
              <button
                onClick={startShuffle}
                disabled={seats.length === 0 || hasValueError}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-xs transition-all duration-150 cursor-pointer disabled:cursor-not-allowed transform active:scale-98"
              >
                🎲 자리 섞기
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
              열
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cols}
              disabled={isShuffling}
              onChange={(e) => setCols(e.target.value)}
              className={`w-16 px-2.5 py-1.5 border rounded-lg text-center text-sm font-semibold transition-all focus:outline-hidden focus:ring-2 disabled:bg-slate-100 ${
                isColsError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-300 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
              placeholder="열"
            />
          </div>
        </div>
        <div className="hidden md:flex absolute right-6 items-center">
          <a
            href="https://github.com/jwchoi-edu/Shuffler"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
          >
            <svg
              height="18"
              width="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="transition-transform duration-200 hover:scale-110"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>by Jongwon Choi</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
