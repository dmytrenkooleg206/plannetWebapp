export type PlannetMonthlyTextSignUpRequest = {
  travelImportance: string | undefined;
  monthlyTravelStyle: string | undefined;
  travelingWith: string | undefined;
  travelDistance: string | undefined;
  priceRange: string | undefined;
  ageRange: string | undefined;
  nextTripArea: string | undefined;
  citiesWantToVisit: string[] | undefined;
  HomeBaseId: string | null;
  UserId: string | undefined;
};
