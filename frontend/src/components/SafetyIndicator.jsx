export default function SafetyIndicator({ safety, safeBalance }) {
    if (!safety) return null;
  
    return (
      <div className="rounded-2xl border border-brass/40 bg-parchment p-6 shadow-lg">
        <h3 className="text-xl font-bold tracking-wide text-ink mb-4">
          Cash-Flow Safety
        </h3>
  
        <div className="space-y-1 text-ink/80 mb-4">
          <p>
            <span className="font-semibold">Minimum Balance:</span>{" "}
            {safety.overallMinBalance}
          </p>
          <p>
            <span className="font-semibold">Safe Balance Threshold:</span>{" "}
            {safeBalance}
          </p>
        </div>
  
        {safety.isUnsafe ? (
          <div className="rounded-xl border border-red-600/40 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              ⚠ Protective ward weakened
            </p>
            <p className="text-sm text-red-700/80 mt-1">
              This repayment plan risks dropping below your safe balance.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-green-600/40 bg-green-50 p-4">
            <p className="font-semibold text-green-700">
              ✓ Protective ward stable
            </p>
            <p className="text-sm text-green-700/80 mt-1">
              This repayment plan maintains healthy cash flow.
            </p>
          </div>
        )}
      </div>
    );
  }
  