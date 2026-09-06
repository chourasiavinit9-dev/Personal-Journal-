export type TabType = 'sanctuary' | 'memories' | 'crawls' | 'habits' | 'journal' | 'lockscreen' | 'wrapped' | 'zodiac';


export interface MindfulIntention {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketStub {
  id: string;
  stubNumber: string;
  category: 'travel' | 'cafe' | 'exhibition' | 'cinema' | 'rail';
  categoryLabel: string;
  title: string;
  subtitle: string;
  location: string;
  date: string;
  weather?: string;
  companion?: string;
  quote: string;
  fare?: string;
  imageUrl?: string;
  hankoStampText?: string;
  barcodeNumber: string;
  tapeStyle?: 'honey' | 'sage' | 'lilac' | 'gold' | 'default';
  audioTitle?: string;
  isHero?: boolean;
  favorite?: boolean;
  notes?: string;
  linkedJournalId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HabitItem {
  id: string;
  title: string;
  subtitle: string;
  targetTime: string;
  category: string;
  icon: string;
  theme: 'sky' | 'lavender' | 'emerald' | 'amber';
  streak: number;
  completedToday: boolean;
  heatmapMatrix: number[][]; // 6 rows of 6 values: 0 = none, 1 = light, 2 = medium, 3 = deep
  weeklyDays: { day: string; done: boolean; isToday?: boolean }[];
  audioMemo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrawlCheckpoint {
  id: string;
  stepNumber: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  status: 'completed' | 'active' | 'locked';
  distanceAway?: string;
  latLng?: string;
  hankoStampName?: string;
  companionComment?: {
    author: string;
    avatarUrl: string;
    text: string;
    timeAgo: string;
  };
  audioCueTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalNote {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  date: string;
  tag?: string;
  author?: string;
  completed?: boolean;
  paperType: 'lined' | 'grid' | 'torn' | 'scalloped' | 'felt';
  paperTone?: PaperTone;
  location?: string;
  mood?: string;
  imageUrl?: string;
  companion?: string;
  quote?: string;
  audioTitle?: string;
  linkedTicketId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SanctuaryDigest {
  title?: string;
  chapterSubtitle: string;
  headingPrefix: string;
  headingItalic: string;
  headingSuffix: string;
  intentionsTitle?: string;
  intentionsSubtitle?: string;
  energyReserves: string;
  flowFocus: string;
  todayCalendarEvent: string;
  calendarMonth: string;
  moonPhase: string;
  memoCode: string;
  memoMonth: string;
  memoText: string;
  memoTag: string;
  archetypeName: string;
  archetypeSubtitle: string;
  archetypeDescription: string;
  archetypeMatrixCode: string;
  archetypeTraits: string;
  curatedScrapsTitle: string;
  curatedScrapsPath: string;
  curatedScrap1Specimen: string;
  curatedScrap1Latin: string;
  curatedScrap1Text: string;
  curatedScrap2Quote: string;
  curatedScrap2Author: string;
  curatedScrap3Title: string;
  curatedScrap3Text: string;
  curatedScrap3Duration: string;
  deskPromptText?: string;
  lofiTrackTitle?: string;
  lofiTrackArtist?: string;

  // Crawl Passport fields
  crawlVol?: string;
  crawlTitle?: string;
  crawlSubtitle?: string;
  crawlDropCountdown?: string;
  crawlFeaturedTitle?: string;
  crawlFeaturedDescription?: string;
  crawlFeaturedArea?: string;
  crawlFeaturedDistance?: string;
  crawlCommunityTravelers?: string;
  crawlCommunityEvent?: string;

  // Habit Garden fields
  habitTitle?: string;
  habitSubtitle?: string;
  habitPhilosophy?: string;

  // Memories Vault fields
  vaultBoxName?: string;
  vaultBoxSubtitle?: string;
  vaultShelfCode?: string;
  vaultWoodType?: string;

  // Header & Archivist
  archivistInitials?: string;

  // Lockscreen fields
  lockscreenCarrier?: string;
  lockscreenMicroSeason?: string;
  lockscreenSolarSeason?: string;
  lockscreenWeather?: string;
  weather?: string;
  lockscreenCityWeatherLabel?: string;
  lockscreenTrack?: string;
  lockscreenAlbum?: string;
  hankoKanji?: string;
  hankoCity?: string;
  lockscreenStorageFooter?: string;

  // Year Wrapped fields
  wrappedVol?: string;
  wrappedTitle?: string;
  wrappedSubtitle?: string;
  wrappedHeadline?: string;
  wrappedSubheadline?: string;
  wrappedCitiesWalked?: string;
  wrappedMinsTapes?: string;
  wrappedArchivalHeading?: string;
  wrappedCertificateTitle?: string;
  wrappedCertificateText?: string;
  wrappedCertificateQuote?: string;
  wrappedCertifiedDays?: string;
  wrappedPresenceQuotient?: string;
  wrappedHankoTop?: string;
  wrappedHankoCenter?: string;
  wrappedHankoBottom?: string;
}

export interface CrawlBadge {
  id: string;
  name: string;
  subtitle: string;
  badgeType: 'bamboo' | 'coffee' | 'book' | 'hanko';
  rotation: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

export interface HabitStamp {
  id: string;
  emoji: string;
  title: string;
  streakLabel: string;
}

export interface VaultEnvelope {
  id: string;
  emoji: string;
  title: string;
  info: string;
  bg: string;
}

export interface LockscreenPack {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  category: string;
  colorName: string;
  headerColorClass: string;
  accentColor: string;
  headerTextDark?: boolean;
  rating: string;
  reviews: string;
  wallpaperUrl: string;
  audioTrack: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'intention' | 'ticket' | 'habit' | 'journal' | 'crawl';
  tab: TabType;
  meta?: string;
}

export type DailyStreamItem = string | { id?: string | number; time?: string; text: string; tag?: string };

export type PaperTone = 'cornflower' | 'wisteria' | 'matcha' | 'cedar';

export interface ZodiacBirthData {
  date: string;     // YYYY-MM-DD
  time?: string;    // HH:MM (24h, optional)
  city?: string;    // free text, optional
}

