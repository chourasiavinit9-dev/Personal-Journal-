import React, { useState, useRef } from 'react';
import { JournalNote, PaperTone } from '../../types';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import { JournalNoteModal } from '../JournalNoteModal';
import { PAPER_TONE_CONFIGS, PaperToneConfig } from '../../utils/paperTones';
import {
  Sparkles,
  Heart,
  SkipBack,
  SkipForward,
  Pause,
  Play,
  RotateCw,
  Plus,
  Volume2,
  Camera,
  Upload,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Check,
  BookOpen,
  ExternalLink,
  Clock,
  Palette
} from 'lucide-react';

interface JournalDeskProps {
  notes?: JournalNote[];
}

export const JournalDesk: React.FC<JournalDeskProps> = ({ notes: propNotes }) => {
  const {
    deskChecklist,
    toggleDeskChecklist,
    addDeskChecklist,
    deleteDeskChecklist,
    dailyStream,
    addDailyStream,
    deleteDailyStream,
    journalNotes: storeJournalNotes,
    addJournalNote,
    updateJournalNote,
    deleteJournalNote,
    digest,
    updateDigest,
    paperTone,
    setPaperTone
  } = useLifeOS();

  // Prioritize store notes so updates to centralized journalNotes array are immediate
  const journalNotes =
    storeJournalNotes && storeJournalNotes.length > 0
      ? storeJournalNotes
      : (propNotes && propNotes.length > 0 ? propNotes : []);

  const [streamInput, setStreamInput] = useState('');
  const [isPlayingLoFi, setIsPlayingLoFi] = useState(false);
  const [polaroidImage, setPolaroidImage] = useState<string | null>(null);
  const [polaroidCaption, setPolaroidCaption] = useState('11:15 AM • after the squall');
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [showAddChecklist, setShowAddChecklist] = useState(false);

  // Active paper tone from store with fallback
  const activeTone: PaperToneConfig = PAPER_TONE_CONFIGS[paperTone || 'cornflower'] || PAPER_TONE_CONFIGS.cornflower;

  const handleSelectPaperTone = (tone: PaperTone) => {
    soundSynthesizer.playPaperClick();
    setPaperTone(tone);
    setSavedNotification(`Paper tone switched to ${PAPER_TONE_CONFIGS[tone].name}`);
    setTimeout(() => setSavedNotification(null), 2500);
  };

  // Active note focused in the retro browser window
  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    return (propNotes && propNotes[0]?.id) || (storeJournalNotes && storeJournalNotes[0]?.id) || 'note-1';
  });

  // Current active note from centralized journalNotes
  const activeNote = journalNotes.find((n) => n.id === activeNoteId) || journalNotes[0] || null;

  // Double-click inline editing state for any note's title or content
  const [inlineEditing, setInlineEditing] = useState<{
    noteId: string;
    field: 'title' | 'content';
  } | null>(null);
  const [inlineValue, setInlineValue] = useState<string>('');
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const startInlineEdit = (noteId: string, field: 'title' | 'content', initialValue: string) => {
    soundSynthesizer.playPaperClick();
    setInlineEditing({ noteId, field });
    setInlineValue(initialValue);
  };

  const saveInlineEdit = (noteId: string, field: 'title' | 'content') => {
    const trimmed = inlineValue.trim();
    if (trimmed) {
      updateJournalNote(noteId, { [field]: trimmed });
      soundSynthesizer.playStampSound();
      setSavedNotification(`Saved ${field === 'content' ? 'long-form entry' : field} to centralized journalNotes`);
      setTimeout(() => setSavedNotification(null), 2500);
    }
    setInlineEditing(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditing(null);
    setInlineValue('');
  };

  // Modal for extra journal notes
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<JournalNote | null>(null);

  const polaroidFileRef = useRef<HTMLInputElement>(null);

  const handlePolaroidUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          soundSynthesizer.playStampSound();
          setPolaroidImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLoFi = () => {
    const isNow = soundSynthesizer.togglePlay((st) => setIsPlayingLoFi(st));
    setIsPlayingLoFi(isNow);
  };

  const handleStreamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (streamInput.trim()) {
      soundSynthesizer.playPaperClick();
      addDailyStream(streamInput.trim());
      setStreamInput('');
    }
  };

  const handleAddChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistText.trim()) {
      soundSynthesizer.playPaperClick();
      addDeskChecklist(newChecklistText.trim());
      setNewChecklistText('');
      setShowAddChecklist(false);
    }
  };

  const handleSaveNote = (data: Partial<JournalNote>) => {
    if (editingNote) {
      updateJournalNote(editingNote.id, data);
    } else {
      addJournalNote(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Desk Toolbar */}
      <section className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#C3D3E6]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase tracking-wider">Board:</span>
          <button className="px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-[#8BAAD0] text-[#3B5C87] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8BAAD0]"></span>
            All Desk Scraps <span className="text-[10px] bg-[#D5E3F0]/60 px-1.5 rounded-full">{journalNotes.length} notes • {deskChecklist.length + dailyStream.length} items</span>
          </button>
          <button
            onClick={() => {
              setEditingNote(null);
              setIsNoteModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#1F1A17] text-white hover:bg-black font-mono flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#E9BA6B]" />
            <span>+ New Journal Note</span>
          </button>

          {/* Double Click Tip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/70 rounded-full border border-[#C3D3E6] text-[11px] font-mono text-[#3B5C87]">
            <Sparkles className="w-3 h-3 text-[#E9BA6B]" />
            <span>Double-click any note title or text to edit in-place</span>
          </div>
        </div>

        {/* Paper Tone Switcher & Save Alert */}
        <div className="flex items-center gap-3">
          {savedNotification && (
            <div className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs animate-fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{savedNotification}</span>
            </div>
          )}

          <div
            className="flex items-center gap-3 text-xs bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border shadow-xs transition-colors"
            style={{ borderColor: activeTone.border }}
          >
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <Palette className="w-3 h-3" style={{ color: activeTone.hex }} />
              <span>Paper Tone:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {(Object.keys(PAPER_TONE_CONFIGS) as PaperTone[]).map((tId) => {
                const conf = PAPER_TONE_CONFIGS[tId];
                const isSelected = activeTone.id === tId;
                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => handleSelectPaperTone(tId)}
                    className={`w-4 h-4 rounded-full transition-all cursor-pointer hover:scale-125 ${
                      isSelected ? 'ring-2 ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: conf.hex,
                      outlineColor: isSelected ? conf.accent : undefined
                    }}
                    title={`${conf.name} (${conf.hex})`}
                    aria-label={`Select ${conf.name}`}
                  />
                );
              })}
            </div>
            <div className="h-3 w-px bg-slate-200"></div>
            <span
              className="text-[10px] font-mono font-medium uppercase tracking-wider transition-colors"
              style={{ color: activeTone.textColor }}
            >
              {activeTone.shortName} Desk
            </span>
          </div>
        </div>
      </section>

      {/* Main Desk Canvas: 12-column grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Memo pad & Cloud scalloped note (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* ITEM 1: Ripped Paper Checklist */}
          <article
            className="relative bg-white shadow-sm rounded-b-lg pt-4 pb-6 px-6 border-x border-b group hover:shadow-md transition-all"
            style={{ borderColor: activeTone.border }}
          >
            {/* Torn Top Edge simulation */}
            <div
              className="absolute -top-3 left-0 right-0 h-4 bg-white border-t rounded-t-sm"
              style={{ borderColor: activeTone.border }}
            ></div>
            {/* Paperclip */}
            <div className="absolute -top-5 left-8 z-20 pointer-events-none drop-shadow-xs">
              <div className="w-4 h-10 border-2 border-slate-400 rounded-full"></div>
            </div>
            {/* Star Decor */}
            <div className="absolute top-2 right-3 pointer-events-none">
              <div className="text-xl rotate-12 drop-shadow-xs" style={{ color: activeTone.starColor }}>★</div>
            </div>

            <div className="mt-2 mb-3">
              <span
                className="text-[10px] uppercase font-mono tracking-widest font-semibold transition-colors"
                style={{ color: activeTone.hex }}
              >
                Field Micro-tasks
              </span>
              <h2 className="font-serif text-lg font-semibold text-slate-800 leading-tight">
                Gentle Observations
              </h2>
              <p className="text-xs text-slate-400 font-sans">Updated today • Kyoto studio</p>
            </div>

            {/* Handwritten items on lined paper */}
            <div
              className="pt-2 pb-2 px-1 border-t border-b rounded transition-colors"
              style={{ backgroundColor: activeTone.paperBg, borderColor: activeTone.border }}
            >
              {deskChecklist.length === 0 ? (
                <div className="py-4 text-center text-slate-400 font-mono text-xs">
                  <p className="font-hand text-base text-slate-500">No active observations.</p>
                  <p className="text-[10px] mt-0.5">Click '+ Add' below to note a micro-task.</p>
                </div>
              ) : (
                <ul className="space-y-2 text-sm font-hand text-slate-700 tracking-wide text-lg">
                  {deskChecklist.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2.5 group/item select-none"
                    >
                      <div
                        onClick={() => {
                          toggleDeskChecklist(item.id);
                          soundSynthesizer.playPaperClick();
                        }}
                        className="flex items-center gap-2.5 flex-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          readOnly
                          className="rounded-full w-4 h-4 cursor-pointer"
                          style={{ accentColor: activeTone.accent }}
                        />
                        <span className={item.done ? 'line-through text-slate-400' : ''}>
                          {typeof item.text === 'string' ? item.text : ((item.text as any)?.text || String(item.text || ''))}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteDeskChecklist(item.id)}
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showAddChecklist ? (
                <form
                  onSubmit={handleAddChecklistSubmit}
                  className="mt-3 flex gap-2 pt-2 border-t"
                  style={{ borderColor: activeTone.border }}
                >
                  <input
                    type="text"
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    placeholder="New observation or micro-task..."
                    autoFocus
                    className="flex-1 text-xs font-hand text-base bg-white border rounded px-2 py-1 focus:outline-none"
                    style={{ borderColor: activeTone.border }}
                  />
                  <button
                    type="submit"
                    className="text-xs font-mono text-white px-2 py-1 rounded hover:bg-black cursor-pointer"
                    style={{ backgroundColor: activeTone.accent }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddChecklist(false)}
                    className="text-xs font-mono text-slate-500"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddChecklist(true)}
                  className="mt-2 text-xs font-mono hover:underline flex items-center gap-1 cursor-pointer"
                  style={{ color: activeTone.hex }}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add observation item</span>
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  {deskChecklist.filter((i) => i.done).length} / {deskChecklist.length} completed
                </span>
              </div>
              <span className="font-mono text-[10px]" style={{ color: activeTone.hex }}>PRESENCE 100%</span>
            </div>
          </article>

          {/* ITEM 2: Scalloped Stitched Cloud Memo */}
          <article
            className="relative border-2 border-white/90 rounded-[32px] p-6 shadow-sm group hover:rotate-1 transition-all"
            style={{ backgroundColor: activeTone.scallopedBg }}
          >
            {/* Double Silver Paperclips */}
            <div className="absolute -top-3 right-8 flex gap-1 z-20 pointer-events-none">
              <div className="w-4 h-10 border-2 border-slate-400 rounded-full -rotate-12"></div>
              <div className="w-4 h-10 border-2 border-slate-300 rounded-full -rotate-6"></div>
            </div>

            {/* Dashed Stitched Inner Border */}
            <div
              className="border border-dashed border-white/90 rounded-[24px] p-4"
              style={{ backgroundColor: `${activeTone.scallopedBg}B3` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-mono tracking-wider uppercase bg-white/80 px-2 py-0.5 rounded-md font-medium"
                  style={{ color: activeTone.accent }}
                >
                  Memory Prompt
                </span>
                <span className="text-[11px] font-mono text-slate-500">16:42 JST</span>
              </div>
              <p className="font-serif italic text-base text-slate-800 leading-relaxed">
                "{digest.deskPromptText || digest.memoText}"
              </p>
              <div className="mt-3 pt-2 border-t border-white/80 flex items-center justify-between text-xs">
                <span className="font-hand text-base" style={{ color: activeTone.accent }}>
                  written with Pilot Iroshizuku (Tsuki-yo)
                </span>
                <span className="text-sm">🏷️ Kyoto</span>
              </div>
            </div>
          </article>

          {/* ITEM 3: Washi Taped Tanizaki Quotation Card */}
          <article
            className="relative text-white p-5 rounded-2xl shadow-sm overflow-hidden transition-colors"
            style={{ backgroundColor: activeTone.audioBg }}
          >
            <div className="absolute -top-3 -left-5 w-20 h-6 bg-amber-100/80 -rotate-45 pointer-events-none border-y border-amber-200/50"></div>
            <div className="absolute -bottom-3 -right-5 w-20 h-6 bg-amber-100/80 -rotate-45 pointer-events-none border-y border-amber-200/50"></div>
            <div className="border border-dashed border-white/60 rounded-xl p-4">
              <div className="text-[10px] uppercase font-mono tracking-widest text-white/80 mb-1">
                Passage of the Season
              </div>
              <p className="font-serif text-sm leading-relaxed tracking-wide text-white italic">
                "{digest.curatedScrap2Quote || "We find beauty not in the thing itself but in the patterns of shadows, the light and the darkness, that one thing against another creates."}"
              </p>
              <div className="mt-3 text-right">
                <span className="text-xs font-mono tracking-tight text-white/90">
                  — {digest.curatedScrap2Author || "Jun'ichirō Tanizaki"}
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* CENTER COLUMN: Retro Browser OS Grid Window (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ITEM 4: Retro Window with Grid Lines and Top Tabs */}
          <article
            className="relative bg-white rounded-xl border-2 shadow-md overflow-hidden group transition-colors"
            style={{ borderColor: activeTone.borderAccent }}
          >
            {/* Pushpin */}
            <div className="absolute -top-3.5 left-10 z-30 pointer-events-none">
              <div
                className="w-5 h-5 rounded-full border-2 shadow-sm flex items-center justify-center transition-colors"
                style={{ backgroundColor: activeTone.accent, borderColor: activeTone.borderAccent }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
              </div>
            </div>

            {/* Retro Window Titlebar */}
            <div
              className="border-b-2 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 select-none transition-colors"
              style={{ backgroundColor: activeTone.headerBg, borderColor: activeTone.borderAccent }}
            >
              <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                <div className="flex items-center gap-1 text-slate-500 font-mono text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeNote || journalNotes.length === 0) return;
                      const idx = journalNotes.findIndex((n) => n.id === activeNote.id);
                      const prevNote = journalNotes[(idx - 1 + journalNotes.length) % journalNotes.length];
                      if (prevNote) setActiveNoteId(prevNote.id);
                    }}
                    className="hover:text-slate-800 cursor-pointer px-1 disabled:opacity-30"
                    disabled={!activeNote || journalNotes.length <= 1}
                    title="Previous Note"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeNote || journalNotes.length === 0) return;
                      const idx = journalNotes.findIndex((n) => n.id === activeNote.id);
                      const nextNote = journalNotes[(idx + 1) % journalNotes.length];
                      if (nextNote) setActiveNoteId(nextNote.id);
                    }}
                    className="hover:text-slate-800 cursor-pointer px-1 disabled:opacity-30"
                    disabled={!activeNote || journalNotes.length <= 1}
                    title="Next Note"
                  >
                    &gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundSynthesizer.playPaperClick();
                      if (inlineEditing) cancelInlineEdit();
                    }}
                    className="hover:text-slate-800 cursor-pointer inline ml-0.5 p-0.5"
                    title="Reset view"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>

                {/* Note tabs */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] sm:max-w-[280px]">
                  {journalNotes.map((note) => {
                    const isTabActive = activeNote && note.id === activeNote.id;
                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => {
                          soundSynthesizer.playPaperClick();
                          setActiveNoteId(note.id);
                          if (inlineEditing) cancelInlineEdit();
                        }}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-all whitespace-nowrap ${
                          isTabActive
                            ? 'bg-white font-bold border shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                        }`}
                        style={{
                          color: isTabActive ? activeTone.accent : undefined,
                          borderColor: isTabActive ? activeTone.borderAccent : undefined
                        }}
                        title={note.title}
                      >
                        {note.title.length > 15 ? note.title.slice(0, 14) + '…' : note.title}
                      </button>
                    );
                  })}
                  {journalNotes.length === 0 && (
                    <span className="text-[10px] font-mono text-slate-400 italic px-1">no entries</span>
                  )}
                </div>

                {activeNote && (
                  <div
                    className="hidden md:flex bg-white/90 border rounded-md px-2.5 py-0.5 text-[10px] font-mono text-slate-600 items-center gap-1 shadow-inner shrink-0"
                    style={{ borderColor: `${activeTone.borderAccent}80` }}
                  >
                    <span>sanctuary://journal/{activeNote.id}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingNote(activeNote);
                    setIsNoteModalOpen(true);
                  }}
                  className="px-2 py-0.5 text-[10px] bg-white rounded border hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                  style={{ borderColor: activeTone.borderAccent }}
                  title={activeNote ? "Open detailed note modal" : "Create new note"}
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>{activeNote ? "Modal" : "New Note"}</span>
                </button>
                <span className="w-4 h-4 flex items-center justify-center">_</span>
                <span className="w-4 h-4 flex items-center justify-center">□</span>
                <span className="w-4 h-4 flex items-center justify-center">×</span>
              </div>
            </div>

            {/* Grid Notepad Workspace */}
            <div
              className="stationery-math-grid p-6 min-h-[440px] relative transition-colors"
              style={{ backgroundColor: activeTone.subtleBg }}
            >
              {activeNote ? (
                <>
                  {/* Editorial Header */}
              <div
                className="flex items-center justify-between border-b pb-3 mb-4"
                style={{ borderColor: activeTone.border }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-mono tracking-widest uppercase text-white px-2 py-0.5 rounded font-semibold shadow-2xs"
                      style={{ backgroundColor: activeTone.hex }}
                    >
                      {activeNote.subtitle || activeNote.tag || 'Volume IV • Kyoto'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Double-click title or text to edit
                    </span>
                  </div>

                  {/* Note Title with Double-Click Inline Edit */}
                  {inlineEditing?.noteId === activeNote.id && inlineEditing.field === 'title' ? (
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={inlineValue}
                        autoFocus
                        onChange={(e) => setInlineValue(e.target.value)}
                        onFocus={(e) => e.currentTarget.select()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveInlineEdit(activeNote.id, 'title');
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            cancelInlineEdit();
                          }
                        }}
                        onBlur={() => saveInlineEdit(activeNote.id, 'title')}
                        className="font-serif text-2xl font-bold text-slate-800 bg-white border-2 px-2 py-0.5 rounded-md focus:outline-none w-full shadow-inner"
                        style={{ borderColor: activeTone.borderAccent }}
                        placeholder="Note title..."
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          saveInlineEdit(activeNote.id, 'title');
                        }}
                        className="px-3 py-1 text-white rounded text-xs font-mono font-medium hover:bg-black cursor-pointer shrink-0 shadow-xs"
                        style={{ backgroundColor: activeTone.accent }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => startInlineEdit(activeNote.id, 'title', activeNote.title)}
                      title="Double-click to edit note title"
                      className="group/title mt-1 cursor-text hover:bg-black/5 rounded px-1.5 -mx-1.5 py-0.5 transition-colors relative"
                    >
                      <h1 className="font-serif text-2xl font-bold text-slate-800 flex items-center justify-between">
                        <span>{activeNote.title}</span>
                        <span
                          className="opacity-0 group-hover/title:opacity-100 transition-opacity text-[11px] font-mono font-normal bg-white/90 px-2 py-0.5 rounded border flex items-center gap-1 shadow-xs"
                          style={{ color: activeTone.hex, borderColor: activeTone.border }}
                        >
                          <Pencil className="w-3 h-3" />
                          <span>double-click to edit</span>
                        </span>
                      </h1>
                    </div>
                  )}
                </div>

                <div className="w-12 h-12 border-2 border-red-600/75 rounded-full flex flex-col items-center justify-center text-red-600/80 rotate-[-8deg] font-mono text-[9px] uppercase leading-tight font-bold tracking-tighter shrink-0 ml-2">
                  <span>OK</span>
                  <span className="border-t border-red-600/50 w-8 text-center text-[7px]">
                    {activeNote.date || 'OCT 24'}
                  </span>
                </div>
              </div>

              {/* Editorial Body with Double-Click Inline Edit on Content Blocks */}
              <div className="journal-desk-content-area w-full relative">
                {inlineEditing?.noteId === activeNote.id && inlineEditing.field === 'content' ? (
                  <div
                    className="space-y-3 mt-1 bg-white/95 rounded-xl border-2 p-4 shadow-md transition-all"
                    style={{ borderColor: activeTone.borderAccent }}
                  >
                    {/* Header bar */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b text-xs font-mono text-slate-500"
                      style={{ borderColor: activeTone.border }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="font-semibold flex items-center gap-1.5"
                          style={{ color: activeTone.accent }}
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#E9BA6B]" />
                          <span>Editing Long-Form Journal Entry</span>
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium"
                          style={{ backgroundColor: `${activeTone.hex}25`, color: activeTone.accent }}
                        >
                          {activeNote.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                        <span>{inlineValue.trim() ? inlineValue.trim().split(/\s+/).length : 0} words</span>
                        <span>•</span>
                        <span>{inlineValue.length} characters</span>
                        <span>•</span>
                        <span>{inlineValue.trim() ? inlineValue.trim().split(/\n\s*\n/).filter(Boolean).length : 0} paragraphs</span>
                      </div>
                    </div>

                    {/* Quick formatting buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          setInlineValue((prev) => prev + (prev.endsWith('\n') || !prev ? '' : '\n\n') + `[${timeStr}] `);
                        }}
                        className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
                        title="Insert current timestamp"
                      >
                        <Clock className="w-3 h-3" style={{ color: activeTone.hex }} />
                        <span>+ Timestamp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInlineValue((prev) => prev + (prev.endsWith('\n') || !prev ? '' : '\n\n') + '— — —\n\n');
                        }}
                        className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                        title="Add section divider"
                      >
                        <span>— Section Divider —</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInlineValue((prev) => prev + (prev.endsWith('\n') || !prev ? '' : '\n') + '• ');
                        }}
                        className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                        title="Add bullet item"
                      >
                        <span>• Bullet Item</span>
                      </button>
                    </div>

                    {/* Textarea for long-form text editing */}
                    <textarea
                      value={inlineValue}
                      autoFocus
                      rows={10}
                      onChange={(e) => setInlineValue(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          e.preventDefault();
                          saveInlineEdit(activeNote.id, 'content');
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          cancelInlineEdit();
                        }
                      }}
                      className="w-full text-slate-800 text-[15px] leading-relaxed font-serif p-3.5 bg-white border rounded-lg focus:outline-none shadow-inner resize-y min-h-[260px]"
                      style={{ borderColor: `${activeTone.borderAccent}B3` }}
                      placeholder="Write your long-form reflections, memories, and thoughts..."
                    />

                    {/* Footer Controls */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs font-mono"
                      style={{ borderColor: activeTone.border }}
                    >
                      <span className="text-[11px] text-slate-400">
                        Keyboard: <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Cmd/Ctrl + Enter</kbd> to save • <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Esc</kbd> to cancel
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={cancelInlineEdit}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded font-medium cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveInlineEdit(activeNote.id, 'content')}
                          className="px-4 py-1.5 text-white rounded-md font-semibold hover:bg-black cursor-pointer shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                          style={{ backgroundColor: activeTone.accent }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save to journalNotes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDoubleClick={() => startInlineEdit(activeNote.id, 'content', activeNote.content)}
                    title="Double-click any block to edit long-form entry"
                    className="journal-desk-content-area space-y-4 font-serif text-slate-700 leading-relaxed text-sm group/area relative cursor-text select-text py-1"
                  >
                    {(() => {
                      const contentBlocks = (activeNote.content || '')
                        .split(/\n\s*\n/)
                        .map((p) => p.trim())
                        .filter(Boolean);

                      if (contentBlocks.length === 0) {
                        return (
                          <div
                            onDoubleClick={() => startInlineEdit(activeNote.id, 'content', '')}
                            className="p-6 border-2 border-dashed border-[#8BAAD0]/50 rounded-xl text-center text-slate-400 font-mono text-xs cursor-pointer hover:bg-[#8BAAD0]/10 transition-colors"
                          >
                            <p className="font-serif text-base text-slate-600 mb-1">No content in this journal note yet.</p>
                            <p className="text-[11px] text-[#8BAAD0]">Double-click to start in-place long-form writing...</p>
                          </div>
                        );
                      }

                      return (
                        <>
                          {contentBlocks.map((para, idx) => (
                            <div
                              key={idx}
                              data-block-index={idx}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                startInlineEdit(activeNote.id, 'content', activeNote.content);
                              }}
                              className="journal-entry-block group/block relative p-2 -mx-2 rounded-md hover:bg-black/5 transition-all cursor-text border border-transparent hover:border-black/10"
                            >
                              <p className={idx === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:font-serif first-letter:float-left first-letter:mr-2.5 first-letter:leading-none whitespace-pre-line" : "whitespace-pre-line"}>
                                {para}
                              </p>
                              <div
                                className="opacity-0 group-hover/block:opacity-100 transition-opacity absolute right-2 top-2 flex items-center gap-1.5 text-[10px] font-mono bg-white/95 px-2 py-0.5 rounded shadow-xs border pointer-events-none"
                                style={{ color: activeTone.accent, borderColor: activeTone.border }}
                              >
                                <Pencil className="w-2.5 h-2.5" style={{ color: activeTone.hex }} />
                                <span>Double-click to edit block</span>
                              </div>
                            </div>
                          ))}

                          <div
                            className="opacity-0 group-hover/area:opacity-100 transition-opacity text-[11px] font-mono flex items-center justify-between pt-1 border-t"
                            style={{ color: activeTone.hex, borderColor: activeTone.border }}
                          >
                            <span className="flex items-center gap-1.5">
                              <Pencil className="w-3 h-3" />
                              <span>Double-click any content block to edit long-form text • Saves to centralized journalNotes</span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {contentBlocks.length} {contentBlocks.length === 1 ? 'block' : 'blocks'}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
                </>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[360px]">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 shadow-xs"
                    style={{ backgroundColor: activeTone.headerBg, color: activeTone.accent }}
                  >
                    ✍️
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-800">Your Journal is Empty</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1 max-w-sm">
                    Record your slow-living reflections, field notes, or sensory observations on tactile paper.
                  </p>
                  <button
                    onClick={() => {
                      setEditingNote(null);
                      setIsNoteModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 text-white rounded-lg text-xs font-mono font-medium hover:bg-black cursor-pointer shadow-xs"
                    style={{ backgroundColor: activeTone.accent }}
                  >
                    + Draft First Entry
                  </button>
                </div>
              )}

              {/* Polaroid-style Photo Scrap Pinned Inside with Custom Photo Upload */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handlePolaroidUpload(file);
                }}
                className="mt-5 bg-white p-2.5 pb-4 rounded shadow-xs border w-56 -rotate-1 relative ml-auto group/polaroid"
                style={{ borderColor: activeTone.border }}
              >
                <input
                  ref={polaroidFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePolaroidUpload(file);
                  }}
                  className="hidden"
                  id="desk-polaroid-photo-upload"
                />

                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-emerald-100/80 rotate-2 pointer-events-none border-y border-emerald-200/40"></div>
                
                <div
                  onClick={() => polaroidFileRef.current?.click()}
                  className="w-full h-32 rounded overflow-hidden relative cursor-pointer group-hover/polaroid:brightness-95 transition-all flex items-center justify-center bg-slate-100"
                >
                  {polaroidImage ? (
                    <img
                      src={polaroidImage}
                      alt="Journal polaroid"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
                      style={{ backgroundColor: activeTone.headerBg, color: activeTone.accent }}
                    >
                      <Camera className="w-5 h-5 mb-1" style={{ color: activeTone.hex }} />
                      <span className="text-xs font-mono font-medium">🍁 Nanzen-ji Eaves</span>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5">Click to upload your photo</span>
                    </div>
                  )}

                  {/* Upload Overlay Button */}
                  <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover/polaroid:opacity-100 transition-opacity">
                    <span className="bg-black/70 hover:bg-black text-white text-[9px] font-mono px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 shadow-xs">
                      <Upload className="w-2.5 h-2.5" />
                      {polaroidImage ? 'Change' : 'Upload'}
                    </span>
                  </div>
                </div>

                {isEditingCaption ? (
                  <input
                    type="text"
                    value={polaroidCaption}
                    autoFocus
                    onBlur={() => setIsEditingCaption(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingCaption(false);
                    }}
                    onChange={(e) => setPolaroidCaption(e.target.value)}
                    className="w-full font-hand text-sm text-center text-slate-700 mt-2 bg-transparent border-b focus:outline-none"
                    style={{ borderColor: activeTone.borderAccent }}
                  />
                ) : (
                  <p
                    onClick={() => setIsEditingCaption(true)}
                    title="Click to edit caption"
                    className="font-hand text-sm text-center text-slate-600 mt-2 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    {polaroidCaption}
                  </p>
                )}
              </div>

              {/* Stream thoughts additions from store */}
              {dailyStream.map((thought, idx) => {
                const isObj = typeof thought === 'object' && thought !== null;
                const text = isObj ? (thought as any).text || (thought as any).content || '' : String(thought || '');
                const tag = isObj ? (thought as any).tag : null;
                const time = isObj ? (thought as any).time : null;
                const streamKey = isObj && (thought as any).id ? (thought as any).id : `thought-${idx}`;

                return (
                  <div
                    key={streamKey}
                    className="mt-3 p-3 bg-white/85 rounded-lg border text-xs font-hand text-lg text-slate-800 flex items-start justify-between gap-2 group/stream transition-all"
                    style={{ borderColor: activeTone.border }}
                  >
                    <div className="flex-1">
                      <span>"{text}"</span>
                      {(time || tag) && (
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-500">
                          {time && <span>{time}</span>}
                          {tag && (
                            <span
                              className="px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: `${activeTone.hex}25`, color: activeTone.accent }}
                            >
                              #{tag}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteDailyStream(idx)}
                      className="opacity-0 group-hover/stream:opacity-100 transition-opacity text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                      title="Delete stream thought"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {/* Interactive Typing Prompt at bottom */}
              <form
                onSubmit={handleStreamSubmit}
                className="mt-5 flex items-center gap-2 text-xs font-mono bg-white/90 p-2 rounded-md border"
                style={{ borderColor: activeTone.border }}
              >
                <span className="font-bold" style={{ color: activeTone.hex }}>&gt;</span>
                <input
                  type="text"
                  value={streamInput}
                  onChange={(e) => setStreamInput(e.target.value)}
                  placeholder="Write the next thought in your stream..."
                  className="bg-transparent border-none p-0 text-xs text-slate-700 focus:ring-0 w-full placeholder-slate-400 font-serif italic"
                />
                <button
                  type="submit"
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border text-slate-600 font-mono cursor-pointer"
                >
                  Return ↵
                </button>
              </form>
            </div>

            {/* Window Status Bar */}
            <div
              className="bg-slate-50 border-t px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500"
              style={{ borderColor: activeTone.border }}
            >
              <div className="flex items-center gap-3">
                <span>Encoding: UTF-8</span>
                <span>Stream entries: {dailyStream.length}</span>
                <span className="capitalize" style={{ color: activeTone.accent }}>Tone: {activeTone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTone.hex }}></span>
                <span>Autosaved locally</span>
              </div>
            </div>
          </article>

          {/* ITEM 5: Weekly Cadence Strips */}
          <article
            className="bg-white rounded-xl border p-4 shadow-xs relative transition-colors"
            style={{ borderColor: activeTone.border }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">🗓️</span>
                <h3 className="font-serif font-semibold text-slate-800 text-sm">
                  Creative Cadence • Week 43
                </h3>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: `${activeTone.hex}20`, color: activeTone.accent }}
              >
                Kyoto Cycle
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center font-mono">
              <div
                className="p-2 rounded-lg border"
                style={{ backgroundColor: `${activeTone.headerBg}60`, borderColor: activeTone.border }}
              >
                <span className="text-[10px] text-slate-400 block">MON</span>
                <span className="text-xs font-bold text-slate-700">21</span>
                <span className="text-[9px] block text-emerald-600 mt-1">● ink</span>
              </div>
              <div
                className="p-2 rounded-lg border"
                style={{ backgroundColor: `${activeTone.headerBg}60`, borderColor: activeTone.border }}
              >
                <span className="text-[10px] text-slate-400 block">TUE</span>
                <span className="text-xs font-bold text-slate-700">22</span>
                <span className="text-[9px] block text-emerald-600 mt-1">● walk</span>
              </div>
              <div
                className="p-2 rounded-lg border"
                style={{ backgroundColor: `${activeTone.headerBg}60`, borderColor: activeTone.border }}
              >
                <span className="text-[10px] text-slate-400 block">WED</span>
                <span className="text-xs font-bold text-slate-700">23</span>
                <span className="text-[9px] block text-emerald-600 mt-1">● film</span>
              </div>
              <div
                className="p-2 rounded-lg text-white shadow-xs ring-2 ring-offset-1 transition-all"
                style={{ backgroundColor: activeTone.hex, '--tw-ring-color': activeTone.hex } as any}
              >
                <span className="text-[10px] text-white/80 block">THU</span>
                <span className="text-xs font-bold">24</span>
                <span className="text-[9px] block text-white/90 mt-1">★ desk</span>
              </div>
              <div
                className="p-2 rounded-lg bg-white border"
                style={{ borderColor: activeTone.border }}
              >
                <span className="text-[10px] text-slate-400 block">FRI</span>
                <span className="text-xs font-bold text-slate-700">25</span>
                <span className="text-[9px] block text-slate-300 mt-1">○ plan</span>
              </div>
              <div
                className="p-2 rounded-lg bg-white border"
                style={{ borderColor: activeTone.border }}
              >
                <span className="text-[10px] text-slate-400 block">SAT</span>
                <span className="text-xs font-bold text-slate-700">26</span>
                <span className="text-[9px] block text-slate-300 mt-1">○ hike</span>
              </div>
              <div
                className="p-2 rounded-lg bg-white border"
                style={{ borderColor: activeTone.border }}
              >
                <span className="text-[10px] text-slate-400 block">SUN</span>
                <span className="text-xs font-bold text-slate-700">27</span>
                <span className="text-[9px] block text-slate-300 mt-1">○ rest</span>
              </div>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN: Lo-Fi Music Widget, Perforated Spiral, Mood Palettes (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* ITEM 6: Retro Music Widget */}
          <article
            className="rounded-xl border-2 shadow-sm p-3 group transition-colors"
            style={{ backgroundColor: activeTone.headerBg, borderColor: activeTone.borderAccent }}
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleLoFi}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs cursor-pointer"
                  style={{ color: isPlayingLoFi ? '#f87171' : activeTone.accent }}
                >
                  <Heart className={`w-3.5 h-3.5 fill-current ${isPlayingLoFi ? 'text-red-400' : ''}`} />
                </button>
                <span
                  className="font-mono text-xs font-bold tracking-tight"
                  style={{ color: activeTone.accent }}
                >
                  playing now
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-3">
                <span
                  className={`w-1 rounded-full ${isPlayingLoFi ? 'h-3 animate-pulse' : 'h-1.5'}`}
                  style={{ backgroundColor: activeTone.hex }}
                ></span>
                <span
                  className={`w-1 rounded-full ${isPlayingLoFi ? 'h-1.5' : 'h-1'}`}
                  style={{ backgroundColor: activeTone.hex }}
                ></span>
                <span
                  className={`w-1 rounded-full ${isPlayingLoFi ? 'h-2.5 animate-pulse' : 'h-2'}`}
                  style={{ backgroundColor: activeTone.hex }}
                ></span>
              </div>
            </div>

            <div
              className="bg-white rounded-lg border p-2.5 mb-3 shadow-inner"
              style={{ borderColor: `${activeTone.borderAccent}B3` }}
            >
              <div className="font-serif font-medium text-xs text-slate-800 truncate">
                Rain on Cedar Shingles (432Hz)
              </div>
              <div className="font-mono text-[10px] text-slate-400 flex items-center justify-between mt-1">
                <span>Sanctuary Soundscapes</span>
                <span>{isPlayingLoFi ? '02:14 / 04:50' : '00:00 / 04:50'}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    backgroundColor: activeTone.accent,
                    width: isPlayingLoFi ? '46%' : '10%'
                  }}
                ></div>
              </div>
            </div>

            <div
              className="flex items-center justify-center gap-5 text-base select-none"
              style={{ color: activeTone.accent }}
            >
              <button onClick={() => soundSynthesizer.playPaperClick()} className="hover:scale-125 transition-transform cursor-pointer">
                |◀
              </button>
              <button
                onClick={toggleLoFi}
                className="w-7 h-7 rounded-lg bg-white border shadow-xs flex items-center justify-center font-bold hover:bg-black/5 transition-colors cursor-pointer"
                style={{ borderColor: activeTone.borderAccent }}
              >
                {isPlayingLoFi ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
              <button onClick={() => soundSynthesizer.playPaperClick()} className="hover:scale-125 transition-transform cursor-pointer">
                ▶|
              </button>
            </div>
          </article>

          {/* ITEM 7: Ring Spiral Perforated Note */}
          <article
            className="relative bg-white rounded-xl shadow-xs border pt-7 pb-4 px-4 transition-colors"
            style={{ borderColor: activeTone.border }}
          >
            {/* Spiral Rings */}
            <div className="absolute -top-3 left-4 right-4 flex justify-between pointer-events-none">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-2.5 h-5 bg-slate-200 rounded-full border border-slate-400"></div>
              ))}
            </div>
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2 mb-2">
              <span
                className="text-[10px] font-mono tracking-wider uppercase font-semibold"
                style={{ color: activeTone.accent }}
              >
                Desk Palette • {activeTone.name}
              </span>
              <span className="text-xs">🎨</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-md border border-black/10 shadow-2xs"
                    style={{ backgroundColor: activeTone.hex }}
                  ></span>
                  <span className="font-mono text-slate-600 text-[11px]">{activeTone.name} {activeTone.hex}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Primary</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-md border border-black/10 shadow-2xs"
                    style={{ backgroundColor: activeTone.headerBg }}
                  ></span>
                  <span className="font-mono text-slate-600 text-[11px]">{activeTone.name} Header</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Accent</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-md border border-black/10 shadow-2xs"
                    style={{ backgroundColor: activeTone.subtleBg }}
                  ></span>
                  <span className="font-mono text-slate-600 text-[11px]">{activeTone.name} Surface</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Surface</span>
              </div>
            </div>
          </article>

          {/* ITEM 8: Blue Lined Legal Pad with Mint Washi Tape */}
          {(() => {
            const padNote =
              journalNotes.find((n) => n.id === 'note-3') ||
              journalNotes[2] ||
              journalNotes[1] ||
              activeNote;
            const isEditingPadTitle = inlineEditing?.noteId === padNote.id && inlineEditing.field === 'title';
            const isEditingPadContent = inlineEditing?.noteId === padNote.id && inlineEditing.field === 'content';

            return (
              <article
                className="relative rounded-lg p-5 shadow-xs border group/pad transition-colors"
                style={{ backgroundColor: activeTone.subtleBg, borderColor: activeTone.borderAccent }}
              >
                <div className="absolute -top-3 left-4 w-6 h-8 bg-emerald-200/85 pointer-events-none rounded-xs border-y border-emerald-300/40"></div>
                <div className="absolute -top-3 right-4 w-6 h-8 bg-emerald-200/85 pointer-events-none rounded-xs border-y border-emerald-300/40"></div>
                <div className="relative pl-4 border-l-2 border-red-300/60 font-sans">
                  {/* Pad Note Title with Double-Click Inline Edit */}
                  {isEditingPadTitle ? (
                    <div className="flex items-center gap-1 mb-1">
                      <input
                        type="text"
                        value={inlineValue}
                        autoFocus
                        onChange={(e) => setInlineValue(e.target.value)}
                        onFocus={(e) => e.currentTarget.select()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveInlineEdit(padNote.id, 'title');
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            cancelInlineEdit();
                          }
                        }}
                        onBlur={() => saveInlineEdit(padNote.id, 'title')}
                        className="text-[11px] font-mono tracking-widest uppercase font-bold bg-white/90 border px-1.5 py-0.5 rounded w-full focus:outline-none shadow-inner"
                        style={{ color: activeTone.accent, borderColor: activeTone.borderAccent }}
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          saveInlineEdit(padNote.id, 'title');
                        }}
                        className="p-1 text-white rounded hover:bg-black cursor-pointer shadow-xs"
                        style={{ backgroundColor: activeTone.accent }}
                        title="Save title"
                      >
                        <Check className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => startInlineEdit(padNote.id, 'title', padNote.title)}
                      title="Double-click to edit note title"
                      className="cursor-text hover:bg-white/50 p-1 -m-1 rounded transition-colors flex items-center justify-between mb-1"
                    >
                      <div
                        className="text-[10px] font-mono tracking-widest uppercase font-bold"
                        style={{ color: activeTone.accent }}
                      >
                        {padNote.title}
                      </div>
                      <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/pad:opacity-100 transition-opacity" style={{ color: activeTone.accent }} />
                    </div>
                  )}

                  {/* Pad Note Content with Double-Click Inline Edit */}
                  {isEditingPadContent ? (
                    <div className="space-y-1 mt-1">
                      <textarea
                        value={inlineValue}
                        autoFocus
                        rows={3}
                        onChange={(e) => setInlineValue(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                            e.preventDefault();
                            saveInlineEdit(padNote.id, 'content');
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            cancelInlineEdit();
                          }
                        }}
                        className="w-full text-xs text-slate-700 leading-relaxed font-hand text-base bg-white/95 border rounded p-2 focus:outline-none shadow-inner"
                        style={{ borderColor: activeTone.borderAccent }}
                      />
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>Esc = Cancel • Ctrl+Enter = Save</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={cancelInlineEdit}
                            className="px-1.5 py-0.5 bg-slate-200 rounded hover:bg-slate-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveInlineEdit(padNote.id, 'content')}
                            className="px-2 py-0.5 text-white rounded font-bold hover:bg-black cursor-pointer shadow-xs"
                            style={{ backgroundColor: activeTone.accent }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p
                      onDoubleClick={() => startInlineEdit(padNote.id, 'content', padNote.content)}
                      title="Double-click to edit note content"
                      className="text-xs text-slate-700 leading-relaxed font-hand text-base cursor-text hover:bg-white/50 p-1 -m-1 rounded transition-colors"
                    >
                      {padNote.content}
                    </p>
                  )}

                  <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                    <span>
                      {padNote.tag || 'Uji Gyokuro'} • {padNote.date || 'harvest 2024'}
                    </span>
                    <span className="text-[9px] opacity-75" style={{ color: activeTone.accent }}>
                      double-click to edit
                    </span>
                  </div>
                </div>
              </article>
            );
          })()}

          {/* ITEM 9: Denim Star Sticker Patch */}
          <div className="flex items-center justify-around py-1">
            <div
              className="inline-flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full border shadow-xs text-xs font-mono transition-colors"
              style={{ borderColor: activeTone.border, color: activeTone.accent }}
            >
              <span>🌟</span> <span>Desk Mood: {activeTone.name}</span>
            </div>
          </div>
        </div>
      </main>

      {/* ALL JOURNAL NOTES & SCRAPS COLLECTION */}
      <section className="pt-6 border-t transition-colors" style={{ borderColor: activeTone.border }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg border flex items-center justify-center shadow-xs"
              style={{ backgroundColor: activeTone.headerBg, borderColor: activeTone.borderAccent, color: activeTone.accent }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-800">
                Desk Scraps &amp; Journal Archive
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {journalNotes.length} notes in central store • Double-click any note title or content to edit in-place
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setIsNoteModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full text-white hover:bg-black font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
            style={{ backgroundColor: activeTone.accent }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Inscribe New Note</span>
          </button>
        </div>

        {/* Note Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journalNotes.map((note) => {
            const isEditingTitle = inlineEditing?.noteId === note.id && inlineEditing.field === 'title';
            const isEditingContent = inlineEditing?.noteId === note.id && inlineEditing.field === 'content';
            const isActive = note.id === activeNote.id;
            const noteTone = note.paperTone ? PAPER_TONE_CONFIGS[note.paperTone] : activeTone;

            return (
              <article
                key={note.id}
                className={`relative rounded-xl p-5 shadow-xs border transition-all flex flex-col justify-between group/card ${
                  isActive ? 'ring-2' : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor: isActive ? '#FFFFFF' : noteTone.subtleBg,
                  borderColor: isActive ? noteTone.borderAccent : noteTone.border,
                  boxShadow: isActive ? `0 4px 20px -2px ${noteTone.hex}30` : undefined,
                  '--tw-ring-color': `${noteTone.hex}40`
                } as any}
              >
                {/* Washi tape header accent */}
                <div
                  className="absolute -top-2 left-8 w-20 h-4 -rotate-2 pointer-events-none rounded-xs border-y"
                  style={{ backgroundColor: `${noteTone.hex}40`, borderColor: `${noteTone.hex}60` }}
                ></div>

                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2 pt-1">
                    <span
                      className="px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: `${noteTone.hex}25`, color: noteTone.accent }}
                    >
                      {note.tag || 'Scrap'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono" style={{ color: noteTone.accent }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: noteTone.hex }}></span>
                        {noteTone.name}
                      </span>
                      <span>{note.date || 'OCT 2026'}</span>
                    </div>
                  </div>

                  {/* Title with Double-Click Inline Edit */}
                  <div className="mb-2">
                    {isEditingTitle ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={inlineValue}
                          autoFocus
                          onChange={(e) => setInlineValue(e.target.value)}
                          onFocus={(e) => e.currentTarget.select()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              saveInlineEdit(note.id, 'title');
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              cancelInlineEdit();
                            }
                          }}
                          onBlur={() => saveInlineEdit(note.id, 'title')}
                          className="font-serif text-base font-bold text-slate-800 bg-white border-2 px-2 py-0.5 rounded w-full focus:outline-none shadow-inner"
                          style={{ borderColor: noteTone.borderAccent }}
                          placeholder="Note title..."
                        />
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            saveInlineEdit(note.id, 'title');
                          }}
                          className="p-1.5 text-white rounded hover:bg-black cursor-pointer shrink-0 shadow-xs"
                          style={{ backgroundColor: noteTone.accent }}
                          title="Save title"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <h3
                        onDoubleClick={() => startInlineEdit(note.id, 'title', note.title)}
                        title="Double-click to edit title"
                        className="font-serif text-lg font-bold text-slate-800 cursor-text hover:opacity-80 p-1 -m-1 rounded transition-colors flex items-center justify-between group/title"
                      >
                        <span>{note.title}</span>
                        <Pencil className="w-3 h-3 opacity-0 group-hover/title:opacity-100 transition-opacity ml-1 shrink-0" style={{ color: noteTone.hex }} />
                      </h3>
                    )}
                  </div>

                  {/* Content with Double-Click Inline Edit */}
                  <div className="mt-2">
                    {isEditingContent ? (
                      <div className="space-y-1.5">
                        <textarea
                          value={inlineValue}
                          autoFocus
                          rows={4}
                          onChange={(e) => setInlineValue(e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                              e.preventDefault();
                              saveInlineEdit(note.id, 'content');
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              cancelInlineEdit();
                            }
                          }}
                          className="w-full font-serif text-xs leading-relaxed text-slate-700 bg-white border-2 rounded p-2 focus:outline-none shadow-inner"
                          style={{ borderColor: noteTone.borderAccent }}
                        />
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Esc = Cancel • Ctrl+Enter = Save</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={cancelInlineEdit}
                              className="px-2 py-0.5 text-slate-500 hover:bg-slate-200 rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveInlineEdit(note.id, 'content')}
                              className="px-2.5 py-0.5 text-white rounded hover:bg-black font-semibold cursor-pointer shadow-xs"
                              style={{ backgroundColor: noteTone.accent }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p
                        onDoubleClick={() => startInlineEdit(note.id, 'content', note.content)}
                        title="Double-click to edit content"
                        className="font-serif text-xs text-slate-600 leading-relaxed line-clamp-4 cursor-text hover:opacity-80 p-1 -m-1 rounded transition-colors group/content relative"
                      >
                        {note.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions & Footer */}
                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: `${noteTone.border}80` }}
                >
                  <div className="text-[10px] font-mono text-slate-400">
                    {note.author ? `by ${note.author}` : 'Personal Scrap'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundSynthesizer.playPaperClick();
                        setActiveNoteId(note.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all border shadow-xs"
                      style={{
                        backgroundColor: isActive ? noteTone.accent : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : noteTone.accent,
                        borderColor: noteTone.borderAccent
                      }}
                      title="Display in main retro window"
                    >
                      <span>{isActive ? '● Focused' : 'Focus in Window'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNote(note);
                        setIsNoteModalOpen(true);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-black/5 cursor-pointer"
                      title="Edit note details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete note "${note.title}"?`)) {
                          soundSynthesizer.playPaperClick();
                          deleteJournalNote(note.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete scrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Journal Note Modal */}
      <JournalNoteModal
        note={editingNote}
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
};
