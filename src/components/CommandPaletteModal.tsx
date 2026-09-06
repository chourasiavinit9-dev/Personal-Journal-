import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLifeOS } from '../store/lifeOSStore';
import { TabType, SearchResultItem } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import {
  Search,
  X,
  Ticket,
  CheckCircle2,
  Flower2,
  BookOpen,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

// ── Match highlighter ────────────────────────────────────────────────────────
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.trim().toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#F3EFE6] text-[#1F1A17] font-semibold not-italic rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { searchEntities, intentions, tickets, habits, journalNotes, checkpoints } = useLifeOS();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Debounce query — fire search 180ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 180);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = debouncedQuery.trim() ? searchEntities(debouncedQuery) : [];

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-result-item]');
    items[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  const handleSelectResult = useCallback((result: SearchResultItem) => {
    soundSynthesizer.playPaperClick();
    onNavigateTab(result.tab);
    onClose();
  }, [onNavigateTab, onClose]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex]);
    }
  };

  const getIconForType = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'intention': return <CheckCircle2 className="w-4 h-4 text-[#8CA689]" />;
      case 'ticket':    return <Ticket className="w-4 h-4 text-[#E9BA6B]" />;
      case 'habit':     return <Flower2 className="w-4 h-4 text-[#A39AC9]" />;
      case 'journal':   return <BookOpen className="w-4 h-4 text-[#756D65]" />;
      case 'crawl':     return <Compass className="w-4 h-4 text-[#D97736]" />;
      default:          return <Sparkles className="w-4 h-4 text-[#8CA689]" />;
    }
  };

  const TYPE_LABELS: Record<SearchResultItem['type'], string> = {
    intention: 'Intention',
    ticket: 'Memory',
    habit: 'Habit',
    journal: 'Journal',
    crawl: 'Waypoint',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] border-2 border-[#D8CAB7] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
        {/* Washi tape accent */}
        <div className="washi-tape-honey absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-5 rounded-xs rotate-1 z-10 shadow-xs" />

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#D8CAB7]/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#756D65] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search intentions, memories, journal, habits, places…"
            className="flex-1 bg-transparent border-none text-base sm:text-lg text-[#1F1A17] font-serif placeholder:font-sans placeholder:text-[#756D65]/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setDebouncedQuery(''); inputRef.current?.focus(); }}
              className="text-[#756D65] hover:text-[#1F1A17] text-xs font-mono px-1.5 py-0.5 rounded hover:bg-[#EDE4D4]/60 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#756D65] hover:text-[#1F1A17] hover:bg-[#EDE4D4]/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Panel */}
        <div ref={listRef} className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {debouncedQuery.trim() === '' ? (
            /* Empty state — stats */
            <div className="py-6 px-4 text-center space-y-3">
              <p className="text-xs font-mono text-[#756D65] uppercase tracking-wider">Active Life OS Registry</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <span className="bg-[#F3EFE6] px-3 py-1 rounded-full border border-[#D8CAB7]/60 font-mono text-[#1F1A17]">
                  {intentions.length} Intentions
                </span>
                <span className="bg-[#F3EFE6] px-3 py-1 rounded-full border border-[#D8CAB7]/60 font-mono text-[#1F1A17]">
                  {tickets.length} Memory Tickets
                </span>
                <span className="bg-[#F3EFE6] px-3 py-1 rounded-full border border-[#D8CAB7]/60 font-mono text-[#1F1A17]">
                  {habits.length} Habits
                </span>
                <span className="bg-[#F3EFE6] px-3 py-1 rounded-full border border-[#D8CAB7]/60 font-mono text-[#1F1A17]">
                  {journalNotes.length} Journal Scraps
                </span>
                <span className="bg-[#F3EFE6] px-3 py-1 rounded-full border border-[#D8CAB7]/60 font-mono text-[#1F1A17]">
                  {checkpoints.length} Waypoints
                </span>
              </div>
              <p className="text-xs font-serif italic text-[#756D65] pt-2">
                Type any keyword — fuzzy search across all your records.
              </p>
              <p className="text-[10px] font-mono text-[#756D65]/50">
                ↑↓ to navigate · Enter to open · ⌘K to toggle
              </p>
            </div>
          ) : results.length === 0 ? (
            /* No results */
            <div className="py-10 text-center">
              <p className="font-serif italic text-[#756D65]">
                No matching records found for "{debouncedQuery}"
              </p>
              <p className="text-xs font-mono text-[#756D65]/70 mt-1">
                Try a shorter word or check the spelling — fuzzy matching is active.
              </p>
            </div>
          ) : (
            /* Results list */
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#756D65] px-2 pb-1">
                <span>{results.length} RECORD{results.length > 1 ? 'S' : ''} — SORTED BY RELEVANCE</span>
                <span className="hidden sm:block">↑↓ NAVIGATE · ENTER OPEN</span>
              </div>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    data-result-item
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all group ${
                      isSelected
                        ? 'bg-[#F3EFE6] border-[#8CA689]/60 shadow-sm scale-[1.005]'
                        : 'bg-white/90 hover:bg-white border-[#D8CAB7]/50 hover:border-[#8CA689] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-white' : 'bg-[#F3EFE6]'
                      }`}>
                        {getIconForType(item.type)}
                      </div>
                      <div className="truncate">
                        <h4 className="font-serif text-sm font-medium text-[#1F1A17] truncate">
                          <HighlightMatch text={item.title} query={debouncedQuery} />
                        </h4>
                        {item.subtitle && (
                          <p className="text-xs text-[#756D65] truncate font-sans">
                            <HighlightMatch text={item.subtitle} query={debouncedQuery} />
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.meta && (
                        <span className="text-[10px] font-mono bg-[#F3EFE6] px-2 py-0.5 rounded text-[#756D65] hidden sm:block">
                          {item.meta}
                        </span>
                      )}
                      <span className={`text-xs font-mono flex items-center gap-1 transition-all ${
                        isSelected ? 'text-[#8CA689] translate-x-0.5' : 'text-[#8CA689]/70 group-hover:translate-x-0.5'
                      }`}>
                        <span className="hidden sm:inline capitalize">{TYPE_LABELS[item.type]}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F3EFE6]/60 border-t border-[#D8CAB7]/50 flex items-center justify-between text-[11px] font-mono text-[#756D65]">
          <span>Sanctuary Life OS — Fuzzy Search</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block">↑↓ navigate</span>
            <span>ESC close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
