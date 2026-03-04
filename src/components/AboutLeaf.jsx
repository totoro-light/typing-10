import { useState } from 'react'

function LeafIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main leaf body */}
      <path
        d="M16 28 C16 28 4 22 4 12 C4 6 10 3 16 3 C22 3 28 6 28 12 C28 22 16 28 16 28 Z"
        fill={color}
        opacity="0.92"
      />
      {/* Highlight lobe */}
      <path
        d="M16 3 C16 3 22 6 24 12 C22 10 18 8 16 3 Z"
        fill="white"
        opacity="0.28"
      />
      {/* Centre vein */}
      <line
        x1="16" y1="6" x2="16" y2="26"
        stroke="white" strokeWidth="1.4"
        strokeLinecap="round" opacity="0.45"
      />
      {/* Side veins */}
      <line x1="16" y1="11" x2="10" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="16" y1="15" x2="10" y2="19" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="16" y1="11" x2="22" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="16" y1="15" x2="22" y2="19" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      {/* Stem */}
      <path
        d="M16 28 C15 29.5 13 30.5 12 30"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  )
}

export default function AboutLeaf() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── Floating leaf button ── */}
      <button
        className="leaf-btn"
        onClick={() => setOpen(true)}
        title="About this app"
        aria-label="About this app"
      >
        <LeafIcon size={26} color="#fff" />
      </button>

      {/* ── Modal ── */}
      {open && (
        <div className="leaf-backdrop" onClick={() => setOpen(false)}>
          <div
            className="leaf-modal"
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            {/* close */}
            <button className="leaf-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

            {/* hero */}
            <div className="leaf-hero">
              <LeafIcon size={52} color="var(--green)" />
            </div>

            <h2 className="leaf-title">Typing Practice</h2>
            <p className="leaf-subtitle">
              A free typing practice app for all skill levels —<br />
              from first-time learners to speed-focused masters.
            </p>

            <div className="leaf-section">
              <h3>🍃 Safe &amp; Private</h3>
              <ul className="leaf-list">
                <li>✅ Works fully <strong>offline</strong> — no server, no internet needed</li>
                <li>✅ All progress saved <strong>only in your browser</strong> (localStorage)</li>
                <li>✅ <strong>No tracking</strong>, no ads, no sign-up required</li>
                <li>✅ <strong>Open source</strong> — you can read every line of code</li>
                <li>✅ <strong>Multi-user</strong> — each player's data stays separate</li>
              </ul>
            </div>

            <div className="leaf-footer">
              <a
                className="leaf-link"
                href="https://github.com/totoro-light/typing-10"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source on GitHub ↗
              </a>
              <span className="leaf-footer-sep">·</span>
              <a
                className="leaf-link"
                href="mailto:ethanstark.mars@gmail.com"
              >
                ethanstark.mars@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
