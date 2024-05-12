import * as nodemailer from 'nodemailer'
import { envConfig } from '~/constants/config'
import fs from 'fs'
import path from 'path'

const adminEmail = envConfig.SES_FROM_ADDRESS
const adminPassword = envConfig.EMAIL_PASSWORD

const verifyOtpEmailTemplate = fs.readFileSync(path.resolve('src/templates/emailOtp.html'), 'utf8')
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
    'Forgot Password',
    template
      .replace('{{title}}', 'Quên mật khẩu')
      .replace('{{content}}', 'Để đặt lại mật khẩu, xin vui lòng nhập mã OTP dưới đây:')
      .replace('{{otpCode}}', otp_code)
  )
}
