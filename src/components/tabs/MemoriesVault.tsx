import React, { useState, useRef } from 'react';
import { TicketStub } from '../../types';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import { EditTicketModal } from '../EditTicketModal';
import {
  Search,
  Download,
  Plus,
  Compass,
  Play,
  Pause,
  Share2,
  Calendar,
  Grid,
  List,
  Layers,
  Sparkles,
  Ticket,
  Volume2,
  Camera,
  Upload,
  Image as ImageIcon,
  Pencil,
  Trash2
} from 'lucide-react';

interface MemoriesVaultProps {
  tickets?: TicketStub[];
  heroTicket?: TicketStub;
  onOpenNewTicket: () => void;
  onUpdateHeroTicketImage?: (newImageUrl: string) => void;
  onUpdateTicketImage?: (ticketId: string, newImageUrl: string) => void;
}

export const MemoriesVault: React.FC<MemoriesVaultProps> = ({
  onOpenNewTicket,
  onUpdateHeroTicketImage = (_url: string) => {},
  onUpdateTicketImage = (_id: string, _url: string) => {},
}) => {
  const { tickets, heroTicket, updateTicket, deleteTicket, digest, vaultEnvelopes } = useLifeOS();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'spread' | 'ledger' | 'tearDeck'>('spread');
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [targetTicketIdForUpload, setTargetTicketIdForUpload] = useState<string | null>(null);
  const [editingTicket, setEditingTicket] = useState<TicketStub | null>(null);

  const heroPhotoRef = useRef<HTMLInputElement>(null);
  const ticketPhotoRef = useRef<HTMLInputElement>(null);

  const handleProcessHeroFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          soundSynthesizer.playStampSound();
          onUpdateHeroTicketImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessTicketFile = (file: File) => {
    if (targetTicketIdForUpload && file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          soundSynthesizer.playStampSound();
          onUpdateTicketImage(targetTicketIdForUpload, e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleReel = () => {
    const playing = soundSynthesizer.togglePlay((st) => setIsPlayingReel(st));
    setIsPlayingReel(playing);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.companion && t.companion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic statistics
  const uniqueCities = Array.from(new Set(tickets.map((t) => t.location).filter(Boolean)));
  const uniqueCompanions = Array.from(new Set(tickets.map((t) => t.companion).filter(Boolean)));

  const categoryCounts = {
    all: tickets.length,
    travel: tickets.filter((t) => t.category === 'travel').length,
    cafe: tickets.filter((t) => t.category === 'cafe').length,
    exhibition: tickets.filter((t) => t.category === 'exhibition').length,
    cinema: tickets.filter((t) => t.category === 'cinema').length,
    rail: tickets.filter((t) => t.category === 'rail').length,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Archival Overview & Stats */}
      <section className="space-y-6" data-purpose="archival-overview">
        {/* Breadcrumb and Ledger Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#756D65]">
            <span>Sanctuary</span>
            <span>/</span>
            <span>Memories Archive</span>
            <span>/</span>
            <span className="text-[#1F1A17] font-semibold underline decoration-[#D8CAB7] decoration-1 underline-offset-4">
              Ticket Stubs Ledger
            </span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px] text-[#756D65] bg-white/80 px-2.5 py-1 rounded-lg border border-[#D8CAB7]/50 shadow-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PHYSICAL VAULT SYNC: OK</span>
            <span className="text-[#D8CAB7]">•</span>
            <span>{digest.vaultShelfCode || 'BOX #04 / SHELF A2'}</span>
          </div>
        </div>

        {/* Main Headline & Editorial Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D8CAB7]/80 pb-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1F1A17] font-medium tracking-tight">
              Tactile Memory Ticket Archive
            </h1>
            <p className="text-sm md:text-base text-[#756D65] mt-1.5 font-serif italic max-w-2xl leading-relaxed">
              "A physical scrapbook vault that records lived days by turning everyday photos, journeys, and cafe receipts into perforated ticket stubs."
            </p>
          </div>

          {/* Archival Search Bar */}
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by place, companion, quote, or stub #..."
                className="w-full text-xs font-mono bg-white/90 border border-[#D8CAB7] rounded-lg pl-9 pr-4 py-2.5 text-[#1F1A17] placeholder-[#756D65]/70 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B] shadow-xs"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#756D65]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#756D65] hover:text-[#1F1A17]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ephemera Metric Cards (4 cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 border border-[#D8CAB7]/60 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#D8CAB7] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Total Collected</span>
              <span className="washi-tape-honey px-2 py-0.5 text-[9px] font-mono text-[#1F1A17] font-medium rotate-2 rounded-xs">
                INDEXED
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#1F1A17]">{tickets.length}</span>
              <span className="text-xs font-mono text-[#756D65]">ticket stubs</span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-emerald-700 flex items-center gap-1">
              <span>Dynamic local storage active</span>
            </div>
          </div>

          <div className="bg-white/80 border border-[#D8CAB7]/60 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#D8CAB7] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Span Documented</span>
              <span className="washi-tape-sage px-2 py-0.5 text-[9px] font-mono text-[#2D3E35] font-medium -rotate-1 rounded-xs">
                2024–2026
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#1F1A17]">3</span>
              <span className="text-xs font-mono text-[#756D65]">seasons captured</span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#756D65]">Autumn, Winter &amp; Early Spring</div>
          </div>

          <div className="bg-white/80 border border-[#D8CAB7]/60 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#D8CAB7] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#756D65]">Waypoints</span>
              <span className="text-[10px] font-mono text-[#C84B31] font-bold">{uniqueCities.length} CITIES</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#1F1A17]">{uniqueCities.length}</span>
              <span className="text-xs font-mono text-[#756D65]">cities &amp; valleys</span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#756D65] truncate">
              {uniqueCities.slice(0, 4).join(', ')}...
            </div>
          </div>

          <div className="bg-white/80 border border-[#D8CAB7]/60 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#D8CAB7] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Sensory Memos</span>
              <span className="washi-tape-lavender px-2 py-0.5 text-[9px] font-mono text-[#2B3A4A] font-medium rotate-1 rounded-xs">
                AUDIO CASSETTE
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#1F1A17]">{tickets.filter(t => t.audioTitle).length || 29}</span>
              <span className="text-xs font-mono text-[#756D65]">ambient field clips</span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#756D65]">Lofi sound generator synced</div>
          </div>
        </div>
      </section>

      {/* Filter and Chips Bar */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#F3EFE6]/60 p-2.5 rounded-2xl border border-[#D8CAB7]/80">
        <div className="flex items-center flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Stubs', count: categoryCounts.all },
            { id: 'travel', label: 'Travel & Wandering', count: categoryCounts.travel, dotColor: 'bg-[#D97736]' },
            { id: 'cafe', label: 'Quiet Cafes & Kissa', count: categoryCounts.cafe, dotColor: 'bg-[#8CA689]' },
            { id: 'exhibition', label: 'Exhibitions & Parks', count: categoryCounts.exhibition, dotColor: 'bg-[#C84B31]' },
            { id: 'cinema', label: 'Midnight Cinema', count: categoryCounts.cinema, dotColor: 'bg-[#2B3A4A]' },
            { id: 'rail', label: 'Rail Passports', count: categoryCounts.rail, dotColor: 'bg-slate-400' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                soundSynthesizer.playPaperClick();
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1F1A17] text-[#F9F6F0] font-semibold shadow-xs'
                  : 'bg-white/80 text-[#1F1A17] hover:bg-white border border-[#D8CAB7]/80'
              }`}
            >
              {cat.dotColor && <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor}`}></span>}
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 rounded-full ${activeCategory === cat.id ? 'bg-[#3F3968] text-white' : 'text-[#756D65]'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center space-x-1 bg-[#EDE4D4]/70 p-1 rounded-lg border border-[#D8CAB7]/60 self-end md:self-auto">
          <button
            onClick={() => setViewMode('spread')}
            className={`px-2.5 py-1 text-xs font-medium font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'spread' ? 'text-[#1F1A17] bg-white shadow-xs' : 'text-[#756D65] hover:text-[#1F1A17]'
            }`}
            title="Desk Spread View"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Spread</span>
          </button>
          <button
            onClick={() => setViewMode('ledger')}
            className={`px-2.5 py-1 text-xs font-medium font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'ledger' ? 'text-[#1F1A17] bg-white shadow-xs' : 'text-[#756D65] hover:text-[#1F1A17]'
            }`}
            title="Chronological Ledger Roll"
          >
            <List className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </button>
          <button
            onClick={() => setViewMode('tearDeck')}
            className={`px-2.5 py-1 text-xs font-medium font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'tearDeck' ? 'text-[#1F1A17] bg-white shadow-xs' : 'text-[#756D65] hover:text-[#1F1A17]'
            }`}
            title="Tear-Off Physical Stub Deck"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tear Deck</span>
          </button>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 8 Cols (The Workdesk & Ticket Gallery) */}
        <section className="lg:col-span-8 space-y-8" data-purpose="workdesk-and-ticket-gallery">
          {/* HERO SPOTLIGHT TICKET */}
          <article className="bg-white rounded-2xl border border-[#D8CAB7] shadow-[0_8px_30px_rgba(50,40,30,0.12)] overflow-hidden relative group">
            {/* Washi tape tab hanging over card */}
            <div className="absolute -top-3 left-16 z-20 washi-tape-honey px-6 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#1F1A17] -rotate-1 font-semibold shadow-xs rounded-xs">
              MEMORIAL_ENTRY // NO. {heroTicket.stubNumber}
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Left Side: Photo Frame Container */}
                <div className="w-full md:w-5/12 flex-shrink-0">
                  <input
                    ref={heroPhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProcessHeroFile(file);
                    }}
                    className="hidden"
                    id="vault-hero-photo-input"
                  />
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProcessHeroFile(file);
                    }}
                    className="bg-[#FAF8F5] p-3 rounded-xl border border-[#D8CAB7]/80 shadow-xs relative group"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-lg bg-[#EDE4D4] relative">
                      <img
                        src={heroTicket.imageUrl}
                        alt={heroTicket.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                      
                      {/* Upload Photo Button Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          heroPhotoRef.current?.click();
                        }}
                        className="absolute top-2 right-2 z-10 bg-[#1F1A17]/80 hover:bg-[#1F1A17] text-[#FAF8F5] text-[10px] font-mono px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5 border border-white/20 shadow-md cursor-pointer transition-all hover:scale-105"
                        title="Upload your own photo for this hero memory"
                      >
                        <Camera className="w-3 h-3 text-[#E9BA6B]" />
                        <span>Upload Photo</span>
                      </button>

                      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                        EXP: 35MM ISO 200
                      </span>
                    </div>
                    {/* Polaroid Handwritten Caption */}
                    <div className="mt-3 pt-1 text-center">
                      <p className="font-hand text-lg text-[#1F1A17] leading-tight">
                        "{heroTicket.subtitle}"
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-[#756D65]">{heroTicket.location}</span>
                        <span className="text-[#D8CAB7]">•</span>
                        <span className="text-[10px] font-mono text-[#756D65]">{heroTicket.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: The Ticket Passbook Body */}
                <div className="w-full md:w-7/12 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#756D65]">
                          {heroTicket.categoryLabel}
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1F1A17] mt-0.5">
                          {heroTicket.title}
                        </h2>
                      </div>
                      {/* Hanko stamp */}
                      <div className="hanko-stamp px-2.5 py-1 rounded text-center select-none flex flex-col items-center">
                        <span className="text-[8px] font-mono font-bold tracking-widest">入場済</span>
                        <span className="text-[9px] font-mono font-bold uppercase">ARCHIVED</span>
                        <span className="text-[7px] font-mono">{heroTicket.date?.substring(0, 7) || '2025.04'}</span>
                      </div>
                    </div>

                    {/* Perforated Tear Line */}
                    <div className="my-4 relative flex items-center">
                      <div className="flex-grow border-t border-dashed border-[#D8CAB7]"></div>
                      <span className="flex-shrink mx-3 text-[9px] font-mono text-[#756D65] uppercase tracking-widest bg-[#FAF8F5] px-2 py-0.5 rounded">
                        TEAR-OFF LINE
                      </span>
                      <div className="flex-grow border-t border-dashed border-[#D8CAB7]"></div>
                    </div>

                    {/* Lined Paper Reflection */}
                    <div className="bg-[#FAF8F5]/80 p-3.5 rounded-lg border border-[#D8CAB7]/80 lined-memo mb-4">
                      <p className="font-hand text-base text-[#1F1A17] leading-6">
                        {heroTicket.quote}
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-[#F5F0E8]/50 p-2 rounded border border-[#D8CAB7]/50">
                        <span className="text-[10px] text-[#756D65] block uppercase">Weather &amp; Fare</span>
                        <span className="font-medium text-[#1F1A17]">{heroTicket.weather} • {heroTicket.fare || 'ADMIT ONE'}</span>
                      </div>
                      <div className="bg-[#F5F0E8]/50 p-2 rounded border border-[#D8CAB7]/50">
                        <span className="text-[10px] text-[#756D65] block uppercase">Companion</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-4 h-4 rounded-full bg-[#D97736]/20 text-[#D97736] flex items-center justify-center text-[9px] font-bold">
                            {heroTicket.companion ? heroTicket.companion.substring(0, 2).toUpperCase() : 'ME'}
                          </span>
                          <span className="font-medium text-[#1F1A17]">{heroTicket.companion || 'Solo'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sensory Audio Memo Player */}
                    <div className="mt-4 bg-white p-3 rounded-lg border border-[#D8CAB7] flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={toggleReel}
                          className="w-8 h-8 rounded-full bg-[#1F1A17] text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                          title="Play field recording"
                        >
                          {isPlayingReel ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <div>
                          <span className="text-xs font-mono font-medium text-[#1F1A17] block">
                            {heroTicket.audioTitle || 'Nagakute Valley Birds & Clock Bell'}
                          </span>
                          <span className="text-[10px] font-mono text-[#756D65]">
                            Tape Memo #19 • 02:45 min • 48kHz
                          </span>
                        </div>
                      </div>
                      {/* Watercolor Soundwave */}
                      <div className="flex items-center space-x-1 h-6 w-24">
                        <span className={`w-1 bg-[#D8CAB7] rounded-full transition-all ${isPlayingReel ? 'h-4 animate-pulse' : 'h-2'}`}></span>
                        <span className={`w-1 bg-[#AC9774] rounded-full transition-all ${isPlayingReel ? 'h-6 animate-pulse' : 'h-4'}`}></span>
                        <span className={`w-1 bg-[#D97736] rounded-full transition-all ${isPlayingReel ? 'h-8 animate-pulse' : 'h-6'}`}></span>
                        <span className={`w-1 bg-[#AC9774] rounded-full transition-all ${isPlayingReel ? 'h-5 animate-pulse' : 'h-3'}`}></span>
                        <span className={`w-1 bg-[#D8CAB7] rounded-full transition-all ${isPlayingReel ? 'h-7 animate-pulse' : 'h-5'}`}></span>
                        <span className={`w-1 bg-[#D97736] rounded-full transition-all ${isPlayingReel ? 'h-4 animate-pulse' : 'h-3'}`}></span>
                        <span className={`w-1 bg-[#D8CAB7] rounded-full transition-all ${isPlayingReel ? 'h-2 animate-pulse' : 'h-1.5'}`}></span>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Footer & Barcode Section */}
                  <div className="mt-6 pt-4 border-t border-[#D8CAB7] flex items-end justify-between">
                    <div>
                      <div className="barcode-lines h-8 w-40 mb-1 opacity-70"></div>
                      <span className="text-[9px] font-mono text-[#756D65] tracking-wider">
                        {heroTicket.barcodeNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTicket(heroTicket)}
                        className="px-2.5 py-1 text-xs font-mono text-[#1F1A17] border border-[#D8CAB7] rounded hover:bg-[#FAF8F5] cursor-pointer flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit Ticket</span>
                      </button>
                      <button
                        onClick={onOpenNewTicket}
                        className="px-3 py-1 text-xs font-mono bg-[#1F1A17] text-white rounded hover:bg-black cursor-pointer"
                      >
                        + New Slip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-3 w-full bg-[#FAF8F5] border-t border-[#D8CAB7]/50"></div>
          </article>

          {/* Subheading for Ledger Gallery */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-xl font-medium text-[#1F1A17]">Physical Ticket Collection</h3>
              <span className="text-xs font-mono text-[#756D65]">
                Showing {filteredTickets.length} stubs
              </span>
            </div>
            <div className="text-xs font-mono text-[#756D65]">
              <span>Filter: </span>
              <span className="font-medium text-[#1F1A17] capitalize">{activeCategory}</span>
            </div>
          </div>

          {/* Collectible Ticket Stubs Grid */}
          <input
            ref={ticketPhotoRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleProcessTicketFile(file);
            }}
            className="hidden"
            id="vault-stub-photo-input"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-purpose="ledger-grid">
            {filteredTickets
              .filter((t) => !t.isHero)
              .map((stub) => {
                const isExpanded = expandedTicketId === stub.id;
                return (
                  <div
                    key={stub.id}
                    onClick={() => setExpandedTicketId(isExpanded ? null : stub.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setTargetTicketIdForUpload(stub.id);
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (typeof ev.target?.result === 'string') {
                              soundSynthesizer.playStampSound();
                              onUpdateTicketImage(stub.id, ev.target.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                    className="bg-white rounded-xl border border-[#D8CAB7] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group"
                  >
                    {/* Washi Tape Accent */}
                    <div
                      className={`px-3 py-0.5 text-[9px] font-mono absolute top-2 right-4 rounded-xs ${
                        stub.tapeStyle === 'lilac'
                          ? 'washi-tape-lavender text-[#2B3A4A] rotate-1'
                          : stub.tapeStyle === 'gold'
                          ? 'bg-amber-600/30 text-amber-900 border border-amber-500/40 -rotate-1'
                          : stub.tapeStyle === 'sage'
                          ? 'washi-tape-sage text-[#2D3E35] rotate-2'
                          : stub.tapeStyle === 'honey'
                          ? 'washi-tape-honey text-[#1F1A17] -rotate-2'
                          : 'washi-tape-honey text-[#1F1A17] -rotate-2'
                      }`}
                    >
                      {stub.stubNumber}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#8CA689]"></span>
                          <span className="text-[10px] font-mono text-[#756D65] uppercase">
                            {stub.categoryLabel}
                          </span>
                        </div>
                        {/* Edit and Delete Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTicket(stub);
                            }}
                            className="p-1 text-[#756D65] hover:text-[#1F1A17] cursor-pointer"
                            title="Edit ticket"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete memory ticket "${stub.title}"?`)) {
                                deleteTicket(stub.id);
                              }
                            }}
                            className="p-1 text-[#756D65] hover:text-rose-600 cursor-pointer"
                            title="Delete ticket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-[#1F1A17] group-hover:text-[#8CA689] transition-colors">
                        {stub.title}
                      </h4>
                      <p className="text-xs text-[#756D65] font-mono mt-0.5">{stub.subtitle}</p>

                      {/* Photo Thumbnail with Change / Upload option */}
                      {stub.imageUrl ? (
                        <div className="mt-3 relative rounded-lg overflow-hidden border border-[#D8CAB7] aspect-[16/9] bg-[#EDE4D4] group/photo">
                          <img
                            src={stub.imageUrl}
                            alt={stub.title}
                            className="w-full h-full object-cover group-hover/photo:scale-102 transition-transform duration-300"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTargetTicketIdForUpload(stub.id);
                              ticketPhotoRef.current?.click();
                            }}
                            className="absolute bottom-2 right-2 bg-[#1F1A17]/80 hover:bg-[#1F1A17] text-white text-[10px] font-mono px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 border border-white/20 transition-all opacity-80 group-hover/photo:opacity-100 cursor-pointer shadow-xs"
                            title="Upload your own photo for this ticket"
                          >
                            <Camera className="w-3 h-3 text-[#E9BA6B]" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTargetTicketIdForUpload(stub.id);
                              ticketPhotoRef.current?.click();
                            }}
                            className="text-[10px] font-mono text-[#756D65] hover:text-[#1F1A17] flex items-center gap-1.5 py-1 px-2 rounded-md bg-[#FAF8F5] border border-dashed border-[#D8CAB7] hover:border-[#1F1A17] transition-colors cursor-pointer"
                          >
                            <Upload className="w-3 h-3 text-[#E9BA6B]" />
                            <span>Upload Your Photo to Stub</span>
                          </button>
                        </div>
                      )}

                      <div className="mt-4 p-2.5 bg-[#FAF8F5] rounded-lg border border-[#EDE4D4] text-xs font-hand text-[#1F1A17] text-base">
                        "{stub.quote}"
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#756D65]">
                        <span>Date: {stub.date}</span>
                        {stub.companion && <span>With: {stub.companion}</span>}
                        {stub.fare && <span className="text-[#C84B31] font-medium">{stub.fare}</span>}
                      </div>
                    </div>

                    {/* Perforated Bottom Tear Section */}
                    <div className="border-t border-dashed border-[#D8CAB7] px-5 py-2.5 bg-[#FAF8F5]/80 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#756D65]">{stub.barcodeNumber}</span>
                      <div className="barcode-lines h-4 w-16 opacity-60"></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* RIGHT COLUMN: 4 Cols (Curator Drawer & Box Metaphor) */}
        <aside className="lg:col-span-4 space-y-6" data-purpose="curator-drawer">
          {/* THE PHYSICAL WOODEN SCRAPBOOK BOX METAPHOR */}
          <div className="bg-[#ECE4D5] rounded-2xl p-6 border border-[#DACFBF] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#D97736]"></div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#1F1A17] font-semibold">
                  Vault Container
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#756D65]">
                {digest.vaultWoodType || 'KYOTO PAULOWNIA WOOD'}
              </span>
            </div>

            <h3 className="font-serif text-xl font-medium text-[#1F1A17]">
              {digest.vaultBoxName || 'Wooden Scrapbook Box 04'}
            </h3>
            <p className="text-xs font-serif italic text-[#1F1A17]/80 mt-1">
              "{digest.vaultBoxSubtitle || 'Late Autumn to Spring Ephemera, Travel Receipts, and Ticket Slips.'}"
            </p>

            {/* Capacity Bar Gauge */}
            <div className="mt-4 pt-4 border-t border-[#D8CAB7]/60">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#1F1A17]">Box Capacity</span>
                <span className="text-[#1F1A17] font-bold">{tickets.length} / 60 Stubs ({Math.min(100, Math.round((tickets.length / 60) * 100))}%)</span>
              </div>
              <div className="w-full h-2 bg-[#D8CAB7]/70 rounded-full overflow-hidden">
                <div
                  className="bg-[#1F1A17] h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.round((tickets.length / 60) * 100))}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-mono text-[#756D65] mt-1.5">
                {Math.max(0, 60 - tickets.length)} ticket sleeves remaining before Box 05 initialization.
              </p>
            </div>

            {/* Box Primary Actions */}
            <div className="mt-5 space-y-2">
              <button
                onClick={onOpenNewTicket}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1F1A17] text-[#F9F6F0] rounded-lg text-xs font-medium hover:bg-black transition-colors shadow-sm cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#E9BA6B]" />
                <span>+ Turn Photo into Memory Ticket</span>
              </button>
              <button
                onClick={() => {
                  soundSynthesizer.playStampSound();
                  alert("Printing tactile A4 memory sheet formatted with perforation lines!");
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/80 hover:bg-white text-[#1F1A17] border border-[#D8CAB7] rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#756D65]" />
                <span>Print Memory Ticket Sheet (A4)</span>
              </button>
            </div>
          </div>

          {/* CURATED ENVELOPES (FOLDERS) */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8CAB7] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif text-base font-medium text-[#1F1A17]">Curated Envelopes</h4>
              <span className="text-[10px] font-mono text-[#756D65]">{vaultEnvelopes.length} SLEEVES</span>
            </div>
            <div className="space-y-2.5">
              {vaultEnvelopes.map((env) => (
                <div
                  key={env.id}
                  onClick={() => soundSynthesizer.playPaperClick()}
                  className="group p-3 rounded-xl border border-[#D8CAB7]/60 hover:border-[#D8CAB7] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded ${env.bg} flex items-center justify-center text-sm`}>
                      {env.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1F1A17] group-hover:text-[#D97736] transition-colors">
                        {env.title}
                      </p>
                      <p className="text-[10px] font-mono text-[#756D65]">{env.info}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#756D65] group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              ))}
            </div>
          </div>

          {/* COMPANION LEDGER */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8CAB7] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif text-base font-medium text-[#1F1A17]">Companion Ledger</h4>
              <span className="text-[10px] font-mono text-[#756D65]">FELLOW TRAVELERS</span>
            </div>
            <div className="space-y-3">
              {[
                { initials: 'S', name: 'Solitary Walks', desc: 'Quiet wandering', count: `${tickets.filter(t => !t.companion || t.companion.toLowerCase().includes('solo')).length || 24} stubs`, bg: 'bg-[#EDE4D4]', text: 'text-[#1F1A17]' },
                { initials: 'KT', name: 'Kenji Takahashi', desc: 'Exhibitions & Architecture', count: `${tickets.filter(t => t.companion?.includes('Kenji')).length || 12} stubs`, bg: 'bg-[#D97736]/20', text: 'text-[#D97736]' },
                { initials: 'EV', name: 'Elena Vance', desc: 'Kissa & Coffee Slips', count: `${tickets.filter(t => t.companion?.includes('Elena')).length || 8} stubs`, bg: 'bg-indigo-100', text: 'text-indigo-800' },
                { initials: 'MR', name: 'Maya & Ren', desc: 'Midnight Film Club', count: `${tickets.filter(t => t.companion?.includes('Maya')).length || 4} stubs`, bg: 'bg-[#8CA689]/20', text: 'text-[#8CA689]' }
              ].map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-7 h-7 rounded-full ${comp.bg} ${comp.text} flex items-center justify-center font-serif text-xs font-bold`}>
                      {comp.initials}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-[#1F1A17] block">{comp.name}</span>
                      <span className="text-[10px] font-mono text-[#756D65]">{comp.desc}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-[#FAF8F5] text-[#1F1A17] px-2 py-0.5 rounded border border-[#D8CAB7]/40">
                    {comp.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SENSORY MINI REEL PLAYER */}
          <div className="bg-[#1F1A17] text-[#F9F6F0] rounded-2xl p-5 shadow-md border border-[#3F3968] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">
                AMBIENT REEL PLAYER
              </span>
              <span className={`w-2 h-2 rounded-full ${isPlayingReel ? 'bg-emerald-400 animate-ping' : 'bg-[#756D65]'}`}></span>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-white/10 mb-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#F9F6F0]/80 mb-2">
                <span className="truncate">Kyoto Rain on Cedar Shingles</span>
                <span className="text-amber-300">{isPlayingReel ? '02:45' : '01:42'}</span>
              </div>
              {/* Cassette wheels rotating */}
              <div className="flex items-center justify-center gap-6 py-2">
                <div className={`w-7 h-7 rounded-full border-2 border-white/50 border-dashed flex items-center justify-center text-[8px] font-mono ${isPlayingReel ? 'animate-spin' : ''}`}>
                  ●
                </div>
                <div className="h-1 flex-1 bg-white/20 rounded overflow-hidden">
                  <div className="w-2/3 h-full bg-amber-400"></div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 border-white/50 border-dashed flex items-center justify-center text-[8px] font-mono ${isPlayingReel ? 'animate-spin' : ''}`}>
                  ●
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => soundSynthesizer.playPaperClick()}
                className="text-[#F9F6F0]/60 hover:text-white transition-colors cursor-pointer"
              >
                Prev Tape
              </button>
              <button
                onClick={toggleReel}
                className="px-3 py-1 bg-white text-[#1F1A17] rounded font-medium text-[11px] hover:bg-[#F3EFE6] cursor-pointer"
              >
                {isPlayingReel ? 'Pause Reel' : 'Play Reel'}
              </button>
              <button
                onClick={() => soundSynthesizer.playPaperClick()}
                className="text-[#F9F6F0]/60 hover:text-white transition-colors cursor-pointer"
              >
                Next Memo
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Edit Ticket Modal */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          isOpen={!!editingTicket}
          onClose={() => setEditingTicket(null)}
          onSave={updateTicket}
          onDelete={deleteTicket}
        />
      )}
    </div>
  );
};
