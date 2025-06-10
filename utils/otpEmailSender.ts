// src/utils/otpEmailSender.ts
import { mailSender } from './mailSender'; // mailSender dosyanız utils içinde ise './mailSender'

/**
 * OTP doğrulama e-postası gönderir.
 * @param email Hedef e-posta adresi
 * @param otp Üretilen OTP kodu
 */
export async function sendVerificationEmail(email: string, otp: string): Promise<void> {
    console.log('[otpEmailSender] Email gönderimi başlıyor. Email:', email);
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #333; margin-bottom: 20px;">Email Doğrulama</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Hesabınızı doğrulamak için aşağıdaki OTP kodunu kullanın:
        </p>
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #2c5aa0; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
        </div>
        <p style="color: #888; font-size: 14px; margin-top: 30px;">
          Bu kod 5 dakika içinde geçerliliğini yitirecektir.
        </p>
      </div>
    </div>
  `;
    try {
        const mailResponse = await mailSender(email, 'Email Doğrulama (OTP)', htmlBody);
        console.log('[otpEmailSender] Email başarıyla gönderildi. messageId:', mailResponse.messageId);
    } catch (err) {
        console.error('[otpEmailSender] Email gönderme hatası:', err);
        throw err;
    }
}
