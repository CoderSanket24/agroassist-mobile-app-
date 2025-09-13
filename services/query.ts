import axios from "axios";

// ⚠️ Change this to your backend URL
const API_URL = "http://172.168.2.99:8000";

export const askQuery = async (question: string) => {
  try {
    const response = await axios.post(`${API_URL}/ask`, { question });
    return response.data; // { id, question, answer, created_at }
  } catch (error) {
    console.error("Error in askQuery:", error);
    throw error;
  }
};
