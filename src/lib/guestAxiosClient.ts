import axios, { AxiosInstance } from 'axios';

import {
    getPlannetGuestUserTokenFromLocalStorage,
  getPlannetTokenFromLocalStorage,
  removePlannetGuestUserTokenFromLocalStorage,
  removePlannetGuestUserTripIdFromLocalStorage,
  removePlannetTokenFromLocalStorage,
  removePlannetUserIdFromLocalStorage,
} from './localStorage/localStorage';

// Step-1: Create a new Axios instance with a custom config.
// The timeout is set to 10s. If the request takes longer than
// that then the request will be aborted.

const API_PROD_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION ||
  'https://plannet-backend.herokuapp.com';

const API_STAGING_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL_STAGING ||
  'https://plannet-backend-staging.herokuapp.com';

const guestAxiosClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? API_PROD_BASE_URL
      : API_STAGING_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${accessToken}`
  },
  timeout: 100000,
});

guestAxiosClient.defaults.headers.common = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Step-2: Create request, response & error handlers
const requestHandler = (request: any) => {
  const plannetToken: string = getPlannetTokenFromLocalStorage();
  
  if (plannetToken) {
    request.headers.Authorization = `Bearer ${plannetToken}`;
  }

  return request;
};

const responseHandler = (response: any) => {
  if (response.status === 401) {
    // window.location = '/';
    console.log('Failed to fetch API');
  }

  return response;
};

const errorHandler = (error: any) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    removePlannetGuestUserTokenFromLocalStorage();
    removePlannetGuestUserTripIdFromLocalStorage();

    const whitlistUrl = [
      '/',
      '/terms-conditions',
      '/privacy-policy',
      '/careers',
      '/planner',
    ];

    if (!whitlistUrl.includes(window.location.pathname)) {
      // window.location = '/';
    }
  }
  return Promise.reject(error);
};

// Step-3: Configure/make use of request & response interceptors from Axios
// Note: You can create one method say configureInterceptors, add below in that,
// export and call it in an init function of the application/page.
guestAxiosClient.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error),
);

guestAxiosClient.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error),
);

// Step-4: Export the newly created Axios instance to be used in different locations.
export default guestAxiosClient;
