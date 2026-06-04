import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'SaaSPebble | Top B2B Software Index & Performance Matrices'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // Image HTML/CSS structure
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030712',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #030712 100%)',
          position: 'relative',
          padding: '80px',
        }}
      >
        {/* Subtle grid pattern background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Decorative ambient glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '300px',
            top: '165px',
            left: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,13,70,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Content Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '110px',
                fontWeight: 900,
                color: '#FF0D46',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-0.04em',
              }}
            >
              SaaS
            </span>
            <span
              style={{
                fontSize: '110px',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-0.04em',
              }}
            >
              Pebble
            </span>
            {/* The signature red dot */}
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#FF0D46',
                marginLeft: '10px',
                marginTop: '35px',
              }}
            />
          </div>

          {/* Divider Line */}
          <div
            style={{
              width: '160px',
              height: '4px',
              backgroundColor: '#FF0D46',
              borderRadius: '2px',
              marginBottom: '32px',
              opacity: 0.8,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: '38px',
              fontWeight: 600,
              color: '#9CA3AF',
              textAlign: 'center',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '-0.02em',
              maxWidth: '850px',
              lineHeight: 1.3,
            }}
          >
            Top B2B Software Index & Performance Matrices
          </div>

          {/* Domain badge */}
          <div
            style={{
              marginTop: '48px',
              padding: '10px 24px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F3F4F6',
              fontSize: '20px',
              fontWeight: 500,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            saaspebble.tech
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
