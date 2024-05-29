export type TypeCurrency = {
  name: string;
  symbol: string;
  displayName: string;
  symbolNative: string;
};

export type TypePlanner = {
  id: number;
  HomeBaseId: number;
};

export type Guest = {
  tempid?: string;
  id?: string;
  firstName?: string;
  firstNameOnInvite?: string;
  lastName?: string;
  lastNameOnInvite?: string;
  countryCode?: string;
  phoneNumber?: string;
  isValid?: boolean;
  TripGuest?: {
    id: string;
    isHost: boolean;
    isCoHost: boolean;
    isPlanner: boolean;
    firstNameOnInvite: string;
    lastNameOnInvite: string;
    attendingStatus: 'YES' | 'NO' | 'PENDING';
  };
};
