import API from './plannerAndItineraryType.api';

export async function getPlannerSuggestions(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getPlannerSuggestions()
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
