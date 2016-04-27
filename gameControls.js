var win = 0;
var lose = 0;
var draw = 0;
var player;
var winningCombos = [
  ['1', '2', '0'],
  ['5', '3', '4'],
  ['7', '8', '6'],
  ['3', '6', '0'],
  ['7', '1', '4'],
  ['5', '8', '2'],
  ['8', '0', '4'],
  ['6', '2', '4']
];
var max = 0;
var sumPosMoves = [0, 0, 0, 0, 0, 0, 0, 0];
var bestMove;
var compTurn = false;
var computer;
var playerHas = [];
var computerHas = [];
var spotsTaken = [];
var compMove = 0;
//resets board after gameover
var clearBoard = function() {
  setTimeout(function() {
    $(".col").text("")
  }, 750);
  playerHas = [];
  computerHas = [];
  spotsTaken = [];
  sumPosMoves = [0, 0, 0, 0, 0, 0, 0, 0]
  compTurn = false;
}
var updateScore = function() {
  $("#win").text("Win: " + win);
  $("#lose").text("Lose: " + lose);
  $("#draw").text("Draw: " + draw);
}
//check to see if player or comp array has any of the winning combinations of moves
var checkWin = function(arrHas) {
  for (var i = 0; i < winningCombos.length; i++) {
    if ((arrHas.indexOf(winningCombos[i][0]) >= 0) && (arrHas.indexOf(winningCombos[i][1]) >= 0) && (arrHas.indexOf(winningCombos[i][2]) >= 0)) {
      if (arrHas[0] === playerHas[0]) {
        win++;
      } else if (arrHas[0] === computerHas[0]) {
        lose++;
      }
      updateScore();
      clearBoard();
    }
  }
  if (spotsTaken.length >= 9) {
    draw++;
    updateScore();
    clearBoard();
  }
}
//calculates best move for computer to take
var checkBest = function(a) {
  var add;
  //adds weight to row, col and diag based on what moves were already taken
  if (playerHas.indexOf(a) >= 0) {
    add = 2;
  } else if (computerHas.indexOf(a) >= 0) {
    add = -2.5;
  }
  bestMove = 0;
  max = 0;
  if (a == 0) {
    sumPosMoves[0] += add; //row1
    sumPosMoves[3] += add; // col1
    sumPosMoves[6] += add; //diag1
  }
  if (a == 1) {
    sumPosMoves[0] += add; //row1
    sumPosMoves[4] += add; //col2
  }
  if (a == 2) {
    sumPosMoves[0] += add; //row1
    sumPosMoves[5] += add; //col3
    sumPosMoves[7] += add; //diag2
  }
  if (a == 3) {
    sumPosMoves[1] += add; // row2
    sumPosMoves[3] += add; //col1
  }
  if (a == 4) {
    sumPosMoves[1] += add; //row2
    sumPosMoves[4] += add; //col2
    sumPosMoves[6] += add; //diag1
    sumPosMoves[7] += add; //diag2
  }
  if (a == 5) {
    sumPosMoves[5] += add; //col3
    sumPosMoves[1] += add; //row2
  }
  if (a == 6) {
    sumPosMoves[3] += add; //col1
    sumPosMoves[2] += add; // row3
    sumPosMoves[7] += add; // diag2
  }
  if (a == 7) {
    sumPosMoves[4] += add; //col2
    sumPosMoves[2] += add; //row3
  }
  if (a == 8) {
    sumPosMoves[6] += add; //diag1
    sumPosMoves[5] += add; //col3
    sumPosMoves[2] += add; //row3
  }
  for (var i = 0; i < sumPosMoves.length; i++) {
    if (Math.abs(sumPosMoves[i]) > max) {
      max = Math.abs(sumPosMoves[i]);
      bestMove = i;
    }
  }
}
//adds player move to board based on where they click
var huMove = function() {
  $("#col0, #col1, #col2, #col3, #col4, #col5, #col6, #col7, #col8").unbind().click(function() {

    var playMove = $(this).attr('id').substr(-1);
    if (spotsTaken.indexOf(playMove) < 0) {
      $("#col" + playMove).text(player);
      compTurn = true;
      playerHas.push(playMove);
      spotsTaken.push(playMove);
      checkBest(playMove);
      checkWin(playerHas);
    }
  });
}
//calculates computer move
var chooseMove = function() {
	//will start off in center or corner for opening move
  if (spotsTaken.length === 1) {
    if (spotsTaken[0] !== '4') {
      compMove = '4';
    } else {
      compMove = '0';
    }
  } else {
	  //moves into next available spot of row, col, or diag that will help it win or keep player from winning
    for (var c = 0; c < 3; c++) {
      if (spotsTaken.indexOf(winningCombos[bestMove][c]) < 0) {
        compMove = winningCombos[bestMove][c];
      }
    }
	//if no available spots in heighest weighted row, col, or diag, choose available spot at random
    if (spotsTaken.indexOf(compMove) >= 0) {
      while (spotsTaken.indexOf(compMove) >= 0) {
        compMove = Math.floor(Math.random() * 9).toString();
      }
    }
  }
}
var coMove = function() {
  chooseMove();
  $("#col" + compMove).text(computer);
  computerHas.push(compMove);
  spotsTaken.push(compMove);
  checkBest(compMove);
  checkWin(computerHas);
  compTurn = false;
}
var game = function() {
  $('body').click(function() {
    huMove();
    if (compTurn) {
      coMove();
    }
  });
}

$(document).ready(function() {
  $("#x").click(function() {
    player = 'X';
    computer = 'O';
    $("#playGround").css({
      "display": "block"
    });
    $("#confirm").css({
      "display": "none"
    });
    game();

  });
  $("#o").click(function() {
    player = 'O';
    computer = 'X';
    $("#playGround").css({
      "display": "block"
    });
    $("#confirm").css({
      "display": "none"
    });
    game();
  });

});