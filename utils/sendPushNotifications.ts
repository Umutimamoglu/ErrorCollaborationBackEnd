import axios from 'axios';

export const sendPushNotification = async (
    expoPushToken: string,
    title: string,
    body: string,
    data: any = {}
) => {
    if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken')) {
        console.error("❌ Geçersiz Expo push token:", expoPushToken);
        return;
    }

    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
    };

    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
        });

        console.log("✅ Push notification gönderildi:", response.data);
    } catch (error) {
        console.error("❌ Push notification gönderme hatası:", error);
    }
};
