import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Phone } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[600px] animate-slide-up hover:shadow-[0_20px_50px_rgba(30,58,138,0.12)] transition-shadow duration-500">
        {/* Right Side / Top - Branding / Graphic */}
        <div className="md:w-5/12 bg-primary-900 p-10 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-accent-amber opacity-20 blur-3xl group-hover:scale-110 group-hover:opacity-30 transition-all duration-700"></div>
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-3xl group-hover:scale-110 group-hover:opacity-30 transition-all duration-700 delay-100"></div>
          
          <div className="relative z-10 flex items-center space-x-2 justify-end animate-slide-down delay-100">
            <span className="text-xl font-bold tracking-tight">Smart Campus Hub</span>
            <ShieldCheck className="h-8 w-8 text-accent-emerald" />
          </div>

          <div className="relative z-10 mt-12 mb-12 text-right animate-slide-left delay-200">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
              Join the Hub
            </h1>
            <p className="text-blue-100 text-lg font-light leading-relaxed">
              Create an account to gain full access to university resources, facility bookings, and support systems.
            </p>
          </div>

          <div className="relative z-10 text-sm text-blue-200 font-medium text-right animate-slide-up delay-300">
            &copy; {new Date().getFullYear()} University Campus Hub
          </div>
        </div>

        {/* Left Side / Bottom - Form */}
        <div className="md:w-7/12 p-10 sm:p-14 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto animate-slide-right delay-400">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 mb-8">Fill in the details below to register.</p>

            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="firstName">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:border-primary-900 bg-slate-50 focus:bg-white transition-colors duration-200 sm:text-sm outline-none"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="lastName">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:border-primary-900 bg-slate-50 focus:bg-white transition-colors duration-200 sm:text-sm outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                  University Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:border-primary-900 bg-slate-50 focus:bg-white transition-colors duration-200 sm:text-sm outline-none"
                    placeholder="student@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:border-primary-900 bg-slate-50 focus:bg-white transition-colors duration-200 sm:text-sm outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-900 hover:text-primary-800 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
