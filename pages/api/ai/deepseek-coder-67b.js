import axios from "axios";
import FormData from "form-data";
import { CREATOR } from "../../../settings";

export default async function handler(req, res) {
    // Set CORS headers untuk mengizinkan request dari berbagai origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Izinkan method GET dan POST
    if (req.method !== "GET" && req.method !== "POST") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed. Use GET or POST",
        });
    }

    // Ambil prompt dari query (GET) atau body (POST)
    const prompt = req.method === "GET" ? req.query.prompt : req.body?.prompt;
    
    // Validasi input
    if (!prompt) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Prompt is required",
        });
    }

    try {
        const data = await deepSeekCoder.chat(prompt);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error("DeepSeek API Error:", error.response?.data || error.message);
        
        // Kirim error detail untuk debugging
        res.status(error.response?.status || 500).json({
            status: false,
            creator: CREATOR,
            error: error.response?.data?.message || error.message || "Internal Server Error",
        });
    }
}

const deepSeekCoder = {
   chat: async (question) => {
      try {
          const formData = new FormData();
          
          // Perbaiki format content sesuai yang diharapkan API
          formData.append("content", question); // Langsung kirim pertanyaan
          formData.append("model", "@hf/thebloke/deepseek-coder-6.7b-instruct-awq");
          
          // Tambahkan parameter tambahan jika diperlukan
          formData.append("temperature", 0.7);
          formData.append("max_tokens", 1000);
          
          const headers = {
              ...formData.getHeaders(),
              // Tambahkan headers tambahan jika diperlukan
              'Accept': 'application/json',
          };
          
          console.log("Sending request to DeepSeek API...");
          
          const response = await axios.post("https://mind.hydrooo.web.id/v1/chat", formData, {
              headers: headers,
              timeout: 30000, // 30 detik timeout
          });
          
          console.log("DeepSeek API Response:", response.data);
          
          // Sesuaikan dengan struktur response API
          return response.data.result || response.data;
          
      } catch (error) {
          console.error("DeepSeek API Error Details:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
          });
          throw error;
      }
   }
};
