import React, { useState } from 'react';
import { CrawlCheckpoint } from '../../types';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import { CrawlModal } from '../CrawlModal';
import {
  Compass,
  ArrowRight,
  Stamp,
  Check,
  Volume2,
  Lock,
  Users,
  Camera,
  Coffee,
  Trees,
  BookOpen,
  Sparkles,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

interface CityCrawlsPassportProps {
  checkpoints?: CrawlCheckpoint[];
}

export const CityCrawlsPassport: React.FC<CityCrawlsPassportProps> = () => {
  const {
    crawlCheckpoints,
    stampCrawlCheckpoint,
    addCrawlCheckpoint,
    updateCrawlCheckpoint,
    deleteCrawlCheckpoint,
    digest,
    crawlBadges
  } = useLifeOS();
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [activeAudioCheckpointId, setActiveAudioCheckpointId] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState<CrawlCheckpoint | null>(null);

  const handleStampCheckpoint = (id: string) => {
    soundSynthesizer.playStampSound();
    stampCrawlCheckpoint(id);
  };

  const toggleAudioCue = (id: string) => {
    if (activeAudioCheckpointId === id) {
      soundSynthesizer.stop();
      setActiveAudioCheckpointId(null);
    } else {
      soundSynthesizer.togglePlay();
      setActiveAudioCheckpointId(id);
    }
  };

  const handleOpenAdd = () => {
    setEditingCheckpoint(null);
    setIsModalOpen(true);
    soundSynthesizer.playPaperClick();
  };

  const handleOpenEdit = (cp: CrawlCheckpoint) => {
    setEditingCheckpoint(cp);
    setIsModalOpen(true);
    soundSynthesizer.playPaperClick();
  };

  const handleSave = (data: Partial<CrawlCheckpoint>) => {
    if (editingCheckpoint) {
      updateCrawlCheckpoint(editingCheckpoint.id, data);
    } else {
      addCrawlCheckpoint(data);
    }
  };

  const completedCount = crawlCheckpoints.filter((i) => i.status === 'completed').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Editorial Intro Banner */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8CAB7]/60 pb-6" data-purpose="editorial-intro">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-[#F5F0E8] rounded-full border border-[#D8CAB7]">
            <p className="font-mono text-[11px] text-[#8CA689] tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{digest.crawlVol || '✦ Route Collection · Vol. 03'}</span>
            </p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-[#1F1A17] tracking-tight">
            {digest.crawlTitle || 'Tour the city on local crawls & stories'}
          </h2>
          <p className="text-xs sm:text-sm text-[#756D65] leading-relaxed max-w-xl">
            {digest.crawlSubtitle || 'Collectible neighborhood journeys, tactile stamp checkpoints, and quiet photo spots handpicked by local curators.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#1F1A17] text-white text-xs font-mono font-medium hover:bg-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-[#E9BA6B]" />
          <span>+ Add Waypoint</span>
        </button>
      </section>

      {/* Hero Crawl Card */}
      <section className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#D8CAB7] shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#D8CAB7]/60 pb-3 mb-4">
          <span className="font-mono text-[11px] text-[#756D65] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#E9BA6B]" />
            <span>{digest.crawlDropCountdown || 'Drops in 12d 2h 46m'}</span>
          </span>
          <span className="font-mono text-[10px] font-semibold bg-white/90 border border-[#D8CAB7] px-2.5 py-0.5 rounded-full text-[#1F1A17]">
            {completedCount} / {crawlCheckpoints.length} Checked In
          </span>
        </div>

        {/* Sticker Badge Cluster */}
        <div className="relative bg-[#FFFDF8] rounded-2xl p-4 border border-[#D8CAB7]/70 shadow-xs mb-5 overflow-hidden">
          <div className="washi-tape-honey absolute -top-1 left-12 w-20 h-4 rounded-xs rotate-2 z-10 opacity-90"></div>
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2 px-1">
            {crawlBadges.map((badge) => (
              <div
                key={badge.id}
                className={`flex-shrink-0 w-24 h-28 rounded-md border p-2 flex flex-col justify-between items-center shadow-xs ${badge.rotation}`}
                style={{
                  backgroundColor: badge.bgColor,
                  borderColor: badge.borderColor || '#C4BAA8',
                  color: badge.textColor
                }}
              >
                <span className="font-mono text-[8px] tracking-wider uppercase font-bold">
                  {badge.name}
                </span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 border border-current">
                  {badge.badgeType === 'bamboo' && <Trees className="w-5 h-5" />}
                  {badge.badgeType === 'coffee' && <Coffee className="w-5 h-5" />}
                  {badge.badgeType === 'book' && <BookOpen className="w-5 h-5" />}
                  {badge.badgeType === 'hanko' && <span className="font-serif text-sm font-bold">祇園</span>}
                </div>
                <span className="font-serif text-[10px] italic">
                  {badge.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Crawl Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#756D65] text-xs font-mono">
            <span>{crawlCheckpoints.length} stops</span>
            <span>✦</span>
            <span>{digest.crawlFeaturedArea || 'Higashiyama & Gion'}</span>
            <span>✦</span>
            <span>{digest.crawlFeaturedDistance || '~3.2 km'}</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1F1A17] tracking-tight">
            {digest.crawlFeaturedTitle || 'The Old Kyoto Craft Crawl'}
          </h3>
          <p className="text-xs sm:text-sm text-[#756D65] leading-relaxed">
            {digest.crawlFeaturedDescription || 'Meander through wood-paneled siphon bars, independent letterpress shops, and quiet stone temple paths.'}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-[#D8CAB7]/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F1A17]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8CAB7]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8CAB7]"></span>
          </div>
          <button
            onClick={() => soundSynthesizer.playStampSound()}
            className="bg-[#1F1A17] text-[#F9F6F0] font-mono text-xs font-semibold px-5 py-2.5 rounded-full shadow-md hover:bg-black active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Resume Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Waypoint Trail */}
      <section className="space-y-5 pt-2" data-purpose="waypoint-passport-trail">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-[#E9BA6B]" />
            <h3 className="font-serif text-xl font-semibold text-[#1F1A17]">Trail Waypoints ({crawlCheckpoints.length})</h3>
          </div>
          <span className="font-mono text-[11px] text-[#756D65]">Customizable Kyoto Pass</span>
        </div>

        {crawlCheckpoints.map((item, idx) => {
          const isCompleted = item.status === 'completed';
          const isLocked = item.status === 'locked';

          return (
            <article
              key={item.id}
              className={`rounded-3xl p-4 sm:p-5 border transition-all relative group ${
                isCompleted
                  ? 'bg-white border-[#D8CAB7] shadow-sm'
                  : isLocked
                  ? 'bg-[#FAF8F5]/70 border-[#D8CAB7]/80'
                  : 'bg-[#FCFAF7] border-dashed border-[#E9BA6B] shadow-sm'
              }`}
            >
              {/* Badge header / action controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isLocked
                        ? 'bg-slate-100 text-slate-600 border-slate-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {isCompleted ? '✓ Verified Hanko' : isLocked ? 'Locked Waypoint' : 'In Range'}
                  </span>
                  <span className="font-mono text-[10px] text-[#756D65]">{item.stepNumber || `#0${idx + 1}`}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Waypoint"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove waypoint "${item.title}"?`)) {
                        deleteCrawlCheckpoint(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Delete Waypoint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Companion comment if available */}
              {item.companionComment && (
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full border border-[#E9BA6B] overflow-hidden flex-shrink-0">
                    <img
                      src={item.companionComment.avatarUrl}
                      alt={item.companionComment.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#D8CAB7]/80 px-3 py-1 rounded-2xl text-[11px] text-[#1F1A17]">
                    <span className="font-semibold text-[#8CA689]">{item.companionComment.author}:</span> "
                    {item.companionComment.text}"
                    <span className="text-[#756D65] text-[10px] ml-1 font-mono">
                      {item.companionComment.timeAgo}
                    </span>
                  </div>
                </div>
              )}

              {/* Waypoint photo & details */}
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#D8CAB7]/70 relative">
                <div className="h-44 sm:h-52 w-full rounded-xl overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full h-full object-cover ${isLocked ? 'grayscale contrast-125' : ''}`}
                  />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full font-mono text-[9px] flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>{item.location || 'Analog 35mm Spot'}</span>
                  </div>
                </div>

                {/* Details bar */}
                <div className="pt-3.5 pb-1 px-1 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1F1A17]">{item.title}</h4>
                    <p className="text-xs text-[#756D65] mt-0.5 max-w-md">{item.description}</p>
                    <span className="font-mono text-[10px] text-[#8CA689] mt-1 block">
                      {item.distanceAway ? `✦ ${item.distanceAway}` : '✦ Collectible Hanko'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleStampCheckpoint(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-[#FAF8F5] border border-[#C86D51] text-[#C86D51] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      <Stamp className="w-4 h-4" />
                      <span>{isCompleted ? 'Stamped ✓' : 'Stamp Check-in'}</span>
                    </button>

                    <button
                      onClick={() => toggleAudioCue(item.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        activeAudioCheckpointId === item.id
                          ? 'bg-[#E3EBDD] border-[#8CA689] text-[#2D3E35]'
                          : 'bg-white border-[#D8CAB7] text-[#1F1A17] hover:bg-[#FAF8F5]'
                      }`}
                      title="Ambient audio"
                    >
                      <Volume2 className="w-4 h-4 text-[#E9BA6B]" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Community Companion Banner */}
      <section className="p-4 bg-[#F3ECE2] rounded-2xl border border-[#D8CAB7] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E9BA6B] flex items-center justify-center text-[#C86D51] shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="font-serif text-xs font-bold text-[#1F1A17]">{digest.crawlCommunityTravelers || '14 Sanctuary Travelers on this Crawl'}</p>
            <p className="font-mono text-[10px] text-[#756D65]">{digest.crawlCommunityEvent || 'Join group tea at Daitoku-ji Gate • 4:30 PM'}</p>
          </div>
        </div>
        <button
          onClick={() => {
            soundSynthesizer.playStampSound();
            setHasRsvpd(!hasRsvpd);
          }}
          className={`px-3.5 py-1.5 font-mono text-[10px] font-bold rounded-lg border transition-all cursor-pointer shadow-xs active:scale-95 ${
            hasRsvpd
              ? 'bg-[#1F1A17] text-white border-[#1F1A17]'
              : 'bg-white text-[#1F1A17] border-[#D8CAB7] hover:bg-[#FAF8F5]'
          }`}
        >
          {hasRsvpd ? 'RSVP Confirmed ✓' : 'RSVP'}
        </button>
      </section>

      {/* Crawl Modal */}
      <CrawlModal
        checkpoint={editingCheckpoint}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};
