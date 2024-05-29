import { useQuery } from 'react-query';
import { QUERY_OPTION } from '@/lib/constants';
import { getDestinationRecommendations } from '@/api/trip/trip.service';
import { GetDestinationRecommendationsProps } from '@/api/trip/trip.types';

export function useGetDestinationRecommendations(
  params: GetDestinationRecommendationsProps,
  options?: {
    refetchOnWindowFocus?: boolean;
    retry?: number;
    enabled?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
  },
) {
  return useQuery(
    'destinationRecommendations',
    () => getDestinationRecommendations(params),
    { ...QUERY_OPTION, ...options },
  );
}
