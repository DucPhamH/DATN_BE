export enum IngerdientTypes {
  not_accept,
  accept
}

export enum UserRoles {
  user,
  chef,
  admin,
  writter,
  inspector
}

export enum UserStatus {
  banned,
  active
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum PostTypes {
  post,
  sharePost
}

export enum PostStatus {
  publish,
  private
}
export enum BlogStatus {
  pending,
  accepted
}

export const UserGender = {
  male: 'male',
  female: 'female',
  other: 'other'
}

export const ActivityValue = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  superActive: 1.9
}
