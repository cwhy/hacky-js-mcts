import mctsAgentGen from "./mcts.js"
import {reset, debug, debugState} from "./utils.js"
import server from "./fakeserver.js"
import {randInt} from "./utils";

reset();

const actions = server.getGameInfo().availableActions;
const nPlayers = server.getGameInfo().nPlayers;

const mctsAgent = mctsAgentGen().init(actions);

const maxRuns = 5000;
const record = [];
const scoreTable = new Map([[true, 1], [false, 0], [null, 0.5]]);


for (let run = 0; run < maxRuns; run++){
    let state = server.newGame(randInt(0, nPlayers - 1));
    mctsAgent.newGame(state);
    do {
        let action = mctsAgent.actionSelection(state);
        state = server.send(action);
    } while (state.gameOver === false);

    record.push(state.isWinner);
    mctsAgent.update(scoreTable.get(state.isWinner));
    //debugState(state.vector)
    console.log(run);
    if (run === maxRuns)
        debugState(state.vector);
}
console.log(record.map((t)=>t===null?'_':(t?1:0)).join(''));
console.log(mctsAgent.rootNode);
console.log(mctsAgent.firstActionRecord);
debug(mctsAgent.getStateScoreTable());
