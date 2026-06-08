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
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: '#02155B',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold top + bottom rules */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1200px', height: '3px', backgroundColor: '#B87D2A', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '1200px', height: '3px', backgroundColor: '#B87D2A', display: 'flex' }} />

        {/* AO mark — -04.svg: white paths on #02155B bg, navy rect disappears into OG bg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://agile-operator.com/SVG/Agile%20Operator-04.svg"
          width={280}
          height={280}
          style={{ opacity: 0.22 }}
          alt=""
        />

        {/* Wordmark */}
        <div style={{
          marginTop: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
        }}>
          <p style={{
            fontSize: '15px',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#B87D2A',
            margin: '0 0 16px',
            textTransform: 'uppercase',
            display: 'flex',
          }}>
            AGILE OPERATOR
          </p>

          <p style={{
            fontSize: '42px',
            fontFamily: 'Georgia, serif',
            fontWeight: 500,
            color: 'white',
            margin: '0',
            letterSpacing: '-0.5px',
            display: 'flex',
          }}>
            Scale smarter. Lead with clarity.
          </p>

          <p style={{
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            margin: '14px 0 0',
            display: 'flex',
          }}>
            Strategic advisory for growth-stage leaders
          </p>
        </div>

        {/* URL — bottom right */}
        <p style={{
          position: 'absolute',
          bottom: '24px',
          right: '48px',
          fontSize: '13px',
          fontFamily: 'sans-serif',
          color: 'rgba(255,255,255,0.2)',
          margin: '0',
          display: 'flex',
        }}>
          agile-operator.com
        </p>
      </div>
    ),
    { ...size }
  )
}
