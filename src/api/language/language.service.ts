import API from './language.api';

export async function getLanguageSuggestions(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getLanguageSuggestions()
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
