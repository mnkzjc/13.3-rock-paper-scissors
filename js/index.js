"use strict";

// przyciski
var startbtn = document.getElementById("start-btn");
var moves = document.querySelectorAll('.player-move');

// div gry
var game = document.getElementById("game");
var infoLine = document.querySelector("#infoLine p");
var endRound = document.getElementById("endRound");

// modale
var endgame = document.getElementById("modal-endgame");
var overlay = document.querySelector('#modal-overlay');
var modals = document.querySelectorAll('.modal');
var closeButtons = document.querySelectorAll('.modal .close');
var tableStats = document.getElementById("tableStats");



var params = {
  scorePlayer: 0,
  scoreComp: 0,
  scoreToWin: 0,
  currentRound: 1,
  youPlayed: "",
  compPlayed: "",
  roundWinner: "",
  score: "",
  isInProgress: false,
  progress: []
};



// drukuje wyniki rundy
var printRound = function(text) {
  document.querySelector("#round div").innerHTML = text;
  document.querySelector("#score div").innerHTML = params.scorePlayer + " - " + params.scoreComp;
};



// generuje ruch kompa
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

// porównuje ruch gracza i wygenerowany ruch kompa
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
    return "You win";
  } else if (player === comp) {
    params.roundWinner = "Draw";
    return "Draw";
  } else {
    params.scoreComp++;
    params.roundWinner = "You lost";
    return "You lose";
  }
};

// sprawdza czy gracz podał cyfrę rund do rozegrania
var inputValidator = function(input) {
  if (isNaN(input) || input === null || input === "") {
    return false;
  } else {
    return true;
  }
};


// funkcja przycisku start new game
startbtn.addEventListener("click", function() {
  if (params.isInProgress) {      // sprawdza czy gra jest in progress
    return;
  }
  reset();
  // pyta o ilość rund i sprawdza wprowadzone dane 
  params.scoreToWin = window.prompt("How many rounds to win?");
  if (!inputValidator(params.scoreToWin)) {
    infoLine.innerHTML = "input must be number";
    infoLine.style.color = "red";
    return;
  }
  // drukuje ilość rund
  infoLine.innerHTML = 'To win the game, You need to win: <strong>' + params.scoreToWin + '</strong> rounds';
  infoLine.style.color = "black";
  enableGame();  
});


// zeruje wyniki
function reset(){
  params.scorePlayer = 0;
  params.scoreComp = 0;
  params.currentRound = 1;
  endgame.querySelector("header").innerHTML = ""; 
  params.progress = []; 
  tableStats.innerHTML = "";
  printRound("");
}

// wyłącza grę
function disableGame(){
  //game.classList.add("hide");
  moves.forEach(function(element){
    element.disabled = true;
  });
  params.isInProgress = false;
}

// odblokowuje grę
function enableGame(){
  game.classList.remove("hide");
  moves.forEach(function(element){
    element.removeAttribute("disabled");
  });
  params.isInProgress = true;
}

// sprawdza czy gra się już skończyła
var endChecker = function() {
  if (params.scoreToWin == params.scorePlayer) {
    endRound.innerHTML = "You won the game!";
    endRound.style.color = "green";
    disableGame();
    showModal(endgame);
    endgame.querySelector("header").innerHTML = "You won the entire game!"; 
    gameTable();
  } else if (params.scoreToWin == params.scoreComp) {
    endRound.innerHTML = "You lost the game!";
    endRound.style.color = "red";
    disableGame();
    showModal(endgame);
    endgame.querySelector("header").innerHTML = "You lost the entire game!"; 
    gameTable();
  } else {
    endRound.innerHTML = "Roll again...";
    endRound.style.color = "blue";
    params.currentRound++;
    enableGame();
  }
};



// pobiera ruch gracza
moves.forEach(function(element){
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
  endChecker();
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

var gameTable = function(){
  for (var i = 0; i < params.progress.length; i++){
    tableStats.innerHTML +=
      "<tr><td>" +
      params.progress[i].roundNumber +
      "</td><td>" +
      params.progress[i].playerChoice +
      "</td><td>" +
      params.progress[i].compChoice +
      "</td><td>" +
      params.progress[i].roundWon +
      "</td><td>" +
      params.progress[i].gameScore +
      "</td></tr>"
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
