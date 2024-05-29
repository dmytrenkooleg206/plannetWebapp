import API from './plannerType.api';
import { type CreatePlannerTypeRequest } from './plannerType.types';

export async function createPlannerType(
  data: CreatePlannerTypeRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createPlannerType(data)
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

export async function deletePlannerType(typeId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.deletePlannerType(typeId)
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
