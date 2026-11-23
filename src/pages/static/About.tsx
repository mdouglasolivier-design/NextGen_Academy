const pillars = [
  ['Our vision', 'A world where geography never limits the opportunity to learn.'],
  ['Our mission', 'Make practical, high-quality online learning accessible to curious minds everywhere.'],
  ['Our philosophy', 'Learn with purpose. Practice with confidence. Grow at your own pace.'],
];

export default function About() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="mb-3 text-xs font-bold tracking-widest text-teal-800">KNOWLEDGE WITHOUT BOUNDARIES</p>
      <h1 className="mb-6 text-4xl font-bold">Education for a world of possibilities.</h1>
      <p className="max-w-3xl text-lg leading-8 text-slate-600">
        NextGen Academy is a digital learning platform built around one belief: quality education should be accessible, structured, and relevant to the world we live in.
      </p>
      <div className="my-10 grid gap-8 md:grid-cols-3">
        {pillars.map(([h, p]) => (
          <div key={h} className="border-t-2 border-teal-800 pt-5">
            <h2 className="mb-4 text-xl font-bold">{h}</h2>
            <p className="text-base leading-7 text-slate-600">{p}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-600">Institutional copy shown here is proposed content for the frontend preview.</p>
    </main>
  );
}