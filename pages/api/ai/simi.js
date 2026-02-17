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
        console.error("SimSimi Error Detail:", error);
        
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: error.message || "Internal Server Error",
        });
    }
}

async function simSimi(text, language = 'id') {
    try {
        console.log("1. Mempersiapkan request ke SimSimi...");
        
        // Coba endpoint alternatif SimSimi
        const endpoints = [
            "https://api.simsimi.vn/v1/simtalk",
            "https://simsimi.fun/api/v1/",  // endpoint alternatif
            "https://api.simsimi.net/v2/"    // endpoint alternatif lain
        ];
        
        let lastError = null;
        
        // Coba semua endpoint sampai ada yang berhasil
        for (const endpoint of endpoints) {
            try {
                console.log(`2. Mencoba endpoint: ${endpoint}`);
                
                const params = new URLSearchParams();
                params.append('text', text);
                params.append('lc', language);
                
                // Format berbeda untuk setiap endpoint
                let requestData;
                let requestHeaders;
                
                if (endpoint.includes("simsimi.vn")) {
                    requestData = params.toString();
                    requestHeaders = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    };
                } else if (endpoint.includes("simsimi.fun")) {
                    requestData = {
                        text: text,
                        lang: language
                    };
                    requestHeaders = {
                        'Content-Type': 'application/json',
                    };
                } else {
                    requestData = {
                        message: text,
                        language: language
                    };
                    requestHeaders = {
                        'Content-Type': 'application/json',
                    };
                }
                
                console.log("3. Mengirim request dengan data:", requestData);
                
                const response = await axios({
                    method: 'post',
                    url: endpoint,
                    data: requestData,
                    headers: {
                        ...requestHeaders,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'application/json',
                    },
                    timeout: 5000
                });
                
                console.log(`4. Response dari ${endpoint}:`, response.data);
                
                // Parse response berdasarkan endpoint
                if (response.data) {
                    if (response.data.message) {
                        return response.data.message;
                    } else if (response.data.success?.message) {
                        return response.data.success.message;
                    } else if (response.data.response) {
                        return response.data.response;
                    } else if (response.data.msg) {
                        return response.data.msg;
                    } else if (typeof response.data === 'string') {
                        return response.data;
                    }
                }
                
            } catch (err) {
                console.log(`Endpoint ${endpoint} gagal:`, err.message);
                lastError = err;
                continue; // Coba endpoint berikutnya
            }
        }
        
        // Jika semua endpoint gagal, coba API SimSimi versi lama
        try {
            console.log("5. Mencoba API versi lama...");
            const response = await axios.get(`https://api.simsimi.net/v1/?text=${encodeURIComponent(text)}&lang=${language}`);
            console.log("Response versi lama:", response.data);
            
            if (response.data && response.data.response) {
                return response.data.response;
            }
        } catch (err) {
            console.log("API versi lama gagal:", err.message);
        }
        
        // Jika semua gagal, gunakan response alternatif
        console.log("6. Semua endpoint gagal, menggunakan response lokal");
        return getLocalResponse(text, language);
        
    } catch (error) {
        console.error("Final error in simSimi function:", error);
        throw new Error("Gagal terhubung ke server SimSimi");
    }
}

// Fungsi fallback jika API down
function getLocalResponse(text, language) {
    const lowerText = text.toLowerCase();
    
    // Respons sederhana dalam bahasa Indonesia
    if (language === 'id') {
        if (lowerText.includes('halo') || lowerText.includes('hai') || lowerText.includes('hi')) {
            return "Halo juga! Ada yang bisa saya bantu?";
        } else if (lowerText.includes('apa kabar') || lowerText.includes('kabar')) {
            return "Kabar baik! Bagaimana denganmu?";
        } else if (lowerText.includes('siapa nama') || lowerText.includes('nama kamu')) {
            return "Nama saya Simi, senang berkenalan denganmu!";
        } else if (lowerText.includes('terima kasih') || lowerText.includes('makasih')) {
            return "Sama-sama! Senang bisa membantu.";
        } else if (lowerText.includes('bye') || lowerText.includes('dadah') || lowerText.includes('sampai jumpa')) {
            return "Sampai jumpa lagi! Semoga harimu menyenangkan.";
        } else {
            return "Maaf, saya sedang mengalami masalah koneksi. Silakan coba lagi nanti.";
        }
    } 
    // Respons dalam bahasa Inggris
    else {
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello too! How can I help you?";
        } else if (lowerText.includes('how are you')) {
            return "I'm fine, thank you! How about you?";
        } else if (lowerText.includes('your name')) {
            return "My name is Simi, nice to meet you!";
        } else if (lowerText.includes('thank')) {
            return "You're welcome! Happy to help.";
        } else if (lowerText.includes('bye')) {
            return "Goodbye! Have a nice day.";
        } else {
            return "Sorry, I'm having connection issues. Please try again later.";
        }
    }
}
