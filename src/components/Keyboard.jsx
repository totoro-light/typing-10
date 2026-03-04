// finger -> color mapping
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

// Default finger assignment for every key
const KEY_FINGER = {
  '`':'left-pinky','1':'left-pinky','2':'left-ring','3':'left-middle',
  '4':'left-index','5':'left-index','6':'right-index','7':'right-index',
  '8':'right-middle','9':'right-ring','0':'right-pinky','-':'right-pinky',
  '=':'right-pinky','backspace':'right-pinky',

  'tab':'left-pinky','q':'left-pinky','w':'left-ring','e':'left-middle',
  'r':'left-index','t':'left-index','y':'right-index','u':'right-index',
  'i':'right-middle','o':'right-ring','p':'right-pinky','[':'right-pinky',
  ']':'right-pinky','\\':'right-pinky',

  'caps':'left-pinky','a':'left-pinky','s':'left-ring','d':'left-middle',
  'f':'left-index','g':'left-index','h':'right-index','j':'right-index',
  'k':'right-middle','l':'right-ring',';':'right-pinky',"'":'right-pinky',
  'enter':'right-pinky',

  'shift-l':'left-pinky','z':'left-pinky','x':'left-ring','c':'left-middle',
  'v':'left-index','b':'left-index','n':'right-index','m':'right-index',
  ',':'right-middle','.':'right-ring','/':'right-pinky','shift-r':'right-pinky',

  'space':'thumb',
}

const ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','backspace'],
  ['tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['caps','a','s','d','f','g','h','j','k','l',';',"'",'enter'],
  ['shift-l','z','x','c','v','b','n','m',',','.','/',  'shift-r'],
  ['space'],
]

const KEY_LABEL = {
  'backspace':'⌫','tab':'Tab','caps':'Caps','enter':'Enter',
  'shift-l':'Shift','shift-r':'Shift','space':' ',
}

const WIDE_KEYS = new Set(['backspace','tab','caps','enter','shift-l','shift-r','space'])

export default function Keyboard({ activeKey, highlightKeys = [], fingerMap = {} }) {
  const active = activeKey?.toLowerCase()

  return (
    <div className="keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="kb-row">
          {row.map(key => {
            const label = KEY_LABEL[key] ?? key.toUpperCase()
            const finger = fingerMap[key] || KEY_FINGER[key]
            const color = finger ? FINGER_COLOR[finger] : '#bdc3c7'
            const isActive = key === active
            const isHighlight = highlightKeys.map(k => k.toLowerCase()).includes(key)

            return (
              <div
                key={key}
                className={[
                  'kb-key',
                  WIDE_KEYS.has(key) ? `kb-wide kb-${key}` : '',
                  isActive ? 'kb-active' : '',
                  isHighlight ? 'kb-highlight' : '',
                ].join(' ')}
                style={{
                  '--key-color': color,
                  borderColor: isHighlight ? color : undefined,
                }}
              >
                {label}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
