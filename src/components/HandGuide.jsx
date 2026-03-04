// SVG hand diagrams showing which finger to use
const FINGER_COLOR = {
  'left-pinky':   '#e74c3c',
  'left-ring':    '#e67e22',
  'left-middle':  '#27ae60',
  'left-index':   '#2980b9',
  'right-index':  '#8e44ad',
  'right-middle': '#16a085',
  'right-ring':   '#d35400',
  'right-pinky':  '#c0392b',
  'thumb':        '#7f8c8d',
}

function Hand({ side, activeFinger }) {
  const isLeft = side === 'left'

  const fingers = isLeft
    ? ['left-pinky','left-ring','left-middle','left-index']
    : ['right-index','right-middle','right-ring','right-pinky']

  // x positions for fingers, palm centered at 100
  const xPos = isLeft
    ? [20, 50, 80, 110]
    : [90, 120, 150, 180]

  const thumbX = isLeft ? 115 : 75
  const thumbSide = isLeft ? 'right-index' : 'left-index' // thumb approximation
  const thumbActive = activeFinger === 'thumb'

  return (
    <svg
      viewBox="0 0 200 220"
      width="140"
      height="154"
      className={`hand-svg hand-${side}`}
    >
      {/* Palm */}
      <rect
        x={isLeft ? 20 : 20}
        y={130}
        width={160}
        height={70}
        rx={20}
        fill="#f5cba7"
        stroke="#d4a574"
        strokeWidth="2"
      />

      {/* Thumb */}
      <rect
        x={isLeft ? 148 : 18}
        y={148}
        width={28}
        height={50}
        rx={12}
        fill={thumbActive ? FINGER_COLOR['thumb'] : '#f5cba7'}
        stroke={thumbActive ? FINGER_COLOR['thumb'] : '#d4a574'}
        strokeWidth="2"
      />

      {/* Four fingers */}
      {fingers.map((finger, i) => {
        const x = isLeft ? xPos[i] : xPos[i]
        const isActive = activeFinger === finger
        return (
          <rect
            key={finger}
            x={x}
            y={isActive ? 20 : 30}
            width={30}
            height={isActive ? 115 : 105}
            rx={12}
            fill={isActive ? FINGER_COLOR[finger] : '#f5cba7'}
            stroke={isActive ? FINGER_COLOR[finger] : '#d4a574'}
            strokeWidth="2"
          />
        )
      })}

      {/* Label */}
      <text x="100" y="215" textAnchor="middle" fontSize="12" fill="#666">
        {isLeft ? 'Left Hand' : 'Right Hand'}
      </text>
    </svg>
  )
}

export default function HandGuide({ activeFinger }) {
  const leftFinger = activeFinger?.startsWith('left') ? activeFinger : null
  const rightFinger = activeFinger?.startsWith('right') ? activeFinger : null
  const thumbFinger = activeFinger === 'thumb' ? 'thumb' : null

  return (
    <div className="hand-guide">
      <Hand side="left" activeFinger={leftFinger || thumbFinger} />
      <Hand side="right" activeFinger={rightFinger || thumbFinger} />
    </div>
  )
}
