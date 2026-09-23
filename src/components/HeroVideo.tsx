import { useEffect, useRef, useState } from 'react'

const START_AT = 12

/**
 * Vídeo de fundo do hero, servido localmente (public/videos/hero-video.mp4).
 * Fica invisível (mostrando o degradê azul) até o vídeo realmente começar a
 * tocar — assim o visitante nunca vê o player carregando no meio da tela.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function skipIntro() {
      if (!video) return
      video.currentTime = START_AT
      video.play().catch(() => {})
    }
    function handlePlaying() {
      setPlaying(true)
    }

    video.addEventListener('loadedmetadata', skipIntro)
    video.addEventListener('ended', skipIntro)
    video.addEventListener('playing', handlePlaying)
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('loadedmetadata', skipIntro)
      video.removeEventListener('ended', skipIntro)
      video.removeEventListener('playing', handlePlaying)
    }
  }, [])

  return (
    <div className={`hero-video ${playing ? 'is-playing' : ''}`} aria-hidden="true">
      <video ref={videoRef} src="/videos/hero-video.mp4" autoPlay muted playsInline preload="auto" />
      <div className="hero-video-overlay"></div>
    </div>
  )
}
