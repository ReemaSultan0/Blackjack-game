
let player = {
    name: "",
    chips: 0
};

let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let highScore = 0;
let highScoreName = "";


const messageEl = document.getElementById("message-el");
const sumEl = document.getElementById("sum-el");
const cardsEl = document.getElementById("cards-el");
const playerEl = document.getElementById("player-el");
const startBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("new-card-btn");
const resetBtn = document.getElementById("reset-btn");
const scoreDisplay = document.getElementById("score-display");
const highScoreDisplay = document.getElementById("high-score-display");
const playerNameInput = document.getElementById("player-name");
const submitNameBtn = document.getElementById("submit-name");
const debugState = document.getElementById("debug-state");
const debugIsAlive = document.getElementById("debug-isAlive");
const debugHasBlackJack = document.getElementById("debug-hasBlackJack");


startBtn.addEventListener("click", startGame);
newCardBtn.addEventListener("click", newCard);
resetBtn.addEventListener("click", resetGame);


if (localStorage.getItem("blackjackHighScore")) {
    highScore = parseInt(localStorage.getItem("blackjackHighScore"));
    highScoreName = localStorage.getItem("blackjackHighScoreName") || "Someone";
    updateHighScoreDisplay();
}


submitNameBtn.addEventListener("click", function() {
    const name = playerNameInput.value.trim();
    if (name) {
        player.name = name;
        playerNameInput.disabled = true;
        submitNameBtn.disabled = true;
        startBtn.disabled = false;
        updatePlayerDisplay();
        messageEl.textContent = "Welcome " + name + "! Press START to begin.";
        debugState.textContent = "Name submitted, ready to play";
        updateDebugInfo();
    } else {
        messageEl.textContent = "Please enter a valid name!";
        debugState.textContent = "Error: No name entered";
    }
});


playerNameInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        submitNameBtn.click();
    }
});

function updatePlayerDisplay() {
    playerEl.textContent = `${player.name}: $${player.chips}`;
    scoreDisplay.textContent = `Score: ${sum}`;
}

function updateHighScoreDisplay() {
    if (highScore > 0) {
        highScoreDisplay.textContent = `High Score: ${highScoreName} - $${highScore}`;
    } else {
        highScoreDisplay.textContent = "High Score: Not set yet";
    }
}

function updateDebugInfo() {
    debugIsAlive.textContent = isAlive;
    debugHasBlackJack.textContent = hasBlackJack;
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    if (randomNumber > 10) {
        return 10;
    } else if (randomNumber === 1) {
        return 11;
    } else {
        return randomNumber;
    }
}

function getRandomSuit() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    return suits[Math.floor(Math.random() * 4)];
}

function startGame() {
    if (!player.name) {
        messageEl.textContent = "Please enter your name first!";
        debugState.textContent = "Error: No player name";
        return;
    }
    
    isAlive = true;
    hasBlackJack = false;
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = firstCard + secondCard;

    renderGame();
    
    startBtn.disabled = true;
    newCardBtn.disabled = false;
    debugState.textContent = "Game started";
    updateDebugInfo();
}

function renderGame() {

    cardsEl.innerHTML = "";
    
    for (let i = 0; i < cards.length; i++) {
        let cardValue = cards[i];
        let suit = getRandomSuit();
        
        let cardEl = document.createElement("div");
        cardEl.className = `card ${suit}`;
        cardEl.textContent = cardValue === 11 ? "A" : cardValue;
        cardsEl.appendChild(cardEl);
    }
    
    sumEl.textContent = `Sum: ${sum}`;
    
    if (sum <= 20) {
        message = "Do you want to draw a new card?";
        debugState.textContent = "Game in progress";
    } else if (sum === 21) {
        message = "Wohoo! You've got Blackjack!";
        hasBlackJack = true;
        isAlive = false;
        player.chips += 50; 
        

        if (player.chips > highScore) {
            highScore = player.chips;
            highScoreName = player.name;
            localStorage.setItem("blackjackHighScore", highScore);
            localStorage.setItem("blackjackHighScoreName", highScoreName);
            updateHighScoreDisplay();
        }
        debugState.textContent = "Blackjack!";
        newCardBtn.disabled = true;
    } else {
        message = "You're out of the game!";
        isAlive = false;
        player.chips -= 10;
        debugState.textContent = "Busted! Game over";
        newCardBtn.disabled = true;
    }
    

    messageEl.textContent = message;
    updatePlayerDisplay();
    updateDebugInfo();
}

function newCard() {
    console.log("New card button clicked");
    console.log("isAlive:", isAlive, "hasBlackJack:", hasBlackJack);
    
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard();
        sum += card;
        cards.push(card);
        renderGame();
        debugState.textContent = "Drew a new card";
    } else {
        debugState.textContent = "Cannot draw card - game not active";
        console.log("Cannot draw card - isAlive:", isAlive, "hasBlackJack:", hasBlackJack);
    }
    updateDebugInfo();
}

function resetGame() {
    cards = [];
    sum = 0;
    hasBlackJack = false;
    isAlive = false;
    

    cardsEl.innerHTML = "";
    sumEl.textContent = "Sum: 0";
    

    startBtn.disabled = false;
    newCardBtn.disabled = true;
    
    if (player.name) {
        messageEl.textContent = "Welcome " + player.name + "! Press START to begin.";
    } else {
        messageEl.textContent = "Enter your name and press START to begin.";
        playerNameInput.disabled = false;
        submitNameBtn.disabled = false;
    }
    
    updatePlayerDisplay();
    debugState.textContent = "Game reset";
    updateDebugInfo();
}