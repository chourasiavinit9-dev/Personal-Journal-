import React, { useState, useEffect, useRef } from 'react';
import { CrawlCheckpoint } from '../types';
import { soundSynthesizer } from '../utils/soundSynthesizer';
import { X, Compass, Check, Trash2, Camera, Upload } from 'lucide-react';

interface CrawlModalProps {
  checkpoint: CrawlCheckpoint | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (chkData: Partial<CrawlCheckpoint>) => void;
  onDelete?: (id: string) => void;
}

export const CrawlModal: React.FC<CrawlModalProps> = ({
  checkpoint,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [stepNumber, setStepNumber] = useState('Waypoint 04');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'completed' | 'active' | 'locked'>('active');
  const [distanceAway, setDistanceAway] = useState('120m Away');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkpoint) {
      setTitle(checkpoint.title || '');
      setStepNumber(checkpoint.stepNumber || 'Waypoint 01');
      setLocation(checkpoint.location || '');
      setDescription(checkpoint.description || '');
      setStatus(checkpoint.status || 'active');
      setDistanceAway(checkpoint.distanceAway || '');
      setImageUrl(checkpoint.imageUrl || '');
    } else {
      setTitle('');
      setStepNumber(`Waypoint 0${Math.floor(Math.random() * 5 + 4)}`);
      setLocation('Kyoto, Japan');
      setDescription('');
      setStatus('active');
      setDistanceAway('100m Away');
      setImageUrl('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80');
    }
  }, [checkpoint, isOpen]);

  if (!isOpen) return null;

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
    onSave({
      title: title.trim(),
      stepNumber: stepNumber.trim(),
      location: location.trim(),
      description: description.trim(),
      status,
      distanceAway: distanceAway.trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    });
    onClose();
  };

  const handleDelete = () => {
    if (checkpoint && onDelete && window.confirm(`Remove crawl waypoint "${checkpoint.title}"?`)) {
      soundSynthesizer.playPaperClick();
      onDelete(checkpoint.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#D8CAB7] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
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
            <div className="flex items-center space-x-2 text-xs font-mono text-[#D97736] uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>{checkpoint ? 'Edit Waypoint' : 'Add Trail Waypoint'}</span>
            </div>
            {checkpoint && onDelete && (
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
            {checkpoint ? 'Edit Passport Waypoint' : 'Map a City Waypoint'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Waypoint Label
              </label>
              <input
                type="text"
                required
                value={stepNumber}
                onChange={(e) => setStepNumber(e.target.value)}
                placeholder="Waypoint 04"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              >
                <option value="active">Active (Next Stop)</option>
                <option value="completed">Completed (Stamped)</option>
                <option value="locked">Locked (Future Trail)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Place / Spot Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vintage Stationery &amp; Ink Shop"
              className="w-full text-sm font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Location / Neighborhood
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sanjo-dori, Nakagyo Ward"
                className="w-full text-xs font-sans bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
                Distance / Walk Note
              </label>
              <input
                type="text"
                value={distanceAway}
                onChange={(e) => setDistanceAway(e.target.value)}
                placeholder="e.g. 50m Away"
                className="w-full text-xs font-mono bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Field Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the tactile ambiance, scents, or sights of this stop..."
              className="w-full text-xs font-serif bg-white border border-[#D8CAB7] rounded-xl px-3 py-2 text-[#1F1A17] focus:outline-none focus:ring-1 focus:ring-[#8CA689]"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-mono text-[#756D65] uppercase mb-1">
              Waypoint Photograph
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
                  alt="Waypoint preview"
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
                <Upload className="w-3.5 h-3.5 text-[#D97736]" />
                <span>Upload Waypoint Photo</span>
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
              <span>{checkpoint ? 'Save Waypoint' : 'Add Waypoint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
