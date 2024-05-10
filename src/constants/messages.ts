export const AUTH_USER_MESSAGE = {
  VALIDATION_ERROR: 'Lỗi dữ liệu',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  PASSWORD_NOT_MATCH: 'Mật khẩu không khớp',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải chứa ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  ACCESS_TOKEN_IS_REQUIRED: 'Cần có access token',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token đã được sử dụng hoặc không tồn tại',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  REFRESH_TOKEN_IS_REQUIRED: 'Cần có refresh token',
  REFRESH_TOKEN_SUCCESS: 'Lấy refresh token thành công',
  PASSWORD_INCORRECT: 'Mật khẩu không chính xác',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  GMAIL_NOT_VERIFIED: 'Email chưa được xác thực',
  ACCOUNT_BANNED: 'Tài khoản đã bị khóa',
  UNAUTHORIZED: 'Không có quyền truy cập',
  USER_NAME_OR_PASSWORD_INCORRECT: 'Tên đăng nhập hoặc mật khẩu không chính xác'
} as const

export const POST_MESSAGE = {
  NO_CONTENT_OR_IMAGE: 'Không có nội dung hoặc ảnh',
  CREATE_POST_SUCCESS: 'Tạo bài viết thành công',
  NOT_CREATE_POST: 'Không thể tạo bài viết',
  POST_NOT_FOUND: 'Không tìm thấy bài viết',
  DELETE_POST_SUCCESS: 'Xóa bài viết thành công',
  LIKE_POST_SUCCESS: 'Like bài viết thành công',
  UNLIKE_POST_SUCCESS: 'Unlike bài viết thành công',
  COMMENT_POST_SUCCESS: 'Bình luận bài viết thành công',
  DELETE_COMMENT_POST_SUCCESS: 'Xóa bình luận bài viết thành công',
  LIKE_COMMENT_POST_SUCCESS: 'Like bình luận bài viết thành công',
  UNLIKE_COMMENT_POST_SUCCESS: 'Unlike bình luận bài viết thành công',
  SHARE_POST_SUCCESS: 'Chia sẻ bài viết thành công',
  UPDATE_POST_SUCCESS: 'Cập nhật bài viết thành công',
  UPDATE_COMMENT_POST_SUCCESS: 'Cập nhật bình luận bài viết thành công',
  DELETE_COMMENT_POST_FAIL: 'Không thể xóa bình luận bài viết',
  DELETE_POST_FAIL: 'Không thể xóa bài viết',
  UPDATE_POST_FAIL: 'Không thể cập nhật bài viết',
  GET_POST_SUCCESS: 'Lấy bài viết thành công',
  GET_NEW_FEEDS_SUCCESS: 'Lấy new feeds thành công',
  CREATE_POST_COMMENT_SUCCESS: 'Tạo bình luận bài viết thành công',
  COMMENT_MUST_NOT_BE_EMPTY: 'Bình luận không được để trống',
  GET_POST_COMMENTS_SUCCESS: 'Lấy bình luận bài viết thành công',
  COMMENT_NOT_FOUND: 'Không tìm thấy bình luận',
  REPORT_POST_SUCCESS: 'Báo cáo bài viết thành công',
  REPORTED_POST: 'Bài viết đã được báo cáo'
} as const

export const USER_MESSAGE = {
  GET_USER_SUCCESS: 'Lấy thông tin người dùng thành công',
  UPDATE_USER_SUCCESS: 'Cập nhật thông tin người dùng thành công',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
  FOLLOW_USER_SUCCESS: 'Theo dõi người dùng thành công',
  CANNOT_FOLLOW_YOURSELF: 'Không thể theo dõi chính mình',
  GET_ME_SUCCESS: 'Lấy thông tin cá nhân thành công',
  UNFOLLOW_USER_SUCCESS: 'Bỏ theo dõi người dùng thành công'
} as const

export const BLOG_MESSAGE = {
  GET_BLOG_SUCCESS: 'Lấy thông tin blog thành công',
  GET_BLOGS_SUCCESS: 'Lấy danh sách blog thành công',
  GET_BLOG_CATEGORIES_SUCCESS: 'Lấy danh sách danh mục blog thành công',
  GET_BLOG_CATEGORY_SUCCESS: 'Lấy thông tin danh mục blog thành công',
  CREATE_BLOG_SUCCESS: 'Tạo blog thành công',
  UPDATE_BLOG_SUCCESS: 'Cập nhật blog thành công',
  DELETE_BLOG_SUCCESS: 'Xóa blog thành công',
  DELETE_BLOG_FAIL: 'Không thể xóa blog',
  CREATE_BLOG_CATEGORY_SUCCESS: 'Tạo danh mục blog thành công',
  UPDATE_BLOG_CATEGORY_SUCCESS: 'Cập nhật danh mục blog thành công',
  DELETE_BLOG_CATEGORY_SUCCESS: 'Xóa danh mục blog thành công',
  DELETE_BLOG_CATEGORY_FAIL: 'Không thể xóa danh mục blog',
  BLOG_NOT_FOUND: 'Không tìm thấy blog',
  BLOG_CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục blog',
  BLOG_CATEGORY_ALREADY_EXISTS: 'Danh mục blog đã tồn tại',
  BLOG_ALREADY_EXISTS: 'Blog đã tồn tại',
  COMMENT_MUST_NOT_BE_EMPTY: 'Bình luận không được để trống',
  CREATE_COMMENT_BLOG_SUCCESS: 'Tạo bình luận blog thành công',
  DELETE_COMMENT_BLOG_SUCCESS: 'Xóa bình luận blog thành công',
  GET_COMMENTS_BLOG_SUCCESS: 'Lấy bình luận blog thành công'
} as const

export const ACTIVITY_MESSAGE = {
  GET_LIST_ACTIVITY_CATEGORY_SUCCESS: 'Lấy danh sách danh mục hoạt động thành công',
  GET_LIST_ACTIVITY_SUCCESS: 'Lấy danh sách hoạt động thành công'
} as const

export const CALCULATOR_MESSAGE = {
  CALCULATE_BMI_SUCCESS: 'Tính chỉ số BMI thành công',
  HEIGHT_MUST_GREATER_THAN_0: 'Chiều cao phải lớn hơn 0',
  CALCULATE_BMR_SUCCESS: 'Tính chỉ số BMR thành công',
  AGE_MUST_GREATER_THAN_0: 'Tuổi phải lớn hơn 0',
  GENDER_MUST_BE_MALE_OR_FEMALE: 'Giới tính phải là male hoặc female',
  WEIGHT_MUST_GREATER_THAN_0: 'Cân nặng phải lớn hơn 0',
  CALCULATE_TDDE_SUCCESS: 'Tính chỉ số TDDE thành công',
  ACTIVITY_MUST_BE_IN_ACTIVITY_VALUE: 'Hoạt động phải thuộc 1 trong các giá trị của ActivityValue',
  CALCULATE_BODY_FAT_SUCCESS: 'Tính chỉ số body fat thành công',
  CALCULATE_LBM_SUCCESS: 'Tính chỉ số LBM thành công',
  CALCULATE__CALORIE_BURNED_SUCCESS: 'Tính chỉ số calorie burned thành công',
  CALCULATE__WATER_INTAKE_SUCCESS: 'Tính chỉ số water intake thành công',
  CALCULATE_IBW_SUCCESS: 'Tính chỉ số IBW thành công',
  TIME_MUST_GREATER_THAN_0: 'Thời gian phải lớn hơn 0',
  SAVE_BMI_SUCCESS: 'Lưu chỉ số BMI thành công',
  SAVE_BMR_SUCCESS: 'Lưu chỉ số BMR thành công',
  SAVE_TDEE_SUCCESS: 'Lưu chỉ số TDEE thành công',
  SAVE_BODY_FAT_SUCCESS: 'Lưu chỉ số body fat thành công',
  SAVE_LBM_SUCCESS: 'Lưu chỉ số LBM thành công',
  SAVE_IBW_SUCCESS: 'Lưu chỉ số IBW thành công'
} as const

export const WORKOUT_MESSAGE = {
  CREATE_WORKOUT_SUCCESS: 'Tạo workout thành công',
  GET_LIST_WORKOUT_SUCCESS: 'Lấy danh sách workout thành công',
  START_DATE_INVALID: 'Ngày bắt đầu không hợp lệ',
  END_DATE_INVALID: 'Ngày kết thúc không hợp lệ',
  GET_WORKOUT_SUCCESS: 'Lấy thông tin workout thành công',
  CREATE_WORKOUT_ITEM_SUCCESS: 'Tạo workout item thành công',
  GET_LIST_DATE_WORKOUT_ITEM_SUCCESS: 'Lấy danh sách ngày workout item thành công',
  COMPLETE_DATE_WORKOUT_ITEM_SUCCESS: 'Hoàn thành ngày workout item thành công',
  DELETE_DATE_WORKOUT_ITEM_SUCCESS: 'Xóa ngày workout item thành công',
  UPDATE_WORKOUT_SUCCESS: 'Cập nhật workout thành công',
  DELETE_WORKOUT_SUCCESS: 'Xóa workout thành công',
  WEIGHT_SYNC_SUCCESS: 'Đồng bộ cân nặng thành công'
}

export const MEAL_MESSAGE = {
  BMI_TDEE_NOT_FOUND: 'Bạn phải tính chỉ số BMI và TDEE trước',
  CREATE_MEAL_SCHEDULE_SUCCESS: 'Tạo meal schedule thành công',
  GET_LIST_MEAL_SCHEDULE_SUCCESS: 'Lấy danh sách meal schedule thành công',
  GET_MEAL_SCHEDULE_SUCCESS: 'Lấy thông tin meal schedule thành công',
  START_DATE_INVALID: 'Ngày bắt đầu không hợp lệ',
  END_DATE_INVALID: 'Ngày kết thúc không hợp lệ',
  WEIGHT_TARGET_INVALID: 'Cân nặng mục tiêu không hợp lệ',
  PURPOSE_INVALID: 'Mục đích không hợp lệ',
  INVALID_WEIGHT_TARGET: 'Cân nặng mục tiêu không hợp lệ',
  MEAL_SCHEDULE_NOT_FOUND: 'Không tìm thấy meal schedule',
  UPDATE_MEAL_SCHEDULE_SUCCESS: 'Cập nhật meal schedule thành công',
  CREATE_MEAL_ITEM_SUCCESS: 'Tạo meal item thành công',
  GET_LIST_DATE_MEAL_ITEM_SUCCESS: 'Lấy danh sách ngày meal item thành công',
  COMPLETE_DATE_MEAL_ITEM_SUCCESS: 'Hoàn thành ngày meal item thành công',
  DELETE_DATE_MEAL_ITEM_SUCCESS: 'Xóa ngày meal item thành công',
  DELETE_MEAL_SCHEDULE_SUCCESS: 'Xóa meal schedule thành công'
}

export const RECIPE_MESSAGE = {
  CREATE_RECIPE_SUCCESS: 'Tạo công thức thành công',
  GET_RECIPE_SUCCESS: 'Lấy thông tin công thức thành công',
  IMAGE_REQUIRED: 'Ảnh không được để trống',
  REGION_INVALID: 'Khu vực không hợp lệ',
  TITLE_REQUIRED: 'Tiêu đề không được để trống',
  CONTENT_REQUIRED: 'Nội dung không được để trống',
  DESCRIPTION_REQUIRED: 'Mô tả không được để trống',
  TIME_INVALID: 'Thời gian không hợp lệ',
  DIFFICULT_LEVEL_INVALID: 'Độ khó không hợp lệ',
  PROCESSING_FOOD_INVALID: 'Chế biến thức ăn không hợp lệ',
  GET_ALL_RECIPE_CATEGORY_SUCCESS: 'Lấy danh mục công thức thành công',
  GET_LIST_RECIPE_FOR_CHEF_SUCCESS: 'Lấy danh sách công thức cho đầu bếp thành công',
  GET_RECIPE_FOR_CHEF_SUCCESS: 'Lấy thông tin công thức cho đầu bếp thành công',
  UPDATE_RECIPE_SUCCESS: 'Cập nhật công thức thành công',
  GET_LIST_RECIPE_FOR_USER_SUCCESS: 'Lấy danh sách công thức cho người dùng thành công',
  GET_RECIPE_FOR_USER_SUCCESS: 'Lấy thông tin công thức cho người dùng thành công',
  LIKE_RECIPE_SUCCESS: 'Like công thức thành công',
  CREATE_COMMENT_RECIPE_SUCCESS: 'Tạo bình luận công thức thành công',
  DELETE_COMMENT_RECIPE_SUCCESS: 'Xóa bình luận công thức thành công',
  BOOKMARK_RECIPE_SUCCESS: 'Bookmark công thức thành công',
  UNBOOKMARK_RECIPE_SUCCESS: 'Unbookmark công thức thành công',
  GET_COMMENT_RECIPE_SUCCESS: 'Lấy bình luận công thức thành công',
  RECIPE_NOT_FOUND: 'Không tìm thấy công thức'
}

export const ALBUM_MESSAGE = {
  CREATE_ALBUM_SUCCESS: 'Tạo album thành công',
  GET_LIST_ALBUM_SUCCESS: 'Lấy danh sách album thành công',
  GET_ALBUM_SUCCESS: 'Lấy thông tin album thành công',
  ALBUM_NOT_FOUND: 'Không tìm thấy album',
  DELETE_RECIPE_IN_ALBUM_SUCCESS: 'Xóa công thức trong album thành công',
  UPDATE_ALBUM_SUCCESS: 'Cập nhật album thành công',
  GET_RECIPES_IN_ALBUM_SUCCESS: 'Lấy danh sách công thức trong album thành công',
  BOOKMARK_ALBUM_SUCCESS: 'Bookmark album thành công',
  UN_BOOKMARK_ALBUM_SUCCESS: 'Unbookmark album thành công'
}

export const INGREDIENT_MESSAGE = {
  GET_ALL_CATEGORY_INGREDIENTS_SUCCESS: 'Lấy danh mục nguyên liệu thành công',
  GET_LIST_INGREDIENTS_SUCCESS: 'Lấy danh sách nguyên liệu thành công'
}
