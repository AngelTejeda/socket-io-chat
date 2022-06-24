var socket = io();
$("#login").css("display", "none");
$("#messages").css("display", "block");

function login() {
  let user = $("#user").val();
  let mail = $("#mail").val();

  $("#login").css("display", "none");
  $("#messages").css("display", "block");

  socket.emit('user-data', {
    mail: mail,
    user: user
  });
}


// socket.on('start', (data) => {
//   alert("I recieved something: " + data.data);
// });