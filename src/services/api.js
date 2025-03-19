import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
});

export const fetchData = async () => {
  try {
    const response = await api.get("/data");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default api;
