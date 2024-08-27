# Messages

## Message Types
### Sent by the frontend to the backend
#### 'login'
Sends the username to the backend with the username in the body of the message.
#### 'ready'
Tells the backend if the user is ready to play.
#### 'unready'
Tells the backend if the user is not ready to play.
#### 'attack'
Tells the backend that the user wants to attack random players.
#### 'answer'
Gives an answer to the backend with the answer (0,1,2 or 3) in the body of the message.
#### 'deathUpdate'
Tells the backend that the user is dead. (Not sure if we need this one)
#### 'getStreak'
Tells the backend to send the streak of the user.

### Send by the backend to the frontend
#### 'playersConnected'
Tells the frontend how many players are connected in this form :
```json
{
    "nbReady": 2,
    "nbPlayers": 3
}
```
#### 'ranking'
Sends the ranking to every sockets connected in this form :
```json
[
    {
        "name": "player1",
        "score": 100
    },
    {
        "name": "player2",
        "score": 50
    }
]
```
#### 'userInfo'
Sends to one user his information in this form :
```json
{
    "streak": 5,
  "isAlive": true,
  "nbBadAnswers": 2,
  "nbGoodAnswers": 3,
  "questions": [
    {
      "id": 1,
      "difficulty": "easy",
      "isAttack": false
    },
    {
      "id": 2,
      "difficulty": "hard",
      "isAttack": true
    }
  ]
}
```
'
#### 'newQuestion'
Sends a new question to the user in this form :
```json
{
    "id": "asdhjakjdhaskdhsajkdamogusakdasdasdoashdoa",
    "difficulty": "hard",
    "isAttack": "false",
    "category": "Gaming",
    "answers": ["Mario", "Sonic", "Pikachu", "Zelda"],
    "question": "Who is the only character that aren't owned by Nintendo?"
}
```
#### 'streak'
Sends the streak of the user that requested it in this form :
```json
{
    "streak": 5
}
```
