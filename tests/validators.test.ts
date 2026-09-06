import { describe, it, expect } from 'vitest';
import { MemoryOutputSchema, MOOD_LABELS } from '../backend/src/schemas/geminiOutput.schema.js';

const validMemory = {
  title: 'The morning everything clicked',
  summary: 'Had a breakthrough on the project. Finally understood the pattern.',
  moodLabel: 'joyful',
  moodScore: 8,
  themes: ['clarity', 'building', 'momentum'],
  people: ['Priya'],
  locationHint: 'Café Coffee Day, Kolkata',
  importantMoment: 'The moment I stopped overthinking and just built.',
  actionItem: 'Ship the yap feature by Friday.',
  companionReaction: 'That sounds like a real turning point.',
  bookColor: '#7eb8f7',
  bookHeight: 85,
};

describe('MemoryOutputSchema — valid inputs', () => {
  it('accepts a fully valid memory object', () => {
    const result = MemoryOutputSchema.safeParse(validMemory);
    expect(result.success).toBe(true);
  });

  it('accepts memory with null optional fields', () => {
    const result = MemoryOutputSchema.safeParse({
      ...validMemory,
      locationHint: null,
      importantMoment: null,
      actionItem: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts all valid moodLabel values', () => {
    MOOD_LABELS.forEach((mood) => {
      const result = MemoryOutputSchema.safeParse({ ...validMemory, moodLabel: mood });
      expect(result.success).toBe(true);
    });
  });
});

describe('MemoryOutputSchema — invalid inputs', () => {
  it('rejects missing title', () => {
    const { title: _, ...rest } = validMemory;
    expect(MemoryOutputSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects invalid moodLabel', () => {
    const result = MemoryOutputSchema.safeParse({ ...validMemory, moodLabel: 'vibes' });
    expect(result.success).toBe(false);
  });

  it('rejects moodScore out of range', () => {
    expect(MemoryOutputSchema.safeParse({ ...validMemory, moodScore: 11 }).success).toBe(false);
    expect(MemoryOutputSchema.safeParse({ ...validMemory, moodScore: 0 }).success).toBe(false);
  });

  it('rejects invalid hex bookColor', () => {
    const result = MemoryOutputSchema.safeParse({ ...validMemory, bookColor: 'blue' });
    expect(result.success).toBe(false);
  });

  it('rejects bookHeight out of range', () => {
    expect(MemoryOutputSchema.safeParse({ ...validMemory, bookHeight: 200 }).success).toBe(false);
    expect(MemoryOutputSchema.safeParse({ ...validMemory, bookHeight: 10 }).success).toBe(false);
  });

  it('rejects empty themes array', () => {
    const result = MemoryOutputSchema.safeParse({ ...validMemory, themes: [] });
    expect(result.success).toBe(false);
  });

  it('rejects title longer than 200 chars', () => {
    const result = MemoryOutputSchema.safeParse({ ...validMemory, title: 'x'.repeat(201) });
    expect(result.success).toBe(false);
  });
});
