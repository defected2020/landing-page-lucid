import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import Image from 'next/image'
import { useTheme } from '../contexts/ThemeContext'

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--bg);
`


const LightBackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(to bottom, #0b0d1a 0%, #0b0d1a 18%, transparent 40%);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(11, 13, 26, 0.5) 0%, transparent 50%);
    z-index: 1;
  }
`

const GrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  pointer-events: none;
  z-index: 2;
`

const Container = styled.div`
  position: relative;
  z-index: 3;
  max-width: var(--container-max);
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: flex;
  align-items: center;
  min-height: 100vh;
`

const Content = styled.div`
  max-width: 620px;
  padding: 6rem 0;

  @media (max-width: 768px) {
    text-align: center;
    max-width: 100%;
  }
`

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.$onImage ? 'rgba(255,255,255,0.2)' : 'var(--border)')};
  font-size: 0.8125rem;
  color: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)')};
  margin-bottom: 2rem;
  backdrop-filter: blur(4px);
  background: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.08)' : 'var(--hover-overlay)')};

  svg {
    width: 14px;
    height: 14px;
    color: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.9)' : 'var(--accent)')};
  }
`

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${(props) => (props.$onImage ? '#ffffff' : 'var(--text)')};
  margin-bottom: 1.5rem;
  line-height: 1.1;
`

const Cursor = styled(motion.span)`
  display: inline-block;
  width: 3px;
  height: 0.85em;
  background-color: var(--accent);
  margin-left: 4px;
  vertical-align: baseline;
  border-radius: 1px;
`

const SubtitleText = styled(motion.p)`
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)')};
  max-width: 540px;
  margin-bottom: 2.5rem;
  line-height: 1.7;

  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  background-color: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  transition: all var(--transition-medium);

  &:hover {
    background-color: var(--accent-hover);
    box-shadow: 0 0 30px var(--accent-glow);
    transform: translateY(-1px);
  }
`

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  background-color: transparent;
  color: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)')};
  border: 1px solid ${(props) => (props.$onImage ? 'rgba(255,255,255,0.25)' : 'var(--border)')};
  cursor: pointer;
  transition: all var(--transition-medium);

  &:hover {
    border-color: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.5)' : 'var(--border-hover)')};
    color: ${(props) => (props.$onImage ? '#ffffff' : 'var(--text)')};
    background-color: ${(props) => (props.$onImage ? 'rgba(255,255,255,0.1)' : 'var(--hover-overlay)')};
  }
`

const STATIC_LINE = 'We Build Software'

const ROTATING_PHRASES = ['That Matters', 'That Counts', 'That Uplifts', 'That Scales', 'That Lasts', 'That Transforms', 'That Changes the World']

const TYPE_SPEED = 45
const DELETE_SPEED = 20
const PAUSE_AFTER_TYPE = 2400
const PAUSE_AFTER_DELETE = 300
const INITIAL_DELAY = 600

const Hero = () => {
  const { isDark } = useTheme()
  const [phase, setPhase] = useState('idle')
  const [staticText, setStaticText] = useState('')
  const [phraseText, setPhraseText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [showContent, setShowContent] = useState(false)

  const currentPhrase = ROTATING_PHRASES[phraseIdx]

  const tick = useCallback(() => {
    switch (phase) {
      case 'typing-static': {
        if (staticText.length < STATIC_LINE.length) {
          setStaticText(STATIC_LINE.slice(0, staticText.length + 1))
        } else {
          setPhase('typing-phrase')
        }
        break
      }
      case 'typing-phrase': {
        if (phraseText.length < currentPhrase.length) {
          setPhraseText(currentPhrase.slice(0, phraseText.length + 1))
        } else {
          setShowContent(true)
          setPhase('pausing')
        }
        break
      }
      case 'deleting': {
        if (phraseText.length > 0) {
          setPhraseText(phraseText.slice(0, -1))
        } else {
          setPhraseIdx((prev) => (prev + 1) % ROTATING_PHRASES.length)
          setPhase('pause-deleted')
        }
        break
      }
      default:
        break
    }
  }, [phase, staticText, phraseText, currentPhrase])

  useEffect(() => {
    if (phase === 'idle') return
    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE)
      return () => clearTimeout(t)
    }
    if (phase === 'pause-deleted') {
      const t = setTimeout(() => setPhase('typing-phrase'), PAUSE_AFTER_DELETE)
      return () => clearTimeout(t)
    }
    if (phase === 'typing-static' || phase === 'typing-phrase') {
      const t = setTimeout(tick, TYPE_SPEED)
      return () => clearTimeout(t)
    }
    if (phase === 'deleting') {
      const t = setTimeout(tick, DELETE_SPEED)
      return () => clearTimeout(t)
    }
  }, [phase, tick])

  useEffect(() => {
    const t = setTimeout(() => setPhase('typing-static'), INITIAL_DELAY)
    return () => clearTimeout(t)
  }, [])

  return (
    <HeroSection id='home'>
      <LightBackgroundImage>
        <Image src='/images/stock/earth-day.jpg' alt='' fill priority sizes='100vw' style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
      </LightBackgroundImage>
      <GrainOverlay />

      <Container>
        <Content>
          <Badge $onImage={!isDark} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='16 18 22 12 16 6' />
              <polyline points='8 6 2 12 8 18' />
            </svg>
            Design &middot; Develop &middot; Deploy
          </Badge>

          <Title $onImage={!isDark}>
            {staticText}
            {staticText.length === STATIC_LINE.length && phraseText && (
              <>
                <br />
                {phraseText}
              </>
            )}
            <Cursor animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
          </Title>

          <SubtitleText
            $onImage={!isDark}
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}>
            We combine cutting-edge technology with creative problem-solving to deliver software that transforms businesses and delights users.
          </SubtitleText>

          <ButtonGroup initial={{ opacity: 0, y: 20 }} animate={showContent ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}>
            <PrimaryButton href='#contact'>Get Started</PrimaryButton>
            <SecondaryButton $onImage={!isDark} href='/services'>
              Explore Services
            </SecondaryButton>
          </ButtonGroup>
        </Content>
      </Container>
    </HeroSection>
  )
}

export default Hero
