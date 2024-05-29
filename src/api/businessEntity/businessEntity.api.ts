import axiosClient from '../../lib/axiosClient';
import { type CreateBusinessEntityRequest } from './businessEntity.types';

export default {
  createBusinessEntity: (data: CreateBusinessEntityRequest) =>
    axiosClient.post('api/businessEntity/create', data),
  uploadPhotoBusinessEntity: (formData: FormData) =>
    axiosClient.post('api/businessEntity/uploadPhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
