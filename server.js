const { WebcastPushConnection } = require('tiktok-live-connector');
const express = require('express');
const app = express();

const TIKTOK_USERNAME = '@hadalahbekgame';

let hangDoi = [];

const tiktok = new WebcastPushConnection(TIKTOK_USERNAME);

tiktok.connect()
    .then(() => console.log('Da ket noi TikTok Live!'))
    .catch(err => console.log('Loi:', err.message));

tiktok.on('comment', data => {
    console.log(`${data.uniqueId} comment: ${data.comment}`);

    // Tách từ đầu tiên trong comment làm username
    const words = data.comment.trim().split(/\s+/);
    const username = words[0];

    if (username && username.length > 0) {
        hangDoi.push({ loai: 'comment', username: username });
    }
});

tiktok.on('gift', data => {
    console.log(`${data.uniqueId} gui ${data.giftName}`);

    if (data.giftName === 'Rose') {
        hangDoi.push({ loai: 'spawn', username: data.uniqueId });
    }

    if (data.giftName === 'Rosa') {
        hangDoi.push({ loai: 'doidieu' });
    }
});

app.get('/events', (req, res) => {
    res.json(hangDoi);
    hangDoi = [];
});

app.listen(3000, () => console.log('Server dang chay!'));