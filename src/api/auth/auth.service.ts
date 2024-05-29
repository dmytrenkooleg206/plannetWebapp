import API from './auth.api';
import {
  SendContactBusinessMessageReqeust,
  SendContactMessageReqeust,
  SendVerificationCodeRequest,
  VerifyPhoneNumberRequest,
} from './auth.types';

export async function sendVerificationCode(
  data: SendVerificationCodeRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.sendVerificationCode(data)
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

export async function verifyPhoneNumber(
  data: VerifyPhoneNumberRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.verifyPhoneNumber(data)
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

export async function sendContactMessage(
  data: SendContactMessageReqeust,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.sendContactMessage(data)
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
export async function sendContactBusinessMessage(
  data: SendContactBusinessMessageReqeust,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.sendContactBusinessMessage(data)
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
