var socket = io();

let loginSection = $("#login");
let messagesSection = $("#messages");

let user = $("#user");
let mail = $("#mail");

let messageField = $("#message-field");
let sendButton = $("#send-button");

let history = $("#history");

let messages = [];

let username;

messagesSection.hide();

// TODO: Remove
// loginSection.hide();
// username = "angel";

messageField.on("input", () => {
  let disabled = messageField.val() == "";
  sendButton.prop("disabled", disabled);
});

messageField.on("keypress", (event) => {
  if (event.key == "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

function getLastMessage() {
  return messages.length == 0
    ? null
    : messages[messages.length - 1];
}

function getLastMessageGroup() {
  return $(".message-group").last();
}

function generateMessage(message) {
  let lastMessage = getLastMessage();

  let messageGroup;

  console.log(lastMessage);
  console.log(message);

  if (lastMessage != null && lastMessage.user == message.user
     && (Date.now() - lastMessage.date) <= 2 * 1000
    ) {
    messageGroup = getLastMessageGroup();
  }
  else {
    let sideClass = message.user == username
      ? "sent"
      : "recieved";

    messageGroup = $("<div></div>")
      .addClass("message-group " + sideClass);

    history.append(messageGroup);
  }

  let newMessage = $("<div></div>")
    .text(message.message)
    .addClass("message");

  messageGroup.append(newMessage);

  messages.push(message);
}

function login() {
  socket.emit('user-data', {
    mail: mail.val(),
    user: user.val()
  });

  username = user.val();

  loginSection.hide();
  messagesSection.show();

  socket.on('get-data', (data) => {
    messages = data;

    for (message of data) {
      generateMessage(data);
    }
  });
}

function sendMessage() {
  if (messageField.val() == "")
    return;

  socket.emit('send-message', {
    user: username,
    message: messageField.val()
  });

  let message = {
    user: username,
    message: messageField.val(),
    date: Date.now()
  };

  generateMessage(message);

  messageField.val("");
  sendButton.prop("disabled", "true");
}

socket.on('new-message', (data) => {
  if (data.user != username) {
    generateMessage(data);
  }
});