const FINGER_COLOR = {
  'left-pinky':   '#FF6FA0',
  'left-ring':    '#FF9A30',
  'left-middle':  '#3EBD73',
  'left-index':   '#3AAEE8',
  'right-index':  '#8B6FE8',
  'right-middle': '#20BAA8',
  'right-ring':   '#FFCB30',
  'right-pinky':  '#FF6FA0',
  'thumb':        '#A0A8C0',
}

const SKIN    = '#FFCBA4'
const SKIN_DK = '#E8A882'

function Hand({ side, activeFinger }) {
  const isLeft = side === 'left'

  const fingers = isLeft
    ? ['left-pinky','left-ring','left-middle','left-index']
    : ['right-index','right-middle','right-ring','right-pinky']

  // x positions of finger rectangles
  const xs = isLeft ? [18, 52, 86, 120] : [80, 114, 148, 182]
  const palmX = isLeft ? 18 : 18
  const thumbActive = activeFinger === 'thumb'

  function fingerFill(f) {
    return activeFinger === f ? FINGER_COLOR[f] : SKIN
  }
  function fingerStroke(f) {
    return activeFinger === f ? FINGER_COLOR[f] : SKIN_DK
  }

  return (
    <svg viewBox="0 0 210 200" width="130" height="124" className="hand-svg">
      {/* Palm */}
      <rect x={isLeft ? 18 : 18} y={120} width={160} height={62} rx={20}
        fill={SKIN} stroke={SKIN_DK} strokeWidth="1.5" />

      {/* Thumb */}
      <rect
        x={isLeft ? 155 : 18} y={138} width={32} height={48} rx={14}
        fill={thumbActive ? FINGER_COLOR['thumb'] : SKIN}
        stroke={thumbActive ? FINGER_COLOR['thumb'] : SKIN_DK}
        strokeWidth="1.5"
      />
      {thumbActive && (
        <rect x={isLeft ? 155 : 18} y={138} width={32} height={48} rx={14}
          fill={FINGER_COLOR['thumb']} opacity="0.3" />
      )}

      {/* Four fingers */}
      {fingers.map((finger, i) => {
        const isActive = activeFinger === finger
        const x = xs[i]
        const y = isActive ? 18 : 28
        const h = isActive ? 108 : 98
        return (
          <g key={finger}>
            <rect x={x} y={y} width={30} height={h} rx={13}
              fill={fingerFill(finger)}
              stroke={fingerStroke(finger)}
              strokeWidth="1.5"
            />
            {isActive && (
              <rect x={x} y={y} width={30} height={h} rx={13}
                fill={FINGER_COLOR[finger]} opacity="0.25" />
            )}
          </g>
        )
      })}

      {/* Label */}
      <text x="105" y="196" textAnchor="middle" fontSize="10" fill={SKIN_DK} fontFamily="system-ui">
        {isLeft ? 'Left' : 'Right'}
      </text>
    </svg>
  )
}

export default function HandGuide({ activeFinger }) {
  const leftFinger  = activeFinger?.startsWith('left')  ? activeFinger : null
  const rightFinger = activeFinger?.startsWith('right') ? activeFinger : null
  const thumb       = activeFinger === 'thumb' ? 'thumb' : null

  return (
    <div className="hand-guide">
      <Hand side="left"  activeFinger={leftFinger  || thumb} />
      <Hand side="right" activeFinger={rightFinger || thumb} />
    </div>
  )
}
