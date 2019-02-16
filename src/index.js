import {createActionNode,
    initStateNode,
    createStateNode,
    actionSelection,
    getScore,
    update} from "./mcts.js"
import {reset,
    debug,
    debugState,
    hashState} from "./utils.js"
import server from "./fakeserver.js"
import {randInt} from "./utils";

reset();

const mt = new Map();
let actionNode;
let stateNode;
let rootNode;
let action;
let state;

const actions = server.getGameInfo().availableActions;
const nPlayers = server.getGameInfo().nPlayers;

const maxRuns = 2000;
const record = [];

for (let run = 0; run < maxRuns; run++){
    state = server.newGame(randInt(0, nPlayers - 1));
    const stateHash = hashState(state.vector);
    if (mt.has(stateHash)){
        stateNode = mt.get(stateHash);
        stateNode.visits += 1;
    } else {
        stateNode = initStateNode(null, actions);
        mt.set(stateHash, stateNode);
    }
    rootNode = stateNode;
    action = actionSelection(stateNode, run, true);

    state = server.send(action);
    let safety = 0;
    while (safety < 100 && state.gameOver === false){
        actionNode = createActionNode(stateNode, action);
        stateNode = createStateNode(
            hashState(state.vector),
            mt, actionNode, actions);
        action = actionSelection(stateNode, run);
        state = server.send(action);
        safety += 1
    }
    // console.log(mt)
    // debug(mt)
    let score;
    if (state.isWinner===null){
        score = 0.5
    } else {
        score = state.isWinner ? 1 : 0;
    }
    record.push(state.isWinner);
    update(actionNode, score);
    // debug(mt)
    //debugState(state.vector)
    console.log(run)
}
console.log(record.map((t)=>t===null?'_':(t?1:0)).join(''));
debugState(state.vector);
debug(rootNode);
debug("=-=-=-=-=-=-=-=-=-=-");
debug([... mt].map(([key, val])=> [key, getScore(val, run), val.visits].join(', ')));
//debug([... mt].map(([key, val])=> getScore(val, run)!==null?[key, getScore(val, run), val.visits].join(', '):getScore(val, run)))
