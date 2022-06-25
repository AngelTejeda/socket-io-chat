const chatContainer = $("#chat-container");
const messagesContainer = $("#messages-container");
const messageInput = $("#message-input");
const sendButton = $("#send-button");

let messages = [];

chatContainer.hide();

function getLastMessage() {
  return messages.length == 0
    ? null
    : messages[messages.length - 1];
}

// Triggers
messageInput.on("input", () => {
  const isDisabled = messageInput.val() == "";
  sendButton.prop("disabled", isDisabled);
});

messageInput.on("keypress", (event) => {
  if (event.key == "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// DOM
function getTimestampDom(millis, date) {
  const seconds = millis / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  
  let timestring;
  if (hours < 24) {
    timestring = moment(date).format("h:mm");
  }
  else if (days < 24 * 7) {
    timestring = moment(date).format("dddd h:mm")
  }
  else {
    timestring = moment(date).format("MMM Do h:mm")
  }

  return $("<div></div>")
    .text(timestring)
    .addClass("timestamp");
}

function getSenderDom(message) {
  return $("<div></div>")
    .text(message.user)
    .addClass("sender");
}

function getMessageGroupDom(lastMessage, nextMessage) {
  const timeDiffForNewGroup = 10 * 60 * 1000;

  if (lastMessage === null || lastMessage.user != nextMessage.user || nextMessage.date - lastMessage.date > timeDiffForNewGroup) {
    const messageClass = nextMessage.user == currentUser.user
      ? "sent"
      : "recieved";

    const messageGroupDom = $("<div></div>")
      .addClass("message-group " + messageClass);

    if (nextMessage.user !== currentUser.user) {
      messagesContainer.append(getSenderDom(nextMessage));
    }

    messagesContainer.append(messageGroupDom);

    return messageGroupDom;
  }
  else {
    return $(".message-group").last();
  }
}

function appendMessage(newMessage, tickClass) {
  const lastMessage = getLastMessage();

  // Message
  // const messageDom = $("<div></div>")
  //   .text(newMessage.text)
  //   .addClass("message");

  const messageDom = $("<div></div>")
    .addClass("message-line");

  if (tickClass !== null) {
    $(".fa-solid, message-tick").remove();

    messageDom.append(
      $("<i></i>")
        .addClass(tickClass + " fa-circle-check message-tick")
        .attr("id", newMessage.id)
    );
  }

  messageDom.append(
    $("<div></div>")
      .text(newMessage.text)
      .addClass("message")
  );

  // Timestamp
  const timeDiffForTimestamp = 30 * 60 * 60 * 10000;

  if (lastMessage === null || (newMessage.date - lastMessage.date > timeDiffForTimestamp)) {
    const timeDiff = lastMessage !== null
    ? newMessage.date - lastMessage.date
    : Date.now() - newMessage.date;

    messagesContainer.append(getTimestampDom(timeDiff, newMessage.date));
  }

  // Message Group
  messages.push(newMessage);
  getMessageGroupDom(lastMessage, newMessage)
    .append(messageDom);

  // messagesContainer.animate({ scrollTop: messagesContainer.prop("scrollHeight")}, 0);
}





function sendMessage() {
  if (messageInput.val() == "")
    return;

  const message = new Message(currentUser.user, messageInput.val(), Date.now());

  emitMessage(message);
  appendMessage(message, "fa-regular");

  messageInput.val("");
  sendButton.prop("disabled", "true");
}