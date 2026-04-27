import React from 'react';
import { Search, Globe, Bell, Shield } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const lang = "en";

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-30 relative shadow-sm">

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1a4b7c] transition-colors" />
          </div>

          <input 
            type="text" 
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' 
              ? "ابحث عن رقم بلاغ أو لوحة..." 
              : "Search by License Plate or Report ID..."
            } 
            className="block w-full pl-10 pr-3 py-2.5 border-none bg-gray-50 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">

        <div className={`flex items-center gap-4 ${lang === 'ar' ? 'border-l pl-6' : 'border-r pr-6'}`}>

          {/* Language toggle */}
          <button 
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#1a4b7c] transition-all hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm active:scale-95"
          >
            <Globe className="w-4 h-4" /> 
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Bell */}
          <button className="relative text-gray-400 hover:text-gray-600 transition-transform hover:scale-110 p-1">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Shield */}
          <button className="text-gray-400 hover:text-blue-600 p-1 transition-colors">
            <Shield className="w-5 h-5" />
          </button>

        </div>

        {/* Status */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-left">
            <div className="text-sm font-bold text-[#002855] group-hover:text-[#1a4b7c] transition-colors">
              {lang === 'ar' ? 'مركز القيادة' : 'Command Center'}
            </div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              {lang === 'ar' ? 'نظام متصل' : 'SYSTEM ONLINE'}
            </div>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" 
            alt="User" 
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:border-blue-200 transition-all"
          />
        </div>

      </div>
    </header>
  );
}