import React, { useState } from 'react';
import { HabitItem } from '../../types';
import { soundSynthesizer } from '../../utils/soundSynthesizer';
import { useLifeOS } from '../../store/lifeOSStore';
import { HabitModal } from '../HabitModal';
import {
  Sparkles,
  BarChart2,
  Trash2,
  Check,
  Plus,
  Play,
  Pause,
  Award,
  Pencil
} from 'lucide-react';

interface HabitGardenProps {
  habits?: HabitItem[];
  onToggleHabit?: (id: string) => void;
}

export const HabitGarden: React.FC<HabitGardenProps> = () => {
  const { habits, toggleHabit, addHabit, updateHabit, deleteHabit, digest, habitStamps } = useLifeOS();
  const [filter, setFilter] = useState<string>('all');
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  const filteredHabits = habits.filter((h) => {
    if (filter === 'morning') return h.category?.toLowerCase().includes('morning') || h.id.includes('morning') || h.id.includes('matcha');
    if (filter === 'somatic') return h.category?.toLowerCase().includes('somatic') || h.category?.toLowerCase().includes('physical');
    if (filter === 'evening') return h.category?.toLowerCase().includes('evening') || h.id.includes('evening');
    return true;
  });

  const groundedTodayCount = habits.filter((h) => h.completedToday).length;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
  const topHabit = habits.reduce<HabitItem | null>((prev, cur) => {
    if (!prev || cur.streak > prev.streak) return cur;
    return prev;
  }, null);

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
    soundSynthesizer.playPaperClick();
  };

  const handleOpenEdit = (habit: HabitItem) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
    soundSynthesizer.playPaperClick();
  };

  const handleSaveHabit = (data: Partial<HabitItem>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
  };

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Editorial Heading */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E2DC] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-[#76716B] mb-2">
            <span>Sanctuary</span>
            <span>/</span>
            <span>Rituals Board</span>
            <span>/</span>
            <span className="text-[#1F1A17] font-semibold">Habit Cadence Studio</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1F1A17] font-normal tracking-tight">
            {digest.habitTitle || 'Mindful Habit Cadence & Activity Heatmaps'}
          </h1>
          <p className="text-sm text-[#76716B] mt-1.5 font-sans max-w-2xl leading-relaxed">
            {digest.habitSubtitle || 'Inspired by tactile physical ledgers. Cultivate somatic presence, micro-habits, and rhythmic consistency without digital overwhelm.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1F1A17] text-white text-xs font-mono font-medium hover:bg-black transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#E9BA6B]" />
            <span>+ Add Daily Habit</span>
          </button>
          <div className="bg-[#F5F3F0] p-1 rounded-xl border border-[#E6E2DC] hidden sm:flex items-center">
            <span className="text-[11px] font-mono text-[#826251] px-2 py-0.5 bg-[#EBD9CF]/40 rounded font-semibold">
              DYNAMIC ARCHIVE
            </span>
          </div>
        </div>
      </section>

      {/* KPI Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#76716B]">Active Rhythms</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#EBF3EE] text-[#2D6A4F]">
              {habits.length} Active
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-medium text-[#1F1A17]">{habits.length}</span>
            <span className="text-xs text-[#76716B]">Daily anchors</span>
          </div>
          <div className="mt-3 text-xs text-[#76716B] flex items-center space-x-1">
            <span className="text-[#2D6A4F] font-medium">100%</span>
            <span>completion target pace</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#76716B]">Grounded Today</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#EEF2F6] text-[#2B598F]">
              {habits.length > 0 ? Math.round((groundedTodayCount / habits.length) * 100) : 0}% Cadence
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-medium text-[#1F1A17]">{groundedTodayCount}</span>
            <span className="text-xs text-[#76716B]">/ {habits.length} Habits Checked</span>
          </div>
          <div className="mt-3 text-xs text-[#76716B] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#4682B4] animate-pulse mr-1"></span>
            <span>{Math.max(0, habits.length - groundedTodayCount)} pending rituals</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#76716B]">Longest Streak</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#F5EEF0] text-[#7A3B56]">
              Personal Best
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-medium text-[#1F1A17]">{longestStreak}</span>
            <span className="text-xs text-[#76716B]">Consecutive days</span>
          </div>
          <div className="mt-3 text-xs text-[#76716B] truncate">
            <span className="font-mono text-[11px] text-[#1F1A17]">{topHabit?.title || 'Steady Cadence'}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#76716B]">Presence Rate</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#F9F5EA] text-[#856404]">
              Steady Flow
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-medium text-[#1F1A17]">
              {habits.length > 0 ? Math.round((groundedTodayCount / habits.length) * 100) : 100}%
            </span>
            <span className="text-xs text-[#76716B]">of daily targets</span>
          </div>
          <div className="mt-3 text-xs text-[#76716B]">
            <span>Optimal balance maintained</span>
          </div>
        </div>
      </section>

      {/* Filter Segment Strip */}
      <section className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Rhythms (${habits.length})` },
            { id: 'morning', label: 'Morning Rituals' },
            { id: 'somatic', label: 'Physical & Somatic' },
            { id: 'evening', label: 'Evening Wind-down' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilter(item.id);
                soundSynthesizer.playPaperClick();
              }}
              className={`px-3.5 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-[#1F1A17] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F5F3F0] border border-[#E6E2DC] text-[#76716B] hover:text-[#1F1A17]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#76716B]">
          <span className="text-[11px] font-mono">HEATMAP DENSITY:</span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#EDF2F7] border border-[#D8E0EA]"></span>
            <span className="text-[10px]">Rest</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#93C5FD]"></span>
            <span className="text-[10px]">Light</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3B82F6]"></span>
            <span className="text-[10px]">Deep</span>
          </span>
        </div>
      </section>

      {/* Main Content Grid: Habit Cards (8 cols) + Quarterly Matrix (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Habit Cards */}
        <section className="lg:col-span-8 space-y-6">
          {filteredHabits.map((habit) => {
            const isSky = habit.theme === 'sky';
            const isLavender = habit.theme === 'lavender';
            const isEmerald = habit.theme === 'emerald';
            const isAmber = habit.theme === 'amber';

            // Theme-specific colors
            const cardBadgeBg = isSky
              ? 'bg-[#E8F2FA] text-[#1E6091]'
              : isLavender
              ? 'bg-[#F3E8FF] text-[#6B21A8]'
              : isEmerald
              ? 'bg-[#D1FAE5] text-[#065F46]'
              : 'bg-[#FEF3C7] text-[#92400E]';

            const buttonBg = isSky
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
              : isLavender
              ? 'bg-[#9333EA] hover:bg-[#7E22CE]'
              : isEmerald
              ? 'bg-[#059669] hover:bg-[#047857]'
              : 'bg-[#D97706] hover:bg-[#B45309]';

            return (
              <article
                key={habit.id}
                className="bg-white border border-[#E6E2DC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#F5F3F0] border border-[#E6E2DC] flex items-center justify-center text-xl shadow-xs">
                      {habit.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded font-medium ${cardBadgeBg}`}>
                          {habit.category}
                        </span>
                        <span className="text-xs text-[#76716B] font-mono">{habit.targetTime}</span>
                      </div>
                      <h2 className="font-serif text-xl font-medium text-[#1F1A17] mt-1">
                        {habit.title}
                      </h2>
                      <p className="text-xs text-[#76716B] mt-0.5">{habit.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-[#1F1A17] bg-[#F5F3F0] px-2.5 py-1 rounded-md border border-[#E6E2DC] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[#E9BA6B]" />
                      <span>{habit.streak}d Streak</span>
                    </span>
                    <button
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1.5 text-[#76716B] hover:text-[#1F1A17] hover:bg-[#F5F3F0] rounded-md transition-colors cursor-pointer"
                      title="Edit Habit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove habit "${habit.title}" from rituals?`)) {
                          deleteHabit(habit.id);
                        }
                      }}
                      className="p-1.5 text-[#76716B] hover:text-rose-600 hover:bg-[#F5F3F0] rounded-md transition-colors cursor-pointer"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Heatmap Matrix Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                  {/* Heatmap Grid (6x6) */}
                  <div className="md:col-span-6 bg-[#FBF9F6] p-3.5 rounded-xl border border-[#E6E2DC] flex flex-col items-center justify-center">
                    <div className="grid grid-cols-6 gap-2 w-fit">
                      {habit.heatmapMatrix?.map((row, rIdx) =>
                        row.map((val, cIdx) => {
                          const isLastCell = rIdx === 5 && cIdx === 5;
                          let cellColor = '#E2E8F0';
                          if (val === 1) {
                            cellColor = isSky ? '#93C5FD' : isLavender ? '#D8B4FE' : isEmerald ? '#6EE7B7' : '#FCD34D';
                          } else if (val === 2) {
                            cellColor = isSky ? '#60A5FA' : isLavender ? '#C084FC' : isEmerald ? '#34D399' : '#FBBF24';
                          } else if (val === 3) {
                            cellColor = isSky ? '#2563EB' : isLavender ? '#9333EA' : isEmerald ? '#059669' : '#D97706';
                          }

                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className="w-6 h-6 rounded-[3px] transition-transform hover:scale-125 cursor-pointer shadow-2xs"
                              style={{
                                backgroundColor: isLastCell && !habit.completedToday ? '#F1F5F9' : cellColor,
                                border: isLastCell && !habit.completedToday ? '1px dashed #94A3B8' : 'none'
                              }}
                              title={`Session: ${val === 0 ? 'Rest' : val === 1 ? 'Light' : val === 2 ? 'Steady' : 'Deep'}`}
                            ></div>
                          );
                        })
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#76716B] mt-2.5">
                      36-Day Micro-Session Density
                    </span>
                  </div>

                  {/* Weekly Days + Action Controls */}
                  <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#76716B] block mb-2">
                        Weekly Rhythm Pace
                      </span>
                      <div className="flex items-center justify-between">
                        {habit.weeklyDays?.map((wd, idx) => (
                          <div key={idx} className="text-center">
                            <span className="text-[10px] text-[#76716B] font-mono">{wd.day}</span>
                            <div
                              className={`w-7 h-7 mt-1 rounded-full flex items-center justify-center text-xs font-semibold ${
                                wd.isToday
                                  ? habit.completedToday
                                    ? 'bg-[#1F1A17] text-white ring-2 ring-[#E9BA6B]'
                                    : 'bg-white border-2 border-[#1F1A17] text-[#1F1A17] ring-2 ring-[#D8CAB7]'
                                  : wd.done
                                  ? 'bg-[#1F1A17]/80 text-white'
                                  : 'bg-[#F1F5F9] text-[#94A3B8]'
                              }`}
                            >
                              {wd.done || (wd.isToday && habit.completedToday) ? '✓' : '·'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Check-In Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          toggleHabit(habit.id);
                          soundSynthesizer.playStampSound();
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer ${
                          habit.completedToday
                            ? 'bg-[#1F1A17] hover:bg-black'
                            : buttonBg
                        }`}
                      >
                        {habit.completedToday ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Completed Today ({habit.targetTime})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>+ Check in Today ({habit.targetTime})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Right Sidebar: Master 90-Day Matrix & Keepsake Stamps */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Master 90-Day Contribution Heatmap */}
          <div className="bg-white border border-[#E6E2DC] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#76716B]">Sanctuary Ledger</span>
                <h3 className="font-serif text-lg font-medium text-[#1F1A17]">Quarterly Heatmap</h3>
              </div>
              <span className="text-xs font-mono text-[#76716B] bg-[#F5F3F0] px-2 py-0.5 rounded border border-[#E6E2DC]">
                Q1 / Q2
              </span>
            </div>
            <p className="text-xs text-[#76716B] mt-3 mb-4 leading-relaxed">
              Composite rhythmic resonance across all intentional habits.
            </p>

            <div className="bg-[#FBF9F6] p-3 rounded-xl border border-[#E6E2DC] overflow-x-auto">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
                {Array.from({ length: 70 }).map((_, i) => {
                  const colors = [
                    '#DBEAFE', '#93C5FD', '#3B82F6', '#2563EB', '#F3E8FF', '#A855F7', '#6EE7B7', '#10B981', '#FCD34D', '#F59E0B'
                  ];
                  const c = colors[i % colors.length];
                  return (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-[2px] transition-transform hover:scale-125"
                      style={{ backgroundColor: c }}
                      title={`Day ${i + 1}`}
                    ></div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#76716B]">
              <span>JAN 01</span>
              <span>PRESENCE INDEX: 94.2</span>
              <span>TODAY</span>
            </div>
          </div>

          {/* Milestone & Badge Vault */}
          <div className="bg-white border border-[#E6E2DC] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#76716B]">Tactile Keepsakes</span>
                <h3 className="font-serif text-lg font-medium text-[#1F1A17]">Earned Cadence Stamps</h3>
              </div>
              <span className="text-xs font-mono text-[#2D6A4F] bg-[#EBF3EE] px-2 py-0.5 rounded border border-[#C3DECB]">
                {habitStamps.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {habitStamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className="p-3 bg-[#FBF9F6] rounded-xl border border-dashed border-[#D8CAB7] text-center shadow-inner flex flex-col items-center"
                >
                  <span className="text-2xl">{stamp.emoji}</span>
                  <span className="text-[11px] font-serif font-medium text-[#1F1A17] mt-1.5 leading-tight">
                    {stamp.title}
                  </span>
                  <span className="text-[9px] font-mono text-[#76716B] mt-0.5">
                    {stamp.streakLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Philosophy */}
          <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E6E2DC] text-xs text-[#76716B] flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-[#826251] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-medium text-[#1F1A17]">Editorial Philosophy:</span>{' '}
              {digest.habitPhilosophy
                ? digest.habitPhilosophy.replace(/^Editorial Philosophy:\s*/, '')
                : 'Rhythms are designed to be forgiving. Skipping a day does not break your cadence; it merely preserves space for intuitive restoration.'}
            </div>
          </div>
        </aside>
      </div>

      {/* Habit Modal */}
      <HabitModal
        habit={editingHabit}
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={handleSaveHabit}
      />
    </div>
  );
};
