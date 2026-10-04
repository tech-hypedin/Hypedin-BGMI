'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang='en'>
            <body style={{ background: '#000', color: '#fff', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                <h1 style={{ fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Critical Error</h1>
                <p style={{ color: '#a8a8a8', marginTop: '12px', maxWidth: '28rem' }}>
                    The application failed to load. Please refresh the page.
                </p>
                <button onClick={() => reset()} style={{ marginTop: '24px', height: '48px', padding: '0 32px', background: '#ff9932', color: '#000', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none', cursor: 'pointer' }}>
                    Reload
                </button>
            </body>
        </html>
    );
}
