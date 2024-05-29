import API from './web.api';

export async function getAllCurrencies(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getAllCurrencies()
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp?.data?.currencyOptions);
        }
      })
      .catch((e: any) => {
        reject(e);
      });
  });
}

export async function getWebFeed(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getWebFeedV2()
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
