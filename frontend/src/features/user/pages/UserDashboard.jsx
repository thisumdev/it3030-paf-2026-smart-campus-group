import React from 'react';
import { 
  Home, 
  Calendar, 
  Ticket, 
  Search, 
  Bell, 
  LogOut, 
  User,
  Clock,
  AlertCircle,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 animate-slide-right">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <ShieldCheck className="h-6 w-6 text-primary-900 mr-2" />
          <span className="text-lg font-bold text-primary-900 tracking-tight">Campus Hub</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="group flex items-center px-4 py-3 bg-primary-50 text-primary-900 rounded-xl font-medium transition-all duration-300 hover:shadow-sm">
            <Home className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
            Home
          </a>
          <a href="#" className="group flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all duration-300 hover:translate-x-1">
            <Calendar className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-primary-900" />
            My Bookings
          </a>
          <a href="#" className="group flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all duration-300 hover:translate-x-1">
            <Ticket className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-primary-900" />
            My Tickets
          </a>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link to="/login" className="group flex items-center px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-all duration-300 hover:translate-x-1">
            <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-red-600" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden animate-fade-in">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex-1 flex max-w-2xl">
            <div className="relative w-full max-w-md hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-900 focus:border-primary-900 sm:text-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-300"
                placeholder="Search resources, tickets..."
              />
            </div>
          </div>
          
          <div className="ml-4 flex items-center mb-0 space-x-4">
            <button className="p-2 text-slate-400 hover:text-primary-900 relative transition-colors duration-300 hover:scale-110">
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center ml-2 cursor-pointer group">
              <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                <User className="h-5 w-5 text-primary-900" />
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block group-hover:text-primary-900 transition-colors">Jane Student</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, Jane! 👋</h1>
            <p className="text-slate-500 mt-1 font-medium">Here's what's happening with your campus activities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-slide-up delay-100">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-accent-amber opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center text-accent-amber">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold text-slate-900">2</span>
              </div>
              <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Pending Bookings</h3>
              <p className="text-slate-800 font-medium">Study Room A, Projector</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-slide-up delay-200">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-500 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold text-slate-900">1</span>
              </div>
              <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Open Tickets</h3>
              <p className="text-slate-800 font-medium">Wi-Fi issue in Library</p>
            </div>

            {/* Card 3 (Action) */}
            <div className="bg-primary-900 rounded-2xl p-6 shadow-md shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer border border-primary-800 text-white flex flex-col justify-center items-center text-center animate-slide-up delay-300">
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-blue-600 opacity-20 rounded-full"></div>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-accent-emerald opacity-20 rounded-full"></div>
              
              <div className="relative z-10 h-14 w-14 bg-white/10 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <PlusCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold relative z-10">Quick Book</h3>
              <p className="text-blue-200 text-sm mt-1 relative z-10">Reserve a room instantly</p>
            </div>
          </div>

          {/* Recent Activity Section Placeholder */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 animate-slide-up delay-400">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <button className="text-sm font-semibold text-primary-900 hover:text-primary-800 transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 hover:shadow-sm transition-all duration-300 cursor-pointer hover:pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-primary-900 mr-4">
                      {i === 2 ? <Ticket className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {i === 2 ? 'Submitted IT Support Ticket' : 'Booked Group Study Room'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Today at {10 - i}:30 AM</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
