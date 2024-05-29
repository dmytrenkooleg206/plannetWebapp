import API from './faq.api';

export async function getALLFAQs(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getAllFAQs()
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
