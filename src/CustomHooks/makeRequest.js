import axios from 'axios';
import { REACT_APP_API_URL } from '@env'; // Import your environment variable

export const makeRequest = async (url) => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}${url}`);
    return data;
  } catch (error) {
    console.error(error);
    return error; // Return the error for handling
  }
};