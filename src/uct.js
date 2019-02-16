const unknownScore = 5;
const exploreCoef = 0.2*Math.sqrt(2);

export const getScore = (node) => {
    if (node.parent === null) {
        return 0
    }
    if (node.visits === 0){
        return unknownScore
    } else {
        const w = node.score;
        const n = node.visits;
        const N = node.parent.visits;
        const c = exploreCoef;
        const x = w/n + Math.sqrt(Math.log(N)/n)*c;
        return x
    }
};

