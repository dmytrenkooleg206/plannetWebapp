import {
  LocationIcon,
  LocationOnIcon,
  DollarIcon,
  DollarOnIcon,
  CombineIcon,
  CombineOnIcon,
  FriendsOnIcon,
  FriendsIcon,
  FamilyIcon,
  FamilyOnIcon,
  CoupleIcon,
  CoupleOnIcon,
  SoloIcon,
  SoloOnIcon,
  HotelOnIcon,
  HotelIcon,
} from './icons';

export const travelSuggestItems = [
  {
    id: 1,
    string: 'Spend my days enjoying the hotel',
    activeIcon: <HotelOnIcon />,
    icon: <HotelIcon />,
    val: 'ENJOY_HOTEL',
  },
  {
    id: 2,
    string: 'Spend my days exploring the city',
    activeIcon: <LocationOnIcon />,
    icon: <LocationIcon />,
    val: 'EXPLORE_CITY',
  },
  {
    id: 3,
    string: 'A combination of both',
    activeIcon: <CombineOnIcon />,
    icon: <CombineIcon />,
    val: 'COMBO',
  },
];
export const travelWithSuggestItems = [
  {
    id: 1,
    string: 'Friends',
    activeIcon: <FriendsOnIcon />,
    icon: <FriendsIcon />,
    val: 'FRIENDS',
  },
  {
    id: 2,
    string: 'Family',
    activeIcon: <FamilyOnIcon />,
    icon: <FamilyIcon />,
    val: 'FAMILY',
  },
  {
    id: 3,
    string: 'Couple',
    activeIcon: <CoupleOnIcon />,
    icon: <CoupleIcon />,
    val: 'COUPLE',
  },
  {
    id: 4,
    string: 'Solo',
    activeIcon: <SoloOnIcon />,
    icon: <SoloIcon />,
    val: 'SOLO',
  },
];
export const hotelSuggestionItems = [
  {
    id: 1,
    string: 'Location close to city attraction',
    activeIcon: <LocationOnIcon />,
    icon: <LocationIcon />,
    val: 'ATTRACTION',
  },
  {
    id: 2,
    string: 'Lower price & find the best deals',
    activeIcon: <DollarOnIcon />,
    icon: <DollarIcon />,
    val: 'PRICE',
  },
  {
    id: 3,
    string: 'A combination of both',
    activeIcon: <CombineOnIcon />,
    icon: <CombineIcon />,
    val: 'COMBO',
  },
];

export const tripPeriods = [
  { id: 1, string: 'Do not want to fly' },
  { id: 2, string: '1-3 hours' },
  { id: 3, string: '3-7 hours' },
  { id: 4, string: '8-12 hours' },
  { id: 5, string: '12+ hours' },
];

export const ageSuggests = [
  { id: 1, range: '18-24', val: 'EIGHTEEN_TO_TWENTY_FOUR' },
  { id: 2, range: '25-34', val: 'TWENTY_FIVE_TO_THIRTY_FOUR' },
  { id: 3, range: '40-55', val: 'FORTY_TO_FIFTY_FIVE' },
  { id: 4, range: '55+', val: 'FIFTY_FIVE_PLUS' },
];

export const travelOptions = [
  {
    id: 1,
    string: 'International',
    selectedIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <circle cx="10" cy="10" r="9" stroke="#1F133E" strokeWidth="2" />
        <circle cx="9.99935" cy="9.99935" r="5.83333" fill="#1F133E" />
      </svg>
    ),
    unSelectedIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <circle
          cx="10"
          cy="10"
          r="9"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="2"
        />
      </svg>
    ),
    val: 'INTERNATIONAL',
  },
  {
    id: 2,
    string: 'Domestic',
    selectedIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <circle cx="10" cy="10" r="9" stroke="#1F133E" strokeWidth="2" />
        <circle cx="9.99935" cy="9.99935" r="5.83333" fill="#1F133E" />
      </svg>
    ),
    unSelectedIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <circle
          cx="10"
          cy="10"
          r="9"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="2"
        />
      </svg>
    ),
    val: 'DOMESTIC',
  },
];
