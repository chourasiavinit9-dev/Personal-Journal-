import React, { useState, useRef, useEffect } from 'react';
import { TicketStub } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import { X, Camera, Upload, Check, Trash2, Stamp } from 'lucide-react';

interface EditTicketModalProps {
  ticket: TicketStub | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<TicketStub>) => void;
  onDelete?: (id: string) => void;
}

export const EditTicketModal: React.FC<EditTicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'travel' | 'cafe' | 'exhibition' | 'cinema' | 'rail'>('cafe');
  const [companion, setCompanion] = useState('');
  const [quote, setQuote] = useState('');
  const [weather, setWeather] = useState('');
  const [fare, setFare] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title || '');
      setSubtitle(ticket.subtitle || '');
      setLocation(ticket.location || '');
      setCategory(ticket.category || 'cafe');
      setCompanion(ticket.companion || '');
      setQuote(ticket.quote || '');
      setWeather(ticket.weather || '');
      setFare(ticket.fare || '');
      setImageUrl(ticket.imageUrl || '');
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          soundSynthesizer.playStampSound();
          setImageUrl(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundSynthesizer.playStampSound();
    onSave(ticket.id, {
      title: title.trim(),
      subtitle: subtitle.trim(),
      location: location.trim(),
      category,
      categoryLabel:
        category === 'cafe'
          ? 'Quiet Cafe Pass'
          : category === 'travel'
          ? 'Traveler Waypoint'
          : category === 'exhibition'
          ? 'Gallery Entry'
          : category === 'cinema'
          ? 'Cinema Screening'
          : 'Rail Pass',
      companion: companion.trim(),
      quote: quote.trim(),
      weather: weather.trim(),
      fare: fare.trim(),
      imageUrl
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Archive & delete Ticket #${ticket.stubNumber} "${ticket.title}"?`)) {
      soundSynthesizer.playPaperClick();
      onDelete(ticket.id);
      onClose();
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#756D65] uppercase tracking-wider mb-1">
              <Stamp className="w-3.5 h-3.5 text-[#E9BA6B]" />
              <span>Editing Stub #{ticket.stubNumber}</span>
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-mono text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer pr-8"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </button>
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
            Edit Memory Ticket
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Title / Destination *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Subtitle / Focus
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              >
                <option value="cafe">Quiet Cafe &amp; Kissa</option>
                <option value="travel">Travel &amp; Wandering</option>
                <option value="exhibition">Exhibitions &amp; Parks</option>
                <option value="cinema">Cinema Screening</option>
                <option value="rail">Mountain Railway Pass</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Companion
              </label>
              <input
                type="text"
                value={companion}
                onChange={(e) => setCompanion(e.target.value)}
                placeholder="e.g. Kenji T. or Solitary Walk"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Weather / Fare Badge
              </label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g. Sun • 21°C"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Memory Quote / Impression
            </label>
            <textarea
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full text-xs font-serif italic bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          {/* Photo Section */}
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Ticket Photograph
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Ticket visual"
                  className="w-16 h-16 rounded-xl object-cover border border-[#D8CAB7]"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#F3EFE6] border border-[#D8CAB7] flex items-center justify-center text-[#756D65]">
                  <Camera className="w-5 h-5" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-[#D8CAB7] rounded-xl text-xs font-mono text-[#1F1A17] hover:bg-[#F3EFE6] flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#8CA689]" />
                <span>Upload New Photo</span>
              </button>
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
