import { useState } from "react";

export function useCashFlow(initialCashFlow) {
  const [cashFlow, setCashFlow] = useState(initialCashFlow);
  const [initialBalance, setInitialBalance] = useState(50000);

  function updateCashFlow(field, value) {
    setCashFlow({ ...cashFlow, [field]: value });
  }

  return {
    cashFlow,
    initialBalance,
    setInitialBalance,
    updateCashFlow
  };
}
