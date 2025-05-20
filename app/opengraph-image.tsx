import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px 80px',
        }}
      >
        <div style={{ 
          fontSize: 64, 
          fontWeight: 'bold',
          marginBottom: 20, 
        }}>
          Hackathons Directory
        </div>
        <div style={{ 
          fontSize: 32, 
          opacity: 0.8,
          marginBottom: 40, 
        }}>
          Find your next coding competition
        </div>
        <div style={{
          display: 'flex',
          padding: '12px 24px',
          background: '#4F46E5',
          borderRadius: 16,
          fontSize: 24,
        }}>
          Discover global hackathon events
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
} 