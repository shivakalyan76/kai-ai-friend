import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EXPRESSIONS, VALID_EMOTIONS } from './avatarConfig.js'

export default function KaiAvatar({
  emotion = 'neutral',
  size = 100,
  showGlow = true,
  className = '',
}) {
  const safeEmotion = VALID_EMOTIONS.includes(emotion) ? emotion : 'neutral'
  const expr = EXPRESSIONS[safeEmotion]

  // Blink
  const [blinking, setBlinking] = useState(false)
  const blinkTimer = useRef(null)

  useEffect(() => {
    const schedule = () => {
      const delay = 2000 + Math.random() * 3500
      blinkTimer.current = setTimeout(() => {
        setBlinking(true)
        setTimeout(() => {
          setBlinking(false)
          schedule()
        }, 130)
      }, delay)
    }
    schedule()
    return () => clearTimeout(blinkTimer.current)
  }, [])

  // Bounce (excited) & tremble (fear)
  const [bounceY, setBounceY] = useState(0)
  const [trembleX, setTrembleX] = useState(0)

  useEffect(() => {
    let frame
    let t = 0

    if (safeEmotion === 'excited') {
      const run = () => {
        t += 1
        setBounceY(Math.sin(t * 0.8) * 6)
        if (t < 28) frame = requestAnimationFrame(run)
        else setBounceY(0)
      }
      frame = requestAnimationFrame(run)
    } else if (safeEmotion === 'fear') {
      const run = () => {
        t += 1
        setTrembleX(Math.sin(t * 2) * 3)
        if (t < 32) frame = requestAnimationFrame(run)
        else setTrembleX(0)
      }
      frame = requestAnimationFrame(run)
    } else {
      setBounceY(0)
      setTrembleX(0)
    }

    return () => cancelAnimationFrame(frame)
  }, [safeEmotion])

  const S = size
  const cx = S / 2
  const cy = S / 2
  const faceR = S * 0.38

  // Eye dimensions
  const eyeRx = faceR * 0.16
  const eyeRyBase = faceR * 0.21
  const eyeRy = blinking ? eyeRyBase * 0.06 : eyeRyBase * expr.eyeScaleY
  const eyeY = cy - faceR * 0.08 + expr.eyeOffsetY * (S / 100)

  const leftEyeX = cx - faceR * 0.31
  const rightEyeX = cx + faceR * 0.31

  // Brow positions
  const browY = cy - faceR * 0.38 + expr.browOffsetY * (S / 100)
  const browLen = faceR * 0.3

  // Mouth path
  const mouthY = cy + faceR * 0.28
  const mouthHalfW = faceR * expr.mouthWidth
  const mouthLeft = cx - mouthHalfW
  const mouthRight = cx + mouthHalfW
  const mouthCtrlY = mouthY - expr.mouthCurve * (S / 100) * 0.8

  const mouthPath = `M${mouthLeft.toFixed(1)},${mouthY.toFixed(1)} Q${cx.toFixed(1)},${mouthCtrlY.toFixed(1)} ${mouthRight.toFixed(1)},${mouthY.toFixed(1)}`

  // Pupil
  const pupilRx = eyeRx * 0.55 * expr.pupilScale
  const pupilRy = eyeRyBase * 0.6 * expr.pupilScale
  const pupilY = blinking ? eyeY : eyeY + (eyeRy - pupilRy) * 0.1

  // Angry brow tilt helper
  const browLeftY1 = browY + expr.browLeftTilt * (S / 100) * 0.6
  const browLeftY2 = browY - expr.browLeftTilt * (S / 100) * 0.6
  const browRightY1 = browY - expr.browRightTilt * (S / 100) * 0.6
  const browRightY2 = browY + expr.browRightTilt * (S / 100) * 0.6

  const bodyTransform = `translateY(${bounceY}px) translateX(${trembleX}px)`

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: S, height: S }}
    >
      {/* Breathing glow ring */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124,110,250,0.22) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
        />
      )}

      <svg
        width={S}
        height={S}
        viewBox={`0 0 ${S} ${S}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          transform: bodyTransform,
          transition: 'transform 0.08s linear',
          filter: 'drop-shadow(0 4px 20px rgba(124,110,250,0.35))',
        }}
      >
        <defs>
          <radialGradient id={`faceGrad-${S}`} cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id={`pupilGrad-${S}`} cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#B8AEFF" />
            <stop offset="100%" stopColor="#4A3FD6" />
          </radialGradient>
          <radialGradient id={`glowRing-${S}`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(124,110,250,0)" />
            <stop offset="100%" stopColor="rgba(124,110,250,0.2)" />
          </radialGradient>
        </defs>

        {/* Outer glow ring */}
        <circle cx={cx} cy={cy} r={faceR + 8} fill={`url(#glowRing-${S})`} />
        <circle
          cx={cx}
          cy={cy}
          r={faceR + 4}
          fill="none"
          stroke="rgba(124,110,250,0.2)"
          strokeWidth={1.5}
        />

        {/* Face base */}
        <circle cx={cx} cy={cy} r={faceR} fill="#181D35" />
        {/* Face sheen */}
        <circle cx={cx} cy={cy} r={faceR} fill={`url(#faceGrad-${S})`} />
        {/* Face border */}
        <circle
          cx={cx}
          cy={cy}
          r={faceR}
          fill="none"
          stroke={safeEmotion === 'angry' ? '#A06060' : '#6A5FD0'}
          strokeWidth={1.5}
        />

        {/* Blush cheeks */}
        {expr.blushOpacity > 0 && (
          <g opacity={expr.blushOpacity}>
            <ellipse
              cx={cx - faceR * 0.44}
              cy={cy + faceR * 0.16}
              rx={faceR * 0.19}
              ry={faceR * 0.1}
              fill="#F06292"
              opacity={0.38}
            />
            <ellipse
              cx={cx + faceR * 0.44}
              cy={cy + faceR * 0.16}
              rx={faceR * 0.19}
              ry={faceR * 0.1}
              fill="#F06292"
              opacity={0.38}
            />
          </g>
        )}

        {/* Eye whites */}
        <ellipse cx={leftEyeX} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#E8ECFF" />
        <ellipse cx={rightEyeX} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#E8ECFF" />

        {/* Pupils */}
        {!blinking && (
          <>
            <ellipse
              cx={leftEyeX}
              cy={pupilY}
              rx={pupilRx}
              ry={pupilRy}
              fill={`url(#pupilGrad-${S})`}
            />
            <ellipse
              cx={rightEyeX}
              cy={pupilY}
              rx={pupilRx}
              ry={pupilRy}
              fill={`url(#pupilGrad-${S})`}
            />
            {/* Eye shine */}
            <circle cx={leftEyeX - pupilRx * 0.3} cy={pupilY - pupilRy * 0.35} r={pupilRx * 0.3} fill="rgba(255,255,255,0.75)" />
            <circle cx={rightEyeX - pupilRx * 0.3} cy={pupilY - pupilRy * 0.35} r={pupilRx * 0.3} fill="rgba(255,255,255,0.75)" />
          </>
        )}

        {/* Eyebrows */}
        <line
          x1={leftEyeX - browLen * 0.5}
          y1={browLeftY1}
          x2={leftEyeX + browLen * 0.5}
          y2={browLeftY2}
          stroke="#9BA4C8"
          strokeWidth={S * 0.023}
          strokeLinecap="round"
        />
        <line
          x1={rightEyeX - browLen * 0.5}
          y1={browRightY1}
          x2={rightEyeX + browLen * 0.5}
          y2={browRightY2}
          stroke="#9BA4C8"
          strokeWidth={S * 0.023}
          strokeLinecap="round"
        />

        {/* Mouth */}
        <path
          d={mouthPath}
          stroke="#9BA4C8"
          strokeWidth={S * 0.03}
          fill="none"
          strokeLinecap="round"
        />

        {/* Excited sparkles */}
        {expr.sparkle && (
          <>
            <text x={cx + faceR * 0.72} y={cy - faceR * 0.55} fontSize={S * 0.13} textAnchor="middle" fill="#FFB74D">✦</text>
            <text x={cx - faceR * 0.82} y={cy - faceR * 0.48} fontSize={S * 0.09} textAnchor="middle" fill="#F06292">✦</text>
          </>
        )}

        {/* Confused question mark */}
        {expr.questionMark && (
          <text
            x={cx + faceR * 0.78}
            y={cy - faceR * 0.28}
            fontSize={S * 0.15}
            textAnchor="middle"
            fill="#9B8FFB"
            fontWeight="700"
          >
            ?
          </text>
        )}
      </svg>
    </div>
  )
}
