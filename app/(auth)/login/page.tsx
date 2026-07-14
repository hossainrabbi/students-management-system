import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import LoginForm from "../../../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-emerald-700/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370e_1px,transparent_1px),linear-gradient(to_bottom,#1f29370e_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-2xl">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            EduManager
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Students Management System
          </p>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader className="text-center pt-8 border-b-0 pb-0">
            <h2 className="text-xl font-semibold text-zinc-200">Sign In</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your details to log in to your account
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
        </Card>

        {/* Demo Credentials Box */}
        {/* <div className="mt-6 text-center text-xs border border-zinc-800/40 bg-zinc-900/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
          <p className="font-bold text-zinc-400 tracking-wider uppercase text-[10px]">
            Development Credentials
          </p>
          <p className="mt-2 text-zinc-450">
            Email:{" "}
            <span className="font-mono text-emerald-400">admin@school.com</span>
          </p>
          <p className="mt-1 text-zinc-450">
            Password:{" "}
            <span className="font-mono text-emerald-400">Admin123</span>
          </p>
        </div> */}
      </div>
    </main>
  );
}
