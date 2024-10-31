// import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
// import { envConfig } from '~/constants/config'
// import fs from 'fs'
// import path from 'path'

// // Create SES service object.
// const sesClient = new SESClient({
//   region: envConfig.AWS_REGION,
//   credentials: {
//     secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: envConfig.AWS_ACCESS_KEY_ID
//   }
// })

// const verifyOtpEmailTemplate = fs.readFileSync(path.resolve('src/templates/emailOtp.html'), 'utf8')

// const createSendEmailCommand = ({
//   fromAddress,
//   toAddresses,
//   ccAddresses = [],
//   body,
//   subject,
//   replyToAddresses = []
// }: {
//   fromAddress: string
//   toAddresses: string | string[]
//   ccAddresses?: string | string[]
//   body: string
//   subject: string
//   replyToAddresses?: string | string[]
// }) => {
//   return new SendEmailCommand({
//     Destination: {
//       /* required */
//       CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
//       ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
//     },
//     Message: {
//       /* required */
//       Body: {
//         /* required */
//         Html: {
//           Charset: 'UTF-8',
//           Data: body
//         }
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: subject
//       }
//     },
//     Source: fromAddress,
//     ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
//   })
// }

// export const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
//   const sendEmailCommand = createSendEmailCommand({
//     fromAddress: envConfig.SES_FROM_ADDRESS,
//     toAddresses: toAddress,
//     body,
//     subject
//   })
//   return sesClient.send(sendEmailCommand)
// }

// export const sendForgotPasswordEmail = (
//   toAddress: string,
//   otp_code: string,
//   template: string = verifyOtpEmailTemplate
// ) => {
//   return sendVerifyEmail(
//     toAddress,
//     'Forgot Password',
//     template
//       .replace('{{title}}', 'Quên mật khẩu')
//       .replace('{{content}}', 'Để đặt lại mật khẩu, xin vui lòng nhập mã OTP dưới đây:')
//       .replace('{{otpCode}}', otp_code)
//   )
// }
