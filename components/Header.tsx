import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-[#E5E2D9] py-6 px-8 flex justify-between items-center bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#26BAA4] rounded-xl flex items-center justify-center shadow-lg shadow-[#26BAA4]/20 overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="20" width="16" height="42" fill="white" rx="2" />
            <rect x="25" y="68" width="16" height="12" fill="white" rx="2" />
            <rect x="59" y="20" width="16" height="42" fill="white" rx="2" />
            <rect x="59" y="68" width="16" height="12" fill="white" rx="2" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#2D2D2D] tracking-tight">Second Brain</h1>
          <p className="text-xs text-[#26BAA4] font-medium">Elevated learning experience.</p>
        </div>
      </div>
      <nav className="flex items-center space-x-6">
        <a href="#" className="text-sm text-[#666] hover:text-[#26BAA4] transition-colors font-medium">Workspace</a>
        <a href="#" className="text-sm text-[#666] hover:text-[#26BAA4] transition-colors font-medium">Shared</a>
        <button className="bg-white border border-[#E5E2D9] px-4 py-1.5 rounded-md text-sm font-semibold text-[#2D2D2D] hover:border-[#26BAA4] hover:text-[#26BAA4] transition-all">
          Settings
        </button>
      </nav>
    </header>
  );
};

export default Header;