import * as mcts from "mcts.js"

const body = document.getElementsByTagName('body')[0];
const reset = () => {body.innerHTML = "Hell-o-Wor LD" + '<br><br>'};
const debug = x => {body.innerHTML += "debug: " + x + '<br>'};
reset();


const createActionStates = (acts) => acts.reduce(
    (acc, nextE) => {acc[nextE] = null; return acc},
    {}
)

const createStateNode = (p, acts) => ({
    action: null,
    visits: 1,
    score: 0,
    parent: p,
    children:createActionStates(acts)});

const createActionStateNode = (p, a) => ({
    action: a,
    visits: 1,
    score: 0,
    parent: p,
    children:[]});

const mt = new Map();
var runs = 0

// init, get avail actions
const actions = ['1', '2', '3']
// got state z
const z = [1, 0, 0, 2 ,3];
const rootNode = createStateNode(null, actions);
mt.set(z, rootNode);
debug(z);
debug(mt.get(z).parent);
debug(mcts.actionSelection(rootNode))


