import React, { useState, useRef } from 'react';
import { TicketStub } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import { X, Image as ImageIcon, Sparkles, Stamp, Camera, Upload, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stub: TicketStub) => void;
}

const PRESET_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    label: 'Kyoto Rain Alley'
  },
  {
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    label: 'Ghibli Timber Garden'
  },
  {
    url: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=800&q=80',
    label: 'Museum Gallery Hall'
  },
  {
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    label: 'Kissaten Siphon Bar'
  }
];

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState('Kyoto, Japan');
  const [category, setCategory] = useState<'travel' | 'cafe' | 'exhibition' | 'cinema' | 'rail'>('cafe');
  const [companion, setCompanion] = useState('Solitary');
  const [quote, setQuote] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [imageSourceTab, setImageSourceTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, or GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedPhoto(event.target.result);
        setUploadedFileName(file.name);
        soundSynthesizer.playPaperClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setSelectedPhoto(customUrlInput.trim());
      setUploadedFileName(null);
      soundSynthesizer.playPaperClick();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundSynthesizer.playStampSound();

    const newStub: TicketStub = {
      id: `stub-${Date.now()}`,
      stubNumber: `0${Math.floor(Math.random() * 90 + 10)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A quiet memory in the sanctuary ledger',
      location: location.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
      imageUrl: selectedPhoto,
      quote: quote.trim() || 'The quiet moments remain the longest.',
      companion: companion.trim(),
      tapeStyle: 'honey',
      barcodeNumber: `9 7804${Math.floor(Math.random() * 89999 + 10000)}`
    };

    onSave(newStub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
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
          <div className="flex items-center space-x-2 text-xs font-mono text-[#756D65] uppercase tracking-wider mb-1">
            <Stamp className="w-3.5 h-3.5 text-[#E9BA6B]" />
            <span>Vault Minting • Memory Ticket</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F1A17]">
            Craft a New Memory Ticket Stub
          </h2>
          <p className="text-xs text-[#756D65] font-serif italic mt-0.5">
            Turn a recent walk, coffee cup, or quiet journey into a collectible perforated slip.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Ticket Destination / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kissa Soiree & Blue Jelly Soda"
              className="w-full text-sm font-serif bg-white border border-[#D8CAB7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B]"
              >
                <option value="cafe">Quiet Cafes &amp; Kissa</option>
                <option value="travel">Travel &amp; Wandering</option>
                <option value="exhibition">Exhibitions &amp; Galleries</option>
                <option value="cinema">Midnight Cinema</option>
                <option value="rail">Rail Passports</option>
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
                placeholder="e.g. Kawaramachi, Kyoto"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Subtitle / Impression
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Fluorescent emerald glow and retro jazz records"
              className="w-full text-xs font-serif bg-white border border-[#D8CAB7] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B]"
            />
          </div>

          {/* Photo Selection Section with Custom User Upload */}
          <div className="bg-[#F3EFE6]/60 rounded-2xl p-3.5 border border-[#D8CAB7]/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-mono text-[#756D65] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#E9BA6B]" />
                <span>Memory Photograph</span>
              </label>

              {/* Source Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#EDE4D4]/80 p-0.5 rounded-lg border border-[#D8CAB7]/60 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setImageSourceTab('upload');
                    soundSynthesizer.playPaperClick();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    imageSourceTab === 'upload'
                      ? 'bg-white text-[#1F1A17] font-semibold shadow-xs'
                      : 'text-[#756D65] hover:text-[#1F1A17]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageSourceTab('preset');
                    soundSynthesizer.playPaperClick();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    imageSourceTab === 'preset'
                      ? 'bg-white text-[#1F1A17] font-semibold shadow-xs'
                      : 'text-[#756D65] hover:text-[#1F1A17]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageSourceTab('url');
                    soundSynthesizer.playPaperClick();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    imageSourceTab === 'url'
                      ? 'bg-white text-[#1F1A17] font-semibold shadow-xs'
                      : 'text-[#756D65] hover:text-[#1F1A17]'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Upload Your Own Image File (Drag & Drop + Click File Picker) */}
            {imageSourceTab === 'upload' && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="ticket-photo-file-input"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#E9BA6B] bg-[#E9BA6B]/15 scale-[1.01]'
                      : 'border-[#D8CAB7] hover:border-[#1F1A17] bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#D8CAB7] flex items-center justify-center text-[#756D65] shadow-xs">
                      <Upload className="w-5 h-5 text-[#E9BA6B]" />
                    </div>
                    <p className="font-serif text-sm font-bold text-[#1F1A17]">
                      {uploadedFileName ? 'Change Your Photograph' : 'Upload Your Own Photograph'}
                    </p>
                    <p className="text-[11px] text-[#756D65] font-mono">
                      Drag &amp; drop any image here, or <span className="underline font-bold text-[#1F1A17]">browse files</span>
                    </p>
                    <span className="text-[10px] text-[#756D65]/70 font-mono">
                      Supports JPG, PNG, WEBP, GIF from your camera roll or desktop
                    </span>
                  </div>
                </div>

                {uploadedFileName && (
                  <div className="flex items-center justify-between text-xs font-mono bg-[#EBE4D5]/70 px-3 py-1.5 rounded-lg border border-[#D8CAB7]/80">
                    <span className="truncate max-w-[280px] text-[#1F1A17]">
                      📎 {uploadedFileName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-[11px] text-[#756D65] hover:text-[#1F1A17] underline cursor-pointer"
                    >
                      Choose Different
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Curated Analog Presets */}
            {imageSourceTab === 'preset' && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_PHOTOS.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(photo.url);
                        setUploadedFileName(null);
                        soundSynthesizer.playPaperClick();
                      }}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative cursor-pointer group ${
                        selectedPhoto === photo.url
                          ? 'border-[#1F1A17] ring-2 ring-[#E9BA6B] scale-102 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo.url} alt={photo.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {selectedPhoto === photo.url && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1F1A17] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-mono py-0.5 px-1 truncate text-center">
                        {photo.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Custom Web Image URL */}
            {imageSourceTab === 'url' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-2 bg-[#1F1A17] text-white text-xs font-mono rounded-xl hover:bg-black cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
                <p className="text-[10px] text-[#756D65] font-mono">
                  Paste a direct link to any public image on Unsplash, Google Photos, or your personal CDN.
                </p>
              </div>
            )}

            {/* Live Visual Ticket Preview of Selected Image */}
            <div className="flex items-center gap-3 pt-1 border-t border-[#D8CAB7]/40">
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#D8CAB7] shadow-inner bg-[#FAF8F5] shrink-0 relative">
                <img
                  src={selectedPhoto}
                  alt="Selected preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-mono text-[#756D65] leading-tight">
                <span className="text-[#1F1A17] font-semibold block">
                  Active Ticket Image Preview
                </span>
                <span className="text-[10px]">
                  {uploadedFileName ? `Custom: ${uploadedFileName}` : 'Ready to imprint on stub slip'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Handwritten Reflection (Lined Paper)
            </label>
            <textarea
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Write a sensory sentence... (e.g. The rain fell quietly against the wooden lattice.)"
              className="w-full text-sm font-hand bg-[#FAF8F5] border border-[#D8CAB7] rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#E9BA6B]"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-[#D8CAB7] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-[#756D65] hover:text-[#1F1A17] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1F1A17] hover:bg-black active:scale-95 text-white text-xs font-mono font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Stamp className="w-4 h-4 text-[#E9BA6B]" />
              <span>Imprint &amp; Archive Stub</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
