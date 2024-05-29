import axiosClient from '../../lib/axiosClient';

export default {
  getPlannerSuggestions: () =>
    axiosClient.get('api/plannerAndItineraryType/suggestions'),
};
