import API from './city.api';
import { type CreateCityRequest } from './city.types';

export async function createCity(data: CreateCityRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createCity(data)
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

export async function uploadCityPhoto(formData: FormData): Promise<any> {
  return new Promise((resolve, reject) => {
    API.uploadCityPhoto(formData)
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
