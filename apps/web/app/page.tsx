type HealthResponse = { status: 'ok' | 'fail'; service: string }

async function getApiHealth(): Promise<HealthResponse | null> {
  const url = `${process.env.API_URL ?? 'http://api:3001'}/health`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as HealthResponse
  } catch {
    return null
  }
}

export default async function HomePage() {
  const health = await getApiHealth()
  const ok = health?.status === 'ok'
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, margin: 0 }}>
        Журнал работ
      </h1>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        API:{' '}
        <span
          data-testid="api-status"
          style={{ color: ok ? '#16a34a' : '#dc2626', fontWeight: 500 }}
        >
          {ok ? 'ok' : 'unreachable'}
        </span>
      </p>
    </main>
  )
}
