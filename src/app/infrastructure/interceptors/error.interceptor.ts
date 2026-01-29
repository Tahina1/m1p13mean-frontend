import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Error interceptor.
 * Handles HTTP errors globally and formats error messages.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        errorMessage = getServerErrorMessage(error);
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};

/**
 * Extract error message from server response.
 */
function getServerErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }

  switch (error.status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please login again.';
    case 403:
      return 'Access forbidden. You do not have permission.';
    case 404:
      return 'Resource not found.';
    case 422:
      return 'Validation error. Please check your input.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return `Error: ${error.status} - ${error.statusText}`;
  }
}
