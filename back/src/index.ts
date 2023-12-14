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
let cardsPlayThisRound:number[] = []
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
function checkCardPlayed(number: number, array: number[]):number
{
    const numbersLowerThanGiven = array.filter(arrayNum => arrayNum < number);
    return numbersLowerThanGiven.length;
}

function didWeLost(lostLife:number, life:number){
    life = life - lostLife;
    if (life <= 0) {
        io.emit('END GAME', 'you lost');
        resetGame()
    }
}

function resetGame(){
    life = 2
    gameStarted = false
    emptyHand = 0
    lvl = 1
    roundStarted = false
    playerIDs = []
    sockets = []
    cardsPlayThisRound = []
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
        const [hand, newDeck] = getCards(roundDeck)
        roundDeck = newDeck
        socket.emit('your cards', hand)
    })

    //start round
    socket.on('PLAYER UP HAND', () => {
        io.emit('SERVER UP HAND')
    })

    //player play card
    socket.on('PLAYER PLAY CARD', (cardPlay) => {
        io.emit('SERVER PLAY CARD', cardPlay);
        cardsPlayThisRound.push(cardPlay);
        const checkCards=checkCardPlayed(cardPlay,cardsPlayThisRound);
        didWeLost(checkCards, life);
    })

    //End round
    socket.on('PLAYER EMPTY HAND', () => {
        emptyHand++
        if (emptyHand == 2) {
            roundStarted = false;
            lvl++;
            io.emit('Round end');
            cardsPlayThisRound = [];
        }
        if(lvl >= 12){
            io.emit('END GAME', 'you won !')
            resetGame()
        }
    })

    //player lost life
    socket.on('PLAYER LOST LIFE', () => {
        life--;
        io.emit('PLAYER LOST LIFE', life);
        // END GAME
        //player lost
        didWeLost(1, life)
    })
});
server.listen(3300, () => {
    console.log('server running at http://localhost:3300');
});

