import axiosClient from '../../lib/axiosClient';

export default {
  getHomeV4feed: () => axiosClient.get('api/home/v4/feed'),
};
