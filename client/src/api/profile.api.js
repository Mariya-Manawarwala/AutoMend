import api from '../lib/axios';

export const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  console.log("Updating Profile with data:", profileData);
  const formData = new FormData();

  Object.keys(profileData).forEach((key) => {
    if (profileData[key] !== undefined && profileData[key] !== null) {
      formData.append(key, profileData[key]);
    }
  });

  try {
    const response = await api.put("/profile/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Profile Update API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteAccount = async () => {
  const response = await api.delete('/profile/delete');
  return response.data;
};
