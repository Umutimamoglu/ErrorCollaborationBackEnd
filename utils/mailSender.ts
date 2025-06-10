import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// .env dosyasını yüklediğimizden emin olalım
dotenv.config();

export const mailSender = async (email: string, title: string, body: string) => {
    console.log('[mailSender] Başladı. Alıcı:', email);

    // ENV değişkenlerini al
    const host = process.env.MAIL_HOST;
    const portStr = process.env.MAIL_PORT;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;
    const fromName = process.env.MAIL_FROM_NAME || 'Error Collaboration';

    // Logla (parolayı yazdırmayalım; sadece varlığını kontrol edelim)
    console.log('[mailSender] ENV kontrolleri:', {
        MAIL_HOST: host,
        MAIL_PORT: portStr,
        MAIL_USER: user,
        MAIL_PASS_DEFINED: !!pass,
        MAIL_FROM_NAME: fromName,
    });

    // Gerekli ENV’lerin dolu olduğundan emin olalım
    if (!host || !portStr || !user || !pass) {
        const msg = '[mailSender] Eksik SMTP konfigürasyonu. .env içindeki MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS değerlerini kontrol edin.';
        console.error(msg);
        throw new Error(msg);
    }

    // Port’u parse et
    const port = parseInt(portStr, 10);

    // from alanını biçimlendir. 
    // Eski kodunuzda `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>` yazmışsınız.
    // Çift tırnak eklemek bazen e-posta alıcısında fazladan tırnak görünmesine yol açabilir.
    // Tipik doğru format: `Error Collaboration <ornek@gmail.com>`
    const fromAddress = `${fromName} <${user}>`;

    // Transporter oluştur
    let transporter;
    try {
        transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // 465 için true (SSL), 587 için false (STARTTLS)
            auth: {
                user,
                pass,
            },
            // Eğer TLS sertifika sorunları yaşarsanız test aşamasında açabilirsiniz:
            // tls: {
            //   rejectUnauthorized: false,
            // },
        });
    } catch (err) {
        console.error('[mailSender] Transporter oluşturma hatası:', err);
        throw err;
    }

    // SMTP kimlik doğrulama ve bağlantı kontrolü (sadece debug/test amacıyla; prod’da her gönderimde yapmayabilirsiniz)
    try {
        await transporter.verify();
        console.log('[mailSender] SMTP transporter doğrulandı (verify başarılı).');
    } catch (verifyErr) {
        console.error('[mailSender] SMTP transporter verify hatası:', verifyErr);
        // Burada hata fırlatıyoruz; bu durumda sendMail aşamasına ilerlemeden önce sorunun nerede olduğunu görmüş oluruz.
        throw verifyErr;
    }

    // E-posta gönder
    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: title,
            html: body,
            // Eğer dilerseniz text fallback ekleyin:
            // text: body.replace(/<[^>]*>/g, ''), // basit HTML’den düz metin çıkarma
        });
        console.log('[mailSender] E-posta gönderildi. messageId:', info.messageId);
        return info;
    } catch (sendErr: any) {
        console.error('[mailSender] sendMail hatası:', sendErr);
        // sendErr.response ya da sendErr.message içindeki detay loglanmış oldu.
        throw sendErr;
    }
};
