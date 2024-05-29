import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';
import { selectors } from '@/store/onboarding/onboarding.slice';
import { createTripWantsHelp } from '@/api/trip/trip.service';
type CompleteButtonProps = {
  cities: any[];
  // onComplete: Function;
  optionType: string;
  setShowDownloadAppModal: Dispatch<SetStateAction<boolean>>;
};
export default function CompleteButton({
  // onComplete,
  cities,
  optionType,
  setShowDownloadAppModal,
}: CompleteButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const onboarding = useSelector(selectors.onboarding);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleComplete = async () => {
    const CityIds: any[] = [];
    const tripLegStartDates: any[] = [];
    const tripLegEndDates: any[] = [];
    let startDate: any = null;
    let endDate: any = null;

    for (let i = 0; i < cities.length; i += 1) {
      CityIds.push(cities[i].id);
      if (cities[i].startDate) {
        tripLegStartDates.push(cities[i].startDate.toISOString().split('T')[0]);
        tripLegEndDates.push(cities[i].endDate.toISOString().split('T')[0]);
        if (!startDate || startDate.getTime() > cities[i].startDate.getTime())
          startDate = cities[i].startDate;
        if (!endDate || endDate.getTime() < cities[i].endDate.getTime())
          endDate = cities[i].endDate;
      }
    }

    const onboardingData: any = {
      ...onboarding,
      CityIds: [...CityIds],
    };

    onboardingData.CityIds = [...CityIds];
    onboardingData.tripLegStartDates = [...tripLegStartDates];
    onboardingData.tripLegEndDates = [...tripLegEndDates];
    if (!onboardingData.startDate && startDate)
      /* eslint-disable-next-line */
      onboardingData.startDate = startDate.toISOString().split('T')[0];
    if (!onboardingData.endDate && endDate)
      /* eslint-disable-next-line */
      onboardingData.endDate = endDate.toISOString().split('T')[0];
    if (!onboardingData.startDate || !onboardingData.CityIds.length) {
      onboardingData.tripLegStartDates = null;
      onboardingData.tripLegEndDates = null;
    }
    if (!onboardingData.CityIds.length) onboardingData.CityIds = null;
    if (!onboardingData.startDate) onboardingData.startDate = null;
    if (!onboardingData.endDate) onboardingData.endDate = null;

    try {
      setIsLoading(true);
      const trip: any = await createTripWantsHelp(onboardingData);
      router.push(`/summary/loading/${trip.trip.urlId}`)
      // setShowDownloadAppModal(true);
    } catch (err) {
      toast.error('Something went wrong!');
      setIsLoading(false);
    }
  };

  if (optionType !== 'complete') return null;
  return (
    <Button
      text="Continue"
      color="black"
      onClick={() => handleComplete()}
      isLoading={isLoading}
      isDisabled={isLoading}
    />
  );
}
