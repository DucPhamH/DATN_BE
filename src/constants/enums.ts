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

export enum NotificationTypes {
  follow,
  likePost,
  commentPost,
  commentChildPost,
  sharePost,
  likeRecipe,
  commentRecipe,
  bookmarkRecipe,
  commentBlog,
  bookmarkAlbum,
  system
}

// có 2 kiểu type là đủ 5000 follow hoặc gửi minh chứng
export enum RequestType {
  follow,
  proof
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
  accepted,
  banned,
  rejected
}

export enum RegionRecipe {
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
export enum RecipeStatus {
  pending,
  accepted,
  banned,
  rejected
}

export enum AlbumStatus {
  pending,
  accepted,
  banned,
  rejected
}

export enum RecipeType {
  chef,
  writter
}

export const UserGender = {
  male: 'male',
  female: 'female',
  other: 'other'
}

export const CategoryAlbum = {
  forBaby: 'Cho bé',
  forPregnant: 'Cho bà bầu',
  forOldPeople: 'Cho người già',
  forWeightLoss: 'Giảm cân',
  forWeightGain: 'Tăng cân',
  forDisease: 'Cho người bệnh',
  forSport: 'Thể thao',
  forBeauty: 'Sắc đẹp',
  forVegetarian: 'Cho người ăn chay'
}

export const ProcessingRecipe = {
  hot_pot: 'Lẩu',
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

export enum RecipeTime {
  lessThan15,
  from15To30,
  from30To60,
  from60To120,
  moreThan120
}

export enum PurposeValue {
  gainWeight,
  loseWeight,
  maintainWeight
}

export const UnitValue = {
  gram: 'gram',
  ml: 'ml',
  piece: 'cái',
  plate: 'đĩa',
  loaf: 'ổ',
  slice: 'lát',
  pack: 'gói',
  cup: 'tách/chén',
  glass: 'cốc/ly',
  can: 'lon',
  bowl: 'tô/bát',
  jar: 'hũ/hộp',
  bottle: 'chai',
  roll: 'cuốn',
  pill: 'viên',
  fruit: 'trái/quả'
}
