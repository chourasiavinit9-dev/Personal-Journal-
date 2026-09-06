import React, { useState, useEffect, useRef } from 'react';
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

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const { searchEntities, intentions, tickets, habits, journalNotes, checkpoints } = useLifeOS();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim() ? searchEntities(query) : [];

  const getIconForType = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'intention':
        return <CheckCircle2 className="w-4 h-4 text-[#8CA689]" />;
      case 'ticket':
        return <Ticket className="w-4 h-4 text-[#E9BA6B]" />;
      case 'habit':
        return <Flower2 className="w-4 h-4 text-[#A39AC9]" />;
      case 'journal':
        return <BookOpen className="w-4 h-4 text-[#756D65]" />;
      case 'crawl':
        return <Compass className="w-4 h-4 text-[#D97736]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#8CA689]" />;
    }
  };

  const handleSelectResult = (result: SearchResultItem) => {
    soundSynthesizer.playPaperClick();
    onNavigateTab(result.tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] border-2 border-[#D8CAB7] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
        {/* Top Decorative Washi Tape */}
        <div className="washi-tape-honey absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-5 rounded-xs rotate-1 z-10 shadow-xs"></div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#D8CAB7]/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#756D65]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across intentions, tickets, journal, habits, places..."
            className="flex-1 bg-transparent border-none text-base sm:text-lg text-[#1F1A17] font-serif placeholder:font-sans placeholder:text-[#756D65]/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#756D65] hover:text-[#1F1A17] text-xs font-mono px-1.5 py-0.5 rounded"
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

        {/* Search Results / Quick Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-6 px-4 text-center space-y-3">
              <p className="text-xs font-mono text-[#756D65] uppercase tracking-wider">
                Active Life OS Registry Stats
              </p>
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
                Type any keyword to search live personal records across all chapters.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-serif italic text-[#756D65]">
                No matching records found for "{query}"
              </p>
              <p className="text-xs font-mono text-[#756D65]/70 mt-1">
                Try searching for keywords in notes, destinations, or daily intentions.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#756D65] px-2 pb-1">
                <span>{results.length} RECORD{results.length > 1 ? 'S' : ''} FOUND</span>
                <span>PRESS TO OPEN VIEW</span>
              </div>
              {results.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelectResult(item)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/90 hover:bg-white border border-[#D8CAB7]/50 hover:border-[#8CA689] shadow-xs cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#F3EFE6] flex items-center justify-center shrink-0">
                      {getIconForType(item.type)}
                    </div>
                    <div className="truncate">
                      <h4 className="font-serif text-sm font-medium text-[#1F1A17] truncate">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p className="text-xs text-[#756D65] truncate font-sans">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.meta && (
                      <span className="text-[10px] font-mono bg-[#F3EFE6] px-2 py-0.5 rounded text-[#756D65]">
                        {item.meta}
                      </span>
                    )}
                    <span className="text-xs font-mono text-[#8CA689] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span className="capitalize">{item.tab}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#F3EFE6]/60 border-t border-[#D8CAB7]/50 flex items-center justify-between text-[11px] font-mono text-[#756D65]">
          <span>Navigation: Sanctuary Life OS</span>
          <div className="flex items-center gap-2">
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
