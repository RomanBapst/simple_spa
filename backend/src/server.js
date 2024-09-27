const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post('/api/submit-data', async (req, res) => {
    try {
        const { name, surname, instagram, inTouchOption, watchTimeOption, timestamp, device } = req.body;
        
        // Make the request to Google Apps Script API
        const googleResponse = await axios.post(process.env.GOOGLE_API_URL, {
            timestamp,
            name,
            surname,
            instagram,
            inTouchOption,
            watchTimeOption,
            device
        });
        
        // If successful, forward the response back to the client
        res.status(200).json({ success: true, message: 'Data submitted successfully' });
    } catch (error) {
        console.error('Error submitting data:', error.message);
        res.status(500).json({ success: false, message: 'Failed to submit data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
