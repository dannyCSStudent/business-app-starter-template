type HeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
};

export function Hero({ eyebrow, title, copy }: HeroProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-[0_30px_80px_rgba(2,6,23,0.7)]">
      <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-200">{copy}</p>
    </div>
  );
}
