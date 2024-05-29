import axiosClient from '../../lib/axiosClient';

export default {
  getAllFAQs: () => axiosClient.get(`api/faq/all`),
};
