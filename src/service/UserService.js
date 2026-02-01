import {  search } from "./ApiService";
import api from "./Axios";
import { sendMessages } from "./websocket";


export function setCurrentReceiver(user){

    const currentReceiver= user.username;
    localStorage.setItem("currentReceiver",currentReceiver);
    localStorage.setItem("currentReceiverData", JSON.stringify(user));
    
}

export function getCurrentReceiver(){
    return localStorage.getItem("currentReceiver");
}

export function getToken(){
    return localStorage.getItem("token");
}

export function addSelectedChat(user) {
  const currentUser = localStorage.getItem("username");
  const key = `selectedChats_${currentUser}`;

  const chats = JSON.parse(localStorage.getItem(key)) || [];

  const exists = chats.some(chat => chat.username === user.username);

  if (!exists) {
    chats.push(user);
    localStorage.setItem(key, JSON.stringify(chats));
  }
  else{

  }
}

export async function addIncommingContact(msg) {
  const currentUser = localStorage.getItem("username");
  const key = `selectedChats_${currentUser}`;

  let chats = JSON.parse(localStorage.getItem(key)) || [];

  // ❌ remove old position
  chats = chats.filter(chat => chat.username !== msg.sender);

  // 🔍 fetch sender
  const response = await search(msg.sender);
  const senderUser = response.data?.[0];

  if (senderUser) {
    const updatedUser = {
      ...senderUser,
      unread: true,              // 🔴 mark unread
      lastMessage: msg.content,
      lastTime: Date.now(),
    };

    // 🔝 add on top
    chats.unshift(updatedUser);
    localStorage.setItem(key, JSON.stringify(chats));
  }
}





export function getSelectedChats() {
  const currentUser = localStorage.getItem("username");
  const key = `selectedChats_${currentUser}`;

  const chats = localStorage.getItem(key);
  return chats ? JSON.parse(chats) : [];
}

export function deleteAllData(){
  localStorage.clear();

}


export function sendMessage(messageContent) {

    
    const receiver = getCurrentReceiver();
    console.log("Sending message to:", receiver);

     const currentUser = localStorage.getItem("username");
      const token=localStorage.getItem("token");
    if (!receiver) {
      alert("Please select a user to chat with");
      return;
    }

    if (!messageContent) {
      alert("Message cannot be empty");
      return;
    }

    console.log()
    try {
      const success = sendMessages(
        currentUser,
        receiver,
        messageContent,
        token
      );
      
      if (success) {
        
        console.log("send ",messageContent)

      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  }



