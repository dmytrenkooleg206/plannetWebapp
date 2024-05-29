import axiosClient from '../../lib/axiosClient';

export default {
  getAllCurrencies: () => axiosClient.get('api/web/currency/all'),
  getWebFeedV2: () => axiosClient.get('api/web/feed/v2'),
};
