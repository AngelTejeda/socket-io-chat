// Socket
const socket = io();

socket.on('replicate-message', (data) => {
  if (data.user != currentUser.user) {
    appendMessage(data, false);
  }
  else {
    let messageDom = $("#" + data.id);

    if (data.id == getLastMessage().id) {
      messageDom.removeClass("fa-regular");
      messageDom.addClass("fa-solid");
    }
    else {
      messageDom.remove();
    }
  }
});

function emitLogin(email, user) {
  socket.emit('login', {
    mail: email,
    user: user
  });
}

function emitMessage(message) {
  socket.emit('new-message', {
    id: message.id,
    user: message.user,
    text: message.text,
  });
}

socket.on('chat-messages', (data) => {
  chatContainer.show();
  messageInput.trigger("focus");

  messagesContainer.empty();
  messages = [];

  data.messages.forEach((message, index) => {
    const tickClass = index == data.messages.length - 1
      ? 'fa-solid'
      : null;
    appendMessage(message, tickClass);
  });
});

socket.on('new-user', (newUser) => {
  if (currentUser.user != newUser.user) {
    connectedUsers.push(newUser);
    
    dropdownOptions.append(
      $("<a></a>")
        .attr("href", "#")
        .text(newUser.user)
        .addClass("dropdown-item")
    );
  }
})