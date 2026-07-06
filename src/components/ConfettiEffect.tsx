import { useEffect, useState } from 'react'

interface ConfettiEffectProps {
  active: boolean
}

interface Particle {
  id: number
  left: string
  delay: string
  color: string
  size: string
  tx: string
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ active }) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (active) {
      const colors = [
        '#34d399',
        '#f59e0b',
        '#ec4899',
        '#3b82f6',
        '#a855f7',
        '#ef4444',
      ]
      const newParticles: Particle[] = Array.from({ length: 60 }).map(
        (_, i) => ({
          id: Date.now() + i,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 0.4}s`,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: `${Math.random() * 10 + 6}px`,
          tx: `${(Math.random() - 0.5) * 350}px`,
        }),
      )
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [active])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute -top-5 rounded-xs animate-confetti-fall"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            ['--tw-tx' as string]: p.tx,
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiEffect
