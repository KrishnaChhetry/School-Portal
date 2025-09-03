import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ShowSchools() {
  const { data, error, isLoading } = useSWR('/api/schools', fetcher);
  if (isLoading) return <p style={{ padding: 16 }}>Loading...</p>;
  if (error) return <p style={{ padding: 16 }}>Failed to load</p>;

  const schools = data?.schools || [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Schools</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {schools.map((s) => (
          <div key={s.id} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', display: 'flex', gap: 12 }}>
            <div style={{ width: 140, height: 100, background: '#f5f5f5', flex: '0 0 140px' }}>
              {s.image ? (
                <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#888' }}>No image</div>
              )}
            </div>
            <div style={{ padding: 12, display: 'grid' }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{s.name}</h2>
              <p style={{ margin: '4px 0', color: '#555' }}>{s.address}</p>
              <p style={{ margin: 0, color: '#777' }}>{s.city}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          div > div { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          div > div { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}
