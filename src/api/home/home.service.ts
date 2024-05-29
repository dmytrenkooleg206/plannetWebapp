import API from './home.api';

export async function getHomeV4feed(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getHomeV4feed()
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
