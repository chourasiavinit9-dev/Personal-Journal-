import React, { useState, useEffect } from 'react';
import { HabitItem } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import { X, Flower2, Check, Trash2 } from 'lucide-react';

interface HabitModalProps {
  habit: HabitItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<HabitItem>) => void;
  onDelete?: (id: string) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  habit,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [targetTime, setTargetTime] = useState('07:30 AM');
  const [category, setCategory] = useState('Mindful Nourishment');
  const [icon, setIcon] = useState('🍵');
  const [theme, setTheme] = useState<'sky' | 'lavender' | 'emerald' | 'amber'>('sky');

  useEffect(() => {
    if (habit) {
      setTitle(habit.title || '');
      setSubtitle(habit.subtitle || '');
      setTargetTime(habit.targetTime || '07:30 AM');
      setCategory(habit.category || 'Mindful Nourishment');
      setIcon(habit.icon || '🍵');
      setTheme(habit.theme || 'sky');
    } else {
      setTitle('');
      setSubtitle('');
      setTargetTime('07:30 AM');
      setCategory('Mindful Cadence');
      setIcon('🌱');
      setTheme('sky');
    }
  }, [habit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundSynthesizer.playStampSound();
    onSave({
      title: title.trim(),
      subtitle: subtitle.trim() || 'A mindful daily rhythm',
      targetTime,
      category,
      icon,
      theme
    });
    onClose();
  };

  const handleDelete = () => {
    if (habit && onDelete && window.confirm(`Remove habit "${habit.title}" from your cadence garden?`)) {
      soundSynthesizer.playPaperClick();
      onDelete(habit.id);
      onClose();
    }
  };

  const PRESET_ICONS = ['🍵', '🌿', '🪵', '🎙️', '✨', '📖', '🚶‍♂️', '🧘', '☕', '🌸'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#D8CAB7] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Washi Tape */}
        <div className="washi-tape-sage absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-5 rounded-xs rotate-1 z-10 shadow-xs"></div>

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
            <div className="flex items-center space-x-2 text-xs font-mono text-[#8CA689] uppercase tracking-wider mb-1">
              <Flower2 className="w-3.5 h-3.5" />
              <span>{habit ? 'Cultivate Rhythm' : 'Plant New Cadence'}</span>
            </div>
            {habit && onDelete && (
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
            {habit ? 'Edit Habit Ritual' : 'Plant a New Habit Ritual'}
          </h2>
          <p className="text-xs text-[#756D65] font-serif italic mt-0.5">
            Design daily anchors with sensory cadences rather than harsh corporate streaks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Ritual Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Sencha & Silent Balcony"
              className="w-full text-sm font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Intention / Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. 15 mins gentle presence before screens"
              className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Preferred Time
              </label>
              <input
                type="text"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                placeholder="e.g. 07:15 AM"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Somatic Movement"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Ritual Emblem
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_ICONS.map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={() => setIcon(sym)}
                  className={`w-9 h-9 rounded-xl border text-base flex items-center justify-center transition-transform cursor-pointer ${
                    icon === sym
                      ? 'bg-[#E3EBDD] border-[#8CA689] scale-110 shadow-xs'
                      : 'bg-white border-[#D8CAB7] hover:bg-[#F3EFE6]'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Pastel Cadence Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sky', label: 'Sky Blue', bg: 'bg-[#E0EDFB]' },
                { id: 'lavender', label: 'Lavender', bg: 'bg-[#EDE9F7]' },
                { id: 'emerald', label: 'Sage', bg: 'bg-[#E3EBDD]' },
                { id: 'amber', label: 'Honey', bg: 'bg-[#FDF4DF]' }
              ].map((th) => (
                <button
                  type="button"
                  key={th.id}
                  onClick={() => setTheme(th.id as any)}
                  className={`p-2 rounded-xl border text-xs font-mono text-[#1F1A17] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${th.bg} ${
                    theme === th.id ? 'ring-2 ring-[#1F1A17] font-semibold' : 'border-[#D8CAB7]/70 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{th.label}</span>
                </button>
              ))}
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
              <span>{habit ? 'Save Ritual' : 'Plant Ritual'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
