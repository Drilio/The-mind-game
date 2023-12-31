import express from 'express';
import {createServer} from 'node:http';
import {Server, Socket} from 'socket.io';
import {beforeEach} from "node:test";
import {restartTries} from "concurrently/dist/src/defaults";

interface IPlayer {
        'playerId': string,
        'name': string,
        'hand': number[],
    }

const app = express();
const server = createServer(app);
const io = new Server(server, {
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
let sockets: Socket[] = [];
let cardsPlayThisRound: number[] = [];
let playersHand : IPlayer[] = [];
const shuffle = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
};

// Usage
const myArray: number[] = [];
for (let i = 0; i <= 99; i++) {
    myArray.push(i);
}

// @ts-ignore
let shuffledArray: number[] = shuffle(myArray);
console.log(shuffledArray);


//PREPARE GAME
let roundDeck: number[] = [...shuffledArray];

function getCards(deck: number[]) {
    let playerHand: number[] = [];
    playerHand = deck.slice(0, lvl);
    const newDeck = deck.slice(lvl);
    return [playerHand, newDeck];
}

function checkCardPlayed(cardValue: number, allPlayerCards: number[]): number {
    const numbersLowerThanGiven = allPlayerCards.filter(arrayNum => arrayNum < cardValue);
    return numbersLowerThanGiven.length;
}

function didWeLost(lostLife: number, life: number) {
    life = life - lostLife;
    if (life <= 0) {
        io.emit('END GAME', 'you lost');
        resetGame()
    }
}

function sendData(){
    let gameData = [{
        gameStarted : gameStarted,
        life: life,
        emptyhand: emptyHand,
        lvl: lvl,
        roundStarted: roundStarted,
        playerIds: playerIDs,
        cardsPlayThisRound: cardsPlayThisRound,
    }]
    io.emit('GameData : ', gameData)
}

function resetGame() {
    life = 2
    gameStarted = false
    emptyHand = 0
    lvl = 1
    roundStarted = false
    playerIDs = []
    sockets = []
    cardsPlayThisRound = []
}

function lvlUp(lvl: number, life: number) {
    lvl++
    if (lvl == 3 || lvl == 6 || lvl == 9) {
        life++
    }
}

function getPlayersWithCleanHands(cardPlay: number, playersHand: IPlayer[]){
    return playersHand.map((player)=> ({
        ...player,
        hand: player.hand.filter(playerCard => playerCard < cardPlay)
    }))
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
    socket.on('askCards', (playerName) => {
        const [hand, newDeck] = getCards(roundDeck)
        roundDeck = newDeck
        socket.emit('your cards', hand)
        playersHand.push(
            {
                'playerId': socket.id,
                'name': playerName,
                'hand': hand,
            })
    })

    //start round
    socket.on('PLAYER UP HAND', () => {
        io.emit('SERVER UP HAND')
    })

    //player play card
    socket.on('PLAYER PLAY CARD', (cardPlay) => {
        io.emit('SERVER PLAY CARD', cardPlay);
        cardsPlayThisRound.push(cardPlay);
        const allPlayerCards = playersHand.reduce((acc: number[], val, i) => {
            return [...acc, ...val.hand]
        }, [])
        const checkCards = checkCardPlayed(cardPlay, allPlayerCards);
        playersHand = getPlayersWithCleanHands(cardPlay, playersHand)
        didWeLost(checkCards, life);
    })

    //End round
    socket.on('PLAYER EMPTY HAND', () => {
        emptyHand++
        if (emptyHand == 2) {
            roundStarted = false;
            lvlUp(lvl, life);
            io.emit('Round end');
            cardsPlayThisRound = [];
        }
        if (lvl >= 12) {
            io.emit('END GAME', 'you won !')
            resetGame()
        }
    })

    socket.on('I NEED DATA', ()=>{
        sendData();
    })

    //player lost life
    socket.on('PLAYER LOST LIFE', () => {
        io.emit('PLAYER LOST LIFE', life);
        // END GAME
        //player lost
        didWeLost(1, life)
    })
});
server.listen(3300, () => {
    console.log('server running at http://localhost:3300');
});

