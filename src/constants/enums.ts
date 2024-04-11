export enum IngerdientTypes {
  not_accept,
  accept
}

export enum UserRoles {
  user,
  chef
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
