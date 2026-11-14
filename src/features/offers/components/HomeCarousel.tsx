import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

export interface CarouselSlide {
  id: string
  /** Classes de degradê do tema. */
  tone: string
  eyebrow: string
  title: string
  subtitle: ReactNode
  /** Contagem ou selo, abaixo do subtítulo. */
  chip?: ReactNode
  to: string
}

interface HomeCarouselProps {
  slides: CarouselSlide[]
}

const AUTO_ADVANCE_MS = 4000
const SWIPE_THRESHOLD_PX = 40

/**
 * Carrossel do topo da tela inicial: preenche o topo por trás da barra do app, troca a cada 4 s,
 * aceita arrastar e tocar nos indicadores.
 */
export function HomeCarousel({ slides }: HomeCarouselProps) {
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const startX = useRef(0)
  const moved = useRef(false)
  const count = slides.length
  // O número de slides muda ao entrar ou sair (o de pontos só existe logado).
  const current = Math.min(index, count - 1)

  // Troca sozinho; recomeça a contar a cada mudança e pausa durante o arrasto.
  useEffect(() => {
    if (count < 2 || dragging) return
    const timer = setInterval(() => setIndex((current + 1) % count), AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [count, current, dragging])

  useEffect(() => {
    if (!dragging) return
    function onMove(event: PointerEvent) {
      const dx = event.clientX - startX.current
      if (Math.abs(dx) > 6) moved.current = true
      setDragX(dx)
    }
    function onEnd(event: PointerEvent) {
      const dx = event.type === 'pointercancel' ? 0 : event.clientX - startX.current
      setDragging(false)
      setDragX(0)
      if (dx <= -SWIPE_THRESHOLD_PX) setIndex((current + 1) % count)
      else if (dx >= SWIPE_THRESHOLD_PX) setIndex((current - 1 + count) % count)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onEnd)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
    }
  }, [dragging, count, current])

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
        startX.current = event.clientX
        moved.current = false
        setDragging(true)
      }}
      className="relative touch-pan-y select-none overflow-hidden"
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transform: `translateX(calc(${-current * 100}% + ${dragX}px))`,
          transitionDuration: dragging ? '0ms' : undefined,
        }}
      >
        {slides.map((slide, position) => (
          <Link
            key={slide.id}
            to={slide.to}
            draggable={false}
            inert={position !== current}
            onClick={(event) => {
              // Depois de um arrasto, o toque que o encerra não abre o slide.
              if (moved.current) event.preventDefault()
              moved.current = false
            }}
            className={`flex min-h-72 w-full flex-none flex-col justify-end px-5 pb-12 pt-[calc(env(safe-area-inset-top)+6rem)] text-white lg:min-h-80 lg:px-0 lg:pt-[calc(env(safe-area-inset-top)+7rem)] ${slide.tone}`}
          >
            <span className="mx-auto flex w-full max-w-5xl flex-col items-start gap-1 lg:px-6">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                {slide.eyebrow}
              </span>
              <span className="text-[22px] font-bold leading-tight lg:text-3xl">{slide.title}</span>
              <span className="text-sm opacity-95 lg:text-base">{slide.subtitle}</span>
              {slide.chip && (
                <span className="mt-1.5 inline-flex items-center rounded-md bg-white/25 px-2.5 py-0.5 text-[15px] font-bold">
                  {slide.chip}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
      {/* Sombra suave no alto, para a barra do app em branco ficar legível sobre o degradê. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-linear-to-b from-black/35 to-transparent" />
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
          {slides.map((slide, position) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ir para o slide ${position + 1}`}
              aria-current={position === current ? 'true' : undefined}
              onClick={() => setIndex(position)}
              onPointerDown={(event) => event.stopPropagation()}
              className="flex size-11 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all ${position === current ? 'w-5 bg-white' : 'w-1.5 bg-white/55'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
