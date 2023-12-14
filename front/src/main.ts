import { io } from "socket.io-client";

const socket = io("http://localhost:3300");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("SERVER GAME", ()=>{
  console.log('SERVER GAME')
})

socket.on("SERVER UP HAND", (cards: number[])=>{
  console.log('SERVER UP HAND', cards)
})


const startButton = document.getElementById('start-button') as HTMLButtonElement

startButton.addEventListener("click",() => {
  socket.emit('PLAYER game', 'PLAYER game')
})



