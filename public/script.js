// Socket
let socket = io();

socket.on('new-message', (data) => {
  if (data.user != username) {
    generateMessage(data);
  }
});

function emitMessage(email, user) {
  socket.emit('user-data', {
    mail: email,
    user: user
  });
}

class Message {
  constructor(user, text, date) {
    this.user = user;
    this.text = text;
    this.date = date;
  }
}

// Login
let loginSection = $("#login");
let user = $("#user");
let mail = $("#mail");
let username;

// Chat
let messagesSection = $("#messages");
let history = $("#history");
let messageField = $("#message-field");
let sendButton = $("#send-button");

let messages = [];

messagesSection.hide();


// Message field events
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

// DOM
function getLastMessageGroup() {
  return $(".message-group").last();
}


function generateMessage(message) {
  let lastMessage = getLastMessage();

  let messageGroup;

  // Timestamp
  if (lastMessage === null || (message.date - lastMessage.date > 5 * 1000)) {
    let timeDiff = lastMessage !== null
      ? message.date - lastMessage.date
      : Date.now() - message.date;

    let d = new Date(timeDiff);

    let timestring;

    let hours = timeDiff / 1000 / 60 / 60;
    let days = hours / 24;

    console.log(hours, days);

    if (hours < 24) {
      timestring = moment(message.date).format("h:mm");
      // timestring = d.toLocaleString('en-US', { hour12: false });
    }
    else if (days < 24 * 7) {
      timestring = moment(message.date).format("dddd h:mm")
    }
    else {
      timestring = moment(message.date).format("MMM Do h:mm")
    }

    let timeElement = $("<div></div>")
      .text(timestring)
      .addClass("timestamp");

    history.append(timeElement);
  }

  // Message Group
  if (lastMessage != null && lastMessage.user == message.user && (message.date - lastMessage.date) <= 2 * 1000) {
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

  // Message
  let newMessage = $("<div></div>")
    .text(message.message)
    .addClass("message");

  messageGroup.append(newMessage);

  messages.push(message);

  history.animate({ scrollTop: history.prop("scrollHeight")}, 1000);
}

function login() {
  username = user.val();

  emitMessage(mail.val(), username);

  loginSection.hide();
  messagesSection.show();

  socket.on('get-data', (data) => {
    messages = data;

    for (message of data) {
      generateMessage(data);
    }
  });

  // generateMessage({
  //   message: "Test",
  //   date: new Date("2022/06/22"),
  //   user: "a"
  // });
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