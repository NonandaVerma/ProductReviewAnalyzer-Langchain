'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { user, loading: sessionLoading, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!sessionLoading && user) router.replace('/');
  }, [sessionLoading, user, router]);

  const switchMode = (next) => {
    setMode(next);
    setFormError('');
    setErrors({});
  };

  const validateLogin = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLoginSubmit = async (ev) => {
    ev.preventDefault();
    setFormError('');
    if (!validateLogin()) return;
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (ev) => {
    ev.preventDefault();
    setFormError('');
    setSuccessMsg('');
    if (!validateRegister()) return;
    setSubmitting(true);
    try {
      await register(name, email, password);
      setPassword('');
      setConfirmPassword('');
      setSuccessMsg('Account created. Please sign in below.');
      setMode('login');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-[#E2E8F0] text-[#2B3674] font-medium text-sm placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all';

  const labelClass = 'block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 ml-0.5';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-[#2563EB] flex flex-col items-center justify-center text-center px-8 py-16 lg:py-0">
        <img src="/pmLogo.png" alt="ProductReviewAnalyzer" className="w-24 h-24 object-contain mb-6" />
        <h1 className="text-4xl font-bold text-white tracking-tight mb-5">
          ProductReviewAnalyzer
        </h1>
        <p className="text-blue-100 font-light text-sm max-w-sm leading-relaxed">
          Turn raw customer feedback into decisive product action — upload review
          datasets, surface root-cause defects automatically, and give your
          product team one trustworthy source for what to fix next.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col px-8 sm:px-14 lg:px-20 py-10">
        <div className="flex justify-end">
          <span className="text-sm text-[#64748B]">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => switchMode('register')} className="text-[#2563EB] font-semibold hover:underline">
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')} className="text-[#2563EB] font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2B3674] mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm font-normal text-[#64748B]">
              {mode === 'login'
                ? 'Sign in to access your PM decision dashboard.'
                : 'Create an account to start analyzing product reviews.'}
            </p>
          </div>

          <>
            {successMsg && mode === 'login' && (
              <div className="text-emerald-600 text-xs font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-4">
                {successMsg}
              </div>
            )}

            <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className={labelClass}>Full name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        name="register-name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className={inputClass}
                      />
                    </div>
                    {errors.name && <p className="text-rose-600 text-xs font-medium mt-1 ml-0.5">{errors.name}</p>}
                  </div>
                )}
                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      key={`email-${mode}`}
                      // Register uses type="text" (not "email") because Chrome's
                      // autofill-suggestion dropdown keys heavily off type="email"
                      // and largely ignores autoComplete="off" on it — switching
                      // type is what actually suppresses old-address suggestions
                      // on a brand-new-account form. Login keeps type="email" so
                      // the browser CAN still suggest a previously-used address.
                      type={mode === 'login' ? 'email' : 'text'}
                      inputMode="email"
                      name={mode === 'login' ? 'login-email' : 'register-email'}
                      autoComplete={mode === 'login' ? 'username' : 'off'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                  {errors.email && <p className="text-rose-600 text-xs font-medium mt-1 ml-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      key={`password-${mode}`}
                      type={showPassword ? 'text' : 'password'}
                      name={mode === 'login' ? 'login-password' : 'register-password'}
                      // "new-password" on BOTH modes is deliberate, not a typo:
                      // it's the standard trick to stop the browser from ever
                      // auto-filling a saved password — including on login.
                      // Otherwise anyone else with access to this browser could
                      // open /login and get the password pre-filled for them.
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-rose-600 text-xs font-medium mt-1 ml-0.5">{errors.password}</p>}
                </div>
                {mode === 'register' && (
                  <div>
                    <label className={labelClass}>Confirm password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="register-confirm-password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-rose-600 text-xs font-medium mt-1 ml-0.5">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {formError && (
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-medium bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-lg shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : mode === 'login' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </button>
            </form>
          </>
        </div>
      </div>
    </div>
  );
}
