import API from './priceFreeze.api';

export async function createPaymentIntent(data: any): Promise<any> {
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
export async function createPaymentIntentV4(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createPaymentIntentV4(data)
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
