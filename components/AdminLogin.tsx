'use client';

import React, { useState } from 'react';
import { ShieldCheck, Database, KeyRound, AlertTriangle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Directly evaluate config parameter to prevent cascading state side-effects
  const supabaseActive = isSupabaseConfigured();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMsg(null);

    // Minor delay for sleek UX loader animation
    await new Promise((r) => setTimeout(r, 800));

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setErrorMsg('Database connection unavailable. Gateway locked.');
        setIsAuthenticating(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        setErrorMsg(`Auth Refused: ${error.message}`);
        setIsAuthenticating(false);
        return;
      }

      if (data?.session) {
        onLoginSuccess();
      } else {
        setErrorMsg('Invalid administrative credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'System validation panic in authentication thread.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div id="admin-login-wrapper" className="min-h-screen flex flex-col justify-center items-center bg-slate-50 relative font-sans p-4">
      {/* Aesthetic grid grid-overlay lines in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Main card box with clean Swiss-styled typography layout */}
      <div 
        id="login-card-inner" 
        className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.06)] relative z-10 p-6 md:p-8 space-y-6"
      >
        <header className="text-center space-y-2">
          {/* Circular Shield Badge */}
          <div className="mx-auto h-12 w-12 bg-slate-100 border border-slate-205 rounded-full flex items-center justify-center text-slate-800">
            <ShieldCheck className="h-6 w-6 stroke-[1.75]" />
          </div>

          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Security Control Gateway
          </h2>
          <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
            Authorized administrators only. This session is monitored and ledger-audited under CRO protocol guidelines.
          </p>
        </header>

        {/* Dynamic Connected Status Flag */}
        <div 
          id="conn-status-flag"
          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            supabaseActive 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}
        >
          {supabaseActive ? (
            <>
              <Database className="h-4.5 w-4.5 text-emerald-600 animate-pulse shrink-0" />
              <div>
                <span className="block font-bold">Supabase Connected</span>
                <span className="block text-[10px] text-emerald-600 font-mono font-normal">Active endpoint authentication enabled</span>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
              <div className="flex-grow">
                <span className="block font-bold">Supabase Disconnected</span>
                <span className="block text-[10px] text-rose-600 leading-tight font-normal">Database credentials missing. Login disabled.</span>
              </div>
            </>
          )}
        </div>

        {/* Form Inputs layout */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 tracking-wide">
              Supabase Account Email:
            </label>
            <input
              type="email"
              required
              id="admin-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@saaspebble.tech"
              className="w-full text-sm p-3 border-2 border-slate-200 bg-white rounded-xl focus:border-slate-800 focus:outline-none transition-colors placeholder-slate-400 font-mono"
            />
          </div>

          <div className="space-y-1 relative">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700 tracking-wide">
                Secret Access Key:
              </label>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm p-3 pr-10 border-2 border-slate-200 bg-white rounded-xl focus:border-slate-800 focus:outline-none transition-colors placeholder-slate-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 select-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            id="admin-login-submit"
            disabled={isAuthenticating}
            className="w-full bg-slate-950 hover:bg-slate-900 border-2 border-transparent disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Decrypting Gateway Security...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4.5 w-4.5" />
                <span>Verify & Unlock Portal</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </>
            )}
          </button>
        </form>


        {/* Bottom instructions to config settings */}
        <p className="text-[10px] text-slate-400 font-mono text-center">
          SAASPEBBLE ADMIN_SECURITY_LAYER v2.0.46 // SECURE SESSION
        </p>
      </div>
    </div>
  );
}
