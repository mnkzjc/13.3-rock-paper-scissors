"use strict";
var startbtn = document.getElementById("start");
var rock = document.getElementById("rock");
var paper = document.getElementById("paper");
var scissors = document.getElementById("scissors");
var game = document.getElementById("game");
var end = document.getElementById("end");
var scorePlayer;
var scoreComp;
var scoreWin;
var isInProgress = false;

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

var printRound = function(text) {
  var round = (document.querySelector("#round div").innerHTML = text);
  var table = (document.querySelector("#score div").innerHTML =
    scorePlayer + " - " + scoreComp);
};

var compareMoves = function(player, comp) {
  if (
    (player === "rock" && comp === "scissors") ||
    (player === "paper" && comp === "rock") ||
    (player === "scissors" && comp === "paper")
  ) {
    scorePlayer++;
    return "You win";
  } else if (player === comp) {
    return "Draw";
  } else {
    scoreComp++;
    return "You lose";
  }
};

var inputValidator = function(input) {
  if (isNaN(input) || input === null || input === "") {
    return false;
  } else {
    return true;
  }
};

startbtn.addEventListener("click", function() {
  if (isInProgress) {
    return;
  }

  scorePlayer = 0;
  scoreComp = 0;
  scoreWin = window.prompt("How many rounds to win?");

  if (!inputValidator(scoreWin)) {
    end.innerHTML = "input must be number";
    end.style.color = "red";
    return;
  }
  var howMany = (document.querySelector("#howMany div").innerHTML = scoreWin);
  game.classList.remove("hide");
  end.innerHTML = "";
  printRound("");
});

var endChecker = function() {
  if (scoreWin == scorePlayer) {
    end.innerHTML = "You won the game!";
    end.style.color = "green";
    game.classList.add("hide");
    isInProgress = false;
  } else if (scoreWin == scoreComp) {
    end.innerHTML = "You lost the game!";
    end.style.color = "red";
    game.classList.add("hide");
    isInProgress = false;
  } else {
    end.innerHTML = "Roll again...";
    end.style.color = "blue";
    isInProgress = true;
  }
};

var playerMove = function(event) {
  var player = this.getAttribute("id");
  var comp = computerMove();
  var result = compareMoves(player, comp);
  printRound(
    result + "<br> you played: " + player + "<br> comp played: " + comp
  );
  endChecker();
};

rock.addEventListener("click", playerMove);
paper.addEventListener("click", playerMove);
scissors.addEventListener("click", playerMove);