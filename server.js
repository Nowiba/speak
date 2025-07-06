const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert('./serviceAccountKey.json'),
    databaseURL: 'YOUR_DATABASE_URL'
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Send push notification endpoint
app.post('/send-notification', async (req, res) => {
    try {
        const { token, notification } = req.body;

        const message = {
            token: token,
            notification: notification,
            android: {
                priority: 'HIGH'
            },
            apns: {
                headers: {
                    'apns-priority': '5'
                },
                payload: {
                    aps: {
                        priority: '5'
                    }
                }
            }
        };

        const response = await admin.messaging().send(message);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
