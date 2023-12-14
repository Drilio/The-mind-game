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


socket.on('SERVER PLAY CARD', (msg: any) => {
  console.log('SERVER PLAY CARD', msg);
});


socket.on('END LVL', () => {
  console.log('END LVL');
});


const startButton = document.getElementById('start-button') as HTMLButtonElement;
const playerNameDisplay = document.getElementById('player-name') as HTMLDivElement;


startButton.addEventListener("click",() => {
  socket.emit('PLAYER GAME', 'PLAYER GAMES');
  const playerName = prompt("ton prenom :");
  if (playerName) {
    socket.emit('PLAYER NAME', playerName);
    playerNameDisplay.textContent = `Player Name: ${playerName}`;
    startButton.remove();
  } else {
    alert("le nom est obligatoire");
  }
})





