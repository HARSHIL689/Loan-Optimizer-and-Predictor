export default function AlertModal({ message, onClose }) {
    if (!message) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/70 backdrop-blur-md">
        <div
          className="
            relative w-full max-w-sm rounded-2xl
            bg-gradient-to-br from-stone to-abyss
            border border-brass/60
            shadow-[0_0_40px_rgba(0,0,0,0.9)]
            p-6
          "
        >
          {/* Arcane seal */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-arcane/80 to-transparent" />
  
          <h3 className="text-xl font-extrabold tracking-widest uppercase text-brass mb-3">
            Arcane Warning
          </h3>
  
          <p className="text-ash leading-relaxed mb-6">
            {message}
          </p>
  
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className=
                "ml-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition"
            >
              Seal It
            </button>
          </div>
        </div>
      </div>
    );
  }
  