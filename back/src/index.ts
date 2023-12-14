import express from 'express';
import { createServer } from 'node:http';
import {Server, Socket} from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server,{
    connectionStateRecovery: {}
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

let gameStarted = false;
let life = 2;
let emptyHand = 0;
let lvl = 1;
let roundStarted = false;
let playerIDs: string[] = [];
let sockets: Socket[] = []
const shuffle = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
};

// Usage
const myArray : number[] = [];
for (let i = 0; i <= 99; i++) {
    myArray.push(i);
}

// @ts-ignore
let shuffledArray: number[] = shuffle(myArray);
console.log(shuffledArray);


//PREPARE GAME
let roundDeck:number[] = [...shuffledArray];

function getCards(){
    let playerHand: number[]= [];
    playerHand = roundDeck.slice(0, lvl);
    roundDeck = roundDeck.slice(lvl);
    return playerHand;
}

io.on('connection', (socket) => {

    //START GAME
    //start party
    socket.on('PLAYER GAME', () => {
        playerIDs.push(socket.id);
        if (playerIDs.length == 2) {
            io.emit('SERVER GAME');
            gameStarted = true;
            roundStarted = true;
   }
    })

    // Deck of card distribution
    socket.on('askCards', () => {
        socket.emit('your cards', getCards())
    })

    //start round
    socket.on('PLAYER UP HAND', () => {
        io.emit('SERVER UP HAND')
    })

    //player play card
    socket.on('PLAYER PLAY CARD', (msg) => {
        io.emit('SERVER PLAY CARD', msg)
    })

    //End round
    socket.on('PLAYER EMPTY HAND', () => {
        emptyHand++
        if (emptyHand == 2) {
            roundStarted = false
            lvl++
            io.emit('Round end')
        }
    })

    //player lost life
    socket.on('PLAYER LOST LIFE', () => {
        life--
        io.emit('PLAYER LOST LIFE', life)
        // END GAME
        //player lost
        if (life <= 0) {
            io.emit('END GAME', 'you lost')
            gameStarted = false;
        }
    })
});
server.listen(3300, () => {
    console.log('server running at http://localhost:3300');
});

