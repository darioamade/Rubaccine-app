import axios from 'axios';
import { showAlert, showMyAlert1 } from './alerts';

export const showMyAlert = function () {
  const loginSuccessMsg = document.querySelector('.signin-account-container');
  loginSuccessMsg.textContent = '';
  loginSuccessMsg.style.display = 'flex';
  loginSuccessMsg.style.justifyContent = 'center';
  loginSuccessMsg.style.alignItems = 'center';
  loginSuccessMsg.style.fontSize = '2.5rem';
  loginSuccessMsg.style.fontWeigth = '500';
  loginSuccessMsg.style.color = 'black';
  loginSuccessMsg.style.textAlign = 'center';
  loginSuccessMsg.insertAdjacentText(
    'afterbegin',
    'You were Logged in successfully'
  );
};


export const showMyAlertFail = function () {
  const loginErrorMsg = document.querySelector('.signin-account-container');
  loginErrorMsg.textContent = '';
  loginErrorMsg.style.display = 'flex';
  loginErrorMsg.style.justifyContent = 'center';
  loginErrorMsg.style.alignItems = 'center';
  loginErrorMsg.style.fontSize = '2.5rem';
  loginErrorMsg.style.fontWeigth = '500';
  loginErrorMsg.style.color = 'black';
  loginErrorMsg.insertAdjacentText(
    'afterbegin',
    'Error logging out! Please Try again.'
  );
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged in successfully!');
      showMyAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Sign Up  successfully!');
 
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};


export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    //if ((res.data.status = 'success')) location.reload(true);
    if ((res.data.status = 'success')) {
      location.reload();
      location.assign('/');
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Please Try again.');
  }
};

export const logoutBtn = document.getElementById('logout-clicked');
if (logoutBtn) logoutBtn.addEventListener('click', logout);
//const logoutBtn = document.getElementById('logout-clicked');

//   const markup = ` <div class="alert alert--${type}">${msg}</div>`;

//  showAlert('success', 'Logged in successfully!');

