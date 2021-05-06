// Type is 'success' or ' error'
//MOVE Up --> parentElement
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = ` <div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 1000);
};

/* export const showMyAlert1 = function () {
  hideAlert();
  const loginSuccessMsg = document.querySelector('.signin-account-container');
  // loginSuccessMsg.textContent = '';
  // loginSuccessMsg.style.display = 'flex';
  // loginSuccessMsg.style.justifyContent = 'center';
  // loginSuccessMsg.style.alignItems = 'center';
  // loginSuccessMsg.style.fontSize = '2.5rem';
  // loginSuccessMsg.style.fontWeigth = '500';
  // loginSuccessMsg.style.color = 'black';
  loginSuccessMsg.insertAdjacentText(
    'afterbegin',
    `Welcome to Rubaccine`
  );
}; */
