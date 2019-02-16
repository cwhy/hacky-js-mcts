# Hacky Javascript Monte Carlo tree search

Aim to be paired with any turn-based game backend with a rest API.

This is a hacky implementation just to figure out
 how the API would look like.

## Install:
```
yarn
```
or
```
npm install
```

## Proposed API docs:
* Game information
```$xslt
GET /game/info
```
sample returns:
```json
{
    "availableActions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    "nPlayers": 2
}
```

* Game Setup
```$xslt
POST /game/new
```

sample submissions:
```json
{
    "botAgents": [0]
}
```
`botAgents` is a list of integers that represent the id
of player(s) that uses the AI

sample returns:
```json
{
    "playerTokens": ["asdf08", "asd092"],
    "state": {
        "forPlayer": [0],
        "gameOver": false,
        "isWinner": null,
        "vector": [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
}
```
where `playerTokens` are the tokens for all the players
(bots and human) for later submission.

`state` is a standard format that game will be used later on
as well. It represent the current game state
for a certain player agent.
`forPlayer` is a list of players that would be playing
in this turn,
who would be the one the state sent to.

`gameOver` will be `false` until the game is over.
`isWinner` will indicate if the agent is the winner if
there is one after game ends. 
`vector` will be a fix-length array of numbers that represent
the current game state.
The array can be of any length,
but the length must not change during the game.

* Send
```$xslt
POST /send/{str}
```
The request is for actual game playing.
It involves the following process:
* A player sends an action to the server
* Server process the action
* (If required) Server interacts with other players
* Server response to this request and return
 the next game state to this player


sample submission:
```json
{
    "token": "asdf08"
}
```
This command will send an action to the server
as a player. the `{str}` is the action to be sent to.
The available actions was obtained in `/game/info`.

The token for the player that perform the action
should be included in the request as well.

sample returns:
```json
{
    "state": {
        "forPlayer": [0],
        "gameOver": false,
        "isWinner": null,
        "vector": [0, 1, 0, -1, 0, 0, 0, 0, 0]
    }
}
```
if the game did not end. And

```json
{
    "state": {
        "forPlayer": [0],
        "gameOver": true,
        "isWinner": true,
        "vector": [1, 1, 1, 0, -1, -1, 0, 0, -1]
    }
}
```
if the game ends.
