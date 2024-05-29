export const TOP_CURRENCIES = [
  {
    symbol: 'USD',
    symbolNative: '$',
    name: 'United States Dollar',
    displayName: '($) United States Dollar',
  },
  {
    symbol: 'EUR',
    symbolNative: '€',
    name: 'Euro',
    displayName: '(€) Euro',
  },
  {
    symbol: 'GBP',
    symbolNative: '£',
    name: 'Pound Sterling',
    displayName: '(£) Pound Sterling',
  },
  {
    symbol: 'CHF',
    symbolNative: '₣',
    name: 'Swiss Franc',
    displayName: '(₣) Swiss Franc',
  },
  {
    symbol: 'AUD',
    symbolNative: '$',
    name: 'Australian Dollar',
    displayName: '($) Australian Dollar',
  },
  {
    symbol: 'CAD',
    symbolNative: '$',
    name: 'Canadian Dollar',
    displayName: '($) Canadian Dollar',
  },
];

export const ONBOARDING_QUESTIONS: any = {
  planning_trip: {
    question: 'Are you...',
    questionType: 0,
    answer: ['Planning a trip'],
    nextQuestions: ['go_where'],
  },
  no_trip_invite: {
    question: 'You haven’t been  invited on a trip',
    answer: [],
  },
  go_where: {
    questionType: 0,
    question: 'Do you know where you want to go?',
    answer: ['Yes', 'Not Sure'],
    nextQuestions: ['go_when', 'climate'],
  },
  climate: {
    questionType: 1,
    question: 'What is your preferred climate?',
    answer: ['Hot', 'Cold', 'No preference'],
    nextQuestions: ['travel_style', 'travel_style', 'travel_style'],
  },
  travel_style: {
    questionType: 1,
    question: 'How would you describe your travel style?',
    answer: [
      'Party',
      'Romantic',
      'Budget',
      'Culture',
      'Relax',
      'No preference',
    ],
    nextQuestions: [
      'travel_type',
      'travel_type',
      'travel_type',
      'travel_type',
      'travel_type',
      'travel_type',
    ],
  },
  travel_type: {
    questionType: 1,
    question: 'Do you want to travel International or Domestic?',
    answer: ['International', 'Domestic'],
    nextQuestions: ['distance_preference', 'distance_preference'],
  },
  distance_preference: {
    questionType: 1,
    question: 'How far do you want to fly?',
    answer: ['5 hours max', '10 hours max', '10+ hours', `Don't want to fly`],
    nextQuestions: ['go_when', 'go_when', 'go_when', 'go_when'],
  },
  go_when: {
    question: 'Do you know when you want to go?',
    answer: ['Yes', 'Not Sure'],
    nextQuestions: ['', '', ''],
  },
  number_guests: {
    question: 'Number of guests?',
    answer: [],
    nextQuestions: ['budget'],
  },
  budget: {
    question: `What’s the budget per person ?`,
    answer: [
      '< $2,000',
      '$2,000-$3,000',
      '$3,000-$4,000',
      '< $4,000',
      'Not Sure',
    ],
    nextQuestions: ['complete', 'complete', 'complete', 'complete', 'complete'],
  },
  complete: {
    question: '',
    answer: [],
    nextQuestions: [],
  },
};

export const MONTHS = [
  { key: 0, value: 1, label: 'January' },
  { key: 1, value: 2, label: 'February' },
  { key: 2, value: 3, label: 'March' },
  { key: 3, value: 4, label: 'April' },
  { key: 4, value: 5, label: 'May' },
  { key: 5, value: 6, label: 'June' },
  { key: 6, value: 7, label: 'July' },
  { key: 7, value: 8, label: 'August' },
  { key: 8, value: 9, label: 'September' },
  { key: 9, value: 10, label: 'October' },
  { key: 10, value: 11, label: 'November' },
  { key: 11, value: 12, label: 'December' },
];

export const NIGHT_DAYS = [
  { key: 0, value: 'N_1_4', label: '1-4 nights' },
  { key: 1, value: 'N_5_7', label: '5-7 nights' },
  { key: 2, value: 'N_8_PLUS', label: '8+ nights' },
];

export const QUERY_OPTION = {
  staleTime: 80000,
  cacheTime: 80000,
  retry: false,
  enabled: true,
};

export const BUDGETS: any = {
  T_2K: '< $2,000',
  T_2K_3K: '$2,000-$3,000',
  T_3K_4K: '$3,000-$4,000',
  T_4K_PLUS: '< $4,000',
  T_NOT_SURE: '',
};
