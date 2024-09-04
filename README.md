# Trivia99

<img src="./Images/Trivia_99.png" alt="Trivia 99 logo" width=175/>

Trivia 99 is a battle royal game with up to 99 players. To survive, you have to answer multiple choice trivia questions. But be careful, if you wait for to long, some questions will add up to your question's queue and if the queue number exceeds 7, you lose the game! Try to chain the right answers to grow your streak and attack your friends.

## Setup guide

### Prerequisites

To try Trivia 99 on your computer, you must have [git](https://github.com/git-guides/install-git) and [npm with Node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

### Download code

To download the source code, you should clone the repo

```bash
git clone https://github.com/GuillaumeDnt2/Trivia99.git
```

### Download dependencies

The project is composed in two parts: the frontend and the backend. Both are located in the `server` directory. Firstly, we are going to the backend directory:

```bash
cd server/backend
```

To download the dependencies with npm you can execute the following command:

```bash
npm install
```

or

```bash
npm i
```

We are going to do same in the frontend directory :

```bash
cd ../frontend
npm install
```

### Start the project

To start the project, you first need to change the address to which the frontend try to connect. To do so, you need to go in the `utils` directory (from `frontend`) :

```bash
cd src/utils
```

Now you can open the `socket.js` file and modify the following line

```js
//const URL = 'http://localhost:4000';
const URL = 'http://trivia99.zapto.org:4000';
```

into

```js
const URL = 'http://localhost:4000';
//const URL = 'http://trivia99.zapto.org:4000';
```

Now you can run the project by returning to the frontend folder and doing this:

```bash
cd ../..
npm start
```

If it runs correctly, you should be able to see a blank page at `http://localhost:3000/`. To display the actual home page you have to start the backend:

```bash
cd ../backend
npm start
```

Now the home page should be available.

<img src="./Images/home.png" alt="Home page" width=500/>

### Testing modifications

To test if your modification are working, you can run the tests. The test in the frontend only check if the routes to the different pages exist but the backend's test are more complex. To run the tests you can do the following command either in the `frontend` or the `backend` directory:

```bash
npm test
```
