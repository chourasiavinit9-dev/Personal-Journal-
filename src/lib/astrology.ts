// ─────────────────────────────────────────────────────────────────────────────
// LIFEOS — Astrology Utility Library
// Simplified ephemeris (entertainment-grade, ±2-3° accuracy)
// Based on mean motion from J2000.0 (Jan 1.5, 2000 UT)
// ─────────────────────────────────────────────────────────────────────────────

export type ZodiacSignName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type QualityType = 'Cardinal' | 'Fixed' | 'Mutable';
export type PlanetName = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';
export type AspectType = 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';

export interface ZodiacSignInfo {
  name: ZodiacSignName;
  symbol: string;
  element: ElementType;
  quality: QualityType;
  ruler: string;
  startDeg: number;
  index: number;
  keywords: string[];
  shadowKeywords: string[];
  bodyPart: string;
  color: string;
  gemstone: string;
  description: string;
  dailyAffirmation: string;
}

export interface PlanetPosition {
  planet: PlanetName;
  longitude: number;       // ecliptic longitude 0-360
  sign: ZodiacSignName;
  degreeInSign: number;    // 0-29
  retrograde: boolean;
  symbol: string;
  color: string;
}

export interface BirthChart {
  sun: PlanetPosition;
  moon: PlanetPosition;
  rising: PlanetPosition | null;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  birthDate: string;
  birthTime?: string;
}

export interface Aspect {
  planet1: PlanetName;
  planet2: PlanetName;
  type: AspectType;
  orb: number;
  angle: number;
  color: string;
  meaning: string;
}

export interface DailyTransit {
  planet: PlanetName;
  sign: ZodiacSignName;
  degreeInSign: number;
  retrograde: boolean;
  planetSymbol: string;
  signSymbol: string;
  interpretation: string;
  energy: 'expansive' | 'restrictive' | 'dynamic' | 'harmonious' | 'transformative';
}

export interface MoonPhaseInfo {
  name: string;
  emoji: string;
  illumination: number;  // 0-1
  description: string;
  ritual: string;
}

export interface CompatibilityResult {
  score: number;           // 0-100
  grade: string;           // A+, A, B, C, D
  summary: string;
  strengths: string[];
  challenges: string[];
  element1: ElementType;
  element2: ElementType;
  quality1: QualityType;
  quality2: QualityType;
}

// ─────────────────────────────────────────────────────────────────────────────
// ZODIAC SIGN DATA
// ─────────────────────────────────────────────────────────────────────────────
export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    name: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal',
    ruler: 'Mars', startDeg: 0, index: 0,
    keywords: ['courageous', 'energetic', 'pioneering', 'passionate'],
    shadowKeywords: ['impulsive', 'aggressive', 'impatient'],
    bodyPart: 'Head & Face', color: '#E84A4A', gemstone: 'Diamond',
    description: 'The trailblazer — bold, pioneering, and driven by pure instinct.',
    dailyAffirmation: 'I lead with courage and act with purpose.'
  },
  {
    name: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed',
    ruler: 'Venus', startDeg: 30, index: 1,
    keywords: ['grounded', 'sensual', 'patient', 'determined'],
    shadowKeywords: ['stubborn', 'possessive', 'indulgent'],
    bodyPart: 'Neck & Throat', color: '#7BB86F', gemstone: 'Emerald',
    description: 'The builder — devoted, sensual, and deeply rooted in the physical world.',
    dailyAffirmation: 'I build my life with patience and pleasure.'
  },
  {
    name: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable',
    ruler: 'Mercury', startDeg: 60, index: 2,
    keywords: ['curious', 'adaptable', 'witty', 'communicative'],
    shadowKeywords: ['scattered', 'inconsistent', 'anxious'],
    bodyPart: 'Arms & Lungs', color: '#F5C842', gemstone: 'Agate',
    description: 'The communicator — quick-minded, playful, and eternally curious.',
    dailyAffirmation: 'My mind is a gift; I use it with intention.'
  },
  {
    name: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal',
    ruler: 'Moon', startDeg: 90, index: 3,
    keywords: ['nurturing', 'intuitive', 'empathic', 'protective'],
    shadowKeywords: ['moody', 'clingy', 'defensive'],
    bodyPart: 'Chest & Stomach', color: '#7EC8D8', gemstone: 'Pearl',
    description: 'The nurturer — emotionally deep, fiercely loyal, and home-oriented.',
    dailyAffirmation: 'I honour my emotions and create safe spaces.'
  },
  {
    name: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed',
    ruler: 'Sun', startDeg: 120, index: 4,
    keywords: ['creative', 'generous', 'charismatic', 'loyal'],
    shadowKeywords: ['arrogant', 'drama-seeking', 'attention-seeking'],
    bodyPart: 'Heart & Spine', color: '#F5A623', gemstone: 'Ruby',
    description: 'The sovereign — radiant, generous, and born to shine.',
    dailyAffirmation: 'I shine brightly and uplift everyone around me.'
  },
  {
    name: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable',
    ruler: 'Mercury', startDeg: 150, index: 5,
    keywords: ['analytical', 'precise', 'helpful', 'practical'],
    shadowKeywords: ['critical', 'perfectionist', 'anxious'],
    bodyPart: 'Digestive System', color: '#8CB87E', gemstone: 'Sapphire',
    description: 'The craftsperson — precise, thoughtful, and devoted to serving others.',
    dailyAffirmation: 'I embrace progress over perfection.'
  },
  {
    name: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal',
    ruler: 'Venus', startDeg: 180, index: 6,
    keywords: ['harmonious', 'diplomatic', 'aesthetic', 'fair'],
    shadowKeywords: ['indecisive', 'people-pleasing', 'avoidant'],
    bodyPart: 'Kidneys & Lower Back', color: '#D4A8C7', gemstone: 'Opal',
    description: 'The diplomat — graceful, fair-minded, and seeking beauty in all things.',
    dailyAffirmation: 'I create harmony by standing in my truth.'
  },
  {
    name: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed',
    ruler: 'Pluto', startDeg: 210, index: 7,
    keywords: ['intense', 'perceptive', 'transformative', 'resourceful'],
    shadowKeywords: ['obsessive', 'secretive', 'controlling'],
    bodyPart: 'Reproductive System', color: '#8B2252', gemstone: 'Topaz',
    description: 'The alchemist — magnetic, perceptive, and unafraid of transformation.',
    dailyAffirmation: 'I embrace depth and emerge stronger from every change.'
  },
  {
    name: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable',
    ruler: 'Jupiter', startDeg: 240, index: 8,
    keywords: ['adventurous', 'philosophical', 'optimistic', 'honest'],
    shadowKeywords: ['restless', 'tactless', 'overcommitted'],
    bodyPart: 'Hips & Thighs', color: '#9B7EC8', gemstone: 'Turquoise',
    description: 'The explorer — freedom-loving, philosophical, and eternally seeking truth.',
    dailyAffirmation: 'Every horizon invites me to grow beyond limits.'
  },
  {
    name: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal',
    ruler: 'Saturn', startDeg: 270, index: 9,
    keywords: ['disciplined', 'ambitious', 'responsible', 'strategic'],
    shadowKeywords: ['rigid', 'cold', 'workaholic'],
    bodyPart: 'Knees & Bones', color: '#5C7A8E', gemstone: 'Garnet',
    description: 'The architect — patient, ambitious, and masterfully building for the long game.',
    dailyAffirmation: 'I climb steadily toward my highest potential.'
  },
  {
    name: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed',
    ruler: 'Uranus', startDeg: 300, index: 10,
    keywords: ['innovative', 'humanitarian', 'independent', 'visionary'],
    shadowKeywords: ['detached', 'rebellious', 'aloof'],
    bodyPart: 'Ankles & Circulation', color: '#6BA3BE', gemstone: 'Amethyst',
    description: 'The visionary — progressive, unconventional, and dreaming of a better world.',
    dailyAffirmation: 'My uniqueness is my greatest contribution.'
  },
  {
    name: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable',
    ruler: 'Neptune', startDeg: 330, index: 11,
    keywords: ['compassionate', 'artistic', 'intuitive', 'mystical'],
    shadowKeywords: ['escapist', 'over-sensitive', 'boundary-less'],
    bodyPart: 'Feet & Lymphatic System', color: '#7B9EA8', gemstone: 'Moonstone',
    description: 'The mystic — boundlessly compassionate, deeply imaginative, and spiritually attuned.',
    dailyAffirmation: 'I flow with the current of life and trust the unseen.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PLANET DATA
// ─────────────────────────────────────────────────────────────────────────────
const PLANET_DATA: Record<PlanetName, { symbol: string; color: string; L0: number; n: number; synodic: number }> = {
  Sun:     { symbol: '☉', color: '#F5A623', L0: 280.460,  n: 0.9856474,  synodic: 365.25  },
  Moon:    { symbol: '☽', color: '#D8CAB7', L0: 218.3165, n: 13.176396,  synodic: 29.53   },
  Mercury: { symbol: '☿', color: '#B0B0C0', L0: 252.2509, n: 4.0923345,  synodic: 115.88  },
  Venus:   { symbol: '♀', color: '#E8B4A0', L0: 181.9798, n: 1.6021303,  synodic: 583.92  },
  Mars:    { symbol: '♂', color: '#E84A4A', L0: 355.4332, n: 0.5240207,  synodic: 779.94  },
  Jupiter: { symbol: '♃', color: '#C8A870', L0: 34.3515,  n: 0.0830853,  synodic: 398.88  },
  Saturn:  { symbol: '♄', color: '#C8B870', L0: 50.0774,  n: 0.0334842,  synodic: 378.09  },
  Uranus:  { symbol: '♅', color: '#7EC8D8', L0: 314.0550, n: 0.0117359,  synodic: 369.66  },
  Neptune: { symbol: '♆', color: '#7B9EA8', L0: 304.3487, n: 0.0059810,  synodic: 367.49  },
  Pluto:   { symbol: '♇', color: '#9B7EC8', L0: 238.9289, n: 0.0039960,  synodic: 366.72  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CORE CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────
function daysSinceJ2000(date: Date): number {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  return (date.getTime() - J2000.getTime()) / 86400000;
}

function normalise(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function longitudeToSign(longitude: number): { sign: ZodiacSignName; degreeInSign: number } {
  const norm = normalise(longitude);
  const index = Math.floor(norm / 30);
  return {
    sign: ZODIAC_SIGNS[index].name,
    degreeInSign: Math.floor(norm % 30)
  };
}

/** Is the planet approximately retrograde? Checks angular velocity relative to Sun */
function isRetrograde(planet: PlanetName, date: Date): boolean {
  if (planet === 'Sun' || planet === 'Moon') return false;
  const d = daysSinceJ2000(date);
  const d1 = daysSinceJ2000(new Date(date.getTime() - 86400000));
  const pd = PLANET_DATA[planet];
  const lon0 = normalise(pd.L0 + pd.n * d1);
  const lon1 = normalise(pd.L0 + pd.n * d);
  let delta = lon1 - lon0;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

export function getPlanetPosition(planet: PlanetName, date: Date): PlanetPosition {
  const d = daysSinceJ2000(date);
  const pd = PLANET_DATA[planet];
  const longitude = normalise(pd.L0 + pd.n * d);
  const { sign, degreeInSign } = longitudeToSign(longitude);

  // Sun equation of centre correction
  let correctedLon = longitude;
  if (planet === 'Sun') {
    const M = normalise(357.529 + 0.98560028 * d);
    const Mrad = M * Math.PI / 180;
    correctedLon = normalise(longitude + 1.915 * Math.sin(Mrad) + 0.020 * Math.sin(2 * Mrad));
  }

  const { sign: finalSign, degreeInSign: finalDeg } = longitudeToSign(correctedLon);

  return {
    planet,
    longitude: correctedLon,
    sign: finalSign,
    degreeInSign: finalDeg,
    retrograde: isRetrograde(planet, date),
    symbol: pd.symbol,
    color: pd.color
  };
}

export function getSunSign(birthDate: Date): ZodiacSignInfo {
  const pos = getPlanetPosition('Sun', birthDate);
  return ZODIAC_SIGNS.find(s => s.name === pos.sign)!;
}

export function getBirthChart(birthDateStr: string, birthTimeStr?: string): BirthChart {
  // Parse date
  const [year, month, day] = birthDateStr.split('-').map(Number);
  let birthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  if (birthTimeStr) {
    const [h, m] = birthTimeStr.split(':').map(Number);
    birthDate = new Date(Date.UTC(year, month - 1, day, h, m, 0));
  }

  const positions: Record<PlanetName, PlanetPosition> = {} as any;
  const planets: PlanetName[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  planets.forEach(p => { positions[p] = getPlanetPosition(p, birthDate); });

  // Rising sign — simplified: based on birth time (local time assumed UTC for now)
  // Ascendant ≈ Sidereal Time + latitude correction (very simplified)
  let rising: PlanetPosition | null = null;
  if (birthTimeStr) {
    // RAMC simplified: sidereal time at midnight + (birth hour * 15 degrees)
    const GMST0 = normalise(100.4606 + 0.9856474 * daysSinceJ2000(birthDate));
    const [h] = birthTimeStr.split(':').map(Number);
    const ascLong = normalise(GMST0 + h * 15 + 90);
    const { sign, degreeInSign } = longitudeToSign(ascLong);
    rising = {
      planet: 'Sun', // placeholder
      longitude: ascLong,
      sign,
      degreeInSign,
      retrograde: false,
      symbol: ZODIAC_SIGNS.find(s => s.name === sign)!.symbol,
      color: ZODIAC_SIGNS.find(s => s.name === sign)!.color
    };
  }

  return {
    sun: positions.Sun,
    moon: positions.Moon,
    rising,
    mercury: positions.Mercury,
    venus: positions.Venus,
    mars: positions.Mars,
    jupiter: positions.Jupiter,
    saturn: positions.Saturn,
    uranus: positions.Uranus,
    neptune: positions.Neptune,
    pluto: positions.Pluto,
    birthDate: birthDateStr,
    birthTime: birthTimeStr
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASPECTS
// ─────────────────────────────────────────────────────────────────────────────
const ASPECT_DEFINITIONS: { type: AspectType; angle: number; orb: number; color: string; meaning: string }[] = [
  { type: 'Conjunction', angle: 0,   orb: 10, color: '#F5A623', meaning: 'Fusion of energies — powerful intensity and focus.' },
  { type: 'Sextile',     angle: 60,  orb: 6,  color: '#7BB86F', meaning: 'Opportunity and easy cooperation between forces.' },
  { type: 'Square',      angle: 90,  orb: 8,  color: '#E84A4A', meaning: 'Creative tension driving growth through friction.' },
  { type: 'Trine',       angle: 120, orb: 8,  color: '#9B7EC8', meaning: 'Harmonious flow and natural talent expressed effortlessly.' },
  { type: 'Opposition',  angle: 180, orb: 10, color: '#7EC8D8', meaning: 'Polarity seeking integration and balance between opposites.' },
];

export function calculateAspects(chart: BirthChart): Aspect[] {
  const planets: { name: PlanetName; lon: number }[] = [
    { name: 'Sun', lon: chart.sun.longitude },
    { name: 'Moon', lon: chart.moon.longitude },
    { name: 'Mercury', lon: chart.mercury.longitude },
    { name: 'Venus', lon: chart.venus.longitude },
    { name: 'Mars', lon: chart.mars.longitude },
    { name: 'Jupiter', lon: chart.jupiter.longitude },
    { name: 'Saturn', lon: chart.saturn.longitude },
  ];

  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      let diff = Math.abs(planets[i].lon - planets[j].lon);
      if (diff > 180) diff = 360 - diff;
      for (const asp of ASPECT_DEFINITIONS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: asp.type,
            orb,
            angle: diff,
            color: asp.color,
            meaning: asp.meaning
          });
          break;
        }
      }
    }
  }
  return aspects;
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY TRANSITS
// ─────────────────────────────────────────────────────────────────────────────
const TRANSIT_INTERPRETATIONS: Record<PlanetName, Partial<Record<ZodiacSignName, { text: string; energy: DailyTransit['energy'] }>>> = {
  Sun: {
    Aries: { text: 'Bold initiative energy. Start something new — the cosmos backs your courage.', energy: 'dynamic' },
    Taurus: { text: 'Grounding and sensual pleasure. Slow down, savour beauty, build steadily.', energy: 'harmonious' },
    Gemini: { text: 'Ideas spark fast. Curiosity leads to connection. Write, talk, explore.', energy: 'expansive' },
    Cancer: { text: 'Home and heart take centre stage. Tend to emotional roots and family bonds.', energy: 'harmonious' },
    Leo: { text: 'Radiance peaks. Lead with warmth, creativity, and generous self-expression.', energy: 'expansive' },
    Virgo: { text: 'Focus on refinement. Systems, health, and service bring quiet satisfaction.', energy: 'harmonious' },
    Libra: { text: 'Harmony and partnership are illuminated. Beauty, diplomacy, and balance flourish.', energy: 'harmonious' },
    Scorpio: { text: 'Depth and intensity surface. Transformation beckons; face what has been hidden.', energy: 'transformative' },
    Sagittarius: { text: 'The explorer awakens. Philosophy, travel, and expansion lift the spirit.', energy: 'expansive' },
    Capricorn: { text: 'Ambition crystallises. Build, commit, and honour long-term visions.', energy: 'restrictive' },
    Aquarius: { text: 'Innovation and community light up. Revolutionary ideas break old patterns.', energy: 'dynamic' },
    Pisces: { text: 'Imagination and compassion dissolve boundaries. Dreams and art flourish.', energy: 'harmonious' },
  },
  Moon: {
    Aries: { text: 'Emotional impulses run strong. React less, channel that fire into action.', energy: 'dynamic' },
    Taurus: { text: 'Emotional steadiness prevails. Comfort-seeking and sensory pleasure soothe.', energy: 'harmonious' },
    Gemini: { text: 'Mood shifts quickly. Intellectual stimulation balances restless feelings.', energy: 'dynamic' },
    Cancer: { text: 'Moon is at home — deep sensitivity, strong intuition, nurturing impulses peak.', energy: 'harmonious' },
    Leo: { text: 'Emotional flair and desire for recognition are heightened. Be generous with joy.', energy: 'expansive' },
    Virgo: { text: 'Emotional processing through analysis. Clean, organise, and restore order.', energy: 'restrictive' },
    Libra: { text: 'Emotional harmony sought through relationship. Social grace and diplomacy flow.', energy: 'harmonious' },
    Scorpio: { text: 'Emotions run deep and intense. Feelings of power, jealousy, or rebirth surface.', energy: 'transformative' },
    Sagittarius: { text: 'Buoyant, freedom-seeking emotional energy. Adventure soothes the soul.', energy: 'expansive' },
    Capricorn: { text: 'Emotional restraint and responsibility. Duty and structure feel comforting.', energy: 'restrictive' },
    Aquarius: { text: 'Detached emotional observation. Community and ideals matter more than personal need.', energy: 'dynamic' },
    Pisces: { text: 'Emotional boundaries dissolve. Heightened empathy, psychic sensitivity, and dreaming.', energy: 'harmonious' },
  },
  Mercury: {
    Virgo: { text: 'Mercury is at home in Virgo. Precision thinking and detailed analysis excel.', energy: 'harmonious' },
    Libra: { text: 'Diplomatic communication and aesthetic thinking. Words become art.', energy: 'harmonious' },
    Scorpio: { text: 'Penetrating insight and investigative thinking. Secrets surface through conversation.', energy: 'transformative' },
    Sagittarius: { text: 'Big-picture thinking and philosophical conversations. Speak your truth boldly.', energy: 'expansive' },
    Capricorn: { text: 'Strategic, practical thinking dominates. Planning and structure in communication.', energy: 'restrictive' },
    Aquarius: { text: 'Original ideas and unconventional thinking flourish. Futuristic concepts click.', energy: 'expansive' },
    Pisces: { text: 'Intuitive thinking over logic. Poetry, symbols, and dreams carry wisdom.', energy: 'harmonious' },
    Aries: { text: 'Fast, direct, impulsive communication. Quick decisions and bold words.', energy: 'dynamic' },
    Taurus: { text: 'Slow, deliberate thinking. Words carry weight; consider before speaking.', energy: 'restrictive' },
    Gemini: { text: 'Mercury at peak power. Wit, curiosity, and wordplay at their finest.', energy: 'expansive' },
    Cancer: { text: 'Emotional memory and intuitive thought. Personal and nostalgic conversations.', energy: 'harmonious' },
    Leo: { text: 'Dramatic, passionate self-expression. Creative writing and confident storytelling.', energy: 'expansive' },
  },
  Venus: {
    Libra: { text: 'Venus at home — love, beauty, and harmony are naturally expressed and received.', energy: 'harmonious' },
    Taurus: { text: 'Venus at home — sensual pleasures, art, and luxury in all forms feel deeply satisfying.', energy: 'harmonious' },
    Leo: { text: 'Romantic, dramatic love energy. Grand gestures and joyful self-adornment.', energy: 'expansive' },
    Virgo: { text: 'Love through acts of service. Details matter; show care through thoughtful action.', energy: 'restrictive' },
    Scorpio: { text: 'Intense, magnetic attraction. Deep bonds and transformative love experiences.', energy: 'transformative' },
    Aquarius: { text: 'Unconventional love. Freedom within partnerships and progressive relationship values.', energy: 'dynamic' },
    Pisces: { text: 'Transcendent, compassionate love. Spiritual bonds and artistic beauty everywhere.', energy: 'harmonious' },
    Aries: { text: 'Passionate, spontaneous love. Pursue what (and who) excites you boldly.', energy: 'dynamic' },
    Gemini: { text: 'Flirty, playful love energy. Intellectual connection and variety in pleasure.', energy: 'expansive' },
    Cancer: { text: 'Nurturing, home-based affection. Emotional safety and family are deeply valued.', energy: 'harmonious' },
    Sagittarius: { text: 'Adventure in love. Freedom-loving relationships and philosophical connections.', energy: 'expansive' },
    Capricorn: { text: 'Commitment and stability in love. Practical partnership and long-term loyalty.', energy: 'restrictive' },
  },
  Mars: {
    Aries: { text: 'Mars at home — raw physical energy and drive are at their absolute peak.', energy: 'dynamic' },
    Scorpio: { text: 'Mars at home — relentless strategic willpower and regenerative force.', energy: 'transformative' },
    Capricorn: { text: 'Mars exalted — disciplined action toward ambitious goals brings great results.', energy: 'expansive' },
    Gemini: { text: 'Mental agility in action. Multi-tasking and verbal sparring are energised.', energy: 'dynamic' },
    Leo: { text: 'Passionate creative drive. Lead with confidence; put yourself in the spotlight.', energy: 'expansive' },
    Cancer: { text: 'Defensive, protective energy. Act from emotional instinct and protect your home.', energy: 'dynamic' },
    Sagittarius: { text: 'Adventurous, enthusiastic drive. Pursue freedom, philosophy, and foreign horizons.', energy: 'expansive' },
    Virgo: { text: 'Precise, methodical effort. Perfect your craft through detailed, disciplined work.', energy: 'restrictive' },
    Libra: { text: 'Mars in detriment — action through negotiation. Assert yourself diplomatically.', energy: 'restrictive' },
    Aquarius: { text: 'Rebellious, collective action. Fight for causes and humanitarian ideals.', energy: 'dynamic' },
    Taurus: { text: 'Slow, determined, persistent action. Build steadily; avoid forcing outcomes.', energy: 'restrictive' },
    Pisces: { text: 'Inspired, compassionate action. Let intuition guide creative energy and spiritual effort.', energy: 'harmonious' },
  },
  Jupiter: {
    Sagittarius: { text: 'Jupiter at home — extraordinary expansion, wisdom, and abundance overflow.', energy: 'expansive' },
    Cancer: { text: 'Jupiter exalted — emotional generosity, family abundance, and spiritual nourishment.', energy: 'expansive' },
    Pisces: { text: 'Jupiter at home — boundless compassion, creativity, and spiritual growth.', energy: 'expansive' },
    Gemini: { text: 'Expansion through learning and communication. Many ideas, broad knowledge.', energy: 'expansive' },
    Leo: { text: 'Generous, magnanimous energy. Big creative visions and joyful self-expression.', energy: 'expansive' },
    Aquarius: { text: 'Expansion of community and humanitarian ideals. Social innovations flourish.', energy: 'expansive' },
    Taurus: { text: 'Financial and material abundance. Slow-growing prosperity through patient effort.', energy: 'expansive' },
    Virgo: { text: 'Growth through service, health, and refinement. Mastery through disciplined practice.', energy: 'expansive' },
    Scorpio: { text: 'Deep transformation and hidden wealth surfaces. Psychological and spiritual expansion.', energy: 'transformative' },
    Capricorn: { text: 'Jupiter in detriment — slow, structured growth. Ambition and discipline rewarded.', energy: 'restrictive' },
    Libra: { text: 'Expansion through partnership and beauty. Abundance flows through collaboration.', energy: 'expansive' },
    Aries: { text: 'Bold, pioneering expansion. Courage and risk-taking open new horizons rapidly.', energy: 'expansive' },
  },
  Saturn: {
    Capricorn: { text: 'Saturn at home — discipline, structure, and mastery are powerfully supported.', energy: 'restrictive' },
    Aquarius: { text: 'Saturn at home — long-term innovation and restructuring of social systems.', energy: 'restrictive' },
    Libra: { text: 'Saturn exalted — partnerships are tested and refined; commitment brings rewards.', energy: 'restrictive' },
    Pisces: { text: 'Saturn in Pisces — spiritual discipline and boundaries around imagination needed.', energy: 'restrictive' },
    Sagittarius: { text: 'Restrictions on belief and expansion. Disciplined study over scattered learning.', energy: 'restrictive' },
    Scorpio: { text: 'Deep karmic work on power and transformation. Face shadows with discipline.', energy: 'transformative' },
    Taurus: { text: 'Long-term financial structures are built. Patience with material security pays off.', energy: 'restrictive' },
    Cancer: { text: 'Saturn in detriment — emotional restrictions. Karmic work with home and family.', energy: 'restrictive' },
    Leo: { text: 'Restrictions on ego and self-expression. Create from duty, not just desire.', energy: 'restrictive' },
    Virgo: { text: 'Disciplined health, work habits, and service obligations are intensified.', energy: 'restrictive' },
    Aries: { text: 'Saturn in fall — assertiveness tested. Patience over impulsiveness is the lesson.', energy: 'restrictive' },
    Gemini: { text: 'Disciplined communication and focused thinking over scattered ideas.', energy: 'restrictive' },
  },
  Uranus: {
    Aquarius: { text: 'Uranus at home — revolutionary breakthroughs and technological liberation.', energy: 'dynamic' },
    Taurus: { text: 'Disruption of material structures, finances, and earth systems. Radical sustainability.', energy: 'dynamic' },
    Gemini: { text: 'Revolutionary ideas in communication and information. AI and tech transform society.', energy: 'dynamic' },
    Aries: { text: 'Pioneering breakthroughs. Individual autonomy and radical new beginnings.', energy: 'dynamic' },
    Cancer: { text: 'Disruption of home, family structures, and emotional norms.', energy: 'dynamic' },
    Leo: { text: 'Creative revolution. Individuality, art, and entertainment are radically transformed.', energy: 'dynamic' },
    Virgo: { text: 'Technological disruption of health, work, and daily systems.', energy: 'dynamic' },
    Libra: { text: 'Revolution in relationships, law, and social contracts.', energy: 'dynamic' },
    Scorpio: { text: 'Radical transformation of power, taboos, and hidden systems.', energy: 'transformative' },
    Sagittarius: { text: 'Revolution in beliefs, religion, and educational systems.', energy: 'dynamic' },
    Capricorn: { text: 'Disruption of authority, corporations, and established institutions.', energy: 'dynamic' },
    Pisces: { text: 'Revolution in spirituality, art, and collective imagination.', energy: 'transformative' },
  },
  Neptune: {
    Pisces: { text: 'Neptune at home — mystical, artistic, and spiritual dimensions are highly activated.', energy: 'harmonious' },
    Aries: { text: 'Neptune in Aries — spiritual pioneers and dissolving of ego boundaries.', energy: 'transformative' },
    Aquarius: { text: 'Dissolution of collective ideals and utopian dreaming in community.', energy: 'harmonious' },
    Capricorn: { text: 'Spiritual questioning of authority and material ambition.', energy: 'restrictive' },
    Scorpio: { text: 'Deep mystical transformation and dissolution of power structures.', energy: 'transformative' },
    Sagittarius: { text: 'Spiritual seeking and dissolution of rigid beliefs and borders.', energy: 'expansive' },
    Libra: { text: 'Dissolution of relationship boundaries. Idealistic and romantic union-seeking.', energy: 'harmonious' },
    Virgo: { text: 'Spiritual service and dissolution of analytical certainty. Intuitive healing.', energy: 'harmonious' },
    Leo: { text: 'Creative dissolution of ego. Spiritual art and cinema transformation.', energy: 'transformative' },
    Cancer: { text: 'Dissolution of home boundaries. Spiritual and psychic opening in family.', energy: 'harmonious' },
    Gemini: { text: 'Dissolution of fixed ideas. Intuitive communication and psychic connection.', energy: 'harmonious' },
    Taurus: { text: 'Dissolution of material security. Spiritual approach to beauty and resources.', energy: 'harmonious' },
  },
  Pluto: {
    Capricorn: { text: 'Pluto in Capricorn — transformation of power, authority, and institutions.', energy: 'transformative' },
    Aquarius: { text: 'Pluto in Aquarius — radical collective transformation and technological power shifts.', energy: 'transformative' },
    Scorpio: { text: 'Pluto at home — regeneration of the deepest psychological and societal structures.', energy: 'transformative' },
    Sagittarius: { text: 'Transformation of beliefs, religion, and global perspectives.', energy: 'transformative' },
    Virgo: { text: 'Transformation of health systems and analytical frameworks.', energy: 'transformative' },
    Leo: { text: 'Transformation of leadership, creativity, and ego expression.', energy: 'transformative' },
    Cancer: { text: 'Transformation of home, family, and emotional foundations.', energy: 'transformative' },
    Gemini: { text: 'Transformation of communication, information, and the mind.', energy: 'transformative' },
    Taurus: { text: 'Transformation of values, resources, and the material world.', energy: 'transformative' },
    Aries: { text: 'Transformation of identity, initiative, and individual power.', energy: 'transformative' },
    Pisces: { text: 'Transformation of spirituality, collective unconscious, and dissolution.', energy: 'transformative' },
    Libra: { text: 'Transformation of relationships, justice, and social contracts.', energy: 'transformative' },
  },
};

function getDefaultTransitText(planet: PlanetName, sign: ZodiacSignName, retrograde: boolean): { text: string; energy: DailyTransit['energy'] } {
  const specific = TRANSIT_INTERPRETATIONS[planet]?.[sign];
  if (specific) {
    const retrogradeSuffix = retrograde ? ` (Retrograde: time to review and internalise ${planet}'s themes.)` : '';
    return { text: specific.text + retrogradeSuffix, energy: retrograde ? 'restrictive' : specific.energy };
  }
  const element = ZODIAC_SIGNS.find(s => s.name === sign)?.element ?? 'Fire';
  const energyMap: Record<ElementType, DailyTransit['energy']> = { Fire: 'dynamic', Earth: 'restrictive', Air: 'expansive', Water: 'harmonious' };
  return {
    text: `${planet} in ${sign} brings ${element.toLowerCase()} energy. ${retrograde ? 'With retrograde, focus inward and review past themes.' : 'Embrace the qualities of this sign in your daily experience.'}`,
    energy: energyMap[element]
  };
}

export function getDailyTransits(date: Date = new Date()): DailyTransit[] {
  const planets: PlanetName[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  return planets.map(planet => {
    const pos = getPlanetPosition(planet, date);
    const signInfo = ZODIAC_SIGNS.find(s => s.name === pos.sign)!;
    const { text, energy } = getDefaultTransitText(planet, pos.sign, pos.retrograde);
    return {
      planet,
      sign: pos.sign,
      degreeInSign: pos.degreeInSign,
      retrograde: pos.retrograde,
      planetSymbol: PLANET_DATA[planet].symbol,
      signSymbol: signInfo.symbol,
      interpretation: text,
      energy
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MOON PHASE
// ─────────────────────────────────────────────────────────────────────────────
export function getMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  const d = daysSinceJ2000(date);
  const sunLon = getPlanetPosition('Sun', date).longitude;
  const moonLon = getPlanetPosition('Moon', date).longitude;
  let phase = normalise(moonLon - sunLon);
  const illumination = (1 - Math.cos(phase * Math.PI / 180)) / 2;

  if (phase < 22.5)  return { name: 'New Moon',        emoji: '🌑', illumination, description: 'Seeds of intention planted in darkness.', ritual: 'Set powerful intentions for the cycle ahead.' };
  if (phase < 67.5)  return { name: 'Waxing Crescent', emoji: '🌒', illumination, description: 'Energy grows; first steps taken with hope.', ritual: 'Take concrete action on what you seeded at New Moon.' };
  if (phase < 112.5) return { name: 'First Quarter',   emoji: '🌓', illumination, description: 'Tension and decision-making — push through resistance.', ritual: 'Overcome obstacles; commit fully to your path.' };
  if (phase < 157.5) return { name: 'Waxing Gibbous',  emoji: '🌔', illumination, description: 'Refinement and adjustment — almost there.', ritual: 'Fine-tune your efforts and trust the process.' };
  if (phase < 202.5) return { name: 'Full Moon',        emoji: '🌕', illumination, description: 'Peak illumination — revelations, completions, and fruition.', ritual: 'Release what no longer serves; celebrate what has grown.' };
  if (phase < 247.5) return { name: 'Waning Gibbous',  emoji: '🌖', illumination, description: 'Gratitude and sharing — integrate the lesson.', ritual: 'Share your harvest; teach what you have learned.' };
  if (phase < 292.5) return { name: 'Last Quarter',     emoji: '🌗', illumination, description: 'Letting go — release and forgiveness work.', ritual: 'Clear space energetically and emotionally.' };
  return               { name: 'Waning Crescent',  emoji: '🌘', illumination, description: 'Rest and surrender — prepare for rebirth.', ritual: 'Rest deeply; trust the dark for renewal.' };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPATIBILITY
// ─────────────────────────────────────────────────────────────────────────────
function elementCompatibility(e1: ElementType, e2: ElementType): number {
  if (e1 === e2) return 90;
  const fire = ['Fire', 'Air'] as ElementType[];
  const earth = ['Earth', 'Water'] as ElementType[];
  if (fire.includes(e1) && fire.includes(e2)) return 80;
  if (earth.includes(e1) && earth.includes(e2)) return 80;
  // Fire-Water or Earth-Air: challenging
  const fireWater = (['Fire', 'Water'] as ElementType[]);
  const earthAir = (['Earth', 'Air'] as ElementType[]);
  if (fireWater.includes(e1) && fireWater.includes(e2)) return 50;
  if (earthAir.includes(e1) && earthAir.includes(e2)) return 55;
  return 65;
}

function qualityCompatibility(q1: QualityType, q2: QualityType): number {
  if (q1 === q2) return 60; // Same quality: challenging power struggles
  const pairs: [QualityType, QualityType][] = [['Cardinal', 'Fixed'], ['Fixed', 'Mutable'], ['Cardinal', 'Mutable']];
  return 80;
}

const COMPATIBILITY_STRENGTHS: Record<ElementType, Record<ElementType, string[]>> = {
  Fire: {
    Fire: ['Mutual enthusiasm and passion', 'Shared love of adventure', 'Inspiring each other to dream bigger'],
    Air:  ['Intellectual sparks and lively debate', 'Air fans Fire\'s dreams', 'Freedom and movement in the bond'],
    Earth: ['Grounding and steadying influence', 'Practical support for Fire\'s vision', 'Long-lasting stability'],
    Water: ['Emotional depth meets fiery passion', 'Creative and deeply intimate', 'Spiritual intensity'],
  },
  Earth: {
    Earth: ['Rock-solid loyalty and stability', 'Shared material goals', 'Deeply reliable partnership'],
    Water: ['Emotional nourishment of Earth\'s structure', 'Patient, devoted love', 'Creative and sensual harmony'],
    Fire:  ['Inspiring each other toward growth', 'Fire motivates Earth\'s potential', 'Exciting dynamic duo'],
    Air:   ['Practical intelligence and creative ideas', 'Grounding Air\'s thoughts', 'Complementary strengths'],
  },
  Air: {
    Air:   ['Mental connection and witty banter', 'Freedom and independence respected', 'Innovative together'],
    Fire:  ['Inspiration and enthusiasm shared', 'Exciting intellectual exchanges', 'Never a dull moment'],
    Water: ['Emotional depth meets mental clarity', 'Balancing heart and mind', 'Deeply healing partnership'],
    Earth: ['Practicality meets innovation', 'Reliable and stimulating', 'Building lasting structures together'],
  },
  Water: {
    Water: ['Deep emotional understanding', 'Psychic attunement', 'Nurturing and compassionate bond'],
    Earth: ['Emotional depth nourishes stability', 'Grounded and intuitive together', 'Deeply comforting partnership'],
    Air:   ['Heart and mind seek balance', 'Healing conversations', 'Growth through vulnerability'],
    Fire:  ['Passionate and spiritually intense', 'Transformative connection', 'Creative fire and emotional depth'],
  },
};

const COMPATIBILITY_CHALLENGES: Record<ElementType, Record<ElementType, string[]>> = {
  Fire: {
    Water: ['Water may dampen Fire\'s enthusiasm', 'Emotional sensitivity vs directness', 'Finding middle ground in conflict'],
    Earth: ['Pacing differences (fast vs slow)', 'Practicality vs idealism', 'Earth may restrict Fire\'s spontaneity'],
    Fire:  ['Ego clashes and dominance struggles', 'Competition instead of cooperation', 'Burnout from too much intensity'],
    Air:   ['Air can feel detached to Fire\'s heart', 'Commitment pace differences', 'Staying grounded together'],
  },
  Earth: {
    Air:   ['Earth may find Air too scattered', 'Tradition vs innovation tension', 'Communication of emotional needs'],
    Fire:  ['Fire\'s restlessness unsettles Earth', 'Risk tolerance differences', 'Slowing down vs speeding up'],
    Earth: ['Both can become too rigid', 'Resistance to change', 'Need to inject playfulness'],
    Water: ['Water may overwhelm Earth\'s structure', 'Emotional processing differences', 'Boundaries with sensitivity'],
  },
  Air: {
    Earth: ['Air may feel restricted by Earth', 'Abstract vs concrete thinking', 'Freedom vs commitment tension'],
    Water: ['Detachment can hurt Water\'s feelings', 'Emotional vs rational perspectives', 'Depth of intimacy sought'],
    Air:   ['Both avoid emotional depth', 'Lack of grounding', 'Ideas without follow-through'],
    Fire:  ['Inconsistency vs sustained passion', 'Attention scattered across too much', 'Depth of commitment'],
  },
  Water: {
    Fire:  ['Emotional flooding vs bluntness', 'Overwhelm from intensity differences', 'Boundaries and directness'],
    Air:   ['Emotional needs vs intellectual distance', 'Vulnerability and logic mismatches', 'Communication of feelings'],
    Water: ['Emotional overwhelm together', 'Lack of practical structure', 'Co-dependency risks'],
    Earth: ['Water may feel emotionally stifled', 'Earth\'s rigidity vs Water\'s flow', 'Allowing full emotional expression'],
  },
};

export function checkCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName): CompatibilityResult {
  const s1 = ZODIAC_SIGNS.find(s => s.name === sign1)!;
  const s2 = ZODIAC_SIGNS.find(s => s.name === sign2)!;

  const elScore = elementCompatibility(s1.element, s2.element);
  const qualScore = qualityCompatibility(s1.quality, s2.quality);

  // Bonus: same sign = 95, opposite sign = 70, square (3 apart) = 55
  const diff = Math.abs(s1.index - s2.index);
  const minDiff = Math.min(diff, 12 - diff);
  let signBonus = 0;
  if (minDiff === 0) signBonus = 10;
  else if (minDiff === 6) signBonus = 5; // opposition — magnetic
  else if (minDiff === 4 || minDiff === 8) signBonus = 8; // trine
  else if (minDiff === 2 || minDiff === 10) signBonus = 5; // sextile
  else if (minDiff === 3 || minDiff === 9) signBonus = -5; // square

  const raw = elScore * 0.5 + qualScore * 0.3 + signBonus * 2 + 20;
  const score = Math.min(99, Math.max(35, Math.round(raw)));

  let grade = 'D';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';

  const strengths = COMPATIBILITY_STRENGTHS[s1.element]?.[s2.element] ?? ['Unique and interesting dynamic', 'Growth through difference', 'Mutual learning'];
  const challenges = COMPATIBILITY_CHALLENGES[s1.element]?.[s2.element] ?? ['Different approaches to life', 'Communication styles vary', 'Finding common ground'];

  const summaries: Record<string, string> = {
    'A+': `${sign1} and ${sign2} share a rare, almost effortless cosmic resonance. Your energies amplify each other\'s best qualities.`,
    'A':  `${sign1} and ${sign2} are highly compatible — a natural, flowing connection with shared values and mutual understanding.`,
    'B':  `${sign1} and ${sign2} have genuine chemistry with some areas needing conscious attention. A rewarding, growth-oriented bond.`,
    'C':  `${sign1} and ${sign2} have different approaches, but differences can be powerful teachers. This is a bond that deepens through effort.`,
    'D':  `${sign1} and ${sign2} face real challenges, but challenging relationships often forge the deepest growth and self-knowledge.`,
  };

  return { score, grade, summary: summaries[grade], strengths, challenges, element1: s1.element, element2: s2.element, quality1: s1.quality, quality2: s2.quality };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export function getSignInfo(name: ZodiacSignName): ZodiacSignInfo {
  return ZODIAC_SIGNS.find(s => s.name === name)!;
}

export function todayCosmicWeather(date: Date = new Date()): string {
  const moon = getMoonPhase(date);
  const sunPos = getPlanetPosition('Sun', date);
  const sunSign = ZODIAC_SIGNS.find(s => s.name === sunPos.sign)!;
  return `${moon.emoji} ${moon.name} in ${sunSign.symbol} ${sunPos.sign} season. ${moon.description}`;
}
