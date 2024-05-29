export const storedTokenLocalStorageKey = 'plannet-token';
export const storedGuestUserTokenLocalStorageKey = 'plannet-guest-user-token';
export const storedUserIdLocalStorageKey = 'plannet-user-id';
export const storedPhoneCodeLocalStorageKey = 'phone-code';
export const storedGuestTripIdLocalStorageKey = 'plannet-guest-user-tripId';
export const storedUserProfilePictureLocalStorageKey =
  'plannet-user-profile-picture';
export const storedUserFullNameLocalStorage = 'plannet-user-fullname';
export const storedUserStatusLocalStorage = 'plannet-user-status';
export const storedSelectedHotelId = 'planner-affiliate-selected-hotel';

export function getPlannetTokenFromLocalStorage(): string {
  const plannetToken: string | null = window.localStorage.getItem(
    storedTokenLocalStorageKey,
  );
  return plannetToken || '';
}

export function getPlannetGuestUserTokenFromLocalStorage(): string {
  const plannetGuestToken: string | null = window.localStorage.getItem(
    storedGuestUserTokenLocalStorageKey,
  );
  return plannetGuestToken || '';
}

export function getPlannetGuestUserTripIdFromLocalStorage(): string {
  const plannetGuestTripId: string | null = window.localStorage.getItem(
    storedGuestTripIdLocalStorageKey,
  );
  return plannetGuestTripId || '';
}

export function removePlannetGuestUserTripIdFromLocalStorage() {
  window.localStorage.removeItem(storedGuestTripIdLocalStorageKey);
}

export function removePlannetGuestUserTokenFromLocalStorage() {
  window.localStorage.removeItem(storedGuestUserTokenLocalStorageKey);
}

export function persistPlannetTokenInLocalStorage(token: string) {
  window.localStorage.setItem(storedTokenLocalStorageKey, token);
}

export function persistPlannetGuestUserTokenInLocalStorage(token: string) {
  window.localStorage.setItem(storedGuestUserTokenLocalStorageKey, token);
}

export function persistPlannetGuestUserTripId(tripId: any) {
  window.localStorage.setItem(storedGuestTripIdLocalStorageKey, tripId);
}

export function removePlannetTokenFromLocalStorage() {
  window.localStorage.removeItem(storedTokenLocalStorageKey);
}

export function getPlannetUserIdFromLocalStorage(): string {
  const userId: string | null = window.localStorage.getItem(
    storedUserIdLocalStorageKey,
  );
  return userId || '';
}

export function getPlannetPhoneCodeFromLocalStorage(): string {
  const phonecode: string | null = window.localStorage.getItem(
    storedPhoneCodeLocalStorageKey,
  );
  return phonecode || '';
}

export function persistPlannetUserIdInLocalStorage(userId: string) {
  window.localStorage.setItem(storedUserIdLocalStorageKey, userId);
}

export function persistPlannetPhoneCodeInLocalStorage(phoneCode: string) {
  window.localStorage.setItem(storedPhoneCodeLocalStorageKey, phoneCode);
}

export function removePlannetUserIdFromLocalStorage() {
  window.localStorage.removeItem(storedUserIdLocalStorageKey);
}

export function getPlannetUserProfilePictureFromLocalStorage(): string {
  const pictureUrl: string | null = window.localStorage.getItem(
    storedUserProfilePictureLocalStorageKey,
  );
  return pictureUrl || '';
}

export function persistPlannetUserProfilePictureInLocalStorage(
  pictureUrl: string,
) {
  window.localStorage.setItem(
    storedUserProfilePictureLocalStorageKey,
    pictureUrl,
  );
}

export function removePlannetUserProfilePictureFromLocalStorage() {
  window.localStorage.removeItem(storedUserProfilePictureLocalStorageKey);
}

export function getPlannetUserFullnameFromLocalStorage(): string {
  if (typeof window !== 'undefined') {
    const userfullName: string | null = window.localStorage.getItem(
      storedUserFullNameLocalStorage,
    );
    return userfullName || '';
  }
  return '';
}

export function removePlannetUserFullnameFromLocalStorage() {
  window.localStorage.removeItem(storedUserFullNameLocalStorage);
}

export function persistUserFullnameInLocalStorage(userFullname: string) {
  window.localStorage.setItem(storedUserFullNameLocalStorage, userFullname);
}
export function getPlannetUserStatusFromLocalStorage(): string {
  if (typeof window !== 'undefined') {
    const userStatus: string | null = window.localStorage.getItem(
      storedUserStatusLocalStorage,
    );
    return userStatus || '';
  }
  return '';
}

export function removePlannetUserStatusFromLocalStorage() {
  window.localStorage.removeItem(storedUserStatusLocalStorage);
}

export function persistUserStatusInLocalStorage(userStatus: string) {
  window.localStorage.setItem(storedUserStatusLocalStorage, userStatus);
}
export function getPlannetAffiliateSelHtlIdFromLocalStorage(): string {
  if (typeof window !== 'undefined') {
    const userStatus: string | null = window.localStorage.getItem(
      storedSelectedHotelId,
    );
    return userStatus || '';
  }
  return '';
}

export function removePlannetAffiliateSelHtlIdFromLocalStorage() {
  window.localStorage.removeItem(storedSelectedHotelId);
}

export function persistAffiliateSelHtlIdInLocalStorage(hotelId: string) {
  window.localStorage.setItem(storedSelectedHotelId, hotelId);
}
