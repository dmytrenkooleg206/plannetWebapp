import { useQuery } from 'react-query';
import { QUERY_OPTION } from '@/lib/constants';
import { getHomeV4feed } from '@/api/home/home.service';

export function useGetV4HomeFeed(options?: {
  refetchOnWindowFocus?: boolean;
  retry?: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) {
  return useQuery('home_v4_feed', () => getHomeV4feed(), {
    ...options,
    ...QUERY_OPTION,
  });
}
