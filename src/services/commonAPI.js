import axios from "axios";

export const commonAPI = async ({ url, data = "", method }) => {
  try {
    return await axios({
      url,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return error;
  }
};
