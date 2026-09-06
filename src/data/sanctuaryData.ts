import { TicketStub, HabitItem, CrawlCheckpoint, JournalNote, LockscreenPack } from '../types';

export const INITIAL_TICKETS: TicketStub[] = [
  {
    id: 'stub-ghibli',
    stubNumber: '0048',
    category: 'exhibition',
    categoryLabel: 'HERITAGE PRESERVE ADMISSION',
    title: 'Ghibli Park & The Great Warehouse',
    subtitle: "Howl's Moving Castle in the early spring mist",
    location: 'Nagakute, Aichi Prefecture',
    date: '2025.04.18',
    weather: 'Sun • 21°C',
    companion: 'Kenji T.',
    quote: 'The wind smelled like pine sap and damp gravel. We waited forty minutes by the cat-bus shelter just watching the clouds move past the copper turrets.',
    fare: 'ADMIT ONE',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5uzPi4ZhHJR9S2px5Xy58fbuNjXh7HRhJ5yBvRgDTXJDmmTBtV5tWVidEJbv_u4hKT4cNfgZumrVCCGpXHE_qDvfqLzGS8GYpwatldgYW70wErX_Z74piI0n96V1d20g5Hk2uSiVWUSBy7czt3Frt0XPebXV5H077q1e9IpPa6_3GT8MUpPv2-H45LNoDPJ674phvgi9KCKA87n_LlxKrd6qsFbJUPhx5XvtUnLnkcxyj5zRkPC_jYg',
    hankoStampText: 'ARCHIVED 入場済',
    barcodeNumber: 'STUB-2025-0418-883492',
    tapeStyle: 'honey',
    audioTitle: 'Nagakute Valley Birds & Clock Bell',
    isHero: true,
  },
  {
    id: 'stub-hakone',
    stubNumber: '0047',
    category: 'rail',
    categoryLabel: 'Mountain Railway Pass',
    title: 'Hakone Tozan Switchback',
    subtitle: 'Miyanoshita → Gora Summit',
    location: 'Hakone, Kanagawa',
    date: '2025.03.22',
    weather: 'Mist • 14°C',
    companion: 'Solitary Walk',
    quote: 'Hydrangeas in bloom along the steep rails. We smelled sulfur and cold fern.',
    fare: 'FARE ¥460 PAID',
    barcodeNumber: 'STUB #047 // CAR 03 SEAT 14A',
    tapeStyle: 'default',
  },
  {
    id: 'stub-orangerie',
    stubNumber: '0046',
    category: 'exhibition',
    categoryLabel: 'Paris National Gallery',
    title: "Musée de l'Orangerie",
    subtitle: 'Jardin des Tuileries • Water Lilies Room',
    location: 'Paris, France',
    date: '2025.02.14',
    weather: 'Overcast • 9°C',
    companion: 'Elena Vance',
    quote: "Sat in the oval room for nearly an hour. Light shifting on Monet's willows.",
    fare: 'SALLE 01 PASS',
    barcodeNumber: 'STUB #046 // ADMIT ONE',
    tapeStyle: 'lilac',
  },
  {
    id: 'stub-cinema-orion',
    stubNumber: '0045',
    category: 'cinema',
    categoryLabel: 'Midnight Screening',
    title: 'Cinéma Orion — Chungking Express',
    subtitle: 'Row G, Seat 12 • 23:45 PM',
    location: 'Kyoto Alley',
    date: '2025.01.30',
    weather: 'Cold Rain • 4°C',
    companion: 'Maya & Ren',
    quote: "Rain beating on the cinema glass dome. California Dreamin' on full volume.",
    fare: 'TICKET NO. 091',
    barcodeNumber: 'CAN OF PINEAPPLES MAY 1',
    tapeStyle: 'gold',
  },
  {
    id: 'stub-shinjuku-greenhouse',
    stubNumber: '0044',
    category: 'travel',
    categoryLabel: 'Conservatory Entry',
    title: 'Shinjuku Gyoen Warm Glasshouse',
    subtitle: 'Tropical Orchids & Water Basin',
    location: 'Tokyo, Japan',
    date: '2025.01.12',
    weather: 'Winter Sun • 7°C',
    companion: 'Solitary Walk',
    quote: 'Escaped the January freezing wind into 26°C jungle humidity and giant palms.',
    fare: 'LEAF SEAL OK',
    barcodeNumber: 'STUB #044 // GREENHOUSE 2',
    tapeStyle: 'sage',
  },
  {
    id: 'stub-bar-martha',
    stubNumber: '0043',
    category: 'cafe',
    categoryLabel: 'Analog Sound Cafe',
    title: 'Bar Martha & Jazz Kissa',
    subtitle: 'Ebisu, Tokyo • Garrard 301 Turntable',
    location: 'Ebisu, Tokyo',
    date: '2024.12.28',
    weather: 'Night • 3°C',
    companion: 'Elena Vance',
    quote: 'Track: Bill Evans "Waltz for Debby". Smoked peat whiskey and absolute quiet.',
    fare: 'SLIP #MARTHA-109',
    barcodeNumber: 'TABLE 04 • SOLITARY',
    tapeStyle: 'honey',
  },
  {
    id: 'stub-fushimi',
    stubNumber: '0042',
    category: 'travel',
    categoryLabel: 'Mountain Trail',
    title: 'Fushimi Inari Dawn Pilgrimage',
    subtitle: 'Yotsutsuji Crossroads • Elev. 233m',
    location: 'Kyoto, Japan',
    date: '2024.11.19',
    weather: 'Dawn Fog • 11°C',
    companion: 'Kenji Takahashi',
    quote: '05:30 AM before the tour buses. Only crows, cedar incense, and the morning bell.',
    fare: 'SUMMIT STAMP: VERIFIED',
    barcodeNumber: 'STUB #042 // EARLY PASS',
    tapeStyle: 'default',
  }
];

export const INITIAL_HERO_TICKET: TicketStub = INITIAL_TICKETS[0];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'habit-matcha',
    title: 'Morning Matcha Whisk & Breath',
    subtitle: 'Mindful nourishment • 20 whisks facing morning light',
    targetTime: '07:15 AM',
    category: 'Mindful Nourishment',
    icon: '🍵',
    theme: 'sky',
    streak: 14,
    completedToday: true,
    heatmapMatrix: [
      [1, 2, 3, 2, 3, 1],
      [2, 3, 3, 2, 3, 2],
      [2, 3, 3, 3, 3, 1],
      [1, 2, 3, 3, 2, 2],
      [3, 3, 1, 3, 3, 3],
      [2, 3, 3, 2, 3, 0]
    ],
    weeklyDays: [
      { day: 'Su', done: true },
      { day: 'Mo', done: true },
      { day: 'Tu', done: true },
      { day: 'We', done: true },
      { day: 'Th', done: true, isToday: true },
      { day: 'Fr', done: false },
      { day: 'Sa', done: false }
    ],
    audioMemo: 'whisking_sencha_0715.wav'
  },
  {
    id: 'habit-ferns',
    title: 'Balcony Ferns & Somatic Stretch',
    subtitle: 'Somatic movement • 15 min gentle breathwork',
    targetTime: '08:00 AM',
    category: 'Somatic Movement',
    icon: '🌿',
    theme: 'lavender',
    streak: 9,
    completedToday: true,
    heatmapMatrix: [
      [1, 2, 3, 1, 3, 2],
      [2, 3, 3, 2, 2, 3],
      [1, 3, 3, 3, 3, 1],
      [2, 2, 3, 3, 2, 1],
      [1, 3, 3, 3, 2, 3],
      [2, 3, 3, 2, 3, 0]
    ],
    weeklyDays: [
      { day: 'Su', done: true },
      { day: 'Mo', done: true },
      { day: 'Tu', done: true },
      { day: 'We', done: true },
      { day: 'Th', done: true, isToday: true },
      { day: 'Fr', done: false },
      { day: 'Sa', done: false }
    ],
    audioMemo: 'balcony_wind_birds.wav'
  },
  {
    id: 'habit-incense',
    title: 'Evening Cedar Incense & Offline Reading',
    subtitle: 'Digital sunset • 30 mins paperback reading by 2400K lamp',
    targetTime: '09:30 PM',
    category: 'Digital Sunset',
    icon: '🪵',
    theme: 'emerald',
    streak: 18,
    completedToday: false,
    heatmapMatrix: [
      [2, 3, 3, 3, 2, 1],
      [2, 3, 3, 3, 2, 1],
      [3, 3, 3, 2, 2, 1],
      [3, 3, 3, 2, 2, 1],
      [2, 3, 3, 3, 3, 2],
      [2, 3, 3, 2, 0, 0]
    ],
    weeklyDays: [
      { day: 'Su', done: true },
      { day: 'Mo', done: true },
      { day: 'Tu', done: true },
      { day: 'We', done: true },
      { day: 'Th', done: false, isToday: true },
      { day: 'Fr', done: false },
      { day: 'Sa', done: false }
    ],
    audioMemo: 'cedar_smoke_night.wav'
  },
  {
    id: 'habit-audio-journal',
    title: 'Sensory Audio Journal & Sound Log',
    subtitle: 'Daily reflection • 3-minute voice memo of gratitude',
    targetTime: '11:20 AM',
    category: 'Daily Reflection',
    icon: '🎙️',
    theme: 'amber',
    streak: 7,
    completedToday: true,
    heatmapMatrix: [
      [2, 2, 3, 3, 2, 1],
      [2, 3, 3, 3, 2, 1],
      [3, 3, 3, 2, 2, 1],
      [3, 3, 3, 2, 2, 1],
      [2, 3, 3, 3, 3, 2],
      [2, 3, 3, 2, 3, 0]
    ],
    weeklyDays: [
      { day: 'Su', done: true },
      { day: 'Mo', done: true },
      { day: 'Tu', done: true },
      { day: 'We', done: true },
      { day: 'Th', done: true, isToday: true },
      { day: 'Fr', done: false },
      { day: 'Sa', done: false }
    ],
    audioMemo: 'memo_04_04.wav'
  }
];

export interface MindfulIntention {
  id: string;
  text: string;
  completed: boolean;
}

export const INITIAL_INTENTIONS: MindfulIntention[] = [
  { id: 'int-1', text: 'Morning pour-over coffee in balcony silence', completed: true },
  { id: 'int-2', text: 'Photograph the golden hour shadows on paper', completed: true },
  { id: 'int-3', text: 'Draft Chapter 3: Architectural wanderings', completed: false },
  { id: 'int-4', text: 'Collect pressed gingko leaves from botanical garden', completed: false },
  { id: 'int-5', text: "Read 25 pages of Tanizaki's In Praise of Shadows", completed: false }
];

export const INITIAL_CRAWL_CHECKPOINTS: CrawlCheckpoint[] = [
  {
    id: 'chk-1',
    stepNumber: 'Waypoint 01',
    title: 'Ogawa Siphon & Matcha Parlor',
    location: 'Sanjo-dori, Nakagyo Ward',
    description: 'Wood-paneled siphon counter, dark roast siphon, and quiet steam rising under vintage copper shades.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNB34ESDQ8IbRNLn2M17xXqrOPJWHq28sp71Nsgoj-JmZVcNnjbjHDIPW-EgtI2cg-OBMrr7miujwikwMMvO7IgUgqpTpvD-nIZ49sTEoNQJko44YyobtERdECdHvKLO7IWY9bO3TXV5VgmPNCLMgCmuVullyLYPZCR1wzeuJkRViEBvKI915a06El5FNt4Hzy4OPU-0H8oUdcL6q53KRsyABhpo18rvRSjstC4uAYuBG_sNF9BMNCYw',
    status: 'completed',
    hankoStampName: 'OGAWA CRAFT CHECKED IN',
    companionComment: {
      author: 'Elena',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNB34ESDQ8IbRNLn2M17xXqrOPJWHq28sp71Nsgoj-JmZVcNnjbjHDIPW-EgtI2cg-OBMrr7miujwikwMMvO7IgUgqpTpvD-nIZ49sTEoNQJko44YyobtERdECdHvKLO7IWY9bO3TXV5VgmPNCLMgCmuVullyLYPZCR1wzeuJkRViEBvKI915a06El5FNt4Hzy4OPU-0H8oUdcL6q53KRsyABhpo18rvRSjstC4uAYuBG_sNF9BMNCYw',
      text: 'Ordered the Kyoto dark roast siphon & matcha roll!',
      timeAgo: '10m ago'
    },
    audioCueTitle: 'Siphon Boiling Murmur & Ceramic Clink'
  },
  {
    id: 'chk-2',
    stepNumber: 'Waypoint 02',
    title: 'Maruzen Alleyway & Ink Bookshop',
    location: 'Higashiyama Alleyway',
    description: 'Old vintage editions, amber lanterns, cedar shelves packed with art books and fountain pen inks.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBkmfgNe4nphd_0bt-CbeffvDFX3gt5RJE5kfkfO2Ybl5gqrBYg6eQhA-y1sTBScA-gJIlv6CsDAjw8wh54gwCmaAPijwhd4p_BpgrTrT_Ny_ejhWhilxpQDK4eS-N-WMHav1ZaaIdxh68gPWWJ05fJfAOpgfknGEq9Y4ljlpK8IETcpIrhhiwZopOL5d-6NQboSllfMOugSCp8COqoVlgQbafn6B-VuRafW49-Nsk1rM-LrA0B1ksrA',
    status: 'active',
    distanceAway: '45m Away',
    latLng: '35.0037° N, 135.7702° E',
    hankoStampName: 'MARUZEN INK SEAL',
    audioCueTitle: 'Alley Wind Chimes & Paper Rustle'
  },
  {
    id: 'chk-3',
    stepNumber: 'Waypoint 03',
    title: 'Daitoku-ji Moss & Zen Courtyard',
    location: 'Kita Ward, Kyoto',
    description: 'Raked gravel sea, bamboo whispers, and the 400-year stone lantern framed by maple branches.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8enhGIEeXzv_dtuKPkdy28HlO_Q-6Vh9TeGwlh0Wj9BZct2iOGSZG0cB87rmZEB_SStVyyYqRwSD4Iy92OMWEY9sQmnAHKXxDutSxB9tyrmbdnSc4SPgwhRW34VDkC1d0VJ41BA1LaiimKVN-Epg2QDTeXRj7bPrtvWCfTLiSUAwzF6HE3fAect9B8fXqL1eXcGk9p26ITMxLRT9hhN0PwyWnDMa93tKZk2sXdPjrHHwdRy4hjNevYA',
    status: 'locked',
    distanceAway: 'Unlocks in 350m',
    latLng: '35.0441° N, 135.7447° E',
    hankoStampName: 'ZEN COURTYARD HANKO'
  }
];

export const LOCKSCREEN_PACKS: LockscreenPack[] = [
  {
    id: 'pack-wisteria',
    name: 'Spring Wisteria Cafe',
    subtitle: 'Tea room, wisteria awning',
    tagline: 'Do you want to go and get a coffee',
    category: 'Quiet Cafes',
    colorName: 'Lilac Bloom',
    headerColorClass: 'bg-[#dcd3f0]',
    accentColor: '#7b6b98',
    headerTextDark: true,
    rating: '4.9 ★',
    reviews: '840 saves',
    wallpaperUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-RCD7hEKsaMd_LV0xMoxJf3IUtzh4ZQGxXcfDRpjZPd9vRm-AWVCPbJ7qSWqYR1i86khVU_x_Ca7NquMl8KGSjMEYRfTQVjKOxOXwPbftsVhnfd6SMS-A-7gvY3wQhmrWUtL4Umj1JcYauxLNVIHH0zUQTH4MduBil7YVjo3rEWHYrXjERKZiKc9w_NTH76HRYdznNUvx6u3O-W5Dbiqu2QaO42OYQBW28BWjZx7J6Zempu82ZJBIOQ',
    audioTrack: 'Gentle Kyoto Eaves Rain · 432Hz Ambient White Noise'
  },
  {
    id: 'pack-willow',
    name: 'The Willow & Paper Co.',
    subtitle: 'Bookshop, cobblestone lane',
    tagline: 'Stationery and slow handwritten letters',
    category: 'Bookstores',
    colorName: 'Willow Matcha',
    headerColorClass: 'bg-[#d5e7d5]',
    accentColor: '#567a5b',
    headerTextDark: true,
    rating: '4.8 ★',
    reviews: '620 saves',
    wallpaperUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3b3d6z8GqjIs019h_bRkCmz5AkIjXptjv3cSvqG7eEEB5Yb1riXy2owG-KQEUx_ka2LXnLNV_Hw5-LqO4D43lpGtvm-5W9z0XzTR1RXtesm7tgiiPEtwyFibrjGE27EH2KzN_Bm_3lDxxQT4IGM2fAlhD7xr6JpQBeUtcWHGido8eA73y6oQf02HDnUvNksGdfE-2_6LwLLdRFghA92kz3H0XwH402EfaE08PEZIaXi2KRhXIHLPiBA',
    audioTrack: 'Willow Breeze & Temple Windchimes'
  },
  {
    id: 'pack-matcha-cafe',
    name: 'Kyoto Matcha Artisan',
    subtitle: 'Ceramic cups & roasted hojicha',
    tagline: 'Old timber storefronts in morning drizzle',
    category: 'Quiet Cafes',
    colorName: 'Matcha Mist',
    headerColorClass: 'bg-[#d8e5f3]',
    accentColor: '#3b5c87',
    headerTextDark: true,
    rating: '5.0 ★',
    reviews: '1.2k saves',
    wallpaperUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9HIODm3KQ5z9TPi5o8g5-7U3uvsKWswmSZFBoXCtICYz2msAKHZjl22Rg9z353wPKfLfg4HkKW4YHQhN0JyWXzBSSY3ENA7ekQxsfbkiUxILamz99e7mXwYhO12MMy7WDc0aGeZZOJmaQoIdYusfHgy4TOpB60LNCsVl74MjV3-aHjH1me16L__V_AKrvw9ZdTtgLZvBuTxpnsdNnI6ivUraLFpxO5BxWZU0fhdwH_AdIkRlgZ-0KGA',
    audioTrack: 'Kyoto Rain on Cedar Shingles'
  },
  {
    id: 'pack-bakery',
    name: 'Spring Day Bakery',
    subtitle: 'Warm croissant & linen awnings',
    tagline: 'Warm butter and fresh brioche scent',
    category: 'Pastel Sky',
    colorName: 'Dusty Rose',
    headerColorClass: 'bg-[#f7d6d7]',
    accentColor: '#995963',
    headerTextDark: true,
    rating: '4.9 ★',
    reviews: '780 saves',
    wallpaperUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-RCD7hEKsaMd_LV0xMoxJf3IUtzh4ZQGxXcfDRpjZPd9vRm-AWVCPbJ7qSWqYR1i86khVU_x_Ca7NquMl8KGSjMEYRfTQVjKOxOXwPbftsVhnfd6SMS-A-7gvY3wQhmrWUtL4Umj1JcYauxLNVIHH0zUQTH4MduBil7YVjo3rEWHYrXjERKZiKc9w_NTH76HRYdznNUvx6u3O-W5Dbiqu2QaO42OYQBW28BWjZx7J6Zempu82ZJBIOQ',
    audioTrack: 'Morning Baker Bells & Radio Jazz'
  }
];

export const JOURNAL_SCRAPS: JournalNote[] = [
  {
    id: 'note-1',
    title: 'Solitude in the Temple Rains',
    subtitle: 'Volume IV • Kyoto',
    content: "I spent the third hour of the morning sitting on the veranda at Ryoan-ji. The rain drops fell from the cedar eaves in rhythmic, metronomic cadences. Each droplet created small concentric ripple rings across the raked gravel sea.",
    date: 'OCT 24',
    tag: 'Kyoto Autumn',
    author: 'Elena Vance',
    paperType: 'grid'
  },
  {
    id: 'note-2',
    title: 'In Praise of Shadows Passage',
    content: "We find beauty not in the thing itself, but in the patterns of shadows, the light and the dark, that one thing against another creates.",
    date: 'SEPT 2026',
    author: "Jun'ichirō Tanizaki",
    paperType: 'felt'
  },
  {
    id: 'note-3',
    title: 'Tea Ceremony Water Notes',
    content: "Water heated just before boil (80°C). First infusion 45 seconds. Gentle sweet umami note at the finish.",
    date: 'MAY 2026',
    tag: 'Uji Gyokuro',
    author: 'Self',
    paperType: 'lined'
  }
];

export const INITIAL_JOURNAL_NOTES: JournalNote[] = JOURNAL_SCRAPS;

export interface DeskChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

export const INITIAL_DESK_CHECKLIST: DeskChecklistItem[] = [
  { id: 1, text: 'Morning sencha tea at wooden bench', done: true },
  { id: 2, text: 'Scan Kyoto vintage stamp receipt', done: true },
  { id: 3, text: 'Clean Pentel brush pen nibs', done: true },
  { id: 4, text: 'Press blue hydrangea petals into journal', done: false },
  { id: 5, text: 'Record evening bell from Nanzen-ji', done: false }
];

export const INITIAL_DAILY_STREAM: string[] = [
  'Rain starting to fall against the bamboo screen. The scent of damp cedar fills the room.',
  'Found an old book of woodblock prints at Higashiyama market. The indigo shades are still deep and vibrant.'
];

export const INITIAL_SANCTUARY_DIGEST = {
  chapterSubtitle: 'Chapter Autumn, Issue 14 — Weekly Digest',
  headingPrefix: 'The art of slow',
  headingItalic: 'living',
  headingSuffix: '& daily notes.',
  intentionsTitle: 'Gentle Intentions',
  intentionsSubtitle: 'Morning Grounding',
  energyReserves: '84% • Balanced',
  flowFocus: '3h 42m Active',
  todayCalendarEvent: 'Today: Tea ceremony at Nanzen-ji',
  calendarMonth: 'May 2026',
  moonPhase: 'New Moon',
  memoCode: 'MEMO_094.TXT',
  memoMonth: 'SEPT 2026',
  memoText: 'Notice how the early morning sun paints rhomboids of honey across the cedar floorboards. Stay here for five more breaths.',
  memoTag: 'Journal snippet',
  archetypeName: 'The Solitary Flâneur',
  archetypeSubtitle: 'Deep Solitude • Visual Curator • High Sensitivity',
  archetypeDescription: 'You observe the city in poetry. Rather than chasing the rush, you curate silent cafes, collector tickets, and light streaming across old book covers.',
  archetypeMatrixCode: '+ ENVC +',
  archetypeTraits: 'Observation • Solitude • Wabi-Sabi',
  curatedScrapsTitle: 'curated_scraps_2026/',
  curatedScrapsPath: 'sanctuary://journal/visual-drafts',
  curatedScrap1Specimen: 'Specimen No. 12',
  curatedScrap1Latin: 'Ginkgo biloba',
  curatedScrap1Text: 'Collected on northern slope. Golden leaf edges drying cleanly.',
  curatedScrap2Quote: 'We find beauty not in the thing itself, but in the patterns of shadows, the light and the dark, that one thing against another creates.',
  curatedScrap2Author: "Jun'ichirō Tanizaki",
  curatedScrap3Title: 'AMBIENCE_CAPTURE',
  curatedScrap3Text: 'Recorded near Kamogawa River before sunrise.',
  curatedScrap3Duration: '42 mins of gentle brook murmur',
  deskPromptText: 'The late afternoon sunlight hit the wet tatami mats in long golden slivers. Outside, the rain cleared into crisp cold air smelling of charred wood and wet moss.',
  lofiTrackTitle: 'Rainy Greenhouse & Lo-fi Piano',
  lofiTrackArtist: 'Komorebi Sounds • Kyoto Rain Tape',

  // Crawl Passport dynamic content
  crawlVol: '✦ Route Collection · Vol. 03',
  crawlTitle: 'Tour the city on local crawls & stories',
  crawlSubtitle: 'Collectible neighborhood journeys, tactile stamp checkpoints, and quiet photo spots handpicked by local curators.',
  crawlDropCountdown: 'Drops in 12d 2h 46m',
  crawlFeaturedTitle: 'The Old Kyoto Craft Crawl',
  crawlFeaturedDescription: 'Meander through wood-paneled siphon bars, independent letterpress shops, and quiet stone temple paths.',
  crawlFeaturedArea: 'Higashiyama & Gion',
  crawlFeaturedDistance: '~3.2 km',
  crawlCommunityTravelers: '14 Sanctuary Travelers on this Crawl',
  crawlCommunityEvent: 'Join group tea at Daitoku-ji Gate • 4:30 PM',

  // Habit Garden dynamic content
  habitTitle: 'Mindful Habit Cadence & Activity Heatmaps',
  habitSubtitle: 'Inspired by tactile physical ledgers. Cultivate somatic presence, micro-habits, and rhythmic consistency without digital overwhelm.',
  habitPhilosophy: 'Editorial Philosophy: Rhythms are designed to be forgiving. Skipping a day does not break your cadence; it merely preserves space for intuitive restoration.',

  // Memories Vault dynamic content
  vaultBoxName: 'Wooden Scrapbook Box 04',
  vaultBoxSubtitle: 'Late Autumn to Spring Ephemera, Travel Receipts, and Ticket Slips.',
  vaultShelfCode: 'BOX #04 / SHELF A2',
  vaultWoodType: 'KYOTO PAULOWNIA WOOD',

  // Header & Archivist
  archivistInitials: 'EA',

  // Lockscreen dynamic content
  lockscreenCarrier: 'KYOTO CELL',
  lockscreenMicroSeason: '霜降 · FROST DESCENDS',
  lockscreenSolarSeason: '霜降 · FROST DESCENDS',
  lockscreenWeather: '18°C · Drizzle',
  weather: '18°C · Drizzle',
  lockscreenCityWeatherLabel: 'KYOTO WEATHER',
  lockscreenTrack: 'Haruomi Hosono — Philharmony',
  lockscreenAlbum: 'Morning Coffee & Rain',
  hankoKanji: '祇園',
  hankoCity: 'KYOTO',
  lockscreenStorageFooter: 'Kyoto Paulownia Vault • Encrypted Local Storage',

  // Year Wrapped dynamic content
  wrappedVol: 'Annual Retrospective • Vol. 2025',
  wrappedHeadline: 'Your Year in Tactile Solitude & Wonder',
  wrappedTitle: 'Your Year in Tactile Solitude & Wonder',
  wrappedSubheadline: 'A tactile chronicle of the tickets you kept, the teas you whisked, and the alleyways where time slowed down.',
  wrappedSubtitle: 'A tactile chronicle of the tickets you kept, the teas you whisked, and the alleyways where time slowed down.',
  wrappedCitiesWalked: '14',
  wrappedMinsTapes: '81',
  wrappedArchivalHeading: 'ARCHIVAL CERTIFICATION • SANCTUARY LIFE OS',
  wrappedCertificateTitle: 'Certificate of Mindful Living 2025',
  wrappedCertificateText: 'Granted to the keeper of this scrapbook, who observed each day with quiet intention, gathered tactile memory slips, and protected stillness in a fast world.',
  wrappedCertificateQuote: 'Granted to the keeper of this scrapbook, who observed each day with quiet intention, gathered tactile memory slips, and protected stillness in a fast world.',
  wrappedCertifiedDays: '365 / 365',
  wrappedPresenceQuotient: '98.4%',
  wrappedHankoTop: '京都市保全',
  wrappedHankoCenter: '聖域領主',
  wrappedHankoBottom: 'OFFICIALLY SEALED 2025'
};

import { CrawlBadge, HabitStamp, VaultEnvelope } from '../types';

export const INITIAL_CRAWL_BADGES: CrawlBadge[] = [
  {
    id: 'badge-1',
    name: 'Sagano',
    subtitle: 'Bamboo Pass',
    badgeType: 'bamboo',
    rotation: '-rotate-3',
    bgColor: '#EBE6DC',
    textColor: '#486349'
  },
  {
    id: 'badge-2',
    name: 'KISSATEN',
    subtitle: 'COFFEE CRAWL',
    badgeType: 'coffee',
    rotation: 'rotate-3',
    bgColor: '#ECD4BC',
    textColor: '#964F26',
    borderColor: '#B87C4C'
  },
  {
    id: 'badge-3',
    name: 'HONDA',
    subtitle: 'OLD BOOKS',
    badgeType: 'book',
    rotation: 'rotate-0',
    bgColor: '#395346',
    textColor: '#E8F0EB'
  },
  {
    id: 'badge-4',
    name: 'Gion',
    subtitle: 'KYOTO 2026',
    badgeType: 'hanko',
    rotation: '-rotate-2',
    bgColor: '#F8E5E5',
    textColor: '#C86D51'
  }
];

export const INITIAL_HABIT_STAMPS: HabitStamp[] = [
  { id: 'stamp-1', emoji: '🍵', title: 'Matcha Flow', streakLabel: '14d Streak' },
  { id: 'stamp-2', emoji: '🌿', title: 'Dawn Walker', streakLabel: 'Equinox Anchor' },
  { id: 'stamp-3', emoji: '🪵', title: 'Cedar Sunset', streakLabel: 'Zero Blue Light' }
];

export const INITIAL_VAULT_ENVELOPES: VaultEnvelope[] = [
  { id: 'env-1', emoji: '✉️', title: "Spring in Kyoto '25", info: '14 stubs • 3 cassette tapes', bg: 'bg-[#EDE4D4]' },
  { id: 'env-2', emoji: '☕', title: 'Quiet Cafes & Kissaten', info: '8 stubs • Vinyl memos', bg: 'bg-[#E4DECF]' },
  { id: 'env-3', emoji: '🏛️', title: 'Museums & Midnight Film', info: '12 stubs • 35mm celluloid', bg: 'bg-[#E0D7D0]' },
  { id: 'env-4', emoji: '🚆', title: 'Solo Rail & Overnight Trains', info: '6 stubs • Shinkansen & Sleeper', bg: 'bg-[#DCE4DD]' }
];

export const INITIAL_DEMO_DATA = {
  tickets: INITIAL_TICKETS,
  heroTicketId: INITIAL_HERO_TICKET.id,
  heroTicket: INITIAL_HERO_TICKET,
  habits: INITIAL_HABITS,
  intentions: INITIAL_INTENTIONS,
  checkpoints: INITIAL_CRAWL_CHECKPOINTS,
  crawlCheckpoints: INITIAL_CRAWL_CHECKPOINTS,
  journalNotes: INITIAL_JOURNAL_NOTES,
  digest: INITIAL_SANCTUARY_DIGEST,
  deskChecklist: INITIAL_DESK_CHECKLIST,
  dailyStream: INITIAL_DAILY_STREAM,
  polaroid: {
    imageUrl: '',
    caption: 'Autumn reflections at Nanzen-ji eaves'
  },
  crawlBadges: INITIAL_CRAWL_BADGES,
  habitStamps: INITIAL_HABIT_STAMPS,
  vaultEnvelopes: INITIAL_VAULT_ENVELOPES
};


