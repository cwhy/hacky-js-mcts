import * as F from "math.js"
const unknownScore = 5
const exploreCoef = Math.sqrt(2)

const getScore = (node) => {
    if (node === null){
        unknownScore
    } else {
        F.uct_score(
            node.score,
            node.visits,
            node.parent.visits,
            exploreCoef);
    }
}

const actionSelection = (stateNode) => {
    const children = stateNode.children;
    Object.entries(children).map(
        ([action, actionNode]) => {
            [action, getScore(actionNode)]
        }
    ).reduce(
        (max, nextE) => {
            nextE[1] < min ? nextE : min},
        0
    )[0];
}
