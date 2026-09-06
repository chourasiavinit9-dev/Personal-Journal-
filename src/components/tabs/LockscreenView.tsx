import React, { useState, useEffect } from 'react';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import {
  Wifi,
  Battery,
  CloudRain,
  Play,
  Pause,
  SkipForward,
  Heart,
  Unlock,
  Sparkles,
  Volume2
} from 'lucide-react';

interface LockscreenViewProps {
  onUnlock: () => void;
}

export const LockscreenView: React.FC<LockscreenViewProps> = ({ onUnlock }) => {
  const { tickets, habits, digest } = useLifeOS();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Take the most prominent or first ticket
  const featuredTicket = tickets.length > 0 ? tickets[0] : null;
  const completedHabits = habits.filter((h) => h.completedToday).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Tokyo'
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Tokyo'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    const st = soundSynthesizer.togglePlay((playing) => setIsPlaying(playing));
    setIsPlaying(st);
  };

  return (
    <div className="max-w-md mx-auto min-h-[820px] bg-[#1F1A17] text-[#F9F6F0] rounded-[44px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-4 border-[#3D352E] flex flex-col justify-between relative overflow-hidden my-4">
      {/* Top Phone Speaker & Notch bar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/80 rounded-full flex items-center justify-center">
        <div className="w-10 h-1 bg-white/20 rounded-full"></div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#D8CAB7] pt-2 px-2 select-none">
        <span className="font-semibold tracking-wider">{digest.lockscreenCarrier || 'KYOTO CELL'}</span>
        <div className="flex items-center space-x-2">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[11px]">98%</span>
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Clock & Solar Micro-Season */}
      <div className="text-center mt-6 space-y-1">
        <p className="text-xs font-mono tracking-widest text-[#E9BA6B] uppercase">
          {digest.lockscreenSolarSeason || '霜降 · FROST DESCENDS'}
        </p>
        <h1 className="font-serif text-6xl font-light tracking-tight text-white select-none">
          {currentTime || '09:42'}
        </h1>
        <p className="text-sm font-mono text-[#D8CAB7] font-medium">
          {currentDate || 'Thursday, October 24'}
        </p>
      </div>

      {/* Today's Memory Polaroid Scrap Widget */}
      <div className="relative my-4 bg-white/95 text-[#1F1A17] p-3 pb-5 rounded-2xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform">
        <div className="washi-tape-honey absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-xs rotate-1 shadow-xs"></div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 relative mb-2.5">
          <img
            src={
              featuredTicket?.imageUrl ||
              'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
            }
            alt={featuredTicket?.title || 'Morning walk in Kyoto'}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded">
            {featuredTicket?.location ? `${featuredTicket.location.toUpperCase()} · 07:15 AM` : 'KYOTO · 07:15 AM'}
          </span>
        </div>
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="font-hand text-lg text-[#1F1A17] leading-tight">
              "{featuredTicket?.notes || featuredTicket?.quote || 'Morning walk through Gion while the stone paths were still wet with mist.'}"
            </p>
            <p className="text-[10px] font-mono text-[#756D65] mt-1">
              Stub #{featuredTicket?.stubNumber || '048'}
            </p>
          </div>
          <div className="hanko-stamp px-2 py-1 rounded text-center shrink-0">
            <span className="text-[8px] font-mono font-bold block">{digest.hankoKanji || '祇園'}</span>
            <span className="text-[7px] font-mono">{digest.hankoCity || 'KYOTO'}</span>
          </div>
        </div>
      </div>

      {/* Now Playing Mini Player */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-amber-900/60 flex items-center justify-center text-lg border border-white/10">
              ☕
            </div>
            <div>
              <p className="text-xs font-serif font-medium text-white truncate max-w-[170px]">
                {digest.lockscreenTrack || 'Haruomi Hosono — Philharmony'}
              </p>
              <p className="text-[10px] font-mono text-[#D8CAB7]">{digest.lockscreenAlbum || 'Morning Coffee & Rain'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMusic}
              className="w-8 h-8 rounded-full bg-white text-[#1F1A17] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div className={`bg-[#E9BA6B] h-full transition-all duration-1000 ${isPlaying ? 'w-1/2' : 'w-1/4'}`}></div>
        </div>
      </div>

      {/* Quick Glance Widget Row */}
      <div className="grid grid-cols-2 gap-2.5 my-2">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center space-x-2.5">
          <CloudRain className="w-6 h-6 text-sky-300" />
          <div>
            <span className="text-[10px] font-mono text-[#D8CAB7] block">{digest.lockscreenCityWeatherLabel || 'KYOTO WEATHER'}</span>
            <span className="text-sm font-semibold text-white">{digest.weather || '18°C · Drizzle'}</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center space-x-2.5">
          <Sparkles className="w-6 h-6 text-amber-300" />
          <div>
            <span className="text-[10px] font-mono text-[#D8CAB7] block">TODAY'S RHYTHMS</span>
            <span className="text-sm font-semibold text-white">{completedHabits} of {habits.length} Complete</span>
          </div>
        </div>
      </div>

      {/* Unlock / Open OS Slider */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            soundSynthesizer.playStampSound();
            onUnlock();
          }}
          className="w-full py-3 bg-[#E9BA6B] hover:bg-[#d6a553] active:scale-98 text-[#1F1A17] rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
        >
          <Unlock className="w-4 h-4" />
          <span>Tap to Unlock Sanctuary OS</span>
        </button>
        <p className="text-[10px] font-mono text-[#756D65] mt-2">
          {digest.lockscreenStorageFooter || 'Kyoto Paulownia Vault • Encrypted Local Storage'}
        </p>
      </div>
    </div>
  );
};
