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
  GMAIL_NOT_VERIFIED: 'Email chưa được xác thực'
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
  UPDATE_POST_FAIL: 'Không thể cập nhật bài viết'
} as const
