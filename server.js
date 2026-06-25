const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock API Endpoint for checking resi
app.get('/api/track', (req, res) => {
    const { awb, courier } = req.query;

    if (!awb || !courier) {
        return res.status(400).json({ error: 'Tracking number (awb) and courier are required.' });
    }

    // Mock tracking timeline
    setTimeout(() => {
        res.json({
            status: 200,
            message: 'Successfully tracked package',
            data: {
                summary: {
                    awb: awb,
                    courier: courier.toUpperCase(),
                    status: 'DELIVERED',
                    date: new Date().toISOString(),
                    desc: 'Paket telah diterima oleh YBS.',
                    amount: 'Rp 15.000',
                    weight: '1.2 kg'
                },
                detail: {
                    origin: 'JAKARTA',
                    destination: 'BANDUNG',
                    shipper: 'SleekStore Official',
                    receiver: 'Budi Santoso'
                },
                history: [
                    {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
                        desc: 'Paket telah diserahkan ke kurir oleh pengirim',
                        location: 'JAKARTA'
                    },
                    {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
                        desc: 'Paket telah berangkat dari fasilitas transit',
                        location: 'JAKARTA SORTING CENTER'
                    },
                    {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
                        desc: 'Paket telah tiba di fasilitas transit tujuan',
                        location: 'BANDUNG GATEWAY'
                    },
                    {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
                        desc: 'Paket sedang dibawa oleh kurir menuju alamat tujuan',
                        location: 'BANDUNG'
                    },
                    {
                        date: new Date().toISOString(),
                        desc: 'Paket telah diterima oleh YBS (Yang Bersangkutan)',
                        location: 'BANDUNG'
                    }
                ].reverse() // Newest first
            }
        });
    }, 1500); // simulate network delay
});

app.listen(PORT, () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
});
