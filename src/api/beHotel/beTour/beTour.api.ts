import axiosClient from '../../../lib/axiosClient';
import {
  type getTourReviews,
} from './beTour.types';

export default {
  getTourReviews: (data: getTourReviews) =>
    axiosClient.post('/api/beTour/viator/product/reviews', data),
};
