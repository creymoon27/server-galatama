const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

let leaderboardData = {};

// Endpoint untuk webhook dari Roblox / Lynx
app.post('/webhook-galatama', (req, res) => {
    const data = req.body;
    const nama = data.nama;
    const berat = parseFloat(data.berat) || 0;

    if (!nama) {
        return res.status(400).send({ error: "Nama peserta kosong!" });
    }

    if (leaderboardData[nama]) {
        leaderboardData[nama] += berat;
    } else {
        leaderboardData[nama] = berat;
    }

    res.status(200).send({ status: "Sukses tercatat!" });
});

// Endpoint data untuk Leaderboard web
app.get('/api/leaderboard', (req, res) => {
    const sorted = Object.keys(leaderboardData)
        .map(nama => ({ nama, poin: leaderboardData[nama] }))
        .sort((a, b) => b.poin - a.poin);
    res.json(sorted);
});

// Menampilkan file HTML utama
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server aktif di port ${PORT}`));
