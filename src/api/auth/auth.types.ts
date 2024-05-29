export type SendVerificationCodeRequest = {
  countryCode: string;
  phoneNumber: string;
};

export type VerifyPhoneNumberRequest = {
  countryCode: string;
  phoneNumber: string;
  verificationCode: string;
};

export type SendContactMessageReqeust = {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
};
export type SendContactBusinessMessageReqeust = {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  companySize: string;
  countryCode: string;
  phoneNumber: string;
};
