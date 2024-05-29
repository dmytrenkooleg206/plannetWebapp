import API from './promoCode.api';
import { ValidatePromoCode } from './promoCode.types';

export async function promoCodeValidate(
  code: ValidatePromoCode,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.promoCodeValidate(code)
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
