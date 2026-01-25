export default function AlertModal({ message, onClose }) {
    if (!message) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/60 backdrop-blur-sm">
        <div className="relative w-full max-w-sm rounded-2xl bg-parchment border border-brass/50 shadow-2xl p-6">
          {/* Arcane accent */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
  
          <h3 className="text-xl font-bold tracking-wide text-ink mb-3">
            Action Required
          </h3>
  
          <p className="text-ink/80 mb-6 leading-relaxed">
            {message}
          </p>
  
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white shadow-md hover:brightness-110 active:scale-[0.97] transition"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    );
  }
  