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

reset();

const mt = new Map();
var actionNode;
var stateNode;
var rootNode;
var action;
var state;

const actions = server.getGameInfo().availableActions;

const maxRuns = 2000;
const record = [];

for (var run = 0; run < maxRuns; run++){
    state = server.newGame();
    const stateHash = hashState(state.vector)
    if (mt.has(stateHash)){
        stateNode = mt.get(stateHash)
        stateNode.visits += 1;
    } else {
        stateNode = initStateNode(null, actions);
        mt.set(stateHash, stateNode);
    }
    rootNode = stateNode;
    action = actionSelection(stateNode, run, true);

    state = server.send(action);
    var safety = 0;
    while (safety < 100 && state.gameOver === false){
        actionNode = createActionNode(stateNode, action)
        stateNode = createStateNode(
            hashState(state.vector),
            mt, actionNode, actions)
        action = actionSelection(stateNode, run);
        state = server.send(action);
        safety += 1
    }
    // console.log(mt)
    // debug(mt)
    var score;
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
console.log(record.map((t)=>t===null?'_':(t?1:0)).join(''))
debugState(state.vector)
debug(rootNode)
debug("=-=-=-=-=-=-=-=-=-=-")
debug([... mt].map(([key, val])=> [key, getScore(val, run), val.visits].join(', ')))
//debug([... mt].map(([key, val])=> getScore(val, run)!==null?[key, getScore(val, run), val.visits].join(', '):getScore(val, run)))
