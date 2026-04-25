/**
 * mockData.js
 * -----------
 * Central source of mock data for the PetPassport frontend.
 * Replace these with real API calls once the backend is running.
 */

// ── Active Pet ─────────────────────────────────────────────────────────────
export const mockPet = {
  _id: 'pet_001',
  name: 'Biscuit',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 3,
  gender: 'Male',
  color: 'Golden',
  microchipId: 'MC-2024-00123',
  ownerName: 'Alex Johnson',
  avatar: null, // replaced by generated SVG avatar component
  weightHistory: [
    { date: '2024-11-01', weight: 28.5 },
    { date: '2024-12-01', weight: 29.1 },
    { date: '2025-01-01', weight: 29.8 },
    { date: '2025-02-01', weight: 30.2 },
    { date: '2025-03-01', weight: 29.9 },
    { date: '2025-04-01', weight: 30.5 },
  ],
};

// ── Daily Logs ─────────────────────────────────────────────────────────────
export const mockDailyLogs = [
  {
    _id: 'log_001',
    petId: 'pet_001',
    date: '2025-04-23',
    foodIntake: 'Royal Canin Adult — 300g (morning) + 300g (evening)',
    mood: 'energetic',
    medicationGiven: true,
    notes: 'Played fetch for 30 minutes at the park.',
  },
  {
    _id: 'log_002',
    petId: 'pet_001',
    date: '2025-04-22',
    foodIntake: 'Royal Canin Adult — 280g (morning) + 280g (evening)',
    mood: 'happy',
    medicationGiven: true,
    notes: 'Normal day, good appetite.',
  },
  {
    _id: 'log_003',
    petId: 'pet_001',
    date: '2025-04-21',
    foodIntake: 'Royal Canin Adult — 250g (morning), skipped evening',
    mood: 'lethargic',
    medicationGiven: false,
    notes: 'Seemed tired after the long walk yesterday.',
  },
  {
    _id: 'log_004',
    petId: 'pet_001',
    date: '2025-04-20',
    foodIntake: 'Royal Canin Adult — 300g x2 + treat snack',
    mood: 'happy',
    medicationGiven: true,
    notes: '',
  },
  {
    _id: 'log_005',
    petId: 'pet_001',
    date: '2025-04-19',
    foodIntake: 'Homemade chicken & rice — 400g',
    mood: 'energetic',
    medicationGiven: true,
    notes: 'Vet recommended bland diet for 2 days.',
  },
];

// ── Medical Records ────────────────────────────────────────────────────────
export const mockMedicalRecords = [
  {
    _id: 'rec_001',
    petId: 'pet_001',
    type: 'Vaccine',
    description: 'Annual Rabies Vaccine booster — administered by Dr. Patel.',
    date: '2025-03-15',
    nextDueDate: '2026-03-15',
    vet: 'Dr. Priya Patel',
    clinic: 'PawsFirst Animal Hospital',
    status: 'completed',
  },
  {
    _id: 'rec_002',
    petId: 'pet_001',
    type: 'Checkup',
    description: 'Routine annual wellness checkup. All vitals normal. Weight 30.2 kg.',
    date: '2025-02-10',
    nextDueDate: '2026-02-10',
    vet: 'Dr. Priya Patel',
    clinic: 'PawsFirst Animal Hospital',
    status: 'completed',
  },
  {
    _id: 'rec_003',
    petId: 'pet_001',
    type: 'Vaccine',
    description: 'Distemper + Parvovirus combo (DHPP) booster due.',
    date: '2025-05-20',
    nextDueDate: null,
    vet: 'Dr. Priya Patel',
    clinic: 'PawsFirst Animal Hospital',
    status: 'upcoming',
  },
  {
    _id: 'rec_004',
    petId: 'pet_001',
    type: 'Checkup',
    description: 'Hip dysplasia screening — X-rays scheduled.',
    date: '2025-06-05',
    nextDueDate: null,
    vet: 'Dr. Rohan Mehta',
    clinic: 'CityVet Diagnostics',
    status: 'upcoming',
  },
  {
    _id: 'rec_005',
    petId: 'pet_001',
    type: 'Surgery',
    description: 'Neutering procedure — successful recovery in 5 days.',
    date: '2024-08-12',
    nextDueDate: null,
    vet: 'Dr. Sarah Chen',
    clinic: 'BluePaw Surgical Centre',
    status: 'completed',
  },
];

// ── Mood map ───────────────────────────────────────────────────────────────
export const moodConfig = {
  happy: { label: 'Happy', emoji: '😄', color: '#14b8a6', bg: '#ccfbf1' },
  energetic: { label: 'Energetic', emoji: '⚡', color: '#f97316', bg: '#ffedd5' },
  lethargic: { label: 'Lethargic', emoji: '😴', color: '#94a3b8', bg: '#f1f5f9' },
  anxious: { label: 'Anxious', emoji: '😰', color: '#a78bfa', bg: '#ede9fe' },
  sick: { label: 'Sick', emoji: '🤒', color: '#f87171', bg: '#fee2e2' },
};

// ── Record type config ─────────────────────────────────────────────────────
export const recordTypeConfig = {
  Vaccine: { color: '#14b8a6', bg: '#ccfbf1', icon: '💉' },
  Checkup: { color: '#3b82f6', bg: '#dbeafe', icon: '🩺' },
  Surgery: { color: '#f97316', bg: '#ffedd5', icon: '🔬' },
};
