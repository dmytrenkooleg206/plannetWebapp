import axiosClient from '@/lib/axiosClient';
import { AddOrDeleteRequest } from './fevorite.type';

export default {
  addOrDelete: (data: AddOrDeleteRequest) =>
    axiosClient.post('/api/favorite/addOrDelete', data),
};
