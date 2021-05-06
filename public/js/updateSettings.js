// Update Data
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (name, email, country, home_tel, mobile_tel) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email,
        country,
        home_tel,
        mobile_tel,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
