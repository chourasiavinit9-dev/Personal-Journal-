import React, { useState, useRef } from 'react';
import { TicketStub, TabType, HabitItem, MindfulIntention } from '../../types';
import { INITIAL_HERO_TICKET } from '../../data/sanctuaryData';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import { SanctuaryDigestModal } from '../SanctuaryDigestModal';
import { EditTicketModal } from '../EditTicketModal';
import {
  Feather,
  Pin,
  Check,
  Minimize2,
  Heart,
  SkipBack,
  SkipForward,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Camera,
  Image as ImageIcon,
  BookOpen,
  Sprout,
  BookMarked,
  Moon,
  Ticket,
  FolderHeart,
  Maximize,
  Leaf,
  Volume2,
  Edit2,
  Trash2,
  Pencil
} from 'lucide-react';

interface SanctuaryHomeProps {
  heroTicket?: TicketStub;
  intentions?: MindfulIntention[];
  onToggleIntention?: (id: string) => void;
  onAddIntention?: (text: string) => void;
  onNavigateTab?: (tab: TabType) => void;
  onOpenNewTicket?: () => void;
  onUpdateHeroTicketImage?: (newImageUrl: string) => void;
}

export const SanctuaryHome: React.FC<SanctuaryHomeProps> = ({
  heroTicket,
  intentions,
  onToggleIntention = (_id: string) => {},
  onAddIntention = (_text: string) => {},
  onNavigateTab = (_tab: TabType) => {},
  onOpenNewTicket = () => {},
  onUpdateHeroTicketImage = (_url: string) => {},
}) => {
  const {
    digest,
    updateDigest,
    habits,
    deleteIntention,
    updateIntention,
    updateTicket,
    deleteTicket,
    tickets,
    journalNotes
  } = useLifeOS();

  const safeHeroTicket = heroTicket || tickets[0] || INITIAL_HERO_TICKET;
  const safeIntentions = intentions || [];
  
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);
  const [activeFanIndex, setActiveFanIndex] = useState(1);
  const [newIntentionText, setNewIntentionText] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [editingIntentionId, setEditingIntentionId] = useState<string | null>(null);
  const [editingIntentionText, setEditingIntentionText] = useState('');
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  
  const heroFileRef = useRef<HTMLInputElement>(null);

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          soundSynthesizer.playStampSound();
          onUpdateHeroTicketImage(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMusic = () => {
    const nextState = soundSynthesizer.togglePlay((playing) => {
      setIsPlayingLofi(playing);
    });
    setIsPlayingLofi(nextState);
  };

  const handleAddIntentionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIntentionText.trim()) {
      onAddIntention(newIntentionText.trim());
      setNewIntentionText('');
      setShowAddInput(false);
      soundSynthesizer.playPaperClick();
    }
  };

  const handleStartEditIntention = (e: React.MouseEvent, item: MindfulIntention) => {
    e.stopPropagation();
    setEditingIntentionId(item.id);
    setEditingIntentionText(item.text);
  };

  const handleSaveEditIntention = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editingIntentionText.trim()) {
      updateIntention(id, { text: editingIntentionText.trim() });
      soundSynthesizer.playPaperClick();
    }
    setEditingIntentionId(null);
  };

  const handleDeleteIntention = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundSynthesizer.playPaperClick();
    deleteIntention(id);
  };

  const completedCount = safeIntentions.filter((i) => i.completed).length;

  // Dynamic habits display (take first 3 from real state)
  const displayHabits = habits.slice(0, 3);

  // Dynamic fan cards derived from tickets, falling back to journal notes
  const fanCards = tickets.length > 0
    ? tickets.slice(0, 3).map((t, idx) => ({
        id: t.id,
        title: t.title,
        subtitle: t.date || `TICKET #0${idx + 1}`,
        quote: t.quote || t.notes || t.location || 'Tactile memory captured',
        imageUrl: t.imageUrl
      }))
    : journalNotes.slice(0, 3).map((n, idx) => ({
        id: n.id,
        title: n.title,
        subtitle: n.date || `NOTE #0${idx + 1}`,
        quote: n.content ? (n.content.length > 40 ? n.content.slice(0, 40) + '...' : n.content) : 'Reflective entry',
        imageUrl: undefined
      }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10" data-purpose="scrapbook-dashboard-canvas">
      {/* Hero Title & Aesthetic Subtitle */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 relative group" data-purpose="hero-intro">
        <div>
          <div className="flex items-center gap-2 text-[#8CA689] font-hand text-xl tracking-wide mb-1">
            <Feather className="w-4 h-4" />
            <span>{digest.chapterSubtitle}</span>
            <button
              onClick={() => setIsDigestModalOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#756D65] hover:text-[#1F1A17] cursor-pointer"
              title="Edit Sanctuary Title & Digest"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
          <h1
            onClick={() => setIsDigestModalOpen(true)}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[#1F1A17] font-light cursor-pointer title-editable"
            title="Click to personalize Slow Living heading"
          >
            {digest.headingPrefix}{' '}
            <span className="italic font-normal underline decoration-[#A39AC9]/50 decoration-wavy decoration-1 underline-offset-8">
              {digest.headingItalic}
            </span>{' '}
            {digest.headingSuffix}
          </h1>
        </div>

        {/* Quick Mood Stats */}
        <div
          onClick={() => setIsDigestModalOpen(true)}
          className="flex items-center gap-4 text-xs font-mono bg-[#FDFBF7]/80 border border-[#D8CAB7]/50 px-4 py-2.5 rounded-2xl shadow-xs cursor-pointer hover:border-[#8CA689] transition-colors"
          title="Click to edit energy and focus metrics"
        >
          <div>
            <span className="text-[#756D65] block text-[10px]">ENERGY RESERVES</span>
            <span className="font-bold text-[#1F1A17] text-sm">{digest.energyReserves}</span>
          </div>
          <div className="h-8 w-px bg-[#D8CAB7]/40"></div>
          <div>
            <span className="text-[#756D65] block text-[10px]">FLOW FOCUS</span>
            <span className="font-bold text-[#1F1A17] text-sm">{digest.flowFocus}</span>
          </div>
        </div>
      </section>

      {/* Masonry Editorial Grid: 12 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* ============================================== */}
        {/* LEFT COLUMN: Scrapbook Notes & Music (4 Cols)  */}
        {/* ============================================== */}
        <div className="md:col-span-12 lg:col-span-4 space-y-8">
          {/* Washi-Taped Todo & Pin Note */}
          <article className="relative bg-[#FDFBF7] border border-[#D8CAB7]/50 rounded-2xl p-6 shadow-[0_10px_30px_-10px_rgba(31,26,23,0.08)] transition-transform duration-300 hover:-translate-y-1">
            {/* Lavender Washi Tape Top Center */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 washi-tape-lavender z-10 shadow-xs pointer-events-none rounded-xs"></div>
            {/* Cute Pin Graphic in top-left */}
            <div className="absolute -top-2 left-4 w-7 h-7 rounded-full bg-[#E5A4A4]/90 shadow-md flex items-center justify-center text-white border-2 border-[#FDFBF7] rotate-12">
              <Pin className="w-3.5 h-3.5 fill-white" />
            </div>

            <div className="flex items-center justify-between pt-2 mb-4">
              <div>
                <span className="font-mono text-[10px] text-[#8CA689] uppercase tracking-wider font-semibold block">
                  {digest.intentionsSubtitle || 'Morning Grounding'}
                </span>
                <h3 className="font-serif italic text-xl font-normal text-[#1F1A17] flex items-center gap-2">
                  {digest.intentionsTitle || 'Gentle Intentions'}
                </h3>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#756D65] bg-[#F3EFE6] px-2 py-0.5 rounded-md">
                {completedCount}/{safeIntentions.length} Complete
              </span>
            </div>

            {/* Handwritten style checklist or empty state */}
            {safeIntentions.length === 0 ? (
              <div className="py-6 px-4 text-center bg-[#F3EFE6]/50 rounded-xl border border-dashed border-[#D8CAB7] my-3">
                <p className="font-serif italic text-base text-[#1F1A17]">No intentions set for today.</p>
                <p className="text-xs font-hand text-lg text-[#756D65] mt-1">Tap below to add a quiet mindful intention.</p>
              </div>
            ) : (
              <ul className="space-y-3.5 text-sm font-hand text-xl text-[#1F1A17]/90 leading-snug">
                {safeIntentions.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2 group select-none"
                  >
                    {editingIntentionId === item.id ? (
                      <form
                        onSubmit={(e) => handleSaveEditIntention(e, item.id)}
                        className="flex-1 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={editingIntentionText}
                          onChange={(e) => setEditingIntentionText(e.target.value)}
                          autoFocus
                          className="flex-1 text-sm font-hand text-lg bg-[#F3EFE6] border border-[#D8CAB7] rounded px-2 py-0.5 text-[#1F1A17] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="text-xs font-mono text-[#8CA689] hover:underline"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingIntentionId(null)}
                          className="text-xs font-mono text-[#756D65]"
                        >
                          ✕
                        </button>
                      </form>
                    ) : (
                      <>
                        <div
                          onClick={() => {
                            onToggleIntention(item.id);
                            soundSynthesizer.playPaperClick();
                          }}
                          className="flex items-start gap-3 flex-1 cursor-pointer"
                        >
                          <span
                            className={`mt-1 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                              item.completed
                                ? 'border-[#A39AC9]/60 bg-[#EDE9F7]'
                                : 'border-2 border-[#8CA689] group-hover:bg-[#E3EBDD]'
                            }`}
                          >
                            {item.completed && <Check className="w-3 h-3 text-[#1F1A17]" />}
                          </span>
                          <span className={item.completed ? 'line-through text-[#756D65]' : 'group-hover:text-[#8CA689] transition-colors'}>
                            {typeof item.text === 'string' ? item.text : ((item.text as any)?.text || String(item.text || ''))}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleStartEditIntention(e, item)}
                            className="p-1 text-[#756D65] hover:text-[#1F1A17] cursor-pointer"
                            title="Edit intention"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteIntention(e, item.id)}
                            className="p-1 text-[#756D65] hover:text-rose-600 cursor-pointer"
                            title="Delete intention"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {showAddInput ? (
              <form onSubmit={handleAddIntentionSubmit} className="mt-4 pt-3 border-t border-[#D8CAB7]/40 flex gap-2">
                <input
                  type="text"
                  value={newIntentionText}
                  onChange={(e) => setNewIntentionText(e.target.value)}
                  placeholder="A quiet mindful intention..."
                  autoFocus
                  className="flex-1 text-xs font-hand text-lg bg-[#F3EFE6]/60 border border-[#D8CAB7] rounded-lg px-3 py-1 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#1F1A17] text-white rounded-lg text-xs font-mono font-medium hover:bg-black"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddInput(false)}
                  className="px-2 py-1 text-xs font-mono text-[#756D65] hover:text-[#1F1A17]"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div
                onClick={() => setShowAddInput(true)}
                className="mt-5 pt-4 border-t border-[#D8CAB7]/40 flex items-center justify-between text-xs text-[#756D65] font-mono cursor-pointer hover:text-[#1F1A17]"
              >
                <span>+ Add mindful thought</span>
                <span className="text-[10px] bg-[#F3EFE6] px-1.5 py-0.5 rounded">Click to add</span>
              </div>
            )}
          </article>

          {/* Retro-Cute Lo-Fi Player Widget */}
          <div className="bg-[#FDFBF7] border-2 border-[#C3BEEC]/70 rounded-3xl p-5 shadow-[0_10px_30px_-10px_rgba(31,26,23,0.08)] relative overflow-hidden">
            {/* Window Title Bar */}
            <div className="flex items-center justify-between border-b border-[#C3BEEC]/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5A4A4]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E9BA6B]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#8CA689]"></span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#A39AC9] font-semibold ml-2">
                  lo-fi desk tape.exe
                </span>
              </div>
              <button
                onClick={toggleMusic}
                className="text-[#A39AC9] hover:text-[#1F1A17] cursor-pointer"
                title="Toggle Ambient Track"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Player Body */}
            <div className="bg-[#EDE9F7]/50 rounded-2xl p-4 border border-[#C3BEEC]/40 relative">
              <div className="flex items-center gap-3.5 mb-3">
                {/* Animated Heart Art */}
                <button
                  onClick={toggleMusic}
                  className={`w-12 h-12 rounded-xl bg-[#FDFBF7] border border-[#A39AC9]/40 flex items-center justify-center text-[#A39AC9] shadow-xs cursor-pointer transition-all ${
                    isPlayingLofi ? 'animate-gentle-pulse ring-2 ring-[#A39AC9]/50' : 'hover:scale-105'
                  }`}
                  title={isPlayingLofi ? 'Pause Lo-fi' : 'Play Lo-fi'}
                >
                  <Heart className={`w-6 h-6 ${isPlayingLofi ? 'fill-[#A39AC9]' : 'fill-[#A39AC9]/20'}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#A39AC9] font-bold tracking-wider block">
                      {isPlayingLofi ? 'Playing Ambient Tape' : 'Tape Ready'}
                    </span>
                    {isPlayingLofi && (
                      <span className="w-2 h-2 rounded-full bg-[#8CA689] animate-ping"></span>
                    )}
                  </div>
                  <h4 className="font-serif italic text-base text-[#1F1A17] truncate">
                    {digest.lofiTrackTitle || 'Rainy Greenhouse & Lo-fi Piano'}
                  </h4>
                  <p className="text-xs text-[#756D65] truncate">
                    {digest.lofiTrackArtist || 'Komorebi Sounds • Kyoto Rain Tape'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-[#FDFBF7] h-2 rounded-full overflow-hidden border border-[#C3BEEC]/30 p-0.5">
                  <div
                    className={`bg-[#A39AC9] h-full rounded-full transition-all duration-1000 ${
                      isPlayingLofi ? 'w-3/5' : 'w-2/5'
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#756D65]">
                  <span>{isPlayingLofi ? '02:45' : '01:42'}</span>
                  <span>04:15</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mt-3 text-[#A39AC9]">
                <button
                  onClick={() => soundSynthesizer.playPaperClick()}
                  className="hover:text-[#1F1A17] transition-colors cursor-pointer"
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleMusic}
                  className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#A39AC9]/50 flex items-center justify-center text-[#1F1A17] shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isPlayingLofi ? 'Pause' : 'Play Ambient Sound'}
                >
                  {isPlayingLofi ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => soundSynthesizer.playPaperClick()}
                  className="hover:text-[#1F1A17] transition-colors cursor-pointer"
                  title="Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom tactile note */}
            <div className="mt-3 text-center">
              <span className="font-hand text-base text-[#756D65]">
                {isPlayingLofi ? '♫ Ambient Rain & 432Hz Soundscape Active' : 'BPM: 74 • Binaural 432Hz focus drift'}
              </span>
            </div>
          </div>

          {/* Tactile Paper Clip Notepad */}
          <div
            onClick={() => setIsDigestModalOpen(true)}
            className="bg-[#FCF9F3] border border-[#D8CAB7]/60 rounded-xl p-5 shadow-xs relative rotate-1 transition-transform hover:rotate-0 cursor-pointer group"
            title="Click to edit daily grounding memo"
          >
            {/* Paper Clip Illustration */}
            <div className="absolute -top-4 right-8 w-4 h-10 border-2 border-[#1F1A17]/70 rounded-full z-10 pointer-events-none"></div>
            <div className="flex items-center justify-between text-xs font-mono text-[#756D65] border-b border-dashed border-[#D8CAB7] pb-2 mb-3">
              <span>{digest.memoCode}</span>
              <span>{digest.memoMonth}</span>
            </div>
            <p className="font-hand text-xl text-[#1F1A17] leading-snug">
              "{digest.memoText}"
            </p>
            <div className="mt-4 flex justify-between items-center text-[11px] font-sans text-[#756D65]">
              <span className="italic font-serif">{digest.memoTag}</span>
              <span className="text-[#8CA689] font-medium flex items-center gap-1">
                <span>★ Saved to Favorites</span>
                <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* CENTER COLUMN: Magazine Memories & Archetype (5 Cols) */}
        {/* ============================================== */}
        <div className="md:col-span-12 lg:col-span-5 space-y-8">
          {/* Spotify Wrapped Style Archetype Card */}
          <article
            onClick={() => onNavigateTab('wrapped')}
            className="relative rounded-3xl p-7 text-[#1F1A17] overflow-hidden shadow-md border border-emerald-900/10 group transition-all duration-500 hover:shadow-xl cursor-pointer"
            style={{ background: 'linear-gradient(145deg, #05E264 0%, #10B981 50%, #049646 100%)' }}
          >
            {/* Background Flower Organic Burst SVG */}
            <div className="absolute -right-12 -top-12 w-64 h-64 opacity-30 pointer-events-none group-hover:rotate-45 transition-transform duration-1000">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 0C100 55.2285 55.2285 100 0 100C55.2285 100 100 144.772 100 200C100 144.772 144.772 100 200 100C144.772 100 100 55.2285 100 0Z"
                  fill="#FDFBF7"
                />
              </svg>
            </div>

            {/* Header Pill */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1A17]/90 text-[#F9F6F0] text-xs font-mono tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#05E264]"></span>
                2026 Inner Season Archetype
              </span>
              <span className="text-xs font-serif italic text-[#1F1A17]/70">Reflective Matrix</span>
            </div>

            {/* Center Organic Radiant Emblem */}
            <div className="my-4 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-300 to-yellow-400 rounded-full blur-xs opacity-80 animate-pulse"></div>
                <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-md text-amber-300" viewBox="0 0 100 100">
                    <g fill="currentColor">
                      <circle cx="50" cy="20" r="14" fill="#FBBF24" opacity="0.9" />
                      <circle cx="80" cy="50" r="14" fill="#F59E0B" opacity="0.9" />
                      <circle cx="50" cy="80" r="14" fill="#FBBF24" opacity="0.9" />
                      <circle cx="20" cy="50" r="14" fill="#F59E0B" opacity="0.9" />
                      <circle cx="71" cy="29" r="13" fill="#FCD34D" />
                      <circle cx="71" cy="71" r="13" fill="#FCD34D" />
                      <circle cx="29" cy="71" r="13" fill="#FCD34D" />
                      <circle cx="29" cy="29" r="13" fill="#FCD34D" />
                      <circle cx="50" cy="50" r="16" fill="#D97706" />
                    </g>
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1F1A17] text-center mt-3 tracking-tight">
                {digest.archetypeName}
              </h2>
              <p className="text-center font-sans text-xs font-semibold text-[#1F1A17]/80 uppercase tracking-widest mt-1">
                {digest.archetypeSubtitle}
              </p>
            </div>

            {/* Description paragraph */}
            <p className="text-[#1F1A17]/90 text-xs sm:text-sm text-center max-w-sm mx-auto font-sans leading-relaxed mt-2">
              {digest.archetypeDescription}
            </p>

            {/* Trait Tag Pills */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-medium text-[#1F1A17]">
                {digest.archetypeMatrixCode}
              </span>
              <span className="text-[11px] font-sans font-medium text-[#1F1A17]/85">
                {digest.archetypeTraits}
              </span>
            </div>

            {/* Footer Footnote */}
            <div className="mt-6 pt-4 border-t border-[#1F1A17]/15 flex items-center justify-between text-xs font-mono text-[#1F1A17]/70">
              <span>SANCTUARY INSIGHTS</span>
              <span className="font-serif italic font-normal group-hover:translate-x-1 transition-transform">
                Explore Wrapped Persona →
              </span>
            </div>
          </article>

          {/* Layered Fan-Out Carousel Showcase ("Autumn Field Notes") */}
          <article className="bg-[#FDFBF7] border border-[#D8CAB7]/50 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] text-[#756D65] uppercase tracking-wider block">Visual Stream</span>
                <h3 className="font-serif italic text-2xl font-normal text-[#1F1A17]">Autumn Field Notes</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveFanIndex((prev) => (prev > 0 ? prev - 1 : 2));
                    soundSynthesizer.playPaperClick();
                  }}
                  className="w-8 h-8 rounded-full border border-[#D8CAB7]/60 flex items-center justify-center hover:bg-[#F3EFE6] transition-colors text-[#756D65]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveFanIndex((prev) => (prev < 2 ? prev + 1 : 0));
                    soundSynthesizer.playPaperClick();
                  }}
                  className="w-8 h-8 rounded-full border border-[#D8CAB7]/60 flex items-center justify-center hover:bg-[#F3EFE6] transition-colors text-[#756D65]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Layered 3D Perspective Card Fan Layout */}
            {fanCards.length === 0 ? (
              <div className="h-64 w-full flex flex-col items-center justify-center p-6 text-center bg-[#F3EFE6]/40 rounded-2xl border border-dashed border-[#D8CAB7] my-2">
                <Camera className="w-8 h-8 text-[#D8CAB7] mb-2" />
                <p className="font-serif italic text-base text-[#1F1A17]">No visual stream cards yet.</p>
                <p className="text-xs text-[#756D65] font-mono mt-1">Preserve your first ticket or journal entry to populate this fan.</p>
              </div>
            ) : (
              <div className="relative h-64 w-full flex items-center justify-center overflow-hidden py-4">
                {/* Left Deck Layer */}
                {fanCards[0] && (
                  <div
                    onClick={() => setActiveFanIndex(0)}
                    className={`absolute left-4 sm:left-8 w-36 h-48 rounded-2xl bg-[#EBE5DB] border-4 border-white shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
                      activeFanIndex === 0
                        ? 'z-30 scale-105 rotate-0'
                        : 'z-10 -rotate-12 -translate-y-1 hover:rotate-0 opacity-85'
                    }`}
                  >
                    <div className="w-full h-32 bg-[#E3EBDD] flex items-center justify-center text-[#8CA689] overflow-hidden">
                      {fanCards[0].imageUrl ? (
                        <img src={fanCards[0].imageUrl} alt={fanCards[0].title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8" />
                      )}
                    </div>
                    <div className="p-2 bg-white">
                      <p className="font-hand text-sm text-[#1F1A17] truncate">{fanCards[0].title}</p>
                      <span className="font-mono text-[9px] text-[#756D65] block truncate">{fanCards[0].subtitle}</span>
                    </div>
                  </div>
                )}

                {/* Right Deck Layer */}
                {(fanCards[2] || fanCards[0]) && (
                  <div
                    onClick={() => setActiveFanIndex(2)}
                    className={`absolute right-4 sm:right-8 w-36 h-48 rounded-2xl bg-[#EBE5DB] border-4 border-white shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
                      activeFanIndex === 2
                        ? 'z-30 scale-105 rotate-0'
                        : 'z-10 rotate-12 -translate-y-1 hover:rotate-0 opacity-85'
                    }`}
                  >
                    <div className="w-full h-32 bg-[#EDE9F7] flex items-center justify-center text-[#A39AC9] overflow-hidden">
                      {(fanCards[2] || fanCards[0]).imageUrl ? (
                        <img src={(fanCards[2] || fanCards[0]).imageUrl} alt={(fanCards[2] || fanCards[0]).title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-8 h-8" />
                      )}
                    </div>
                    <div className="p-2 bg-white">
                      <p className="font-hand text-sm text-[#1F1A17] truncate">{(fanCards[2] || fanCards[0]).title}</p>
                      <span className="font-mono text-[9px] text-[#756D65] block truncate">{(fanCards[2] || fanCards[0]).subtitle}</span>
                    </div>
                  </div>
                )}

                {/* Center Primary Hero Card */}
                {(fanCards[1] || fanCards[0]) && (
                  <div
                    onClick={() => setActiveFanIndex(1)}
                    className={`relative z-20 w-44 h-54 rounded-2xl bg-white border-4 border-white shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${
                      activeFanIndex === 1 ? 'scale-105' : 'scale-95 opacity-90'
                    }`}
                  >
                    <div className="w-full h-36 bg-[#FDF4DF]/80 flex flex-col items-center justify-center text-[#E9BA6B] relative overflow-hidden">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 washi-tape-sage z-10"></div>
                      {(fanCards[1] || fanCards[0]).imageUrl ? (
                        <img src={(fanCards[1] || fanCards[0]).imageUrl} alt={(fanCards[1] || fanCards[0]).title} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-9 h-9 mb-1" />
                          <span className="font-mono text-[10px] text-[#1F1A17]/60 tracking-wider">TACTILE CAPTURE</span>
                        </>
                      )}
                    </div>
                    <div className="p-3 bg-white text-center">
                      <p className="font-serif italic font-medium text-sm text-[#1F1A17] truncate">{(fanCards[1] || fanCards[0]).title}</p>
                      <span className="font-hand text-base text-[#756D65] block mt-0.5 truncate">
                        "{(fanCards[1] || fanCards[0]).quote}"
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 flex items-center justify-between text-xs font-mono text-[#756D65] pt-2 border-t border-[#D8CAB7]/30">
              <span>{tickets.length} TICKETS IN ARCHIVE</span>
              <button
                onClick={() => onNavigateTab('journal')}
                className="font-sans text-[#1F1A17] font-medium hover:underline cursor-pointer"
              >
                Explore Archive →
              </button>
            </div>
          </article>

          {/* Habit & Rhythm Garden (Botanical & Pastel Growth Showcase) */}
          <article className="bg-[#FDFBF7] border border-[#D8CAB7]/50 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] text-[#8CA689] uppercase tracking-wider font-semibold block">
                  Botanical Rhythm
                </span>
                <h3 className="font-serif italic text-xl text-[#1F1A17]">Mindful Habit Conservatory</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E3EBDD] text-[#8CA689] font-mono text-xs font-semibold">
                {habits.reduce((acc, h) => Math.max(acc, h.streak), 0)}-Day Peak Streak
              </span>
            </div>
            <p className="text-xs text-[#756D65] mb-4">
              Cultivating daily practice without corporate checklists. Each ring blossoms with mindful cadence.
            </p>

            {displayHabits.length === 0 ? (
              <div className="py-6 px-4 text-center bg-[#F3EFE6]/40 rounded-2xl border border-dashed border-[#D8CAB7]">
                <p className="font-serif italic text-sm text-[#1F1A17]">No active habits in conservatory.</p>
                <p className="text-[11px] text-[#756D65] font-mono mt-1">Cultivate your first botanical cadence in Habits.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayHabits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onNavigateTab('habits')}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F3EFE6]/60 border border-[#D8CAB7]/40 hover:bg-[#F3EFE6] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E3EBDD] text-[#8CA689] flex items-center justify-center text-sm">
                        {h.icon || <Sprout className="w-4 h-4" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-[#1F1A17]">{h.title}</h5>
                        <p className="text-[10px] text-[#756D65] font-mono">
                          {h.completedToday ? `Completed • Streak: ${h.streak}d` : `Target: ${h.targetTime}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#E3EBDD]"></span>
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#8CA689]/40"></span>
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#8CA689]/70"></span>
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#8CA689]"></span>
                      <span className={`w-3.5 h-3.5 rounded-xs ${h.completedToday ? 'bg-[#8CA689] ring-2 ring-[#8CA689]/40' : 'border border-dashed border-[#8CA689]'}`}></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        {/* ============================================== */}
        {/* RIGHT COLUMN: Perforated Ticket Stub & Notes (3 Cols) */}
        {/* ============================================== */}
        <div className="md:col-span-12 lg:col-span-3 space-y-8">
          {/* Perforated Ticket Stub Memory Card */}
          <article
            onClick={() => onNavigateTab('memories')}
            className="relative bg-[#FDFBF7] border border-[#D8CAB7]/60 rounded-3xl p-5 shadow-[0_12px_28px_rgba(38,28,20,0.12)] overflow-hidden transition-all duration-300 hover:shadow-xl group cursor-pointer"
          >
            {/* Left & Right Notched Punch Holes */}
            <div className="ticket-edge-left"></div>
            <div className="ticket-edge-right"></div>
            {/* Honey Washi on Corner */}
            <div className="absolute -top-3.5 -right-3 w-20 h-7 washi-tape-honey z-10 rounded-xs"></div>

            {/* Ticket Header */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#D8CAB7]/80 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#756D65]">
                MEM_TICKET // NO. {safeHeroTicket.stubNumber}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditTicketModalOpen(true);
                  }}
                  className="p-1 text-[#756D65] hover:text-[#1F1A17] opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit Ticket Details"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <Ticket className="w-4 h-4 text-[#E9BA6B]" />
              </div>
            </div>

            {/* Photo Canvas inside Ticket with Custom User Upload Support */}
            <div
              onMouseEnter={() => setIsPhotoHovered(true)}
              onMouseLeave={() => setIsPhotoHovered(false)}
              onDragOver={(e) => {
                e.preventDefault();
                setIsPhotoHovered(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsPhotoHovered(false);
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (typeof ev.target?.result === 'string') {
                      soundSynthesizer.playStampSound();
                      onUpdateHeroTicketImage(ev.target.result);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="rounded-2xl overflow-hidden border border-[#D8CAB7]/40 bg-[#F3EFE6] shadow-inner relative group-hover:scale-[1.02] transition-transform"
            >
              <input
                ref={heroFileRef}
                type="file"
                accept="image/*"
                onChange={handleHeroPhotoUpload}
                className="hidden"
                id="hero-ticket-photo-upload"
              />

              <div className="h-44 w-full bg-gradient-to-t from-[#1F1A17]/80 via-transparent to-transparent absolute inset-0 z-10"></div>
              {safeHeroTicket.imageUrl ? (
                <img
                  src={safeHeroTicket.imageUrl}
                  alt={safeHeroTicket.title}
                  className="h-44 w-full object-cover object-center"
                />
              ) : (
                <div className="h-44 w-full bg-[#D7E3DF] flex items-center justify-center relative">
                  <div className="text-center p-4">
                    <span className="font-serif italic text-sm text-[#1F1A17] block">{safeHeroTicket.title}</span>
                  </div>
                </div>
              )}

              {/* Upload Your Own Image Action Overlay */}
              <div className="absolute top-2 right-2 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    heroFileRef.current?.click();
                  }}
                  title="Upload your own photo for this memory ticket"
                  className="bg-[#1F1A17]/80 hover:bg-[#1F1A17] text-[#FAF8F5] text-[10px] font-mono px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5 border border-white/20 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Camera className="w-3 h-3 text-[#E9BA6B]" />
                  <span>{isPhotoHovered ? 'Upload Your Photo' : 'Photo'}</span>
                </button>
              </div>

              <div className="absolute bottom-2 left-3 right-3 z-20 flex justify-between items-end text-[#F9F6F0] text-xs">
                <div>
                  <span className="text-[9px] font-mono text-[#F9F6F0]/70 uppercase">{safeHeroTicket.categoryLabel}</span>
                  <p className="font-serif text-xs leading-none">{safeHeroTicket.title}</p>
                </div>
                <span className="font-mono text-[9px] bg-[#1F1A17]/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  {safeHeroTicket.fare || 'ADMIT ONE'}
                </span>
              </div>
            </div>

            {/* Perforated Line across ticket */}
            <div className="my-5 border-b-2 border-dotted border-[#D8CAB7]/70 relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FDFBF7] px-2 font-mono text-[8px] text-[#756D65] tracking-widest uppercase">
                TEAR OFF MEMORY
              </span>
            </div>

            {/* Ticket Metadata & Barcode */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#756D65]">DATE:</span>
                <span className="font-bold text-[#1F1A17]">{safeHeroTicket.date}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#756D65]">WEATHER:</span>
                <span className="text-[#1F1A17]">{safeHeroTicket.weather}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#756D65]">COMPANION:</span>
                <span className="text-[#1F1A17]">{safeHeroTicket.companion}</span>
              </div>
              <p className="font-hand text-base text-[#1F1A17] pt-2 leading-relaxed">
                "{safeHeroTicket.quote}"
              </p>

              {/* Barcode Accent */}
              <div className="pt-3 flex flex-col items-center">
                <div className="barcode-lines h-8 w-36 opacity-75"></div>
                <span className="font-mono text-[8px] tracking-widest text-[#756D65] mt-1">
                  {safeHeroTicket.barcodeNumber || '9 421008 339102'}
                </span>
              </div>
            </div>
          </article>

          {/* Pastel Calendar Planner Widget */}
          <div
            onClick={() => setIsDigestModalOpen(true)}
            className="bg-[#FDFBF7] border border-[#D8CAB7]/50 rounded-3xl p-5 shadow-xs cursor-pointer hover:border-[#8CA689] transition-colors"
            title="Click to edit Calendar and Daily Anchor"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif italic text-base text-[#1F1A17]">{digest.calendarMonth}</h4>
              <span className="font-hand text-sm text-[#E5A4A4] font-bold">{digest.moonPhase}</span>
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-[#756D65] mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-sans">
              <span className="p-1 text-[#D8CAB7]">28</span>
              <span className="p-1 text-[#D8CAB7]">29</span>
              <span className="p-1 text-[#D8CAB7]">30</span>
              <span className="p-1 text-[#1F1A17]">1</span>
              <span className="p-1 text-[#1F1A17]">2</span>
              <span className="p-1 text-[#1F1A17]">3</span>
              <span className="p-1 text-[#1F1A17]">4</span>
              <span className="p-1 text-[#1F1A17]">5</span>
              <span className="p-1 text-[#1F1A17]">6</span>
              <span className="p-1 text-[#1F1A17]">7</span>
              <span className="p-1 bg-[#E9BA6B] text-[#1F1A17] font-bold rounded-full shadow-xs">8</span>
              <span className="p-1 text-[#1F1A17]">9</span>
              <span className="p-1 text-[#1F1A17]">10</span>
              <span className="p-1 text-[#1F1A17]">11</span>
              <span className="p-1 text-[#1F1A17]">12</span>
              <span className="p-1 text-[#1F1A17]">13</span>
              <span className="p-1 text-[#1F1A17]">14</span>
              <span className="p-1 text-[#1F1A17]">15</span>
              <span className="p-1 text-[#1F1A17]">16</span>
              <span className="p-1 text-[#1F1A17]">17</span>
              <span className="p-1 text-[#1F1A17]">18</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D8CAB7]/30 flex items-center gap-2 text-xs font-hand text-[#1F1A17]">
              <span className="w-2 h-2 rounded-full bg-[#E9BA6B]"></span>
              <span>{digest.todayCalendarEvent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Retro Grid Aesthetic Folder Area: curated_scraps_2026/ */}
      <section className="bg-[#FDFBF7] border-2 border-[#C3BEEC] rounded-3xl p-6 shadow-xs bg-retro-grid relative overflow-hidden">
        {/* Folder Header Tab */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C3BEEC]/60">
          <div className="flex items-center gap-3">
            <div className="bg-[#EDE9F7] px-3 py-1 rounded-t-lg border-t border-x border-[#C3BEEC] text-xs font-mono font-medium text-[#1F1A17] flex items-center gap-2">
              <FolderHeart className="w-3.5 h-3.5 text-[#A39AC9]" />
              <span>{digest.curatedScrapsTitle}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[#756D65] text-xs font-mono">
              <span>←</span><span>→</span><span>↻</span>
              <span className="text-[11px] bg-white/80 px-3 py-0.5 rounded-full border border-[#C3BEEC]/40">
                {digest.curatedScrapsPath}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-hand text-lg text-[#756D65]">Interactive Moodboard Desk</span>
            <button
              onClick={() => onNavigateTab('journal')}
              className="w-7 h-7 rounded-full bg-white border border-[#C3BEEC] flex items-center justify-center text-[#756D65] hover:text-[#1F1A17] cursor-pointer"
            >
              <Maximize className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Freeform Interactive Scrapbook Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Scrappy Item 1: Botanical Pressed Herbarium Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-[#D8CAB7]/60 shadow-xs relative group hover:rotate-1 transition-transform">
            <div className="absolute -top-3 left-6 w-16 h-5 washi-tape-sage"></div>
            <div className="flex justify-between items-center text-xs font-serif italic text-[#756D65] mb-2">
              <span>{digest.curatedScrap1Specimen}</span>
              <span className="font-mono text-[9px]">{digest.curatedScrap1Latin}</span>
            </div>
            <div className="h-28 bg-[#F5F2EB] rounded-xl flex items-center justify-center text-[#E9BA6B] border border-[#D8CAB7]/30">
              <Leaf className="w-12 h-12 stroke-[1.2]" />
            </div>
            <p className="font-hand text-lg text-[#1F1A17] mt-3">
              "{digest.curatedScrap1Text}"
            </p>
          </div>

          {/* Scrappy Item 2: Polaroid Quote Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#D8CAB7]/60 shadow-xs relative group hover:-rotate-1 transition-transform">
            <div className="absolute -top-3 right-6 w-16 h-5 washi-tape-lavender"></div>
            <div className="h-28 bg-[#F3EFE6] rounded-xl flex items-center justify-center p-4 text-center border border-[#D8CAB7]/30">
              <p className="font-serif italic text-sm text-[#1F1A17]">
                "{digest.curatedScrap2Quote}"
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs font-mono text-[#756D65]">
              <span>{digest.curatedScrap2Author}</span>
              <span className="text-[#8CA689]">★ Quote of Week</span>
            </div>
          </div>

          {/* Scrappy Item 3: Coffee Stain & Audio Frequency Memo */}
          <div
            onClick={toggleMusic}
            className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-[#D8CAB7]/60 shadow-xs relative group hover:rotate-2 transition-transform cursor-pointer"
          >
            <div className="absolute -top-3 left-1/3 w-16 h-5 washi-tape-honey"></div>
            <div className="flex items-center justify-between text-xs font-mono text-[#756D65] mb-2">
              <span>{digest.curatedScrap3Title}</span>
              <span className={`w-2 h-2 rounded-full ${isPlayingLofi ? 'bg-[#8CA689] animate-ping' : 'bg-red-400'}`}></span>
            </div>
            <div className="h-28 bg-[#FAF6EE] rounded-xl flex flex-col items-center justify-center border border-[#D8CAB7]/30 p-3">
              <div className="flex items-center gap-1 h-10 w-full justify-center">
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-5 animate-pulse' : 'h-3'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-8 animate-pulse' : 'h-6'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-10 animate-pulse' : 'h-9'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-6 animate-pulse' : 'h-5'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-9 animate-pulse' : 'h-8'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-5 animate-pulse' : 'h-4'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-8 animate-pulse' : 'h-7'}`}></span>
                <span className={`w-1 bg-[#8CA689] rounded-full transition-all ${isPlayingLofi ? 'h-4 animate-pulse' : 'h-2'}`}></span>
              </div>
              <span className="font-mono text-[9px] text-[#756D65] mt-1 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-[#8CA689]" />
                {digest.curatedScrap3Duration}
              </span>
            </div>
            <p className="font-hand text-lg text-[#1F1A17] mt-3">"{digest.curatedScrap3Text}"</p>
          </div>
        </div>
      </section>

      {/* Sanctuary Inscription & Edit Modals */}
      <SanctuaryDigestModal
        digest={digest}
        isOpen={isDigestModalOpen}
        onClose={() => setIsDigestModalOpen(false)}
        onSave={updateDigest}
      />

      <EditTicketModal
        ticket={safeHeroTicket}
        isOpen={isEditTicketModalOpen}
        onClose={() => setIsEditTicketModalOpen(false)}
        onSave={updateTicket}
        onDelete={deleteTicket}
      />
    </main>
  );
};
