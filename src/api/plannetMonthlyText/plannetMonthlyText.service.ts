import API from './plannetMonthlyText.api';
import { type PlannetMonthlyTextSignUpRequest } from './plannetMonthlyText.types';

export async function plannetMonthlyTextSignUp(
  data: PlannetMonthlyTextSignUpRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.plannetMonthlyTextSignUp(data)
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
