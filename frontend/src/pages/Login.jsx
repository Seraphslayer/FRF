import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const HOME_BY_ROLE = {
  requestor: "/requestor",
  dept_head: "/review",
  admin: "/admin",
  super_user: "/super",
};

const DEMO_ACCOUNTS = [
  { role: "requestor", label: "Requestor", email: "requestor@ncst.edu.ph" },
  { role: "dept_head", label: "Department Head", email: "depthead@ncst.edu.ph" },
  { role: "admin", label: "Admin", email: "admin@ncst.edu.ph" },
  { role: "super_user", label: "Super User", email: "superuser@ncst.edu.ph" },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goHome = (role) => navigate(HOME_BY_ROLE[role] || "/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = mode === "signin" ? await login(email, password) : await register({ name, email, password, department });
      goHome(user.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail) => {
    setError("");
    setLoading(true);
    try {
      const user = await login(demoEmail, "password123");
      goHome(user.role);
    } catch (err) {
      setError(`${err.message} — did you run "npm run seed" in the backend yet?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">
              Facilities Reservation Program
            </p>
            <h1 className="text-lg font-medium text-navy">
              {mode === "signin" ? "Sign in" : "Create requestor account"}
            </h1>
          </div>

          {mode === "register" && (
            <>
              <label className="block">
                <span className="mb-1 block text-sm text-slate-600">Full name</span>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-slate-600">Department / org / section</span>
                <input className={inputClass} value={department} onChange={(e) => setDepartment(e.target.value)} />
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Email</span>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Password</span>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {error && (
            <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy/90 disabled:opacity-60"
          >
            {loading ? "Please wait\u2026" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "register" : "signin");
              setError("");
            }}
            className="w-full text-center text-xs text-slate-500 hover:text-navy"
          >
            {mode === "signin" ? "New requestor? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Quick demo login</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => quickLogin(d.email)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs text-slate-600 transition hover:border-navy hover:text-navy"
              >
                <span className="block font-medium">{d.label}</span>
                <span className="block text-[10px] text-slate-400">{d.email}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-slate-400">Password for all demo accounts: password123</p>
        </div>
      </div>
    </div>
  );
}
