let newPasswordValue;
let confirmationValue;
const form = document.querySelector('form');
const newPassword = document.getElementById('new-password');
const confiramtion = document.getElementById('password-confiramtion');
const validationMessage = document.getElementById('validation-message');

function validatePasswords(message, add, remove) {
  validationMessage.textContent = message;
  validationMessage.classList.add(add)
  validationMessage.classList.remove(remove);
}

// add a listener to the confiramtion for any input
// anytime the user goes inside of that input and begins typing they're going to be firing off this function
confiramtion.addEventListener('input', e => {
  e.preventDefault();
  newPasswordValue = newPassword.value;
  confirmationValue = confiramtion.value;
  if(newPasswordValue !== confirmationValue) {
    validatePasswords('Passwods must mathc!', 'color-red', 'color-green');
  } else {
    validatePasswords('Passwods mathc!', 'color-green', 'color-red');
  }
});

form.addEventListener('submit', e => {
  if(newPasswordValue !== confirmationValue) {
    e.preventDefault();
    const error = document.getElementById('error');
    if (!error) {
      const flashErrorH1 = document.createElement('h1');
      flashErrorH1.classList.add('color-red');
      flashErrorH1.setAttribute('id', 'error');
      flashErrorH1.textContent = 'Passwords must match!';
      const navbar = document.getElementById('navbar');
      navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling)
    }
  }
});
