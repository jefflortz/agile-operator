import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Agile Operator — Strategic Growth Advisory for Technology CEOs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '1200px',
          height: '630px',
          backgroundColor: '#02155B',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid lines — top-right decorative */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '480px',
          height: '480px',
          opacity: 0.06,
          display: 'flex',
        }}>
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} style={{
              position: 'absolute',
              top: 0,
              left: `${i * 80}px`,
              width: '1px',
              height: '480px',
              backgroundColor: 'white',
            }} />
          ))}
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} style={{
              position: 'absolute',
              left: 0,
              top: `${i * 80}px`,
              width: '480px',
              height: '1px',
              backgroundColor: 'white',
            }} />
          ))}
        </div>

        {/* Gold top rule */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '3px',
          backgroundColor: '#B87D2A',
        }} />

        {/* AO monogram — top left */}
        <div style={{
          position: 'absolute',
          top: '56px',
          left: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Circle mark placeholder using text */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '1.5px',
              height: '28px',
              backgroundColor: 'rgba(255,255,255,0.5)',
            }} />
          </div>
          <span style={{
            fontSize: '11px',
            fontFamily: 'sans-serif',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#B87D2A',
            fontWeight: 600,
          }}>
            AGILE OPERATOR
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {/* Gold accent line */}
          <div style={{
            width: '48px',
            height: '2px',
            backgroundColor: '#B87D2A',
            marginBottom: '28px',
            opacity: 0.8,
          }} />

          <div style={{
            fontSize: '58px',
            fontWeight: 500,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '28px',
            maxWidth: '820px',
          }}>
            Scale smarter.<br />Lead with clarity.
          </div>

          <div style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'sans-serif',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 1.5,
            maxWidth: '640px',
          }}>
            Strategic growth advisory for technology CEOs<br />navigating $5M–$50M ARR.
          </div>
        </div>

        {/* Bottom right — URL */}
        <div style={{
          position: 'absolute',
          bottom: '44px',
          right: '80px',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.06em',
        }}>
          agile-operator.com
        </div>
      </div>
    ),
    { ...size }
  )
}
