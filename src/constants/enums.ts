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
  following,
  private
}
export enum BlogStatus {
  pending,
  accepted
}

export enum RegionFood {
  north,
  central,
  south,
  asian,
  european
}
export enum DifficultLevel {
  easy,
  normal,
  hard
}

export enum FoodType {
  chef,
  writter
}

export const UserGender = {
  male: 'male',
  female: 'female',
  other: 'other'
}

export const ProcessingFood = {
  hot_pot: 'lẩu',
  stir_fry: 'Xào',
  grill: 'Nướng',
  steam: 'Hấp',
  fry: 'Chiên',
  stew: 'Kho',
  simmer: 'Hầm',
  salad: 'Gỏi/Trộn',
  soup: 'Canh/Súp',
  roast: 'Quay',
  braised: 'Om/Rim',
  fried: 'Rang',
  raw: 'Đồ sống',
  other: 'Khác'
}

export const ActivityValue = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  superActive: 1.9
}
