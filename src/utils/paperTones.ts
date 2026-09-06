import { PaperTone } from '../types';

export interface ToneSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface PaperToneConfig {
  id: PaperTone;
  name: string;
  shortName: string;
  hex: string;
  accent: string;
  subtleBg: string;
  deskBg: string;
  paperBg: string;
  border: string;
  borderAccent: string;
  ring: string;
  tabActiveBg: string;
  tabInactiveBg: string;
  tabBorderTop: string;
  headerBg: string;
  padBg: string;
  padBorder: string;
  padTape: string;
  audioBg: string;
  lofiBg: string;
  scallopedBg: string;
  starColor: string;
  badge: string;
  btnPrimary: string;
  textColor: string;
  swatches: [ToneSwatch, ToneSwatch, ToneSwatch];
}

export const PAPER_TONE_CONFIGS: Record<PaperTone, PaperToneConfig> = {
  cornflower: {
    id: 'cornflower',
    name: 'Cornflower Blue',
    shortName: 'Cornflower',
    hex: '#8BAAD0',
    accent: '#3B5C87',
    subtleBg: '#F3F7FA',
    deskBg: '#F2F6FA',
    paperBg: '#FFFFFF',
    border: '#C3D3E6',
    borderAccent: '#8BAAD0',
    ring: 'ring-[#8BAAD0]',
    tabActiveBg: '#FFFFFF',
    tabInactiveBg: '#C3D3E6',
    tabBorderTop: 'border-t-2 border-[#3B5C87]',
    headerBg: '#DCE7F3',
    padBg: '#D3E5F4',
    padBorder: '#B9D2E7',
    padTape: 'bg-blue-200/85 border-blue-300/40',
    audioBg: '#6E93BE',
    lofiBg: '#DCE6F2',
    scallopedBg: '#DCE7F3',
    starColor: '#8BAAD0',
    badge: 'bg-[#D5E3F0]/70 text-[#3B5C87]',
    btnPrimary: 'bg-[#3B5C87] hover:bg-[#2A4363] text-white',
    textColor: '#3B5C87',
    swatches: [
      { name: 'Cornflower #8BAAD0', hex: '#8BAAD0', role: 'Primary' },
      { name: 'Powder Sky #DCE7F3', hex: '#DCE7F3', role: 'Accent' },
      { name: 'Washi Paper #FCFBF7', hex: '#FCFBF7', role: 'Surface' }
    ]
  },
  wisteria: {
    id: 'wisteria',
    name: 'Wisteria Lilac',
    shortName: 'Wisteria',
    hex: '#A49ECC',
    accent: '#585187',
    subtleBg: '#F7F6FB',
    deskBg: '#F6F4FA',
    paperBg: '#FDFCFF',
    border: '#D3CEE8',
    borderAccent: '#A49ECC',
    ring: 'ring-[#A49ECC]',
    tabActiveBg: '#FDFCFF',
    tabInactiveBg: '#D3CEE8',
    tabBorderTop: 'border-t-2 border-[#585187]',
    headerBg: '#E8E5F7',
    padBg: '#EDEAF8',
    padBorder: '#D1CEE8',
    padTape: 'bg-purple-200/85 border-purple-300/40',
    audioBg: '#827BBA',
    lofiBg: '#E7E4F6',
    scallopedBg: '#EAE7F8',
    starColor: '#A49ECC',
    badge: 'bg-[#E3E0F4]/70 text-[#585187]',
    btnPrimary: 'bg-[#585187] hover:bg-[#433D69] text-white',
    textColor: '#585187',
    swatches: [
      { name: 'Wisteria #A49ECC', hex: '#A49ECC', role: 'Primary' },
      { name: 'Lilac Mist #E8E5F7', hex: '#E8E5F7', role: 'Accent' },
      { name: 'Silk Paper #FDFCFA', hex: '#FDFCFA', role: 'Surface' }
    ]
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Mist',
    shortName: 'Matcha',
    hex: '#7E9F7C',
    accent: '#3E5C3B',
    subtleBg: '#F5F8F4',
    deskBg: '#F4F7F3',
    paperBg: '#FCFDFC',
    border: '#CBD7CA',
    borderAccent: '#7E9F7C',
    ring: 'ring-[#7E9F7C]',
    tabActiveBg: '#FCFDFC',
    tabInactiveBg: '#CBD7CA',
    tabBorderTop: 'border-t-2 border-[#3E5C3B]',
    headerBg: '#E0ECE0',
    padBg: '#E3EDE2',
    padBorder: '#CADBC8',
    padTape: 'bg-emerald-200/85 border-emerald-300/40',
    audioBg: '#678B64',
    lofiBg: '#DFEADE',
    scallopedBg: '#E3EDE2',
    starColor: '#7E9F7C',
    badge: 'bg-[#DAE7D8]/70 text-[#3E5C3B]',
    btnPrimary: 'bg-[#3E5C3B] hover:bg-[#2B4229] text-white',
    textColor: '#3E5C3B',
    swatches: [
      { name: 'Matcha Mist #7E9F7C', hex: '#7E9F7C', role: 'Primary' },
      { name: 'Sage Foam #E0ECE0', hex: '#E0ECE0', role: 'Accent' },
      { name: 'Kozo Fiber #FAFBF8', hex: '#FAFBF8', role: 'Surface' }
    ]
  },
  cedar: {
    id: 'cedar',
    name: 'Cedar Eggshell',
    shortName: 'Cedar',
    hex: '#B89B77',
    accent: '#6B5438',
    subtleBg: '#FAF7F1',
    deskBg: '#FAF6EE',
    paperBg: '#FDFCF9',
    border: '#E4DAC8',
    borderAccent: '#B89B77',
    ring: 'ring-[#B89B77]',
    tabActiveBg: '#FDFCF9',
    tabInactiveBg: '#E4DAC8',
    tabBorderTop: 'border-t-2 border-[#6B5438]',
    headerBg: '#F3EBDD',
    padBg: '#F4ECE0',
    padBorder: '#E5DCCE',
    padTape: 'bg-amber-200/85 border-amber-300/40',
    audioBg: '#9C7F5B',
    lofiBg: '#F1E9DB',
    scallopedBg: '#F3EBDD',
    starColor: '#B89B77',
    badge: 'bg-[#EFE5D4]/70 text-[#6B5438]',
    btnPrimary: 'bg-[#6B5438] hover:bg-[#503E28] text-white',
    textColor: '#6B5438',
    swatches: [
      { name: 'Cedar Amber #B89B77', hex: '#B89B77', role: 'Primary' },
      { name: 'Warm Parchment #F3EBDD', hex: '#F3EBDD', role: 'Accent' },
      { name: 'Antique Vellum #FDFBF7', hex: '#FDFBF7', role: 'Surface' }
    ]
  }
};
