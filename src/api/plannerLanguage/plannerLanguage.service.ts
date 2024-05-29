import API from './plannerLanguage.api';
import { type CreatePlannerLanguageRequest } from './plannerLanguage.types';

export async function createPlannerLanguage(
  data: CreatePlannerLanguageRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createPlannerLanguage(data)
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

export async function deletePlannerLanguage(languageId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.deletePlannerLanguage(languageId)
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
