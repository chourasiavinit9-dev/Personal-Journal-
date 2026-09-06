import React from 'react';

interface FooterProps {
  onExport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onExport }) => {
  return (
    <footer className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#D8CAB7]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#756D65]">
      <div className="flex items-center gap-3">
        <span className="font-serif italic font-medium text-[#1F1A17] text-sm">Sanctuary Life OS</span>
        <span>•</span>
        <span>Handcrafted with mindfulness, paper and ink</span>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => alert("Digital Wellness Protocol: Zero algorithmic feeds. All data stays local and tactile. Calm presence over urgency.")}
          className="hover:text-[#1F1A17] transition-colors cursor-pointer"
        >
          Digital Wellness Protocol
        </button>
        <button
          onClick={onExport}
          className="hover:text-[#1F1A17] transition-colors cursor-pointer underline decoration-[#D8CAB7]"
        >
          Export Scrapbook PDF
        </button>
        <span className="text-[#1F1A17] font-serif italic">© 2026 All Moments Cherished</span>
      </div>
    </footer>
  );
};
