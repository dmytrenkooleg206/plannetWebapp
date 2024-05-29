import API from './beTour.api';
import {
  type getTourReviews,
} from './beTour.types';

export async function getTourReviews(data: getTourReviews): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getTourReviews(data)
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp.data);
        }
      })
      .catch((e: any) => {
        reject(e);
      });
  });
}
