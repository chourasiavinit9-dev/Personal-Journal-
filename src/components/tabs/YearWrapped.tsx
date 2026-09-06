import React, { useState } from 'react';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import {
  Award,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Compass,
  Music,
  Trees,
  Coffee,
  Ticket
} from 'lucide-react';

export const YearWrapped: React.FC = () => {
  const { tickets, habits, digest } = useLifeOS();
  const [isCertified, setIsCertified] = useState(false);

  const handleCertify = () => {
    soundSynthesizer.playStampSound();
    setIsCertified(true);
  };

  const topMoments = tickets.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header Banner */}
      <section className="text-center space-y-3 border-b border-[#D8CAB7] pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#D8CAB7] shadow-xs text-xs font-mono text-[#8CA689] uppercase tracking-wider font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#E9BA6B]" />
          <span>{digest.wrappedVol || 'Annual Retrospective • Vol. 2025'}</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#1F1A17] tracking-tight">
          {digest.wrappedTitle || 'Your Year in Tactile Solitude & Wonder'}
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-[#756D65] max-w-2xl mx-auto leading-relaxed">
          "{digest.wrappedSubtitle || 'A tactile chronicle of the tickets you kept, the teas you whisked, and the alleyways where time slowed down.'}"
        </p>
      </section>

      {/* Hero Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8CAB7] text-center shadow-xs">
          <Ticket className="w-6 h-6 mx-auto text-[#D97736] mb-2" />
          <span className="font-serif text-4xl font-bold text-[#1F1A17] block">{tickets.length}</span>
          <span className="text-xs font-mono text-[#756D65] uppercase">Tickets Preserved</span>
        </div>
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8CAB7] text-center shadow-xs">
          <Coffee className="w-6 h-6 mx-auto text-[#8CA689] mb-2" />
          <span className="font-serif text-4xl font-bold text-[#1F1A17] block">
            {habits.reduce((acc, h) => acc + h.streak * 3, 312)}
          </span>
          <span className="text-xs font-mono text-[#756D65] uppercase">Ritual Cadences</span>
        </div>
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8CAB7] text-center shadow-xs">
          <Compass className="w-6 h-6 mx-auto text-[#C84B31] mb-2" />
          <span className="font-serif text-4xl font-bold text-[#1F1A17] block">
            {digest.wrappedCitiesWalked || '14'}
          </span>
          <span className="text-xs font-mono text-[#756D65] uppercase">Cities Walked</span>
        </div>
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8CAB7] text-center shadow-xs">
          <Music className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
          <span className="font-serif text-4xl font-bold text-[#1F1A17] block">
            {digest.wrappedMinsTapes || '81'}
          </span>
          <span className="text-xs font-mono text-[#756D65] uppercase">Mins Field Tapes</span>
        </div>
      </section>

      {/* Chapter 1: Top Preserved Moments */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#D8CAB7]/60 pb-2">
          <span className="text-xs font-mono text-[#E9BA6B] font-bold">CHAPTER 01</span>
          <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">Memorable Waypoints</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topMoments.map((ticket, idx) => {
            const tapeClasses = ['washi-tape-honey', 'washi-tape-sage', 'washi-tape-lavender'];
            const tapeClass = tapeClasses[idx % tapeClasses.length];

            return (
              <div
                key={ticket.id}
                className="bg-white p-4 rounded-2xl border border-[#D8CAB7] shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div className={`${tapeClass} absolute -top-1 right-6 w-16 h-4 rotate-2`}></div>
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#756D65] uppercase">
                    Stub #{ticket.stubNumber || `00${idx + 1}`} • {ticket.date}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1F1A17] mt-0.5">{ticket.title}</h3>
                  <p className="font-serif italic text-xs text-[#756D65] mt-1">
                    "{ticket.notes || ticket.quote || ticket.location}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-dashed border-[#D8CAB7] flex justify-between items-center text-xs font-mono text-[#D97736]">
                  <span>Cherished Memory</span>
                  <span>★★★★★</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapter 2: The Physical Keepsake Certificate */}
      <section className="bg-[#FAF8F5] p-8 rounded-3xl border-2 border-[#D8CAB7] shadow-lg relative overflow-hidden">
        <div className="washi-tape-honey absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-6 -rotate-1 rounded-xs"></div>

        <div className="border border-dashed border-[#C4BAA8] rounded-2xl p-6 sm:p-8 text-center space-y-5 bg-[#FFFDF8]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8CA689] font-bold">
            {digest.wrappedArchivalHeading || 'ARCHIVAL CERTIFICATION • SANCTUARY LIFE OS'}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1A17]">
            {digest.wrappedCertificateTitle || 'Certificate of Mindful Living 2025'}
          </h2>
          <p className="font-serif italic text-sm text-[#756D65] max-w-lg mx-auto">
            "{digest.wrappedCertificateText || 'Granted to the keeper of this scrapbook, who observed each day with quiet intention, gathered tactile memory slips, and protected stillness in a fast world.'}"
          </p>

          <div className="flex justify-center items-center gap-6 py-4">
            <div className="text-center">
              <span className="font-mono text-xs text-[#756D65] block">CERTIFIED DAYS</span>
              <span className="font-serif text-2xl font-bold text-[#1F1A17]">{digest.wrappedCertifiedDays || '365 / 365'}</span>
            </div>
            <div className="h-10 w-px bg-[#D8CAB7]"></div>
            <div className="text-center">
              <span className="font-mono text-xs text-[#756D65] block">PRESENCE QUOTIENT</span>
              <span className="font-serif text-2xl font-bold text-emerald-800">{digest.wrappedPresenceQuotient || '98.4%'}</span>
            </div>
            <div className="h-10 w-px bg-[#D8CAB7]"></div>
            <div className="text-center">
              <span className="font-mono text-xs text-[#756D65] block">ARCHIVE VAULT</span>
              <span className="font-serif text-2xl font-bold text-[#1F1A17]">BOX #{tickets.length}</span>
            </div>
          </div>

          {/* Hanko Seal Imprint */}
          <div className="flex flex-col items-center justify-center py-2">
            {isCertified ? (
              <div className="hanko-stamp p-4 rounded-xl text-center select-none shadow-md animate-bounce">
                <span className="text-xs font-mono font-bold block tracking-widest">{digest.wrappedHankoTop || '京都市保全'}</span>
                <span className="text-base font-serif font-extrabold block">{digest.wrappedHankoCenter || '聖域領主'}</span>
                <span className="text-[10px] font-mono tracking-wider">{digest.wrappedHankoBottom || 'OFFICIALLY SEALED 2025'}</span>
              </div>
            ) : (
              <button
                onClick={handleCertify}
                className="px-6 py-3 bg-[#C84B31] text-white font-mono text-xs font-bold rounded-xl shadow-md hover:bg-[#a93922] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Stamp Hanko Seal of Verification</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-[#D8CAB7]/60 flex items-center justify-between text-xs font-mono text-[#756D65]">
            <span>Registry ID: SANCTUARY-2025-KYOTO-{tickets.length}</span>
            <button
              onClick={() => {
                soundSynthesizer.playStampSound();
                alert("Exporting high-resolution A4 keepsake certificate to print!");
              }}
              className="hover:text-[#1F1A17] flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PDF</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
