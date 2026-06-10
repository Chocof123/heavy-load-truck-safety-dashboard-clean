import { useState } from "react";
import { User, Lock, LogIn, AlertCircle } from "lucide-react";

interface Props {
  /** returns true on success, false on bad credentials */
  onLogin: (account: string, password: string) => boolean;
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const LOGO_SRC = assetUrl("logo.png");
const BG_SRC = assetUrl("login-background.png");

export default function LoginPage({ onLogin }: Props) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(account.trim(), password);
    if (!ok) setError("账号或密码错误，请重新输入");
    else setError("");
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#070b14" }}>
      {/* background image + deep-navy overlay */}
      <img
        src={BG_SRC}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(6,10,22,0.92) 0%, rgba(8,16,30,0.78) 45%, rgba(7,12,24,0.9) 100%)",
        }}
      />
      {/* subtle tech grid + glow over the photo */}
      <div className="app-bg absolute inset-0 opacity-60" />

      {/* page title top-left */}
      <div className="absolute left-8 top-7 z-10 flex items-center gap-2 text-cyan-glow/70">
        <span className="h-4 w-[3px] rounded bg-accent shadow-glow" />
        <span className="font-mono text-sm tracking-[0.22em]">WUXIA · 车辆安全管理</span>
      </div>

      {/* center login card */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <form
          onSubmit={submit}
          className="glass-card shadow-glow-strong"
          style={{ width: "clamp(440px, 30vw, 520px)", padding: "40px 44px", borderRadius: "18px" }}
        >
          {/* logo */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-cyan-glow/20 blur-xl" />
              <img
                src={LOGO_SRC}
                alt="重点车辆智管云平台"
                className="h-[60px] w-auto object-contain drop-shadow-[0_0_12px_rgba(62,231,255,0.45)]"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <h1
              className="mt-5 bg-clip-text text-[30px] font-extrabold tracking-[0.2em] text-transparent"
              style={{
                backgroundImage: "linear-gradient(180deg,#ffffff,#3ee7ff)",
                filter: "drop-shadow(0 0 12px rgba(62,231,255,0.4))",
              }}
            >
              重点车辆智管云平台
            </h1>
            <div className="mx-auto mt-2.5 h-[2px] w-44 bg-gradient-to-r from-transparent via-cyan-glow to-transparent" />
            <p className="mt-2.5 text-[11px] tracking-[0.16em] text-cyan-glow/55">
              VEHICLE SAFETY MANAGEMENT PLATFORM
            </p>
          </div>

          {/* inputs */}
          <div className="mt-9 space-y-4">
            <Input
              icon={<User size={15} />}
              value={account}
              placeholder="请输入账号"
              onChange={(v) => {
                setAccount(v);
                setError("");
              }}
            />
            <Input
              icon={<Lock size={15} />}
              value={password}
              type="password"
              placeholder="请输入密码"
              onChange={(v) => {
                setPassword(v);
                setError("");
              }}
            />
          </div>

          {/* error area */}
          <div className="mt-2 h-5">
            {error && (
              <div className="flex items-center gap-1 text-[12px] text-red-400">
                <AlertCircle size={13} />
                {error}
              </div>
            )}
          </div>

          {/* login button */}
          <button
            type="submit"
            className="login-btn mt-2 flex w-full items-center justify-center gap-2 rounded-lg text-[16px] font-bold tracking-[0.3em] text-[#04121d] transition"
            style={{ minHeight: "46px" }}
          >
            <LogIn size={16} />
            登录
          </button>

          {/* mock account hint */}
          <div className="mt-5 rounded-lg bg-panel/50 px-3 py-2 text-[11px] text-cyan-glow/55 ring-1 ring-cyan-glow/15">
            <div className="mb-0.5 font-semibold text-cyan-glow/70">演示账号</div>
            <div className="flex justify-between font-mono">
              <span>车手</span>
              <span className="text-accent">cheshou / 123</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>车队长</span>
              <span className="text-accent">duizhang / 123</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg bg-panel/60 px-3.5 ring-1 ring-cyan-glow/20 transition focus-within:ring-cyan-glow/60 focus-within:shadow-glow"
      style={{ minHeight: "44px" }}
    >
      <span className="text-accent">{icon}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[15px] text-ink placeholder:text-cyan-glow/35 focus:outline-none"
        autoComplete="off"
      />
    </div>
  );
}
