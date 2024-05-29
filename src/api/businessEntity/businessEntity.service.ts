import API from './businessEntity.api';
import { type CreateBusinessEntityRequest } from './businessEntity.types';

export async function createBusinessEntity(
  data: CreateBusinessEntityRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createBusinessEntity(data)
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

export async function uploadPhotoBusinessEntity(data: FormData): Promise<any> {
  return new Promise((resolve, reject) => {
    API.uploadPhotoBusinessEntity(data)
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
