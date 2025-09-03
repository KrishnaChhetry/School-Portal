import { useMemo, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ShowSchools() {
  const { data, error, isLoading } = useSWR('/api/schools', fetcher);
  const [query, setQuery] = useState('');

  const schools = data?.schools || [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) =>
      [s.name, s.address, s.city, s.state]
        .filter(Boolean)
        .some((t) => String(t).toLowerCase().includes(q))
    );
  }, [schools, query]);

  if (isLoading) return <p style={{ padding: 16 }}>Loading...</p>;
  if (error) return <p style={{ padding: 16 }}>Failed to load</p>;

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-icon">🎓</div>
        <h1>Educational Excellence</h1>
        <p>Discover top-quality educational institutions. Find the perfect school for your journey.</p>
        <div className="hero-actions">
          <a href="/showSchools" className="btn btn-light">▦ View Schools</a>
          <a href="/addSchool" className="btn btn-primary">＋ Add New School</a>
        </div>
      </section>

      <div className="search-row">
        <input
          className="search"
          placeholder="Search schools by name, city, or state..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h2 className="section-title">All Schools</h2>
      <p className="section-sub">Browse through {filtered.length} educational institutions</p>

      <div className="grid">
        {filtered.map((s) => (
          <article key={s.id} className="card">
            <div className="thumb">
              {s.image ? (
                <img src={s.image} alt={s.name} />
              ) : (
                <div className="thumb-fallback">No image</div>
              )}
            </div>
            <div className="card-body">
              <h3 className="card-title">{s.name}</h3>
              <p className="card-text">{s.address}</p>
              <p className="card-meta">{[s.city, s.state].filter(Boolean).join(', ')}</p>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
        .hero { background: linear-gradient(180deg, #ede9fe, #ffffff); border: 1px solid #eee; border-radius: 16px; padding: 48px 24px; text-align: center; }
        .hero-icon { width: 72px; height: 72px; border-radius: 9999px; background: #7c3aed; color: white; display: grid; place-items: center; margin: 0 auto 16px; font-size: 34px; }
        .hero h1 { margin: 0 0 8px; font-size: 40px; }
        .hero p { margin: 0; color: #6b7280; }
        .hero-actions { margin-top: 20px; display: flex; gap: 12px; justify-content: center; }
        .btn { padding: 10px 14px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary { background: #7c3aed; color: white; }
        .btn-light { background: white; color: #111827; border: 1px solid #e5e7eb; }

        .search-row { display: flex; justify-content: center; margin: 24px 0 8px; }
        .search { width: 100%; max-width: 640px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; font-size: 16px; }

        .section-title { margin: 16px 0 0; font-size: 22px; }
        .section-sub { margin: 4px 0 16px; color: #6b7280; }

        .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }

        .card { border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .thumb { width: 100%; height: 160px; background: #f3f4f6; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .thumb-fallback { width: 100%; height: 100%; display: grid; place-items: center; color: #9ca3af; }
        .card-body { padding: 12px; }
        .card-title { margin: 0 0 6px; font-size: 18px; }
        .card-text { margin: 0 0 4px; color: #4b5563; }
        .card-meta { margin: 0; color: #6b7280; font-size: 14px; }
      `}</style>
    </div>
  );
}
