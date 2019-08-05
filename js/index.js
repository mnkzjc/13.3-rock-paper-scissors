"use strict";

// Buttons
var startButton = document.getElementById("start-btn");
var choiceButtons = document.querySelectorAll('.player-move');

// Game elements
var infoLine = document.querySelector("#infoLine");
var endRound = document.getElementById("endRound");

// Modals
var endgame = document.getElementById("modal-endgame");
var overlay = document.querySelector('#modal-overlay');
var modals = document.querySelectorAll('.modal');
var closeButtons = document.querySelectorAll('.modal .close');
var tableBody = document.getElementById("tableBody");


// Game parameters
var params = {
  scorePlayer: 0,
  scoreComp: 0,
  howManyRounds: 0,
  currentRound: 1,
  youPlayed: "",
  compPlayed: "",
  roundWinner: "",
  score: "",
  isInProgress: false,
  progress: []
};



// Game

var disableGame = function(){
  choiceButtons.forEach(function(element){
    element.disabled = true;
  });
  params.isInProgress = false;
}


var enableGame = function(){
  choiceButtons.forEach(function(element){
    element.disabled = false;
  });
  params.isInProgress = true;
}


var reset = function(){
  params.scorePlayer = 0;
  params.scoreComp = 0;
  params.currentRound = 1;
  endgame.querySelector("header").innerHTML = ""; 
  params.progress = []; 
  tableBody.innerHTML = "";
  printRound("");
}


var isInputValid = function(input) {
  return (!isNaN(input) && input !== null && input !== "" && input > 0);
};


var isGameOver = function() {
  if (params.howManyRounds == params.currentRound) {
    endRound.innerHTML = "You won the game!";
    endRound.style.color = "green";
    disableGame();
    showModal(endgame);
    endgame.querySelector("header").innerHTML = "You won the entire game!"; 
    gameTable();
  } else if (params.howManyRounds == params.currentRound) {
    endRound.innerHTML = "You lost the game!";
    endRound.style.color = "red";
    disableGame();
    showModal(endgame);
    endgame.querySelector("header").innerHTML = "You lost the entire game!"; 
    gameTable();
  } else {
    endRound.innerHTML = "Roll again...";
    endRound.style.color = "blue";
    enableGame();
  }
};



// drukuje wyniki rundy ------------
var printRound = function(text) {
  document.querySelector("#round div").innerHTML = params.roundWinner;
  document.querySelector("#score div").innerHTML = params.scorePlayer + " - " + params.scoreComp;
};



// Computer's move generator
var computerMove = function() {
  var move = Math.round(Math.random() * 3);
  if (move === 0) {
    return "rock";
  } else if (move === 1) {
    return "paper";
  } else {
    return "scissors";
  }
};

// Compare player and computer moves
var compareMoves = function(player, comp) {
  params.youPlayed = player;
  params.compPlayed = comp;
  if (
    (player === "rock" && comp === "scissors") ||
    (player === "paper" && comp === "rock") ||
    (player === "scissors" && comp === "paper")
  ) {
    params.scorePlayer++;
    params.roundWinner = "You won";
  } else if (player === comp) {
    params.roundWinner = "Draw";
  } else {
    params.scoreComp++;
    params.roundWinner = "You lost";
  }
};




// New Game
startButton.addEventListener("click", function() {
  if (params.isInProgress) {
    return;
  }
  reset();
  params.howManyRounds = window.prompt("How many rounds do You want to play?");
  if (!isInputValid(params.howManyRounds)) {
    infoLine.innerHTML = "input must be number above zero";
    infoLine.style.color = "red";
    return;
  }
  infoLine.innerHTML = 'You chose to play: <strong>' + params.howManyRounds + '</strong> rounds';
  infoLine.style.color = "black";
  enableGame();  
});










// pobiera ruch gracza
choiceButtons.forEach(function(element){
  element.addEventListener('click', function(){
    playerMove(element.getAttribute('data-move'));
  });
});


// ruch gracza, porównanie z ruchem kompa, sprawdzenie czy koniec gry
var playerMove = function(player) {
  var comp = computerMove();
  var result = compareMoves(player, comp);
  printRound(
    result + "<br> you played: " + player + "<br> comp played: " + comp
  );
  updateProgress();
  isGameOver();
  params.currentRound++;
};


// budowanie tabeli progress
function updateProgress(){
  params.progress.push({
    roundNumber: params.currentRound,
    playerChoice: params.youPlayed,
    compChoice: params.compPlayed,
    roundWon: params.roundWinner,
    gameScore: params.scorePlayer + " - " + params.scoreComp
  })
};


function createCell(content) {
  var tableCell = document.createElement("td");
  tableCell.innerHTML = content;
  return tableCell;
}

var gameTable = function() {
  for (var i = 0; i < params.progress.length; i++){
    var tableRow = document.createElement("tr");
    tableRow.appendChild(createCell(params.progress[i].roundNumber));
    tableRow.appendChild(createCell(params.progress[i].playerChoice));
    tableRow.appendChild(createCell(params.progress[i].compChoice));
    tableRow.appendChild(createCell(params.progress[i].roundWon));
    tableRow.appendChild(createCell(params.progress[i].gameScore));
    tableBody.appendChild(tableRow);
  }
};


// modal

var showModal = function(modalToDisplay){
  overlay.classList.add('show');
  modalToDisplay.classList.add('show');
};


// zamykanie modali
var hideModal = function(event){
  event.preventDefault();
  overlay.classList.remove('show');
};


for(var i = 0; i < closeButtons.length; i++){
  closeButtons[i].addEventListener('click', hideModal);
}

overlay.addEventListener('click', hideModal);

for(var i = 0; i < modals.length; i++){
  modals[i].addEventListener('click', function(event){
    event.stopPropagation();
  });
}
