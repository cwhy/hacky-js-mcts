import {getScore} from "./uct.js"
import {hashState} from "./utils";
import {randomBest, sampleItem} from "./commonMath";


const updateRec = (lastNode, finalScore) => {
    if (lastNode.parent === null){
        lastNode.score += finalScore;

    } else if (lastNode.parent.nextStates instanceof Map){
        if (lastNode.parent.nextStates.size === 1){
            lastNode.score += finalScore;
            updateRec(lastNode.parent, finalScore)
        } else {
            const N = lastNode.parent.visits;
            const n = lastNode.visits;
            const newScore = finalScore * n/N;
            lastNode.score += newScore;
            updateRec(lastNode.parent, newScore)
        }
    } else {
        lastNode.score += finalScore;
        updateRec(lastNode.parent, finalScore)
    }
};

export default () => ({
    startRollout: false,
    rootNode: null,
    currentState: null,
    currentActionInfo: null,
    actions: null,
    actionToIdx: null,
    allStates: new Map(),
    firstActionRecord: "",
    init: function (actions) {
        this.actions = actions;
        this.actionToIdx = new Map(actions.map((a, i) => [a, i]));
        return this
    },

    newGame: function (state) {
        this.startRollout = false;
        if (this.rootNode === null)
            this.rootNode = this.initStateNode(state,null);
        this.currentState = this.rootNode;
        this.rootNode.visits += 1;
        this.currentActionInfo = null;
    },

    initStateActions: function (stateNode) {
        return this.actions.map(i => ({
            action: i,
            visits: 0,
            score: 0,
            parent: stateNode,
            nextStates: new Map() })
        );
    },

    initStateNode: function (state, sourceAction) {
        const newStateNode = {
            visits: 1,
            score: 0,
            parent: sourceAction,
            actions: null
        };
        newStateNode.actions = this.initStateActions(newStateNode);
        this.allStates.set(hashState(state.vector), newStateNode);
        return newStateNode
    },

    walkState: function (state) {
        const actionInfo = this.currentActionInfo;
        const stateHash = hashState(state.vector);
        const actionStates = actionInfo.nextStates;
        if (actionStates.has(stateHash)) {
            const stateNode = actionStates.get(stateHash);
            stateNode.visits += 1;
            this.currentState = stateNode
        } else {
            this.currentState = this.initStateNode(state, actionInfo);
            actionStates.set(stateHash, this.currentState);
        }
    },

    actionSelection: function (state) {
        if (this.startRollout){
            const probs = Array(this.actions.length).fill(1);
            const action = sampleItem(this.actions, probs);
            return action
        } else {
            if (this.currentActionInfo !== null){
                this.walkState(state);
            }
            const actionInfos = this.currentState.actions;
            const scores = actionInfos.map(getScore);
            const actionInfo = randomBest(actionInfos, scores);
            if (this.currentState === this.rootNode){
                if (this.rootNode.visits === 4700)
                {
                    console.log(scores, actionInfos)
                    //debugger;
                }
            }
            const action = actionInfo.action;
            this.currentActionInfo = actionInfo;
            if (this.currentActionInfo.visits === 0) {
                this.startRollout = true;
            }
            this.currentActionInfo.visits += 1;
            return action
        }
    },

    update: function (score) {
        const lastNode = this.currentState;
        updateRec(lastNode, score)
    },

    getStateScoreTable: function(){
        return [... this.allStates].map(([key, val]) =>
            [key, getScore(val), val.visits].join(', '))
    }

});

