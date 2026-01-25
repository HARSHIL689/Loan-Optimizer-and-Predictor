import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import SignInPage from "../auth/SignIn";
import SignUpPage from "../auth/SignUp";

import Dashboard from "../pages/Dashboard";
import Repayment from "../pages/RepaymentPage";
import Opportunity from "../pages/OpportunityPage";
import Prepayment from "../pages/PrepaymentPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/repayment" element={<Repayment />} />
          <Route path="/opportunity" element={<Opportunity />} />
          <Route path="/prepayment" element={<Prepayment />} />
        </Route>
      </Route>
    </Routes>
  );
}
