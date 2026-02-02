import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {url} from "./Axios";

var stompClient = null;
var isWebSocketConnected = false;
var activeSubscriptions = new Map();
var reconnectAttempts = 0;

const MAX_RECONNECT_ATTEMPTS = 5;

export function connectToWebSocketAndReceiverMessages(
  currentUser,
  token,
  handleIncomingMessage,
  onConnectedCallback,
) {
  if (!currentUser || !token) {
    console.error("WebSocket connection aborted: user or token missing");
    return;
  }

  if (stompClient) {
    disconnectWebSocket();
  }
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${url}/chat?token=${token}`),
    debug: (str) => console.debug("STOMP: ", str),

    reconnectDelay: 0,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    beforeConnect: () => {
      console.log("Connecting WebSocket...");
    },
    onConnect: (frame) => {
      console.log("WebSocket CONNECTED:", frame.headers["session"]);
      isWebSocketConnected = true;
      reconnectAttempts = 0;

      // clear old subscriptions
      activeSubscriptions.forEach((id) => stompClient.unsubscribe(id));
      activeSubscriptions.clear();

      // subscribe to user queue
      const subscription = stompClient.subscribe(
        "/user/queue/messages",
        (message) => {
          try {
            const parsed = JSON.parse(message.body);
            handleIncomingMessage(parsed);
          } catch (err) {
            console.error("Message parse error:", err);
          }
        },
      );

      activeSubscriptions.set(currentUser, subscription.id);

      if (onConnectedCallback) {
        onConnectedCallback();
      }
    },
 onStompError: (frame) => {
      console.error("STOMP ERROR:", frame.headers["message"]);
      disconnectWebSocket();
    },

    onWebSocketClose: () => {
      console.warn("WebSocket CLOSED");
      isWebSocketConnected = false;
      attemptReconnect(
        currentUser,
        token,
        handleIncomingMessage,
        onConnectedCallback,
      );
    },

    onWebSocketError: (error) => {
      console.error("WebSocket ERROR:", error);
      isWebSocketConnected = false;
      attemptReconnect(
        currentUser,
        token,
        handleIncomingMessage,
        onConnectedCallback,
      );
    },
  });

  stompClient.activate();
}

function attemptReconnect(
  currentUser,
  token,
  handleIncomingMessage,
  onConnectedCallback,
) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error("Max WebSocket reconnect attempts reached");
    return;
  }

  reconnectAttempts++;
  const delay = reconnectAttempts * 3000;

  console.warn(
    `Reconnecting WebSocket (attempt ${reconnectAttempts}) in ${delay}ms`,
  );

  setTimeout(() => {
    connectToWebSocketAndReceiverMessages(
      currentUser,
      token,
      handleIncomingMessage,
      onConnectedCallback,
    );
  }, delay);
}

export function sendMessages(sender, receiver, messageContent, token) {
  if (!isWebSocketConnected || !stompClient) {
    console.warn("Cannot send message - WebSocket not connected");
    return false;
  }

  if (!messageContent) {
    return false;
  }

  
  

  try {
   
    stompClient.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(messageContent),
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });

    return true;
  } catch (error) {
    console.error("Send failed:", error);
    return false;
  }
}


export function disconnectWebSocket() {
  if (stompClient) {
    isWebSocketConnected = false;
    activeSubscriptions.clear();

    stompClient
      .deactivate()
      .then(() => console.log("WebSocket DISCONNECTED"))
      .catch((err) => console.error("Disconnect error:", err));

    stompClient = null;
  }
}

export function isSocketConnected() {
  return isWebSocketConnected;
}
