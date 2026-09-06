import React, { useState, useEffect } from 'react';
import { JournalNote, PaperTone } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import { X, BookOpen, Check, Trash2, Tag, Calendar, Palette } from 'lucide-react';
import { PAPER_TONE_CONFIGS } from '../utils/paperTones';

interface JournalNoteModalProps {
  note: JournalNote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Partial<JournalNote>) => void;
  onDelete?: (id: string) => void;
}

export const JournalNoteModal: React.FC<JournalNoteModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [author, setAuthor] = useState('');
  const [paperType, setPaperType] = useState<'grid' | 'lined' | 'torn' | 'scalloped' | 'felt'>('grid');
  const [paperTone, setPaperTone] = useState<PaperTone>('cornflower');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setSubtitle(note.subtitle || '');
      setContent(note.content || '');
      setDate(note.date || '');
      setTag(note.tag || '');
      setAuthor(note.author || '');
      setPaperType(note.paperType || 'grid');
      setPaperTone(note.paperTone || 'cornflower');
    } else {
      setTitle('');
      setSubtitle('');
      setContent('');
      setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase());
      setTag('Reflective');
      setAuthor('Self');
      setPaperType('grid');
      setPaperTone('cornflower');
    }
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    soundSynthesizer.playStampSound();
    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      content: content.trim(),
      date: date.trim() || 'TODAY',
      tag: tag.trim(),
      author: author.trim(),
      paperType,
      paperTone
    });
    onClose();
  };

  const handleDelete = () => {
    if (note && onDelete && window.confirm(`Permanently remove journal note "${note.title}"?`)) {
      soundSynthesizer.playPaperClick();
      onDelete(note.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#D8CAB7] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Washi Tape */}
        <div className="washi-tape-lavender absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-5 rounded-xs -rotate-1 z-10 shadow-xs"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundSynthesizer.playPaperClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#EDE4D4] text-[#756D65] hover:text-[#1F1A17] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#756D65] uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#A39AC9]" />
              <span>{note ? 'Edit Desk Scrap' : 'Inscribe New Journal Note'}</span>
            </div>
            {note && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-mono text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer pr-8"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
            {note ? 'Edit Journal Entry' : 'Write a Journal Entry'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Note Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solitude in the Temple Rains"
              className="w-full text-base font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Subtitle / Chapter
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Volume IV • Kyoto"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Date Stamp
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. OCT 24 or SEPT 2026"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Reflective Content *
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your observation, quote, or stream of consciousness..."
              className="w-full text-sm font-serif leading-relaxed bg-white border border-[#D8CAB7] rounded-xl p-3 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Tag / Category
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Kyoto Autumn"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Author / Source
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Elena Vance or Tanizaki"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Stationery Paper Texture
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'grid', label: 'Grid Paper' },
                { id: 'lined', label: 'Lined Ledges' },
                { id: 'felt', label: 'Felt Washi' }
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPaperType(p.id as any)}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    paperType === p.id
                      ? 'bg-[#1F1A17] text-white border-[#1F1A17]'
                      : 'bg-white text-[#756D65] border-[#D8CAB7] hover:bg-[#F3EFE6]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1 flex items-center justify-between">
              <span>Stationery Paper Tone</span>
              <span className="text-[10px] text-slate-400 font-normal">{PAPER_TONE_CONFIGS[paperTone].name}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PAPER_TONE_CONFIGS) as PaperTone[]).map((tId) => {
                const conf = PAPER_TONE_CONFIGS[tId];
                const isSelected = paperTone === tId;
                return (
                  <button
                    type="button"
                    key={tId}
                    onClick={() => {
                      soundSynthesizer.playPaperClick();
                      setPaperTone(tId);
                    }}
                    className={`p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-slate-800 shadow-xs ring-1 ring-slate-800'
                        : 'border-[#D8CAB7] hover:border-slate-400 bg-white/70'
                    }`}
                    style={{ backgroundColor: isSelected ? conf.subtleBg : undefined }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: conf.hex }}
                    ></span>
                    <span className="truncate" style={{ color: isSelected ? conf.accent : '#555' }}>
                      {conf.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#D8CAB7]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-mono text-[#756D65] hover:text-[#1F1A17] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#1F1A17] text-[#F9F6F0] hover:bg-black text-xs font-mono font-medium shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#E9BA6B]" />
              <span>{note ? 'Save Entry' : 'Inscribe Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
