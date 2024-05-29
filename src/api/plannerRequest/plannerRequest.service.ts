import API from './plannerRequest.api';
import { type CreatePaymentIntentRequest } from './plannerRequest.types';

export async function createPaymentIntent(
  data: CreatePaymentIntentRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createPaymentIntent(data)
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
