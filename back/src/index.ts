import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server,{
    connectionStateRecovery: {}
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


io.on('connection', (socket) => {
        let gameStarted = false
        let player = 0;
        let life = 2;
        let emptyHand = 0
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
    const shuffledArray = shuffle(myArray);
    console.log(shuffledArray);

    //start party
    socket.on('PLAYER GAME', () => {
        player ++
        if(player === 2){
        io.emit('SERVER GAME');
        gameStarted = true;
        }
    })

    //start lvl
    socket.on('PLAYER UP HAND', ()=>{
        io.emit('SERVER UP HAND')
    })

    //player play card
    socket.on('PLAYER PLAY CARD', (msg)=>{
        io.emit('SERVER PLAY CARD', msg)
    })

    //player lost life
    socket.on('PLAYER LOST LIFE',()=>{
        life --
        io.emit('PLAYER LOST LIFE', life)
    })

    //player lost
    if(life <= 0 ){
        io.emit('END GAME', 'you lost')
        gameStarted = false;
    }

    //check if lvl is finito pipo
    socket.on('EMPTY HAND',()=>{
        emptyHand ++
        if(emptyHand == 2){
            io.emit('END LVL')
        }
    })


});
server.listen(3300, () => {
    console.log('server running at http://localhost:3300');
});

