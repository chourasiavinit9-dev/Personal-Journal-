import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import type { Memory, InsightResponse } from '@/lib/types';
import {
  TicketStub,
  HabitItem,
  CrawlCheckpoint,
  JournalNote,
  MindfulIntention,
  SanctuaryDigest,
  SearchResultItem,
  CrawlBadge,
  HabitStamp,
  VaultEnvelope,
  DailyStreamItem,
  PaperTone
} from '../types';
import {
  INITIAL_TICKETS,
  INITIAL_HERO_TICKET,
  INITIAL_HABITS,
  INITIAL_INTENTIONS,
  INITIAL_CRAWL_CHECKPOINTS,
  INITIAL_JOURNAL_NOTES,
  INITIAL_SANCTUARY_DIGEST,
  INITIAL_DESK_CHECKLIST,
  INITIAL_DAILY_STREAM,
  INITIAL_CRAWL_BADGES,
  INITIAL_HABIT_STAMPS,
  INITIAL_VAULT_ENVELOPES,
  INITIAL_DEMO_DATA,
  DeskChecklistItem
} from '../data/sanctuaryData';

export { INITIAL_DEMO_DATA } from '../data/sanctuaryData';

const STORAGE_KEY = 'sanctuary-life-os-state-v1';
const LEGACY_STORAGE_KEY = 'sanctuary_life_os_v1';

export interface PolaroidData {
  imageUrl: string;
  caption: string;
}

export interface LifeOSState {
  tickets: TicketStub[];
  heroTicketId: string;
  habits: HabitItem[];
  intentions: MindfulIntention[];
  checkpoints: CrawlCheckpoint[];
  journalNotes: JournalNote[];
  digest: SanctuaryDigest;
  deskChecklist: DeskChecklistItem[];
  dailyStream: DailyStreamItem[];
  polaroid: PolaroidData;
  paperTone: PaperTone;
}

export interface LifeOSContextValue {
  tickets: TicketStub[];
  heroTicket: TicketStub;
  habits: HabitItem[];
  intentions: MindfulIntention[];
  checkpoints: CrawlCheckpoint[];
  crawlCheckpoints: CrawlCheckpoint[];
  journalNotes: JournalNote[];
  digest: SanctuaryDigest;
  deskChecklist: DeskChecklistItem[];
  dailyStream: DailyStreamItem[];
  polaroid: PolaroidData;
  paperTone: PaperTone;

  // Paper Tone actions
  setPaperTone: (tone: PaperTone) => void;

  // Intention actions
  addIntention: (text: string, category?: string) => void;
  updateIntention: (id: string, updates: Partial<MindfulIntention>) => void;
  deleteIntention: (id: string) => void;
  toggleIntention: (id: string) => void;

  // Ticket actions
  addTicket: (stub: TicketStub) => void;
  updateTicket: (id: string, updates: Partial<TicketStub>) => void;
  deleteTicket: (id: string) => void;
  updateHeroTicketImage: (newImageUrl: string) => void;
  updateTicketImage: (ticketId: string, newImageUrl: string) => void;
  setAsHeroTicket: (id: string) => void;

  // Habit actions
  addHabit: (habit: Partial<HabitItem> | HabitItem) => void;
  updateHabit: (id: string, updates: Partial<HabitItem>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;

  // Checkpoint actions
  addCheckpoint: (chk: Partial<CrawlCheckpoint> | CrawlCheckpoint) => void;
  addCrawlCheckpoint: (chk: Partial<CrawlCheckpoint> | CrawlCheckpoint) => void;
  updateCheckpoint: (id: string, updates: Partial<CrawlCheckpoint>) => void;
  updateCrawlCheckpoint: (id: string, updates: Partial<CrawlCheckpoint>) => void;
  deleteCheckpoint: (id: string) => void;
  deleteCrawlCheckpoint: (id: string) => void;
  stampCheckpoint: (id: string) => void;
  stampCrawlCheckpoint: (id: string) => void;

  // Journal actions
  addJournalNote: (note: Partial<JournalNote> | JournalNote) => void;
  updateJournalNote: (id: string, updates: Partial<JournalNote>) => void;
  deleteJournalNote: (id: string) => void;

  // Desk checklist
  addDeskChecklistItem: (text: string) => void;
  addDeskChecklist: (text: string) => void;
  updateDeskChecklistItem: (id: number, text: string) => void;
  toggleDeskChecklistItem: (id: number) => void;
  toggleDeskChecklist: (id: number) => void;
  deleteDeskChecklistItem: (id: number) => void;
  deleteDeskChecklist: (id: number) => void;

  // Stream thoughts
  addStreamThought: (thought: DailyStreamItem) => void;
  addDailyStream: (thought: DailyStreamItem) => void;
  deleteStreamThought: (index: number) => void;
  deleteDailyStream: (target: string | number) => void;

  // Polaroid
  updatePolaroid: (imageUrl: string, caption?: string) => void;

  // Digest
  updateDigest: (updates: Partial<SanctuaryDigest>) => void;

  // Collections & Badges
  crawlBadges: CrawlBadge[];
  habitStamps: HabitStamp[];
  vaultEnvelopes: VaultEnvelope[];
  demoData: typeof INITIAL_DEMO_DATA;

  // Search & Utilities
  searchEntities: (query: string) => SearchResultItem[];
  resetToSeedData: () => void;
}

const DEFAULT_POLAROID: PolaroidData = {
  imageUrl: '',
  caption: 'Autumn reflections at Nanzen-ji eaves'
};

const getInitialState = (): LifeOSState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tickets: Array.isArray(parsed.tickets) ? parsed.tickets : INITIAL_DEMO_DATA.tickets,
        heroTicketId: parsed.heroTicketId || INITIAL_DEMO_DATA.heroTicketId,
        habits: Array.isArray(parsed.habits) ? parsed.habits : INITIAL_DEMO_DATA.habits,
        intentions: Array.isArray(parsed.intentions)
          ? parsed.intentions.map((item: any) => ({
              ...item,
              text: typeof item?.text === 'string' ? item.text : (item?.text?.text || String(item?.text || item || ''))
            }))
          : INITIAL_DEMO_DATA.intentions,
        checkpoints: Array.isArray(parsed.checkpoints) ? parsed.checkpoints : INITIAL_DEMO_DATA.checkpoints,
        journalNotes: Array.isArray(parsed.journalNotes) ? parsed.journalNotes : INITIAL_DEMO_DATA.journalNotes,
        digest: { ...INITIAL_DEMO_DATA.digest, ...(parsed.digest || {}) },
        deskChecklist: Array.isArray(parsed.deskChecklist)
          ? parsed.deskChecklist.map((item: any) => ({
              ...item,
              text: typeof item?.text === 'string' ? item.text : (item?.text?.text || String(item?.text || item || ''))
            }))
          : INITIAL_DEMO_DATA.deskChecklist,
        dailyStream: Array.isArray(parsed.dailyStream)
          ? parsed.dailyStream.map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') {
                return {
                  id: item.id || `stream-${Date.now()}`,
                  time: typeof item.time === 'string' ? item.time : '',
                  text: typeof item.text === 'string' ? item.text : (item.content || item.title || String(item.text || '')),
                  tag: typeof item.tag === 'string' ? item.tag : ''
                };
              }
              return String(item || '');
            })
          : INITIAL_DEMO_DATA.dailyStream,
        polaroid: parsed.polaroid || DEFAULT_POLAROID,
        paperTone: (['cornflower', 'wisteria', 'matcha', 'cedar'].includes(parsed.paperTone) ? parsed.paperTone : 'cornflower') as PaperTone
      };
    }
  } catch (err) {
    console.error('Failed to parse localStorage life OS state:', err);
  }

  return {
    tickets: INITIAL_DEMO_DATA.tickets,
    heroTicketId: INITIAL_DEMO_DATA.heroTicketId,
    habits: INITIAL_DEMO_DATA.habits,
    intentions: INITIAL_DEMO_DATA.intentions,
    checkpoints: INITIAL_DEMO_DATA.checkpoints,
    journalNotes: INITIAL_DEMO_DATA.journalNotes,
    digest: INITIAL_DEMO_DATA.digest,
    deskChecklist: INITIAL_DEMO_DATA.deskChecklist,
    dailyStream: INITIAL_DEMO_DATA.dailyStream,
    polaroid: DEFAULT_POLAROID,
    paperTone: 'cornflower'
  };
};

export const loadInitialState = getInitialState;
export type SanctuaryState = LifeOSState;

export async function loadLiveState(uid: string): Promise<Partial<SanctuaryState>> {
  try {
    const [memoriesData, insightsData] = await Promise.allSettled([
      apiFetch<{ memories: Memory[] }>('/api/memories?limit=30'),
      apiFetch<InsightResponse>('/api/insights'),
    ]);

    const memories =
      memoriesData.status === 'fulfilled'
        ? memoriesData.value.memories
        : [];

    const insights =
      insightsData.status === 'fulfilled'
        ? insightsData.value
        : null;

    // Map backend memory objects → your existing journalNotes shape
    const journalNotes = memories.map((m) => ({
      id: m.id,
      title: m.title,
      body: m.summary,
      mood: m.moodLabel,
      themes: m.themes,
      createdAt: m.createdAt,
      bookColor: m.bookColor,
    }));

    // Map insights → your existing digest shape
    const digestPatch: Partial<SanctuaryDigest> = {
      ...(insights?.era && {
        wrappedTitle: insights.era.eraName,
        wrappedSubtitle: insights.era.description,
        habitPhilosophy: insights.era.whatIsShifting,
      }),
      ...(insights?.connectTheDots?.found && {
        deskPromptText: insights.connectTheDots.pattern,
      }),
    };

    return {
      journalNotes: journalNotes as any,
      digest: { ...INITIAL_DEMO_DATA.digest, ...digestPatch },
    };
  } catch (err) {
    // Graceful fallback — demo data still renders if API is down
    console.warn('[store] API unavailable, using demo data:', err);
    return loadInitialState();
  }
}

const LifeOSContext = createContext<LifeOSContextValue | null>(null);

export const LifeOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifeOSState>(getInitialState);

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [state]);

  // Intentions
  const addIntention = useCallback((text: string, category = 'General') => {
    setState((prev) => ({
      ...prev,
      intentions: [
        ...prev.intentions,
        {
          id: `int-${Date.now()}`,
          text,
          completed: false,
          category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }));
  }, []);

  const updateIntention = useCallback((id: string, updates: Partial<MindfulIntention>) => {
    setState((prev) => ({
      ...prev,
      intentions: prev.intentions.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    }));
  }, []);

  const deleteIntention = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      intentions: prev.intentions.filter((item) => item.id !== id)
    }));
  }, []);

  const toggleIntention = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      intentions: prev.intentions.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() } : item
      )
    }));
  }, []);

  // Tickets
  const addTicket = useCallback((stub: TicketStub) => {
    setState((prev) => ({
      ...prev,
      tickets: [stub, ...prev.tickets]
    }));
  }, []);

  const updateTicket = useCallback((id: string, updates: Partial<TicketStub>) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    }));
  }, []);

  const deleteTicket = useCallback((id: string) => {
    setState((prev) => {
      const remaining = prev.tickets.filter((t) => t.id !== id);
      const nextHeroId =
        prev.heroTicketId === id
          ? (remaining[0]?.id || '')
          : prev.heroTicketId;
      return {
        ...prev,
        tickets: remaining,
        heroTicketId: nextHeroId
      };
    });
  }, []);

  const updateHeroTicketImage = useCallback((newImageUrl: string) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === prev.heroTicketId ? { ...t, imageUrl: newImageUrl } : t
      )
    }));
  }, []);

  const updateTicketImage = useCallback((ticketId: string, newImageUrl: string) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === ticketId ? { ...t, imageUrl: newImageUrl } : t
      )
    }));
  }, []);

  const setAsHeroTicket = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      heroTicketId: id
    }));
  }, []);

  // Habits
  const addHabit = useCallback((habit: Partial<HabitItem> | HabitItem) => {
    const fullHabit: HabitItem = {
      id: habit.id || `habit-${Date.now()}`,
      title: habit.title || 'Untitled Ritual',
      subtitle: habit.subtitle || 'Gentle daily cadence',
      targetTime: habit.targetTime || '08:00 AM',
      category: habit.category || 'Mindfulness',
      icon: habit.icon || 'Flower2',
      theme: habit.theme || 'lavender',
      streak: habit.streak || 0,
      completedToday: habit.completedToday || false,
      heatmapMatrix: habit.heatmapMatrix || [
        [0, 1, 2, 0, 1, 3],
        [1, 2, 3, 2, 1, 0],
        [0, 0, 1, 2, 3, 1],
        [2, 3, 1, 0, 2, 2],
        [1, 2, 0, 3, 1, 0],
        [0, 1, 2, 1, 3, 2]
      ],
      weeklyDays: habit.weeklyDays || [
        { day: 'M', done: true },
        { day: 'T', done: true },
        { day: 'W', done: false },
        { day: 'T', done: true },
        { day: 'F', done: false },
        { day: 'S', done: true },
        { day: 'S', done: false, isToday: true }
      ],
      audioMemo: habit.audioMemo,
      createdAt: habit.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, fullHabit]
    }));
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<HabitItem>) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
      )
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id)
    }));
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          return {
            ...h,
            completedToday: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
            updatedAt: new Date().toISOString()
          };
        }
        return h;
      })
    }));
  }, []);

  // Checkpoints
  const addCheckpoint = useCallback((chk: Partial<CrawlCheckpoint> | CrawlCheckpoint) => {
    const fullChk: CrawlCheckpoint = {
      id: chk.id || `chk-${Date.now()}`,
      stepNumber: chk.stepNumber || 'POINT',
      title: chk.title || 'New Waypoint',
      location: chk.location || 'Kyoto',
      description: chk.description || '',
      imageUrl: chk.imageUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      status: chk.status || 'locked',
      distanceAway: chk.distanceAway,
      latLng: chk.latLng,
      hankoStampName: chk.hankoStampName || 'VERIFIED CHECK-IN',
      companionComment: chk.companionComment,
      audioCueTitle: chk.audioCueTitle,
      createdAt: chk.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setState((prev) => ({
      ...prev,
      checkpoints: [...prev.checkpoints, fullChk]
    }));
  }, []);

  const updateCheckpoint = useCallback((id: string, updates: Partial<CrawlCheckpoint>) => {
    setState((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    }));
  }, []);

  const deleteCheckpoint = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.filter((c) => c.id !== id)
    }));
  }, []);

  const stampCheckpoint = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.map((c) =>
        c.id === id ? { ...c, status: 'completed', hankoStampName: c.hankoStampName || 'VERIFIED CHECK-IN' } : c
      )
    }));
  }, []);

  // Journal Notes
  const addJournalNote = useCallback((note: Partial<JournalNote> | JournalNote) => {
    const fullNote: JournalNote = {
      id: note.id || `note-${Date.now()}`,
      title: note.title || 'Untitled Scrap',
      subtitle: note.subtitle || '',
      content: note.content || '',
      date: note.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tag: note.tag || 'Reflection',
      paperType: note.paperType || 'lined',
      paperTone: note.paperTone,
      location: note.location,
      mood: note.mood,
      imageUrl: note.imageUrl,
      companion: note.companion,
      quote: note.quote,
      audioTitle: note.audioTitle,
      linkedTicketId: note.linkedTicketId,
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setState((prev) => ({
      ...prev,
      journalNotes: [fullNote, ...prev.journalNotes]
    }));
  }, []);

  const updateJournalNote = useCallback((id: string, updates: Partial<JournalNote>) => {
    setState((prev) => ({
      ...prev,
      journalNotes: prev.journalNotes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    }));
  }, []);

  const deleteJournalNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      journalNotes: prev.journalNotes.filter((n) => n.id !== id)
    }));
  }, []);

  // Desk Checklist
  const addDeskChecklistItem = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      deskChecklist: [...prev.deskChecklist, { id: Date.now(), text, done: false }]
    }));
  }, []);

  const updateDeskChecklistItem = useCallback((id: number, text: string) => {
    setState((prev) => ({
      ...prev,
      deskChecklist: prev.deskChecklist.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    }));
  }, []);

  const toggleDeskChecklistItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      deskChecklist: prev.deskChecklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    }));
  }, []);

  const deleteDeskChecklistItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      deskChecklist: prev.deskChecklist.filter((item) => item.id !== id)
    }));
  }, []);

  // Stream Thoughts
  const addStreamThought = useCallback((thought: DailyStreamItem) => {
    setState((prev) => ({
      ...prev,
      dailyStream: [thought, ...prev.dailyStream]
    }));
  }, []);

  const deleteStreamThought = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      dailyStream: prev.dailyStream.filter((_, i) => i !== index)
    }));
  }, []);

  const deleteDailyStream = useCallback((target: string | number) => {
    setState((prev) => ({
      ...prev,
      dailyStream: typeof target === 'number'
        ? prev.dailyStream.filter((_, i) => i !== target)
        : prev.dailyStream.filter((item: any, i) => {
            if (typeof item === 'string') {
              return item !== target && `thought-${i}` !== target;
            }
            return item?.id !== target && item?.text !== target && `thought-${i}` !== target;
          })
    }));
  }, []);

  // Polaroid
  const updatePolaroid = useCallback((imageUrl: string, caption?: string) => {
    setState((prev) => ({
      ...prev,
      polaroid: {
        imageUrl,
        caption: caption !== undefined ? caption : prev.polaroid.caption
      }
    }));
  }, []);

  // Digest
  const updateDigest = useCallback((updates: Partial<SanctuaryDigest>) => {
    setState((prev) => ({
      ...prev,
      digest: { ...prev.digest, ...updates }
    }));
  }, []);

  // Paper Tone
  const setPaperTone = useCallback((tone: PaperTone) => {
    setState((prev) => ({
      ...prev,
      paperTone: tone
    }));
  }, []);

  // Global search across real state
  const searchEntities = useCallback(
    (query: string): SearchResultItem[] => {
      const raw = query.trim().toLowerCase();
      if (!raw) return [];

      // ─── Fuzzy scoring helper ──────────────────────────────────────────────
      // Returns 0-100. 100 = exact, 80 = starts-with, 60 = word-starts-with,
      // 40 = substring, 20 = fuzzy (all chars in order), 0 = no match.
      const scoreText = (text: string, q: string): number => {
        const t = text.toLowerCase();
        if (t === q) return 100;
        if (t.startsWith(q)) return 85;
        const words = t.split(/\s+/);
        if (words.some(w => w.startsWith(q))) return 65;
        if (t.includes(q)) return 45;
        // Fuzzy: all chars in order
        let qi = 0;
        for (let i = 0; i < t.length && qi < q.length; i++) {
          if (t[i] === q[qi]) qi++;
        }
        return qi === q.length ? 20 : 0;
      };

      // Score across multiple fields, take the max
      const fieldScore = (...fields: (string | undefined)[]): number => {
        let best = 0;
        for (const f of fields) {
          if (!f) continue;
          const s = scoreText(f, raw);
          if (s > best) best = s;
          // Multi-word query bonus
          const words = raw.split(/\s+/);
          if (words.length > 1) {
            const multiScore = words.reduce((acc, w) => acc + scoreText(f, w), 0) / words.length;
            if (multiScore > best) best = multiScore;
          }
        }
        return best;
      };

      const results: (SearchResultItem & { _score: number })[] = [];

      // Intentions
      state.intentions.forEach((item) => {
        const score = fieldScore(item.text, item.category);
        if (score > 0) {
          results.push({
            id: item.id, title: item.text,
            subtitle: item.completed ? 'Completed Intention' : 'Active Intention',
            type: 'intention', tab: 'sanctuary', meta: item.category, _score: score
          });
        }
      });

      // Tickets
      state.tickets.forEach((ticket) => {
        const score = fieldScore(ticket.title, ticket.subtitle, ticket.location, ticket.quote, ticket.category, ticket.companion);
        if (score > 0) {
          results.push({
            id: ticket.id, title: ticket.title,
            subtitle: `${ticket.location} • ${ticket.categoryLabel}`,
            type: 'ticket', tab: 'memories', meta: `Ticket #${ticket.stubNumber}`, _score: score
          });
        }
      });

      // Habits
      state.habits.forEach((habit) => {
        const score = fieldScore(habit.title, habit.subtitle, habit.category);
        if (score > 0) {
          results.push({
            id: habit.id, title: habit.title, subtitle: habit.subtitle,
            type: 'habit', tab: 'habits', meta: `${habit.streak}d streak`, _score: score
          });
        }
      });

      // Journal Notes
      state.journalNotes.forEach((note) => {
        const score = fieldScore(note.title, note.subtitle, note.content.slice(0, 200), note.tag, note.author, note.mood);
        if (score > 0) {
          results.push({
            id: note.id, title: note.title,
            subtitle: note.subtitle || note.content.slice(0, 50) + '…',
            type: 'journal', tab: 'journal', meta: note.date, _score: score
          });
        }
      });

      // Checkpoints
      state.checkpoints.forEach((chk) => {
        const score = fieldScore(chk.title, chk.location, chk.description);
        if (score > 0) {
          results.push({
            id: chk.id, title: chk.title, subtitle: chk.location,
            type: 'crawl', tab: 'crawls', meta: chk.stepNumber, _score: score
          });
        }
      });

      // Sort by score descending, cap at 25 results
      results.sort((a, b) => b._score - a._score);
      return results.slice(0, 25).map(({ _score, ...item }) => item);
    },
    [state]
  );




  const resetToSeedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setState({
      tickets: INITIAL_DEMO_DATA.tickets,
      heroTicketId: INITIAL_DEMO_DATA.heroTicketId,
      habits: INITIAL_DEMO_DATA.habits,
      intentions: INITIAL_DEMO_DATA.intentions,
      checkpoints: INITIAL_DEMO_DATA.checkpoints,
      journalNotes: INITIAL_DEMO_DATA.journalNotes,
      digest: INITIAL_DEMO_DATA.digest,
      deskChecklist: INITIAL_DEMO_DATA.deskChecklist,
      dailyStream: INITIAL_DEMO_DATA.dailyStream,
      polaroid: INITIAL_DEMO_DATA.polaroid,
      paperTone: 'cornflower'
    });
  }, []);

  const heroTicket =
    state.tickets.find((t) => t.id === state.heroTicketId) ||
    state.tickets[0] ||
    INITIAL_HERO_TICKET;

  const value: LifeOSContextValue = {
    tickets: state.tickets,
    heroTicket,
    habits: state.habits,
    intentions: state.intentions,
    checkpoints: state.checkpoints,
    crawlCheckpoints: state.checkpoints,
    journalNotes: state.journalNotes,
    digest: state.digest,
    deskChecklist: state.deskChecklist,
    dailyStream: state.dailyStream,
    polaroid: state.polaroid,
    paperTone: state.paperTone,

    setPaperTone,

    crawlBadges: INITIAL_CRAWL_BADGES,
    habitStamps: INITIAL_HABIT_STAMPS,
    vaultEnvelopes: INITIAL_VAULT_ENVELOPES,
    demoData: INITIAL_DEMO_DATA,

    addIntention,
    updateIntention,
    deleteIntention,
    toggleIntention,

    addTicket,
    updateTicket,
    deleteTicket,
    updateHeroTicketImage,
    updateTicketImage,
    setAsHeroTicket,

    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,

    addCheckpoint,
    addCrawlCheckpoint: addCheckpoint,
    updateCheckpoint,
    updateCrawlCheckpoint: updateCheckpoint,
    deleteCheckpoint,
    deleteCrawlCheckpoint: deleteCheckpoint,
    stampCheckpoint,
    stampCrawlCheckpoint: stampCheckpoint,

    addJournalNote,
    updateJournalNote,
    deleteJournalNote,

    addDeskChecklistItem,
    addDeskChecklist: addDeskChecklistItem,
    updateDeskChecklistItem,
    toggleDeskChecklistItem,
    toggleDeskChecklist: toggleDeskChecklistItem,
    deleteDeskChecklistItem,
    deleteDeskChecklist: deleteDeskChecklistItem,

    addStreamThought,
    addDailyStream: addStreamThought,
    deleteStreamThought,
    deleteDailyStream,

    updatePolaroid,
    updateDigest,

    searchEntities,
    resetToSeedData
  };

  return <LifeOSContext.Provider value={value}>{children}</LifeOSContext.Provider>;
};

export const useLifeOS = (): LifeOSContextValue => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
