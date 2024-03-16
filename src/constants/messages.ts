export const AUTH_USER_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  USER_NOT_FOUND: 'User not found',
  PASSWORD_NOT_MATCH: 'Password not match',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  REGISTER_SUCCESS: 'Register success',
  LOGIN_SUCCESS: 'Login success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  PASSWORD_INCORRECT: 'Password incorrect'
} as const
