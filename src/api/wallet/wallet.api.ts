import axiosClient from '../../lib/axiosClient';

export default {
  getPlannetCashBalance: () =>
    axiosClient.get('api/wallet/plannetCash/balance'),
};
