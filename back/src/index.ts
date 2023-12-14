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

function getCards(deck:number[]){
    let playerHand: number[]= [];
    playerHand = deck.slice(0, lvl);
    const newDeck = deck.slice(lvl);
    return [playerHand, newDeck];
}

io.on('connection', (socket) => {
        let gameStarted = false
        let player = 0;
        let life = 2;
        let emptyHand = 0;
        let lvl = 1;
        let roundStarted = false
    // Deck of card distribution
    const shuffle = (array: string[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

// Usage
    const myArray = [];
    for( let i =0; i<=99; i++){
        myArray.push(i);
    }
    // @ts-ignore
    let shuffledArray = shuffle(myArray);
    console.log(shuffledArray);

    //PREPARE GAME
    let roundDeck = [... shuffledArray];
    //start party
    socket.on('PLAYER GAME', () => {
        player ++
        if (player == 2) {
            io.emit('SERVER GAME');
            gameStarted = true;
            roundStarted = true;
            for (let i = 0; i < lvl; i++) {
                const random = Math.floor(Math.random() * roundDeck.length);
                io.emit(roundDeck[random]);
                roundDeck = shuffledArray.filter((val, i) => {
                    i !== random
                });
            }
        }
    })

    //START GAME

    //start round
    socket.on('PLAYER UP HAND', ()=>{
        io.emit('SERVER UP HAND')
    })

    //player play card
    socket.on('PLAYER PLAY CARD', (msg)=>{
        io.emit('SERVER PLAY CARD', msg)
    })

    //End round
    socket.on('PLAYER EMPTY HAND', ()=>{
        let emptyHand = 0;
        emptyHand ++
        if(emptyHand == 2){
            roundStarted = false
            lvl ++
            io.emit('Round end')
        }
    })

    //player lost life
    socket.on('PLAYER LOST LIFE',()=>{
        life --
        io.emit('PLAYER LOST LIFE', life)
    })

    // END GAME

    //player lost
    if(life <= 0 ){
        io.emit('END GAME', 'you lost')
        gameStarted = false;
    }

});
server.listen(3300, () => {
    console.log('server running at http://localhost:3300');
});

