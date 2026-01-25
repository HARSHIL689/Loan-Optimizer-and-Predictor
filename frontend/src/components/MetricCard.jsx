export default function MetricCard({ label, value, subtext }) {
    return (
      <div className="relative rounded-2xl bg-parchment/95 border border-brass/40 p-5 shadow-md hover:shadow-lg transition-shadow">
        {/* Arcane glow */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
  
        <p className="text-sm font-semibold tracking-wide text-ink/70">
          {label}
        </p>
  
        <p className="mt-1 text-3xl font-extrabold text-ink">
          {value}
        </p>
  
        {subtext && (
          <p className="mt-1 text-xs italic text-ink/60">
            {subtext}
          </p>
        )}
      </div>
    );
  }
  