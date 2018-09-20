var client = new WebSocket('ws://' + window.WEB_SOCKET_URL);

var NEW_CLIENT_EVENT = 'NEW_CLIENT_EVENT';
var CLOSE_CLIENT_SESSION = 'CLOSE_CLIENT_SESSION';
var TOTAL_CLIENTS_CONNECTED = 'TOTAL_CLIENTS_CONNECTED';
var MESSAGE = 'MESSAGE';
var currentSessionUuid = '';
var currentSessionHandleColor = randDarkColor();

function randDarkColor() {
  var lum = -0.25;
  var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var rgb = "#",
      c, i;
  for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

Date.prototype.getFullMinutes = function () {
  if (this.getMinutes() < 10) {
      return '0' + this.getMinutes();
  }
  return this.getMinutes();
};

client.onmessage = function (event) {
  var message = JSON.parse(event.data)

  console.log('message', message)

  switch (message.type) {
    case NEW_CLIENT_EVENT:
      currentSessionUuid = message.payload;
      break;
    case TOTAL_CLIENTS_CONNECTED:
      document.getElementById('total-clients').innerHTML = message.payload;
      break;
    case MESSAGE:
      document.getElementById('chat').innerHTML = '<li class="message"><span class="handle" style="color:' + message.payload.handleColor + '">' + message.payload.handle + '</span><p class="text">' + message.payload.message + '</p><span class="time">' + message.payload.time + '</span></li>' + document.getElementById('chat').innerHTML;
      break;
  }
};

client.onopen = function(event) {
  console.log('onopen', event);
};

client.onclose = function(event) {
  console.log('onclose', event);
};

window.onunload = function () {
  client.send(
    JSON.stringify({
      type: CLOSE_CLIENT_SESSION,
      payload: currentSessionUuid
    })
  );
};

document.getElementById('chat-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var handle = document.getElementById('handle').value;
  var message = document.getElementById('message').value;

  if (!handle || !message) {
    return;
  }

  var date = new Date();

  client.send(
    JSON.stringify({
      type: MESSAGE,
      payload: {
        uuid: currentSessionUuid,
        handleColor: currentSessionHandleColor,
        handle: handle,
        message: message,
        time: date.getHours() + ':' + date.getFullMinutes()
      }
    })
  );

  document.getElementById('message').value = '';
});