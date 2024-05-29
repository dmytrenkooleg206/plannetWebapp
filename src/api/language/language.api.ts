import axiosClient from '../../lib/axiosClient';

export default {
  getLanguageSuggestions: () => axiosClient.get('api/language/suggestions'),
};
