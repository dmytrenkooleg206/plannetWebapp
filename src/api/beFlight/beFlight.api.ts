import axiosClient from '../../lib/axiosClient';

export default {
  getAllAirports: () => axiosClient.get('api/beFlight/airport/all'),
};
