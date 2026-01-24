# Loan Repayment Optimizer

## Overview

This project provides backend functionality to help users make **loan repayment and prepayment decisions**. It exposes core financial logic that can be consumed by any frontend or API client.


---

## Core Functionalities

### 1. Loan Repayment Optimization

**Purpose:**
Calculate how loans should be repaid month-by-month to minimize total interest.

**What it does:**

* Simulates repayment over time
* Applies monthly interest on outstanding balances
* Pays minimum EMI for each loan
* Uses remaining surplus to repay the highest-interest loan first (Debt Avalanche)
* Supports one-time lump-sum prepayment

**Output:**

* Total months required to repay all loans
* Total interest paid
* Month-by-month loan balances

---

### 2. Opportunity Cost Analysis (Prepay vs Invest)

**Purpose:**
Help decide whether extra money should be used to prepay a loan or invested elsewhere.

**What it does:**

* Calculates interest saved by prepaying a loan
* Calculates returns from investing the same amount
* Compares both outcomes

**Output:**

* Investment gain
* Loan interest avoided
* Net benefit
* Recommendation: `INVEST`, `PREPAY_LOAN`, or `EITHER`

---

### 3. Prepayment Timing Optimization

**Purpose:**
Determine the best month to make a one-time lump-sum prepayment to maximize interest savings.

**What it does:**

* Simulates loan interest growth without prepayment (baseline)
* Simulates prepayment in each possible future month
* Compares interest paid in each case
* Selects the month with maximum interest savings

**Output:**

* Best month to prepay
* Maximum interest saved
* Number of months evaluated

---

## Money Handling

All monetary calculations use decimal-safe arithmetic to avoid floating-point errors.

---

## Tech Stack

* Node.js
* Express
* Decimal-based money utility

---

## Usage

The services are designed to be called from controllers or APIs. Each service is independent and can be used separately or combined.

---

## Summary

This project provides:

* Loan repayment simulation
* Prepayment vs investment decision logic
* Optimal prepayment timing calculation

It is intended as a **functional financial decision engine**, not a UI application.
