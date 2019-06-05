let newPasswordValue;
let confirmationValue;
const submitBtn = document.getElementById('update-profile');
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
    submitBtn.setAtribute('disabled', true);
  } else {
    validatePasswords('Passwods mathc!', 'color-green', 'color-red');
    submitBtn.removeAtribute('disabled');
  }
});
