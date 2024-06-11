import * as nodemailer from 'nodemailer'
import { envConfig } from '~/constants/config'
import fs from 'fs'
import path from 'path'

const adminEmail = envConfig.SES_FROM_ADDRESS
const adminPassword = envConfig.EMAIL_PASSWORD

const verifyOtpEmailTemplate = fs.readFileSync(path.resolve('src/templates/emailOtp.html'), 'utf8')
const acceptEmailTemplate = fs.readFileSync(path.resolve('src/templates/emailAccept.html'), 'utf8')
// Mình sử dụng host của google - gmail
const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587

export const sendMail = (to: string, subject: string, htmlContent: string) => {
  // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })

  const options = {
    from: adminEmail, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: subject, // Tiêu đề của mail
    html: htmlContent // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
  }

  // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
  return transporter.sendMail(options)
}

export const sendForgotPasswordEmailNodeMailer = (
  toAddress: string,
  otp_code: string,
  template: string = verifyOtpEmailTemplate
) => {
  return sendMail(
    toAddress,
    'Thư từ CookHealthy',
    template
      .replace('{{title}}', 'Quên mật khẩu')
      .replace('{{content}}', 'Để đặt lại mật khẩu, xin vui lòng nhập mã OTP dưới đây:')
      .replace('{{otpCode}}', otp_code)
  )
}

export const sendRejectEmailNodeMailer = (
  toAddress: string,
  user_name: string,
  template: string = acceptEmailTemplate
) => {
  return sendMail(
    toAddress,
    'Thư từ CookHealthy',
    template
      .replace('{{user_name}}', user_name)
      .replace(
        '{{content}}',
        'Lời đầu tiên, đội ngũ CookHealthy xin cảm ơn anh đã quan tâm và dành thời gian để đăng ký tài khoản đầu bếp trên hệ thống của chúng tôi. Tuy nhiên, sau khi đã kiểm tra và xác nhận thông tin của anh, chúng tôi rất tiếc phải thông báo rằng tài khoản của anh chưa đủ điều kiện để nâng cấp lên tài khoản đầu bếp. Chúng tôi rất tiếc về sự bất tiện này và mong anh thông cảm. Chúng tôi sẽ lưu trữ thông tin của anh và thông báo cho anh khi có cơ hội phù hợp hơn.'
      )
      .replace('{{note}}', 'Lưu ý: Đây là email tự động, vui lòng không trả lời email này.')
  )
}

export const sendAcceptEmailNodeMailer = (
  toAddress: string,
  user_name: string,
  template: string = acceptEmailTemplate
) => {
  return sendMail(
    toAddress,
    'Thư từ CookHealthy',
    template
      .replace('{{user_name}}', user_name)
      .replace(
        '{{content}}',
        'Lời đầu tiên, đội ngũ CookHealthy xin cảm ơn anh đã quan tâm và dành thời gian để đăng ký tài khoản đầu bếp trên hệ thống của chúng tôi. Sau khi đã kiểm tra và xác nhận thông tin của anh, chúng tôi xin trân trọng thông báo rằng tài khoản của anh đã được chấp nhận nâng cấp lên tài khoản đầu bếp. Chúng tôi rất vui mừng khi chào đón anh trở thành một thành viên của đội ngũ đầu bếp của chúng tôi.'
      )
      .replace(
        '{{note}}',
        'Lưu ý: Để mở thêm chức năng bạn vui lòng đăng xuất và đăng nhập lại hệ thống. Xin lỗi vì sự bất tiện này.'
      )
  )
}
