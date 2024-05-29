import API from './earnCredit.api';
import { CreateItenaryForEarnTravelCredit } from './earnCredit.types';

export async function createPlannerItinerary(
  data: CreateItenaryForEarnTravelCredit,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createPlannerItinerary(data)
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp?.data);
        }
      })
      .catch((e: any) => {
        reject(e);
      });
  });
}
