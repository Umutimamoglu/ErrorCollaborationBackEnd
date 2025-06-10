import { Request, Response } from 'express';
import otpGenerator from 'otp-generator';
import User from '../models/userModel';
import { OTP, IOTP } from '../models/otpModel';
import { sendVerificationEmail } from '../utils/otpEmailSender';

/**
 * POST /send-otp
 * Body: { email: string }
 */
export const sendOTP = async (req: Request, res: Response) => {
    console.log('[sendOTP] İstek alındı:', req.body);

    try {
        const { email }: { email: string } = req.body;

        // Email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            console.warn('[sendOTP] Geçersiz email formatı:', email);
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir email adresi girin',
            });
        }

        // Kullanıcının zaten kayıtlı olup olmadığını kontrol et
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            console.warn('[sendOTP] Bu email ile kullanıcı zaten var:', email);
            return res.status(401).json({
                success: false,
                message: 'Bu email adresi ile zaten kayıtlı bir kullanıcı var',
            });
        }

        // OTP üretimi ve benzersiz olana kadar döngü
        let otp: string;
        let exists: IOTP | null;
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            });
            exists = await OTP.findOne({ otp });
        } while (exists);

        console.log('[sendOTP] Üretilen OTP (DB kaydeden önce):', otp);

        // Önce OTP modelinde oluşturup kaydetmek yerine önce email gönderimi yapıp sonra kaydetme de yapılabilir.
        // Burada e-posta gönderimini önce deneyeceğiz; başarılı olursa DB'ye kaydedeceğiz.
        try {
            console.log('[sendOTP] E-posta gönderimi başlıyor. Email:', email);
            await sendVerificationEmail(email, otp);
            console.log('[sendOTP] E-posta gönderimi başarılı. Şimdi OTP DB kaydı oluşturulacak.');
        } catch (emailErr) {
            console.error('[sendOTP] E-posta gönderme hatası:', emailErr);
            // E-posta gönderimi başarısızsa OTP kaydı yapılmaz.
            return res.status(500).json({
                success: false,
                message: 'OTP e-postası gönderilemedi, lütfen tekrar deneyin.',
                error: (emailErr as Error).message || emailErr,
            });
        }

        // E-posta başarılı gönderildiyse OTP'yi DB'ye kaydet
        let otpDoc: IOTP;
        try {
            otpDoc = await OTP.create({ email, otp });
            console.log('[sendOTP] OTP başarıyla veritabanına kaydedildi. id:', otpDoc._id);
        } catch (dbErr) {
            console.error('[sendOTP] OTP veritabanı kaydetme hatası:', dbErr);
            return res.status(500).json({
                success: false,
                message: 'OTP kaydedilirken hata oluştu.',
                error: (dbErr as Error).message || dbErr,
            });
        }

        // Başarılı yanıt
        return res.status(200).json({
            success: true,
            message: 'OTP başarıyla gönderildi ve kaydedildi',
            data: {
                email: email,
                otpId: otpDoc._id,
                // Güvenlik için OTP değerini response’da dönmüyoruz. Geliştirme aşamasında isterseniz dönülebilir, prod’da kesinlikle dönmeyin.
            }
        });
    } catch (error: any) {
        console.error('[sendOTP] Genel hata:', error);
        return res.status(500).json({
            success: false,
            message: 'OTP gönderilirken bir hata oluştu',
            error: error.message || error,
        });
    }
};
