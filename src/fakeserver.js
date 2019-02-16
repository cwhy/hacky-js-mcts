import {randInt} from "./utils.js"

const info = {
    availableActions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    nPlayers: 2
};
let state = {
    gameOver: false,
    isWinner: null,
    vector: [0, 0, 0, 0, 0, 0, 0, 0, 0]
};

const winConds = [
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0]
];

const checkWinCond = (vector, agentCode) => {
    let correctFlag = false;
    vector = vector.map(i => i===agentCode?i:0);
    winConds.forEach((winCond) => {
        let correctFlags = 0;
        winCond.map(
            (e, i) => {
                if((e - vector[i]) < 1) {
                    correctFlags += 1;
                }
            });
        if (correctFlags >= 9) {
            correctFlag = true
        }
    });
    return correctFlag;
};

const checkDrawCond = (vector) =>
    vector.every(i => i !== 0);

export default {
    getGameInfo: function() {
        return info;
    },
    newGame: function() {
        state.vector = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        state.gameOver = false;
        state.isWinner = null;
        return state;
    },
    send: function(action) {
        const actionInt = parseInt(action) - 1;
        if (state.vector[actionInt] !== 0){
            state.gameOver = true;
            state.isWinner = false
        } else {
            state.vector[actionInt] = 1;
            if (checkDrawCond(state.vector)){
                state.gameOver = true;
                state.isWinner = null
            } else if (checkWinCond(state.vector, 1)){
                state.gameOver = true;
                state.isWinner = true
            } else {
                let z = randInt(0, 8);
                let j = 0;
                while(state.vector[z] !== 0){
                    z = randInt(0, 8);
                    j += 1;
                    if (j> 100){
                        debugger;
                    }
                }
                state.vector[z] = -1;
                if (checkWinCond(state.vector, -1)){
                    state.gameOver = true;
                    state.isWinner = false
                } else if (checkDrawCond(state.vector)){
                    state.gameOver = true;
                    state.isWinner = null
                }

            }
        }
        return state;
    }
}
