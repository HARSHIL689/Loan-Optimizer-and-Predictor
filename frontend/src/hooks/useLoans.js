import { useState } from "react";

export function useLoans(initialLoans = []) {
  const [loans, setLoans] = useState(initialLoans);

  function updateLoan(index, field, value) {
    setLoans(loans.map((l, i) =>
      i === index ? { ...l, [field]: value } : l
    ));
  }

  function addLoan() {
    setLoans([
      ...loans,
      {
        id: `L${loans.length + 1}`,
        principal: 0,
        annualRate: 0,
        minEmi: 0
      }
    ]);
  }

  return {
    loans,
    updateLoan,
    addLoan
  };
}
