import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";

export default async function handler(req, res) {
    // 1. Ambil prompt dari QUERY (untuk GET) atau BODY (untuk POST)
    // Kini bisa diakses via Browser: /api/simi?prompt=halo
    const { prompt, lang = 'id' } = req.method === 'GET' ? req.query : req.body;

    // 2. Validasi Input
    if (!prompt) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'prompt' is required",
        });
    }

    try {
        const data = await simSimi(prompt, lang);
        
        if (!data) {
            return res.status(404).json({
                status: false,
                creator: CREATOR,
                error: "No response found from SimSimi",
            });
        }

        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error("Handler Error:", error.message);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: error.message || "Internal Server Error",
        });
    }
}

async function simSimi(text, language = 'id') {
    try {
        const { data } = await axios.post(
            "https://api.simsimi.vn/v1/simtalk", 
            new URLSearchParams({
                text,
                lc: language
            }).toString(), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        );

        if (data && data.message) {
            return data.message;
        } else {
            // Jika API merespon tapi tidak ada message
            throw new Error("Invalid response structure from API");
        }
    } catch (err) {
        // Tangkap error spesifik dari Axios
        if (err.response) {
            console.error("SimSimi API Error:", err.response.status, err.response.data);
            throw new Error(`SimSimi API Error: ${err.response.status}`);
        }
        throw err;
    }
}
