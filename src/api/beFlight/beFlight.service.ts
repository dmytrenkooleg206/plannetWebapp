import API from './beFlight.api';

export async function getAllAirports(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getAllAirports()
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
