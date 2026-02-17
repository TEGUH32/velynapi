import { CREATOR } from "../../../settings";
import axios from "axios";

export default async function handler(req, res) {
    // ... (bagian atas sama seperti sebelumnya)

    try {
        console.log("Processing SimSimi request:", { prompt, language, method: req.method });
        const data = await simSimiAlternative(prompt, language);
        
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error("SimSimi Error:", error);
        
        // Fallback response
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: "Maaf, saya sedang dalam mode offline. Silakan coba lagi nanti.",
            offline: true
        });
    }
}

// Menggunakan API SimSimi alternatif yang lebih stabil
async function simSimiAlternative(text, language = 'id') {
    try {
        // Gunakan API SimSimi versi 2
        const response = await axios.post('https://api.simsimi.net/v2/', 
            new URLSearchParams({
                text: text,
                lang: language
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        if (response.data && response.data.success) {
            return response.data.success;
        }
        
        throw new Error('Invalid response');
        
    } catch (error) {
        console.log("API v2 gagal, coba API v1...");
        
        // Fallback ke API v1
        const response = await axios.get(`https://api.simsimi.net/v1/?text=${encodeURIComponent(text)}&lang=${language}`);
        
        if (response.data && response.data.response) {
            return response.data.response;
        }
        
        throw error;
    }
}
