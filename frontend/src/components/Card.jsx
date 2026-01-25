export default function Card({ title, children }) {
    return (
      <div className="rounded-2xl
        bg-parchment/95
        shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">

        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
  
        {title && (
          <h2 className="text-xl font-bold tracking-wide text-ink mb-4">
            {title}
          </h2>
        )}
  
        <div className="text-ink/80 leading-relaxed">
          {children}
        </div>
      </div>
    );
  }
  