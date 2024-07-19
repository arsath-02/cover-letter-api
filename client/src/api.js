// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const generateCoverLetter = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_URL}/generate_cover_letter`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
