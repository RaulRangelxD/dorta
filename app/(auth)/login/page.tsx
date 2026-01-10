"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Facebook, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Image 
            src="/LOGO.png" 
            alt="Dorta Logo" 
            width={120} 
            height={40} 
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Products</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          <button 
            onClick={() => router.push("/auth/register")}
            className="bg-[#1d61f2] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            Register
          </button>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center p-4 py-12 relative max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold text-sm self-start md:absolute md:left-4 md:top-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8 md:mt-0">
          <div className="p-8 pt-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mt-2 mb-10 text-center text-sm font-medium">Sign in to your account to manage your orders</p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                  <input 
                    {...register("email")}
                    type="email" 
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                      errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-slate-400'}`} />
                  <input 
                    {...register("password")}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-all ${
                      errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-600 cursor-pointer select-none font-semibold">
                  <input {...register("rememberMe")} type="checkbox" className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="text-blue-600 font-bold hover:text-blue-700">Forgot password?</a>
              </div>

              <button 
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#1d61f2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center text-base"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Log In"}
              </button>
            </form>

            <div className="relative w-full my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-3 text-slate-400 font-bold">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <button type="button" className="flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm">
                <Facebook className="w-5 h-5 text-[#1877f2] fill-[#1877f2]" />
                Facebook
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Don't have an account? <button onClick={() => router.push("/auth/register")} className="text-blue-600 font-bold hover:underline">Register for a new account</button>
            </p>
          </div>
        </div>
        
        <footer className="mt-12 text-slate-400 text-[11px] text-center max-w-xs leading-relaxed uppercase tracking-tighter">
          © 2026 Alejandra & Alejandro.
        </footer>
      </main>
    </div>
  );
}