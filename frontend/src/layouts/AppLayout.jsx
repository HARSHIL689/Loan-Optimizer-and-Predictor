import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useScenario } from "../context/ScenarioContext";

export default function AppLayout() {
  const { signOut } = useAuth();
  const { resetScenario } = useScenario();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-abyss via-stone to-abyss text-ash">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-midnight/95 backdrop-blur border-b border-brass/100 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm font-semibold tracking-wide">
            {[
              ["Dashboard", "/"],
              ["Repayment", "/repayment"],
              ["Opportunity", "/opportunity"],
              ["Prepayment", "/prepayment"],
            ].map(([label, path], i) => (
              <NavLink
                key={i}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-brass underline underline-offset-8 decoration-2 decoration-primary"
                    : "text-parchment/70 hover:text-parchment transition-colors"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => {
              resetScenario();
              signOut();
              navigate("/signin");
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-md hover:brightness-110 active:scale-[0.97] transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-7xl rounded-3xl bg-parchment border border-brass/40 shadow-2xl p-6 mt-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
