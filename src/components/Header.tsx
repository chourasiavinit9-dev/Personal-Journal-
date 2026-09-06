import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { useLifeOS } from '../store/lifeOSStore';
import { Sparkles, Search, PenTool, Compass, Ticket, Flower2, BookOpen, Smartphone, Sun, Star } from 'lucide-react';


interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNewTicket: () => void;
  onOpenCommand: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTicket,
  onOpenCommand,
}) => {
  const { digest } = useLifeOS();
  const [kyotoTime, setKyotoTime] = useState('09:41 AM');
  const [mood, setMood] = useState('☁️ Mind: Serene & Grounded');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // JST is UTC+9
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const jst = new Date(utc + 3600000 * 9);
      let hours = jst.getHours();
      const minutes = jst.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      setKyotoTime(`${hours}:${minStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cycleMood = () => {
    const moods = [
      '☁️ Mind: Serene & Grounded',
      '🍵 Mind: Deep Flow & Sencha',
      '🌧️ Mind: Reflective Solitude',
      '🌿 Mind: Stillness & Cedar',
      '✨ Mind: Warm & Inspired'
    ];
    const nextIndex = (moods.indexOf(mood) + 1) % moods.length;
    setMood(moods[nextIndex]);
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'sanctuary', label: 'Sanctuary', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'memories', label: 'Memories', icon: <Ticket className="w-3.5 h-3.5" /> },
    { id: 'habits', label: 'Habit Garden', icon: <Flower2 className="w-3.5 h-3.5" /> },
    { id: 'crawls', label: 'City Crawls', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'lockscreen', label: 'Lockscreen', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'wrapped', label: 'Wrapped', icon: <Sun className="w-3.5 h-3.5" />, badge: true },
    { id: 'zodiac', label: 'Celestial', icon: <Star className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <nav className="bg-[#FDFBF7]/90 backdrop-blur-xl border border-[#D8CAB7]/60 rounded-full px-4 sm:px-5 py-2.5 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(31,26,23,0.08)] transition-all duration-300">
        {/* Brand & Kyoto Micro-Clock */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab('sanctuary')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#E3EBDD] border border-[#8CA689]/40 flex items-center justify-center text-[#8CA689] shadow-inner group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif italic font-semibold text-lg tracking-tight text-[#1F1A17] block leading-none">
                Sanctuary
              </span>
              <span className="font-mono text-[9px] tracking-wider text-[#756D65] uppercase">
                Vol. IV • Personal OS
              </span>
            </div>
          </div>
          <div className="hidden lg:flex items-center pl-4 border-l border-[#D8CAB7]/50 text-xs font-serif italic text-[#756D65]">
            <span>
              Kyoto Time —{' '}
              <span className="font-mono font-normal not-italic text-[#1F1A17] bg-[#F3EFE6] px-1.5 py-0.5 rounded ml-1">
                {kyotoTime}
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-[#F3EFE6]/70 p-1 rounded-full border border-[#D8CAB7]/40 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all relative ${
                  isActive
                    ? 'bg-[#FDFBF7] text-[#1F1A17] shadow-sm font-serif italic text-[13px] font-medium'
                    : 'text-[#756D65] hover:text-[#1F1A17] hover:bg-[#FDFBF7]/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-[#E9BA6B] animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Mood Selector Pill */}
          <button
            onClick={cycleMood}
            title="Click to shift mindset"
            className="hidden sm:flex items-center gap-1.5 bg-[#EDE9F7]/70 border border-[#A39AC9]/30 hover:border-[#A39AC9]/60 px-3 py-1.5 rounded-full text-xs text-[#1F1A17] font-hand text-base transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <span>{mood}</span>
          </button>

          {/* Quick Search / Command Button */}
          <button
            onClick={onOpenCommand}
            className="w-9 h-9 rounded-full bg-[#F3EFE6] hover:bg-[#D8CAB7]/30 border border-[#D8CAB7]/50 flex items-center justify-center text-[#756D65] hover:text-[#1F1A17] transition-all shadow-xs active:scale-95"
            title="Command Menu (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* New Entry Action */}
          <button
            onClick={onOpenNewTicket}
            className="flex items-center gap-2 bg-[#1F1A17] text-[#F9F6F0] hover:bg-[#1F1A17]/90 text-xs px-4 py-2 rounded-full font-medium shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5 text-[#E9BA6B]" />
            <span className="hidden sm:inline">Scrapbook</span>
            <span className="sm:hidden">+</span>
          </button>

          {/* Tactile Avatar Badge */}
          <div
            onClick={() => setActiveTab('wrapped')}
            className="relative pl-1 cursor-pointer group"
            title="Archivist Profile"
          >
            <div className="w-9 h-9 rounded-full ring-2 ring-[#FDFBF7] shadow-inner overflow-hidden border border-[#D8CAB7] bg-[#FDF4DF] flex items-center justify-center font-serif text-sm font-semibold text-[#1F1A17] group-hover:ring-[#E9BA6B] transition-all">
              {digest?.archivistInitials || 'EA'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#8CA689] rounded-full border-2 border-[#FDFBF7]"></span>
          </div>
        </div>
      </nav>

      {/* Mobile Sub-Navigation for quick tab switching on small screens */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto no-scrollbar pt-2 px-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 border ${
              activeTab === item.id
                ? 'bg-[#1F1A17] text-[#F9F6F0] border-[#1F1A17] shadow-sm'
                : 'bg-[#FDFBF7]/80 text-[#756D65] border-[#D8CAB7]/40'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
