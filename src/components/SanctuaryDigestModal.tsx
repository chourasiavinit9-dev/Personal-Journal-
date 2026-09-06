import React, { useState, useEffect } from 'react';
import { SanctuaryDigest } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import { X, Sparkles, Check } from 'lucide-react';

interface SanctuaryDigestModalProps {
  digest: SanctuaryDigest;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<SanctuaryDigest>) => void;
}

export const SanctuaryDigestModal: React.FC<SanctuaryDigestModalProps> = ({
  digest,
  isOpen,
  onClose,
  onSave
}) => {
  const [chapterSubtitle, setChapterSubtitle] = useState('');
  const [headingPrefix, setHeadingPrefix] = useState('');
  const [headingItalic, setHeadingItalic] = useState('');
  const [headingSuffix, setHeadingSuffix] = useState('');
  const [intentionsTitle, setIntentionsTitle] = useState('');
  const [intentionsSubtitle, setIntentionsSubtitle] = useState('');
  const [memoText, setMemoText] = useState('');
  const [memoMonth, setMemoMonth] = useState('');
  const [todayCalendarEvent, setTodayCalendarEvent] = useState('');
  const [archetypeName, setArchetypeName] = useState('');
  const [archetypeSubtitle, setArchetypeSubtitle] = useState('');
  const [archetypeDescription, setArchetypeDescription] = useState('');
  const [archivistInitials, setArchivistInitials] = useState('');
  const [lockscreenSolarSeason, setLockscreenSolarSeason] = useState('');
  const [lockscreenTrack, setLockscreenTrack] = useState('');

  useEffect(() => {
    if (digest) {
      setChapterSubtitle(digest.chapterSubtitle || '');
      setHeadingPrefix(digest.headingPrefix || '');
      setHeadingItalic(digest.headingItalic || '');
      setHeadingSuffix(digest.headingSuffix || '');
      setIntentionsTitle(digest.intentionsTitle || '');
      setIntentionsSubtitle(digest.intentionsSubtitle || '');
      setMemoText(digest.memoText || '');
      setMemoMonth(digest.memoMonth || '');
      setTodayCalendarEvent(digest.todayCalendarEvent || '');
      setArchetypeName(digest.archetypeName || '');
      setArchetypeSubtitle(digest.archetypeSubtitle || '');
      setArchetypeDescription(digest.archetypeDescription || '');
      setArchivistInitials(digest.archivistInitials || 'EA');
      setLockscreenSolarSeason(digest.lockscreenSolarSeason || '霜降 · FROST DESCENDS');
      setLockscreenTrack(digest.lockscreenTrack || 'Haruomi Hosono — Philharmony');
    }
  }, [digest, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynthesizer.playStampSound();
    onSave({
      chapterSubtitle: chapterSubtitle.trim(),
      headingPrefix: headingPrefix.trim(),
      headingItalic: headingItalic.trim(),
      headingSuffix: headingSuffix.trim(),
      intentionsTitle: intentionsTitle.trim(),
      intentionsSubtitle: intentionsSubtitle.trim(),
      memoText: memoText.trim(),
      memoMonth: memoMonth.trim(),
      todayCalendarEvent: todayCalendarEvent.trim(),
      archetypeName: archetypeName.trim(),
      archetypeSubtitle: archetypeSubtitle.trim(),
      archetypeDescription: archetypeDescription.trim(),
      archivistInitials: archivistInitials.trim(),
      lockscreenSolarSeason: lockscreenSolarSeason.trim(),
      lockscreenTrack: lockscreenTrack.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#D8CAB7] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Washi Tape */}
        <div className="washi-tape-honey absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-5 rounded-xs rotate-1 z-10 shadow-xs"></div>

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
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8CA689] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Sanctuary Aura</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
            Sanctuary Desk Inscription
          </h2>
          <p className="text-xs text-[#756D65] font-serif italic mt-0.5">
            Personalize your weekly digest heading, daily memo, and soul archetype.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Issue / Chapter Subtitle
            </label>
            <input
              type="text"
              value={chapterSubtitle}
              onChange={(e) => setChapterSubtitle(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Main Banner Title
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={headingPrefix}
                onChange={(e) => setHeadingPrefix(e.target.value)}
                placeholder="Prefix (e.g. The art of)"
                className="w-full text-xs font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
              <input
                type="text"
                value={headingItalic}
                onChange={(e) => setHeadingItalic(e.target.value)}
                placeholder="Emphasis"
                className="w-full text-xs font-serif italic bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
              <input
                type="text"
                value={headingSuffix}
                onChange={(e) => setHeadingSuffix(e.target.value)}
                placeholder="Suffix (e.g. & quiet days)"
                className="w-full text-xs font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Intentions Card Title
              </label>
              <input
                type="text"
                value={intentionsTitle}
                onChange={(e) => setIntentionsTitle(e.target.value)}
                placeholder="Card Title (e.g. Daily Intentions)"
                className="w-full text-xs font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Intentions Eyebrow Tag
              </label>
              <input
                type="text"
                value={intentionsSubtitle}
                onChange={(e) => setIntentionsSubtitle(e.target.value)}
                placeholder="Tag (e.g. Morning Grounding)"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Daily Event / Calendar Anchor
            </label>
            <input
              type="text"
              value={todayCalendarEvent}
              onChange={(e) => setTodayCalendarEvent(e.target.value)}
              className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Daily Memo / Grounding Note
            </label>
            <textarea
              rows={3}
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              className="w-full text-xs font-serif italic bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Archetype Name
              </label>
              <input
                type="text"
                value={archetypeName}
                onChange={(e) => setArchetypeName(e.target.value)}
                className="w-full text-xs font-serif font-bold bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Archetype Subtitle
              </label>
              <input
                type="text"
                value={archetypeSubtitle}
                onChange={(e) => setArchetypeSubtitle(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Archetype Description
            </label>
            <textarea
              rows={2}
              value={archetypeDescription}
              onChange={(e) => setArchetypeDescription(e.target.value)}
              className="w-full text-xs font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Archivist Initials
              </label>
              <input
                type="text"
                maxLength={4}
                value={archivistInitials}
                onChange={(e) => setArchivistInitials(e.target.value)}
                placeholder="EA"
                className="w-full text-xs font-mono font-bold bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Micro-Season
              </label>
              <input
                type="text"
                value={lockscreenSolarSeason}
                onChange={(e) => setLockscreenSolarSeason(e.target.value)}
                placeholder="霜降 · FROST DESCENDS"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Now Playing Track
              </label>
              <input
                type="text"
                value={lockscreenTrack}
                onChange={(e) => setLockscreenTrack(e.target.value)}
                placeholder="Track & Artist"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
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
              <span>Save Inscription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
