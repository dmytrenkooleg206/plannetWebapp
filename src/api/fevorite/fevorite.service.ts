import API from './fevorite.api';
import { AddOrDeleteRequest } from './fevorite.type';

export async function addOrDelete(data: AddOrDeleteRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    API.addOrDelete(data)
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
