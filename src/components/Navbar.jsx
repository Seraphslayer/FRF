import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const HOME_BY_ROLE = {
  requestor: "/requestor",
  dept_head: "/review",
  admin: "/admin",
  super_user: "/super",
};

export default function Navbar() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  if (!session) return null;

  return (
    <header className="border-b border-slate-200 bg-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to={HOME_BY_ROLE[session.role]} className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-gold">
            Facilities Reservation Program
          </span>
          <span className="text-sm font-medium text-white">NCST</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-white/90">{session.name}</p>
            <p className="text-[10px] uppercase tracking-wide text-gold">
              {session.role.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
