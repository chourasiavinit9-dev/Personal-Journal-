import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getBirthChart, getDailyTransits, getMoonPhase, checkCompatibility,
  calculateAspects, getSignInfo, todayCosmicWeather,
  ZODIAC_SIGNS,
  type BirthChart, type DailyTransit, type MoonPhaseInfo,
  type CompatibilityResult, type ZodiacSignName, type PlanetName, type Aspect
} from '../../lib/astrology';
import { ZodiacBirthData } from '../../types';
import { apiFetch } from '../../lib/api';
import {
  Star, Sparkles, Moon, Sun, MessageCircle, Heart, ChevronRight,
  ChevronLeft, RotateCcw, Send, Loader2, X, ArrowRight
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const ENERGY_COLORS: Record<DailyTransit['energy'], string> = {
  expansive: '#9B7EC8',
  restrictive: '#7B9EA8',
  dynamic: '#E84A4A',
  harmonious: '#7BB86F',
  transformative: '#C8A870',
};

const ENERGY_BG: Record<DailyTransit['energy'], string> = {
  expansive: 'rgba(155,126,200,0.15)',
  restrictive: 'rgba(123,158,168,0.15)',
  dynamic: 'rgba(232,74,74,0.15)',
  harmonious: 'rgba(123,184,111,0.15)',
  transformative: 'rgba(200,168,112,0.15)',
};

const VISIBLE_PLANETS: PlanetName[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// ─────────────────────────────────────────────────────────────────────────────
// BIRTH CHART SVG WHEEL
// ─────────────────────────────────────────────────────────────────────────────
function BirthChartWheel({ chart, aspects, size = 300 }: { chart: BirthChart; aspects: Aspect[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.46;            // outer zodiac ring
  const zodiacInner = R * 0.82;    // inner zodiac ring
  const houseOuter = zodiacInner;
  const houseInner = R * 0.6;
  const planetRing = R * 0.46;
  const aspectRing = R * 0.35;
  const centerR = R * 0.2;

  // Convert ecliptic longitude to SVG angle (Aries 0° at 9 o'clock, counterclockwise)
  const lonToAngle = (lon: number) => {
    // Start at 180° (left / 9 o'clock) and go counterclockwise
    return (180 - lon) * Math.PI / 180;
  };

  const polarToXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  // Zodiac segments
  const zodiacSegments = ZODIAC_SIGNS.map((sign, i) => {
    const startAngle = lonToAngle(sign.startDeg + 30);
    const endAngle = lonToAngle(sign.startDeg);
    const mid = lonToAngle(sign.startDeg + 15);
    const textPos = polarToXY(mid, (R + zodiacInner) / 2);
    const elementColors: Record<string, string> = { Fire: '#3D1F1F', Earth: '#1F3020', Air: '#1F2A3D', Water: '#1F2537' };
    const bg = elementColors[sign.element] ?? '#1A1A2E';

    const p1 = polarToXY(startAngle, R);
    const p2 = polarToXY(endAngle, R);
    const p3 = polarToXY(endAngle, zodiacInner);
    const p4 = polarToXY(startAngle, zodiacInner);

    const path = `M ${p1.x} ${p1.y} A ${R} ${R} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${zodiacInner} ${zodiacInner} 0 0 1 ${p4.x} ${p4.y} Z`;

    return (
      <g key={sign.name}>
        <path d={path} fill={bg} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <text
          x={textPos.x} y={textPos.y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.045} fill={sign.color}
          style={{ fontFamily: 'serif' }}
        >
          {sign.symbol}
        </text>
      </g>
    );
  });

  // House lines
  const houseLines = Array.from({ length: 12 }, (_, i) => {
    const angle = lonToAngle(i * 30);
    const inner = polarToXY(angle, houseInner);
    const outer = polarToXY(angle, houseOuter);
    return (
      <line
        key={`house-${i}`}
        x1={inner.x} y1={inner.y}
        x2={outer.x} y2={outer.y}
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"
      />
    );
  });

  // Planet positions
  const planetMap: { name: PlanetName; pos: { longitude: number; symbol: string; color: string; retrograde: boolean } }[] = [
    { name: 'Sun', pos: chart.sun },
    { name: 'Moon', pos: chart.moon },
    { name: 'Mercury', pos: chart.mercury },
    { name: 'Venus', pos: chart.venus },
    { name: 'Mars', pos: chart.mars },
    { name: 'Jupiter', pos: chart.jupiter },
    { name: 'Saturn', pos: chart.saturn },
  ];

  const planetGlyphs = planetMap.map(({ name, pos }) => {
    const angle = lonToAngle(pos.longitude);
    const { x, y } = polarToXY(angle, planetRing);
    return (
      <g key={name}>
        <circle cx={x} cy={y} r={size * 0.028} fill="rgba(20,16,30,0.9)" stroke={pos.color} strokeWidth="1" />
        <text
          x={x} y={y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.038} fill={pos.color}
          style={{ fontFamily: 'serif', fontWeight: 'bold' }}
        >
          {pos.symbol}
        </text>
        {pos.retrograde && (
          <text
            x={x + size * 0.025} y={y - size * 0.025}
            fontSize={size * 0.022} fill="#C8A870"
            style={{ fontFamily: 'sans-serif' }}
          >
            ℞
          </text>
        )}
      </g>
    );
  });

  // Aspect lines
  const aspectLines = aspects.slice(0, 8).map((asp, i) => {
    const p1 = planetMap.find(p => p.name === asp.planet1);
    const p2 = planetMap.find(p => p.name === asp.planet2);
    if (!p1 || !p2) return null;
    const a1 = lonToAngle(p1.pos.longitude);
    const a2 = lonToAngle(p2.pos.longitude);
    const start = polarToXY(a1, aspectRing);
    const end = polarToXY(a2, aspectRing);
    const opacity = asp.type === 'Conjunction' || asp.type === 'Trine' ? 0.55 : asp.type === 'Square' ? 0.45 : 0.35;
    const dashArray = asp.type === 'Square' ? '3,3' : asp.type === 'Opposition' ? '5,3' : 'none';
    return (
      <line
        key={`asp-${i}`}
        x1={start.x} y1={start.y}
        x2={end.x} y2={end.y}
        stroke={asp.color}
        strokeWidth={1.2}
        opacity={opacity}
        strokeDasharray={dashArray === 'none' ? undefined : dashArray}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke="rgba(155,126,200,0.2)" strokeWidth="3" />

      {/* Zodiac ring */}
      {zodiacSegments}

      {/* House ring */}
      <circle cx={cx} cy={cy} r={houseInner} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      {houseLines}

      {/* Planet ring background */}
      <circle cx={cx} cy={cy} r={planetRing + size * 0.035} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

      {/* Aspect lines */}
      {aspectLines}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={centerR} fill="rgba(20,16,30,0.95)" stroke="rgba(155,126,200,0.3)" strokeWidth="1" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={size * 0.055} fill="#C8A870" style={{ fontFamily: 'serif' }}>✦</text>
      <text x={cx} y={cy + size * 0.055} textAnchor="middle" fontSize={size * 0.025} fill="rgba(255,255,255,0.4)" style={{ fontFamily: 'monospace' }}>
        NATAL
      </text>

      {/* Planet glyphs (on top) */}
      {planetGlyphs}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAR FIELD BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.7 + 0.2,
    dur: Math.random() * 4 + 3,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        {stars.map(s => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.opacity}>
            <animate attributeName="opacity" values={`${s.opacity};${s.opacity * 0.2};${s.opacity}`}
              dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT INTERFACE
// ─────────────────────────────────────────────────────────────────────────────
interface ChatMsg { role: 'user' | 'assistant'; content: string; ts: number; }

function CelesteChatPanel({ chart }: { chart: BirthChart | null }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([{
    role: 'assistant',
    content: chart
      ? `Welcome back, cosmic traveller ✦\n\nWith your ${chart.sun.sign} Sun${chart.moon ? `, ${chart.moon.sign} Moon` : ''}${chart.rising ? `, and ${chart.rising.sign} Rising` : ''}, the stars have much to reveal. What would you like to explore today?`
      : `Welcome, cosmic traveller ✦\n\nI am Celeste, your astrology co-pilot. Share your birth date to unlock your natal chart, or ask me anything about today's planetary energies, compatibility, or your cosmic journey.`,
    ts: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const buildContext = () => {
    if (!chart) return '';
    return `Sun in ${chart.sun.sign}${chart.sun.degreeInSign}°, Moon in ${chart.moon.sign}${chart.moon.degreeInSign}°${chart.rising ? `, Rising ${chart.rising.sign}` : ''}, Mercury in ${chart.mercury.sign}, Venus in ${chart.venus.sign}, Mars in ${chart.mars.sign}.`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMsg = { role: 'user', content: input.trim(), ts: Date.now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { reply } = await apiFetch<{ reply: string }>('/api/astro/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg.content, context: buildContext() }),
      });
      setMsgs(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (err: any) {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: 'The stars are momentarily veiled ☁️ — please try again in a moment.',
        ts: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const suggestions = [
    'What does my sun sign mean for this week?',
    'What planet is influencing my energy today?',
    'Tell me about my moon sign traits.',
    'What should I focus on this lunar cycle?'
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {msgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-purple-600/30 border border-purple-500/30 text-white'
                : 'bg-white/5 border border-white/10 text-white/90'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-purple-400 text-xs">✦</span>
                  <span className="text-purple-400 text-xs font-mono uppercase tracking-wider">Celeste</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-white/50 text-xs font-mono">Celeste is consulting the stars…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (show when no conversation yet) */}
      {msgs.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white/60 hover:text-white/90 rounded-full px-3 py-1.5 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end gap-2 bg-white/5 border border-white/15 hover:border-purple-500/40 rounded-2xl p-2.5 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Celeste anything…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 resize-none outline-none min-h-[36px] max-h-[120px]"
            rows={1}
            style={{ fieldSizing: 'content' as any }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full bg-purple-600/60 hover:bg-purple-600 border border-purple-500/50 flex items-center justify-center transition-all disabled:opacity-30 shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 font-mono mt-2">Shift+Enter for new line · Enter to send</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPATIBILITY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function CompatibilityPanel() {
  const signs: ZodiacSignName[] = ZODIAC_SIGNS.map(s => s.name);
  const [sign1, setSign1] = useState<ZodiacSignName>('Aries');
  const [sign2, setSign2] = useState<ZodiacSignName>('Leo');
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const calculate = () => setResult(checkCompatibility(sign1, sign2));

  const gradeColors: Record<string, string> = {
    'A+': '#7BB86F', A: '#9B7EC8', B: '#C8A870', C: '#7EC8D8', D: '#E84A4A'
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {([['sign1', sign1, setSign1], ['sign2', sign2, setSign2]] as const).map(([key, val, setter]) => (
          <div key={key}>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">
              {key === 'sign1' ? 'First Sign' : 'Second Sign'}
            </label>
            <select
              value={val}
              onChange={e => setter(e.target.value as ZodiacSignName)}
              className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
              style={{ backgroundImage: 'none' }}
            >
              {signs.map(s => {
                const info = getSignInfo(s);
                return <option key={s} value={s} style={{ background: '#14102A' }}>{info.symbol} {s}</option>;
              })}
            </select>
          </div>
        ))}
      </div>

      {/* Connector display */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-2xl">
            {getSignInfo(sign1).symbol}
          </div>
          <p className="text-xs text-white/50 mt-1">{sign1}</p>
        </div>
        <Heart className="w-5 h-5 text-white/20" />
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-2xl">
            {getSignInfo(sign2).symbol}
          </div>
          <p className="text-xs text-white/50 mt-1">{sign2}</p>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 hover:from-purple-600/70 hover:to-indigo-600/70 border border-purple-500/30 text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-95"
      >
        ✦ Read Compatibility
      </button>

      {result && (
        <div className="space-y-4 animate-fadeIn">
          {/* Score */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
            <div className="text-5xl font-serif font-bold mb-1" style={{ color: gradeColors[result.grade] }}>
              {result.grade}
            </div>
            <div className="text-xl font-mono text-white/70 mb-3">{result.score}%</div>
            <p className="text-sm text-white/70 leading-relaxed italic">{result.summary}</p>
          </div>

          {/* Elements */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-white/40 uppercase tracking-wider mb-2 font-mono">Strengths</div>
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-white/70">{s}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-white/40 uppercase tracking-wider mb-2 font-mono">Growth Areas</div>
              {result.challenges.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <span className="text-amber-400 mt-0.5">◆</span>
                  <span className="text-white/70">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BIRTH DATA FORM
// ─────────────────────────────────────────────────────────────────────────────
function BirthDataForm({ onSubmit }: { onSubmit: (data: ZodiacBirthData) => void }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onSubmit({ date, time: time || undefined, city: city || undefined });
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">✦</div>
        <h3 className="text-white font-serif text-lg mb-1">Cast Your Natal Chart</h3>
        <p className="text-white/50 text-sm">Enter your birth details to unlock your personal cosmic blueprint.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">
            Birth Date <span className="text-purple-400">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full bg-white/5 border border-white/15 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">
              Birth Time <span className="text-white/30">(optional)</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-white/5 border border-white/15 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">
              Birth City <span className="text-white/30">(optional)</span>
            </label>
            <input
              type="text"
              value={city}
              placeholder="Mumbai, Paris…"
              onChange={e => setCity(e.target.value)}
              className="w-full bg-white/5 border border-white/15 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-700/60 to-indigo-700/60 hover:from-purple-700/80 hover:to-indigo-700/80 border border-purple-500/40 text-white font-medium text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
        >
          ✦ Reveal My Chart
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSIT CARD
// ─────────────────────────────────────────────────────────────────────────────
function TransitCard({ transit }: { transit: DailyTransit }) {
  const [expanded, setExpanded] = useState(false);
  const color = ENERGY_COLORS[transit.energy];
  const bg = ENERGY_BG[transit.energy];

  const VISIBLE: PlanetName[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  if (!VISIBLE.includes(transit.planet)) return null;

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      style={{ background: bg, borderColor: `${color}30` }}
    >
      <div className="p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center border shrink-0" style={{ borderColor: `${color}50`, background: `${color}20` }}>
            <span className="text-lg" style={{ color }}>{transit.planetSymbol}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm font-medium">{transit.planet}</span>
              {transit.retrograde && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${color}30`, color }}>℞ Rx</span>
              )}
            </div>
            <div className="text-xs text-white/50">
              {transit.signSymbol} {transit.sign} {transit.degreeInSign}°
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${color}25`, color }}>
            {transit.energy}
          </span>
          <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 text-sm text-white/70 leading-relaxed border-t" style={{ borderColor: `${color}20` }}>
          <p className="pt-3">{transit.interpretation}</p>
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
type MobileTab = 'chart' | 'transits' | 'chat' | 'compat';

export const ZodiacCopilot: React.FC = () => {
  const [birthData, setBirthData] = useState<ZodiacBirthData | null>(() => {
    try {
      const stored = localStorage.getItem('lifeos-birth-data');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [transits, setTransits] = useState<DailyTransit[]>([]);
  const [moonPhase, setMoonPhase] = useState<MoonPhaseInfo | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('chart');

  // Load transits on mount
  useEffect(() => {
    setTransits(getDailyTransits());
    setMoonPhase(getMoonPhase());
  }, []);

  // Recalculate chart when birthData changes
  useEffect(() => {
    if (!birthData) { setChart(null); setAspects([]); return; }
    try {
      const c = getBirthChart(birthData.date, birthData.time);
      setChart(c);
      setAspects(calculateAspects(c));
    } catch { setChart(null); }
  }, [birthData]);

  const handleBirthDataSubmit = (data: ZodiacBirthData) => {
    setBirthData(data);
    localStorage.setItem('lifeos-birth-data', JSON.stringify(data));
  };

  const clearBirthData = () => {
    setBirthData(null);
    setChart(null);
    setAspects([]);
    localStorage.removeItem('lifeos-birth-data');
  };

  const visibleTransits = transits.filter(t => VISIBLE_PLANETS.includes(t.planet));

  const mobileTabs: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: 'chart', label: 'My Chart', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'transits', label: 'Today', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'chat', label: 'Celeste', icon: <MessageCircle className="w-3.5 h-3.5" /> },
    { id: 'compat', label: 'Match', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  // ── Shared sub-panels for composing layouts ──────────────────────────────
  const ChartPanel = (
    <div className="space-y-4">
      {/* Moon Phase */}
      {moonPhase && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4">
          <div className="text-4xl">{moonPhase.emoji}</div>
          <div>
            <div className="text-white font-medium text-sm">{moonPhase.name}</div>
            <div className="text-white/50 text-xs mt-0.5">{moonPhase.description}</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden w-32">
              <div className="h-full rounded-full bg-white/60 transition-all" style={{ width: `${moonPhase.illumination * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {chart ? (
        <>
          {/* Chart Wheel */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center">
            <BirthChartWheel chart={chart} aspects={aspects} size={260} />
            {/* Big 3 */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {[
                { label: 'Sun', pos: chart.sun, icon: '☉' },
                { label: 'Moon', pos: chart.moon, icon: '☽' },
                { label: 'Rising', pos: chart.rising, icon: '↑' },
              ].map(({ label, pos, icon }) => (
                <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-center">
                  <div className="text-white/40 text-[10px] font-mono uppercase mb-1">{icon} {label}</div>
                  <div className="text-white text-sm font-medium">
                    {pos ? getSignInfo(pos.sign).symbol : '?'}
                  </div>
                  <div className="text-white/60 text-[11px] mt-0.5">
                    {pos ? pos.sign : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspects summary */}
          {aspects.length > 0 && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-3">Key Aspects</div>
              <div className="space-y-2">
                {aspects.slice(0, 4).map((asp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full mt-0.5 shrink-0" style={{ background: asp.color }} />
                    <span className="text-white/70">
                      <strong className="text-white/90">{asp.planet1}</strong>
                      {' '}{asp.type}{' '}
                      <strong className="text-white/90">{asp.planet2}</strong>
                      <span className="text-white/40"> — {asp.meaning}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={clearBirthData}
            className="w-full py-2 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 text-xs font-mono transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" /> Change Birth Data
          </button>
        </>
      ) : (
        <BirthDataForm onSubmit={handleBirthDataSubmit} />
      )}
    </div>
  );

  const TransitsPanel = (
    <div className="space-y-3">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider pb-1">
        {todayCosmicWeather()}
      </div>
      {visibleTransits.map(t => <TransitCard key={t.planet} transit={t} />)}
    </div>
  );

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  const MobileLayout = (
    <div className="flex flex-col h-full">
      {/* Mobile tab bar */}
      <div className="flex items-center gap-1 p-2 bg-black/30 border-b border-white/10 shrink-0">
        {mobileTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setMobileTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
              mobileTab === tab.id
                ? 'bg-purple-600/40 border border-purple-500/40 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.icon}
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile content */}
      <div className="flex-1 overflow-y-auto p-4">
        {mobileTab === 'chart' && ChartPanel}
        {mobileTab === 'transits' && TransitsPanel}
        {mobileTab === 'chat' && (
          <div className="h-[calc(100vh-14rem)]">
            <CelesteChatPanel chart={chart} />
          </div>
        )}
        {mobileTab === 'compat' && <CompatibilityPanel />}
      </div>
    </div>
  );

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  const DesktopLayout = (
    <div className="grid grid-cols-[360px_1fr] h-full gap-0 overflow-hidden">
      {/* Left column: chart + moon + aspects */}
      <div className="border-r border-white/10 overflow-y-auto p-6 space-y-4">
        {ChartPanel}
      </div>

      {/* Right column: 3-section split */}
      <div className="grid grid-rows-[1fr_auto] overflow-hidden">
        {/* Top: Transits + Chat side by side */}
        <div className="grid grid-cols-2 gap-0 overflow-hidden min-h-0">
          {/* Transits */}
          <div className="border-r border-white/10 overflow-y-auto p-5 space-y-3">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider pb-1 sticky top-0 bg-transparent">
              {moonPhase && `${moonPhase.emoji} `}Today's Cosmic Weather
            </div>
            {TransitsPanel}
          </div>

          {/* Celeste Chat */}
          <div className="overflow-hidden flex flex-col">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider p-5 pb-0 shrink-0">
              ✦ Celeste — AI Co-pilot
            </div>
            <div className="flex-1 overflow-hidden">
              <CelesteChatPanel chart={chart} />
            </div>
          </div>
        </div>

        {/* Bottom: Compatibility */}
        <div className="border-t border-white/10 p-5 overflow-y-auto max-h-[42vh]">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-4">♡ Compatibility Oracle</div>
          <CompatibilityPanel />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 20% 20%, #1a0a35 0%, #0a0520 40%, #06030d 100%)' }}
    >
      <StarField />

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="text-white font-serif text-base sm:text-lg font-semibold leading-none">Celestial Compass</h1>
            <p className="text-white/40 text-[11px] font-mono uppercase tracking-wider mt-0.5">Zodiac Co-pilot</p>
          </div>
        </div>

        {/* Cosmic weather pill */}
        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/60">
          <span>{moonPhase?.emoji}</span>
          <span className="font-mono">{moonPhase?.name}</span>
        </div>
      </div>

      {/* Content — adaptive layout */}
      <div className="relative z-10" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Mobile: < 1024px */}
        <div className="lg:hidden h-full overflow-hidden">{MobileLayout}</div>
        {/* Desktop: >= 1024px */}
        <div className="hidden lg:block h-full overflow-hidden">{DesktopLayout}</div>
      </div>
    </div>
  );
};
