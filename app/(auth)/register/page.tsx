"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, User, Facebook, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from "react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-center">
        <div className="p-8 pt-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <User className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2 mb-10">Join us to manage your orders and more</p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 text-left">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className={`absolute left-3 top-3.5 w-5 h-5 ${errors.fullName ? 'text-red-400' : 'text-slate-400'}`} />
                <input 
                  {...register("fullName")}
                  type="text" 
                  placeholder="Carl Johnson"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    errors.fullName ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs font-medium">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
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
              <label className="text-sm font-semibold text-slate-700">Password</label>
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${errors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
                <input 
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center items-center mt-2"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </button>
          </form>

          <div className="relative w-full my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-white px-3 text-slate-400 font-bold">Or register with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button type="button" className="flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm">
              <Facebook className="w-5 h-5 text-blue-600 fill-blue-600" />
              Facebook
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Already have an account? <a href="/auth/login" className="text-blue-600 font-bold hover:underline">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}