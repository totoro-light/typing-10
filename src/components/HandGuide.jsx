// ─── Colors ───────────────────────────────────────────────────────────────────
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

const SKIN    = '#FFCBA4'   // base skin
const SKIN_DK = '#D4956A'   // outline / crease
const SKIN_LT = '#FFE4CC'   // highlight / nail

// ─── Layout constants ─────────────────────────────────────────────────────────
// ViewBox: 175 × 210.  Palm centred at x=87.
// Left hand: pinky(left) → index(right), thumb on right side.
// Right hand is the exact mirror of left around x=87.5.

const PALM = { x: 27, y: 105, w: 120, h: 90, rx: 22 }

// tilt = degrees to rotate the finger around its base (negative = lean left)
const LEFT_FINGERS = [
  { name: 'left-pinky',  x:  33, y: 40, w: 22, h:  75, rx: 11, tilt: -5 },
  { name: 'left-ring',   x:  59, y: 22, w: 24, h:  93, rx: 12, tilt: -2 },
  { name: 'left-middle', x:  87, y: 14, w: 26, h: 101, rx: 13, tilt:  0 },
  { name: 'left-index',  x: 117, y: 20, w: 24, h:  95, rx: 12, tilt:  3 },
]

// Mirror each finger around x = 87.5:  x_right = 175 - x_left - w
const RIGHT_FINGERS = [
  { name: 'right-index',  x:  34, y: 20, w: 24, h:  95, rx: 12, tilt: -3 },
  { name: 'right-middle', x:  62, y: 14, w: 26, h: 101, rx: 13, tilt:  0 },
  { name: 'right-ring',   x:  92, y: 22, w: 24, h:  93, rx: 12, tilt:  2 },
  { name: 'right-pinky',  x: 120, y: 40, w: 22, h:  75, rx: 11, tilt:  5 },
]

// ─── Finger ───────────────────────────────────────────────────────────────────
function Finger({ x, y, w, h, rx, name, tilt, activeFinger }) {
  const isActive = activeFinger === name
  const color    = FINGER_COLOR[name]
  const fill     = isActive ? color : SKIN
  const stroke   = isActive ? color : SKIN_DK
  // rotate around finger base-center
  const bx = x + w / 2
  const by = y + h

  return (
    <g transform={`rotate(${tilt}, ${bx}, ${by})`}>
      {/* glow halo */}
      {isActive && (
        <rect x={x - 6} y={y - 6} width={w + 12} height={h + 6}
          rx={rx + 6} fill={color} opacity="0.28" />
      )}
      {/* main body – capsule (rx = w/2 gives fully-rounded tip) */}
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* highlight stripe on upper half */}
      <rect x={x + 4} y={y + 6} width={w - 8} height={Math.round(h * 0.22)}
        rx={rx - 3} fill="white"
        opacity={isActive ? 0.28 : 0.45} />
      {/* nail */}
      <rect x={x + 3} y={y + 3} width={w - 6} height={9} rx={3}
        fill={isActive ? 'rgba(255,255,255,0.55)' : SKIN_LT}
        stroke={stroke} strokeWidth="1" />
      {/* knuckle crease 1 */}
      <line x1={x + 5} y1={y + h * 0.47} x2={x + w - 5} y2={y + h * 0.47}
        stroke={isActive ? 'rgba(255,255,255,0.38)' : SKIN_DK}
        strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      {/* knuckle crease 2 */}
      <line x1={x + 5} y1={y + h * 0.68} x2={x + w - 5} y2={y + h * 0.68}
        stroke={isActive ? 'rgba(255,255,255,0.25)' : SKIN_DK}
        strokeWidth="1" strokeLinecap="round" opacity="0.38" />
    </g>
  )
}

// ─── Thumb ────────────────────────────────────────────────────────────────────
// Thumb is a capsule drawn around origin (tip at y=-h/2, base at y=+h/2),
// then translated to the palm edge and rotated outward.
//   Left hand: originates from right palm edge → rotate +22° (tip swings right-up)
//   Right hand: originates from left palm edge  → rotate -22° (tip swings left-up)
function Thumb({ side, activeFinger }) {
  const isActive = activeFinger === 'thumb'
  const color    = FINGER_COLOR['thumb']
  const fill     = isActive ? color : SKIN
  const stroke   = isActive ? color : SKIN_DK

  const tw = 22, th = 56, trx = 11
  // anchor = where the thumb base meets the palm
  const tx = side === 'left' ? 145 : 30
  const ty = 148
  const angle = side === 'left' ? 22 : -22

  return (
    <g transform={`translate(${tx}, ${ty}) rotate(${angle})`}>
      {isActive && (
        <rect x={-tw / 2 - 5} y={-th - 5} width={tw + 10} height={th + 8}
          rx={trx + 5} fill={color} opacity="0.28" />
      )}
      {/* body – tip upward (y = -th), base downward (y = 0) */}
      <rect x={-tw / 2} y={-th} width={tw} height={th + 4} rx={trx}
        fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* highlight */}
      <rect x={-tw / 2 + 4} y={-th + 6} width={tw - 8} height={14}
        rx={trx - 3} fill="white"
        opacity={isActive ? 0.28 : 0.45} />
      {/* nail */}
      <rect x={-tw / 2 + 3} y={-th + 3} width={tw - 6} height={9} rx={3}
        fill={isActive ? 'rgba(255,255,255,0.55)' : SKIN_LT}
        stroke={stroke} strokeWidth="1" />
      {/* knuckle */}
      <line x1={-tw / 2 + 4} y1={-th * 0.48} x2={tw / 2 - 4} y2={-th * 0.48}
        stroke={isActive ? 'rgba(255,255,255,0.38)' : SKIN_DK}
        strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    </g>
  )
}

// ─── Hand ─────────────────────────────────────────────────────────────────────
function Hand({ side, activeFinger }) {
  const fingers = side === 'left' ? LEFT_FINGERS : RIGHT_FINGERS

  return (
    <svg
      viewBox="0 0 175 210"
      width="128"
      height="154"
      className="hand-svg"
      overflow="visible"
    >
      {/* drop shadow for palm */}
      <rect x={PALM.x + 2} y={PALM.y + 4} width={PALM.w} height={PALM.h}
        rx={PALM.rx} fill="rgba(0,0,0,0.07)" />

      {/* palm body */}
      <rect x={PALM.x} y={PALM.y} width={PALM.w} height={PALM.h}
        rx={PALM.rx} fill={SKIN} stroke={SKIN_DK} strokeWidth="1.5" />

      {/* palm highlight (upper-centre glow) */}
      <ellipse cx={87} cy={118} rx={46} ry={14}
        fill={SKIN_LT} opacity="0.6" />

      {/* wrist crease */}
      <path d={`M ${PALM.x + 14},${PALM.y + PALM.h - 14} Q 87,${PALM.y + PALM.h - 6} ${PALM.x + PALM.w - 14},${PALM.y + PALM.h - 14}`}
        fill="none" stroke={SKIN_DK} strokeWidth="1.5"
        strokeLinecap="round" opacity="0.4" />

      {/* fingers (drawn on top of palm) */}
      {fingers.map(f => (
        <Finger key={f.name} {...f} activeFinger={activeFinger} />
      ))}

      {/* thumb */}
      <Thumb side={side} activeFinger={activeFinger} />

      {/* label */}
      <text x="87" y="206" textAnchor="middle"
        fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif"
        fill={SKIN_DK}>
        {side === 'left' ? 'Left' : 'Right'}
      </text>
    </svg>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
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
