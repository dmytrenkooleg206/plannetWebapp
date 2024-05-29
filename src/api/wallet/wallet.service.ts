import API from './wallet.api';

export async function getPlannetCashBalance(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getPlannetCashBalance()
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
