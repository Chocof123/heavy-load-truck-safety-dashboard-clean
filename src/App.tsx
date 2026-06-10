import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DriverDashboard from "./pages/DriverDashboard";
import FleetDashboard from "./pages/FleetDashboard";
import { Theme, ThemeContext } from "./theme/ThemeContext";

// ---- mock auth ----------------------------------------------------------
type Role = "cheshou" | "duizhang";
const ROLE_KEY = "wx_role";

const ACCOUNTS: Record<string, { password: string; role: Role; route: string }> = {
  cheshou: { password: "123", role: "cheshou", route: "#/driver-dashboard" },
  duizhang: { password: "123", role: "duizhang", route: "#/fleet-dashboard" },
};

function getRole(): Role | null {
  const r = localStorage.getItem(ROLE_KEY);
  return r === "cheshou" || r === "duizhang" ? r : null;
}

type Route = "login" | "driver" | "fleet";

function routeFromHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  if (h === "driver-dashboard") return "driver";
  if (h === "fleet-dashboard") return "fleet";
  return "login";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("immersive");
  const [route, setRoute] = useState<Route>(routeFromHash);

  // keep route state in sync with the URL hash
  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // on first load: if logged in but at root/login, jump to the role's dashboard
  useEffect(() => {
    const role = getRole();
    const h = window.location.hash.replace(/^#\/?/, "");
    if (!h && role) {
      window.location.hash = ACCOUNTS[role].route;
    }
  }, []);

  // route guard: dashboard routes require the matching role
  const role = getRole();
  let effective: Route = route;
  if (route === "driver" && role !== "cheshou") effective = "login";
  if (route === "fleet" && role !== "duizhang") effective = "login";

  const handleLogin = (account: string, password: string): boolean => {
    const acc = ACCOUNTS[account];
    if (acc && acc.password === password) {
      localStorage.setItem(ROLE_KEY, acc.role);
      window.location.hash = acc.route;
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem(ROLE_KEY);
    window.location.hash = "#/login";
  };

  return (
    <ThemeContext.Provider value={theme}>
      {effective === "login" && <LoginPage onLogin={handleLogin} />}
      {effective === "driver" && (
        <DriverDashboard theme={theme} onThemeChange={setTheme} onLogout={handleLogout} />
      )}
      {effective === "fleet" && (
        <FleetDashboard theme={theme} onThemeChange={setTheme} onLogout={handleLogout} />
      )}
    </ThemeContext.Provider>
  );
}
