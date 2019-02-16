import {randChoice, uctScore} from "./math.js"
import {randChoice} from "./math";

const unknownScore = 2;
const exploreCoef = 3*Math.sqrt(2);

export const getScore = (node, nSims) => {
    if (node === null){
        return unknownScore
    } else {
        return uctScore(
            node.score,
            node.visits,
            nSims,
            exploreCoef);
    }
};

const initActionStates = (acts) => new Map(acts.map(i => [i, null]));

export const initStateNode = (p, acts) => ({
    visits: 1,
    score: 0,
    parent: p,
    children:initActionStates(acts)});

export const createStateNode = (stateHash, mt, actionNode, actions) => {
    if (mt.has(stateHash)){
        const stateNode = mt.get(stateHash);
        stateNode.parent = actionNode;
        stateNode.visits += 1;
        actionNode.children.add(stateHash);
        return stateNode
    } else {
        const stateNode = initStateNode(actionNode, actions);
        mt.set(stateHash, stateNode);
        actionNode.children.add(stateHash);
        return stateNode
    }
};

export const createActionNode = (stateNode, act) => {
    let actionNode = stateNode.children.get(act);
    if ( actionNode !== null ){
        actionNode.visits += 1;
    } else {
        actionNode = {
            action: act,
            visits: 1,
            score: 0,
            parent: stateNode,
            children: new Set()};
        stateNode.children.set(act, actionNode)
    }
    return actionNode
};

export const actionSelection = (stateNode, nSims, ift) => {
    const children = stateNode.children;
    const scores = Array.from(children).map(
        ([action, actionNode]) => {
            return [action, getScore(actionNode, nSims)]
        }
    );
    let maxScore = scores[0][1];
    scores.forEach(
        ([action, score]) => {
            if (score > maxScore)
                maxScore = score
        }
    );
    const maxActions = scores.filter(([action, score]) =>
        score === maxScore
    );
    return randChoice(maxActions)[0];
};

export const update = (lastNode, finalScore) => {
    if (lastNode.parent === null){
        lastNode.score += finalScore;

    } else if (lastNode.parent.children instanceof Set){
        if (lastNode.parent.children.size === 1){
            lastNode.score += finalScore;
            update(lastNode.parent, finalScore)
        } else {
            const N = lastNode.parent.visits;
            const n = lastNode.visits;
            const newScore = finalScore * n/N;
            lastNode.score += newScore;
            update(lastNode.parent, newScore)
        }
    } else {
        lastNode.score += finalScore;
        update(lastNode.parent, finalScore)
    }
};
