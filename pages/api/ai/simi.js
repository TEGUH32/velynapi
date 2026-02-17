import { CREATOR } from "../../../settings";
import axios from "axios";

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Izinkan GET dan POST
    if (req.method !== "GET" && req.method !== "POST") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed. Use GET or POST",
        });
    }

    // Ambil prompt dari query (GET) atau body (POST)
    let prompt, language = 'id';
    
    if (req.method === "GET") {
        prompt = req.query.prompt;
        language = req.query.language || 'id';
    } else {
        prompt = req.body?.prompt;
        language = req.body?.language || 'id';
    }
    
    // Validasi input
    if (!prompt) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Prompt is required",
        });
    }

    try {
        console.log("Processing SimSimi request:", { prompt, language, method: req.method });
        const data = await simSimi(prompt, language);
        
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error("SimSimi Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        res.status(error.response?.status || 500).json({
            status: false,
            creator: CREATOR,
            error: error.response?.data?.message || error.message || "Internal Server Error",
        });
    }
}

async function simSimi(text, language = 'id') {
    try {
        const params = new URLSearchParams();
        params.append('text', text);
        params.append('lc', language);
        
        console.log("Sending to SimSimi API:", { text, language });
        
        const { data } = await axios.post("https://api.simsimi.vn/v1/simtalk", 
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json',
                },
                timeout: 10000
            }
        );
        
        console.log("SimSimi API Response:", data);
        
        if (!data || !data.message) {
            throw new Error("Invalid response from SimSimi API");
        }
        
        return data.message;
        
    } catch (error) {
        console.error("SimSimi API Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        if (error.response?.status === 404) {
            throw new Error("SimSimi API endpoint not found");
        } else if (error.code === 'ECONNABORTED') {
            throw new Error("SimSimi API timeout");
        } else if (error.response?.data) {
            throw new Error(error.response.data.message || "SimSimi API error");
        }
        
        throw error;
    }
}
