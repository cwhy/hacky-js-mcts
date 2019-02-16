export const stocasticPolicy = (allActionVisits, stateVisits) => {
    const NAs = allActionVisits;
    const NS = stateVisits;
    const probs = NAs.map(N => N/NS);
    const allIdx = Array.from(
        {length: allActionVisits.length},
        (x,i) => i);
    const actionIndex = sampleItem(allIdx, probs);
    return actionIndex
};

export const sampleItem = (items, scores) => {
    const sumScores = scores.reduce((p, c) => p + c, 0);
    const probs = scores.map(s => s/sumScores);
    const num = Math.random(),
        lastIndex = probs.length - 1;
    let s = 0;

    for (let i = 0; i < lastIndex; ++i) {
        s += probs[i];
        if (num < s) {
            return items[i];
        }
    }
    return items[lastIndex];
};

export const randomBest = (items, scores) => {
    let maxScore = scores[0];
    scores.forEach(
        score => {
            if (score > maxScore)
                maxScore = score
        }
    );
    const maxActions = scores.map((score, i) =>
        score === maxScore ? i : false
    ).filter(i => i !== false);
    return items[randChoice(maxActions)];
};

export const randChoice = (choices) => {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
};

/*
export const alphaZeroScore = (value, estimation, visits, stateVisits, exploreCoef) => {
    const Q = value;
    const P = estimation;
    const c = exploreCoef;
    const Nb = stateVisits;
    const Ns = visits;
    const U = Q + c * P * Math.sqrt(Nb)/(1 + Ns);
    return U;
};

export const actionValueUpdate = (oldActionValue, visits, stateValue) => {
    const N = visits;
    const v = stateValue;
    const QOld = oldActionValue;
    const Q = (N * QOld + v)/(N + 1);
    return Q
};

*/
