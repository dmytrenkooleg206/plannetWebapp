import axiosClient from '../../lib/axiosClient';

export default {
  getUserById: (userId: string) =>
    axiosClient.get(`api/user/v3/byId/${userId}`),
  updateFirstAndLastName: (firstName: string, lastName: string) =>
    axiosClient.post('api/user/updateFirstAndLastName', {
      firstName,
      lastName,
    }),
  updateEmail: (email: string, userId: string) =>
    axiosClient.post('api/user/updateEmail', {
      email,
      UserId: userId,
    }),
  updateProfilePicture: (formData: FormData) =>
    axiosClient.post('api/user/updateProfilePicture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (data: any) => axiosClient.post('api/user/update', data),
  updateTours: (data: any) =>
    axiosClient.post('api/user/update/sellTours', data),

  completeSignUp: (data: any) =>
    axiosClient.post('api/user/v4/completeSignUp', data),

  addPaymentMethod: (data: any) =>
    axiosClient.post('api/user/addPaymentMethod', data),
};
