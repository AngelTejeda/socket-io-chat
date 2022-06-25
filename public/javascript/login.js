$("#login-form").on("submit", (e) => {
  e.preventDefault();
});

const loginSection = $("#login");
const userInput = $("#user");
const dropdownOptions = $("#dropdown-options");
// let mail = $("#mail");
let currentUser = { id: null, user: '' };

let connectedUsers = [];

function login() {
  currentUser.user = userInput.val();
  //let email = mail.val();
  let email = ""
  
  emitLogin(email, currentUser.user);
  loginSection.hide();
}