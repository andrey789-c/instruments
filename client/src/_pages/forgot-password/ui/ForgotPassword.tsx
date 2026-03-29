import { ForgotPasswordForm } from "@/src/features/forgot-password";

export function ForgotPasswordPage() {
  return (
    <main className="relative min-h-dvh bg-[#0d0f14] flex items-center justify-center overflow-hidden px-4">

      {/* Ambient orb — top left */}
      <div
        className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(232,168,56,0.12) 0%, transparent 70%)",
          animation: "drift1 14s ease-in-out infinite alternate",
        }}
      />

      {/* Ambient orb — bottom right */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 w-[320px] h-[320px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(100,120,232,0.1) 0%, transparent 70%)",
          animation: "drift2 10s ease-in-out infinite alternate",
        }}
      />

      <div
        className="relative z-10 w-full flex justify-center"
        style={{ animation: "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <ForgotPasswordForm />
      </div>

      <style>{`
        @keyframes drift1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(24px, 18px) scale(1.07); }
        }
        @keyframes drift2 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-20px, -14px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}