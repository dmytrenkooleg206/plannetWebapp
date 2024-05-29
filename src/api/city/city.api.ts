import axiosClient from '../../lib/axiosClient';
import { type CreateCityRequest } from './city.types';

export default {
  createCity: (data: CreateCityRequest) =>
    axiosClient.post(`api/city/create`, data),
  uploadCityPhoto: (formData: FormData) =>
    axiosClient.post('api/city/uploadPhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
