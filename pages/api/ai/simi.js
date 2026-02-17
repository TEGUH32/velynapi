import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";

export default async function handler(req, res) {
    // 1. Validasi Method
    if (req.method !== "POST") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed, use POST",
        });
    }

    // 2. Ambil data dari body (bukan query) untuk method POST
    const { prompt, lang = 'id' } = req.body;

    // 3. Validasi Input
    if (!prompt) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'prompt' is required in body",
        });
    }

    try {
        const data = await simSimi(prompt, lang);
        
        // 4. Validasi hasil data sebelum dikirim
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

        // 5. Cek apakah response memiliki pesan
        if (data && data.message) {
            return data.message;
        } else {
            throw new Error("Invalid response structure from API");
        }
    } catch (err) {
        // Tangkap error spesifik dari Axios (misalnya 429 Too Many Requests atau 500)
        if (err.response) {
            console.error("SimSimi API Error:", err.response.status, err.response.data);
            throw new Error(`SimSimi API Error: ${err.response.status}`);
        }
        throw err;
    }
}
