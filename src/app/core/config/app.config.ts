import { environment } from '@env';

/**
 * Application configuration constants.
 */
export const APP_CONFIG = {
  appName: environment.appName,
  apiUrl: environment.apiUrl,
  production: environment.production,

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
  },

  // Token configuration
  auth: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    storageKeys: {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      user: 'user',
    },
  },

  // Date formats
  dateFormats: {
    display: 'dd/MM/yyyy',
    displayDateTime: 'dd/MM/yyyy HH:mm',
    api: 'yyyy-MM-dd',
    apiDateTime: "yyyy-MM-dd'T'HH:mm:ss",
  },
};
