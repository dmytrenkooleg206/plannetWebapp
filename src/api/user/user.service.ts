import API from './user.api';

export async function getUserById(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getUserById(userId)
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

export async function updateFirstAndLastName(
  firstName: string,
  lastName: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateFirstAndLastName(firstName, lastName)
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

export async function updateEmail(email: string, userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateEmail(email, userId)
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

export async function updateProfilePicture(formData: FormData): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateProfilePicture(formData)
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

export async function updateProfile(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.update(data)
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

export async function updateTours(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTours(data)
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

export async function completeSignUp(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.completeSignUp(data)
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

export async function addPaymentMethod(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.addPaymentMethod(data)
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
