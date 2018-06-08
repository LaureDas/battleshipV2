var abc = function(x, y) {
  console.log(x, y);
};

$("#pcThinks").hide();
$("#end").hide();
$(".popup").hide();

var arrayShips1 = [
  new Ship("carrier", 5),
  new Ship("battleship", 4),
  new Ship("cruiser", 3),
  new Ship("destroyer", 3),
  new Ship("frigate", 2)
];

var arrayShips2 = [
  new Ship("carrier", 5),
  new Ship("battleship", 4),
  new Ship("cruiser", 3),
  new Ship("destroyer", 3),
  new Ship("frigate", 2)
];

var player1 = new Player("computer");
var player2 = new Player("human");

$(document).ready(function() {
  player1.gameBoard = new GameBoard(10);
  player2.gameBoard = new GameBoard(10);
  var countPcHits = 0;

  $(".start").on("click", function(e) {
    //setTimeout
    $(".start").fadeOut(3000);
  });
  //DEBUG CONSOLE
  function debug() {
    //show whether ship is sunk or not
    //player1
    $("#p1Boatscarrier > p:nth-child(2)").html(
      player1.gameBoard.contents[0].ship.score
    );
    $("#p1Boatsbattleship > p:nth-child(2)").html(
      player1.gameBoard.contents[1].ship.score
    );
    $("#p1Boatscruiser > p:nth-child(2)").html(
      player1.gameBoard.contents[2].ship.score
    );
    $("#p1Boatsdestroyer > p:nth-child(2)").html(
      player1.gameBoard.contents[3].ship.score
    );
    $("#p1Boatssubmarine > p:nth-child(2)").html(
      player1.gameBoard.contents[4].ship.score
    );
    //player 2
    $("#p2Boatscarrier > p:nth-child(2)").html(
      player2.gameBoard.contents[0].ship.score
    );
    $("#p2Boatsbattleship > p:nth-child(2)").html(
      player2.gameBoard.contents[1].ship.score
    );
    $("#p2Boatscruiser > p:nth-child(2)").html(
      player2.gameBoard.contents[2].ship.score
    );
    $("#p2Boatsdestroyer > p:nth-child(2)").html(
      player2.gameBoard.contents[3].ship.score
    );
    $("#p2Boatssubmarine > p:nth-child(2)").html(
      player2.gameBoard.contents[4].ship.score
    );
  }

  function drawPlayersBoard(gameBoard) {
    var board = document.getElementById("playerboard");
    var size = gameBoard.size;
    for (var i = 0; i < size; i++) {
      var row = document.createElement("div");
      row.classList.add("row");
      row.dataset.id = i;
      for (var j = 0; j < size; j++) {
        var cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.id = j;
        $(cell).attr("data-row", i);
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  }

  drawPlayersBoard(player1.gameBoard);

  function drawComputerBoard(gameBoard) {
    var board = document.getElementById("computerboard");
    var size = gameBoard.size;
    for (var i = 0; i < size; i++) {
      var row = document.createElement("div");
      row.classList.add("row");
      row.dataset.id = i;
      for (var j = 0; j < size; j++) {
        var cell = document.createElement("div");
        cell.dataset.id = j;
        cell.classList.add("cell");
        $(cell).attr("data-row", i);
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  }
  drawComputerBoard(player2.gameBoard);

  player1.gameBoard.placeShips(arrayShips1);
  player2.gameBoard.placeShips(arrayShips2);

  function shipShape(boardID, gameboard) {
    var board = document.getElementById(boardID);
    gameboard.contents.forEach(function(x) {
      //horizontal
      if (x.cells[0].x == x.cells[1].x) {
        x.cells.forEach(function(square) {
          var row = board.querySelectorAll(".row")[square.x];
          var cell = row.querySelectorAll(".cell")[square.y];
          cell.classList.add("horizontalS");
        });
      } else {
        //vertical
        x.cells.forEach(function(square) {
          var row = board.querySelectorAll(".row")[square.x];
          var cell = row.querySelectorAll(".cell")[square.y];
          cell.classList.add("verticalS");
        });
      }
    });
  }

  shipShape("playerboard", player1.gameBoard);
  shipShape("computerboard", player2.gameBoard);
  $("#computerboard")
    .find(".verticalS")
    .css("background-color", "transparent");
  $("#computerboard")
    .find(".horizontalS")
    .css("background-color", "transparent");
  debug();

  //IF WE CLICK ON THE COMPUTER'S BOARD
  $("#computerboard .cell").on("click", function(event) {
    var $myCell = $(event.currentTarget);
    var y = $($myCell).data("id");
    var x = $($myCell).data("row");
    var cell = { x: x, y: y };
    player1.attack(cell, player2); //player2 (HUMAN)receives the attack, hits and miss are recorded
    //get which boat it is
    debug();
    //Now, we add classes in order to deal with HITS AND MISS graphically
    if (
      this.className === "cell horizontalS" ||
      this.className === "cell verticalS"
    ) {
      $($myCell).addClass("hit");
    } else if (this.className === "cell") {
      $($myCell).addClass("miss");
    }
    if (player2.gameBoard.allSink()) {
      $("#end").fadeIn(1000);
      $("#end").append("!! " + "<br>" + "YOU DEFEATED THE PC");
    }
    //call AITake over humans function and send into it the RANDOM CELLS

    $("#pcThinks").fadeIn(2000);
    setTimeout(function() {
      $("#pcThinks").fadeOut(2000);
      computerAttack();
    }, 2000);
  });

  //OUTLAY COMPUTER ATTACKS
  var outlayComputer = function(randomX, randomY) {
    var pcCell = $(
      "#playerboard > .row >.cell[data-id=" +
        "" +
        randomY +
        "" +
        '][data-row="' +
        "" +
        randomX +
        "" +
        '"]'
    );
    var classCell = pcCell.attr("class");
    if (classCell === "cell horizontalS" || classCell === "cell verticalS") {
      pcCell.addClass("hit");
      // countPcHits++;
    } else if (classCell === "cell") {
      pcCell.addClass("miss");
    }
  };

  //COMPUTER COUNTER PART ATTACK
  function computerAttack() {
    //look through miss and hit et si trouve alors, recalcule les random (en fonction)

    // x = Math.floor(Math.random() * 10);
    //y = Math.floor(Math.random() * 10);
    //var firstCell = { x: x, y: y };
    var cell = player2.AItakeOverHumanAttack(player1);
    console.log(cell);
    console.log(cell.x);
    var x = cell.x;
    var y = cell.y;
    //change color by adding classes through outlayComputer fn()
    outlayComputer(x, y);
    //console.log(randomX, randomY); OK IM GETTING THE VALUE
    //end statement
    if (player1.gameBoard.allSink()) {
      $("#end").fadeIn(1000);
      $("#end").append("!! " + "<br>" + "THE PC BEAT YOU");
    }

    //var coords=[x,y];
    //if(miss.)

    // var firstE = player1.gameBoard.shotStack[0];
    /*switch (firstE) {
      case 0: //random
     
        break;

      case 1:
      

        break;
    }*/
  }

  //END THE GAME BEAUT
  /*var endGame = function() {
    $("#boards").hide();
  };*/
});

//onclick - toggle hit class
//on click - toggle miss class

//on click- record attack

/*	//var gameboard= new GameBoard(10);
var rows = 10;
var cols = 10;
var squareSize = 50;

// get the container element
var gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
for (var i = 0; i < cols; i++) {
	for (var j = 0; j < rows; j++) {
		
	// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div")
		square.className="cell";
		gameBoardContainer.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i;			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';						
	}
}*/

/*player1.gameBoard.placeShips(arrayShips);
player2.gameBoard.placeShips(arrayShips);
*/

//$('#playerboard>.row>.cell[data-id="7"][data-row="0"]').addClass('hit');
//var $pcCell=$('#playerboard>.row>.cell[data-id="7"][data-row="0"]')
//.addClass('miss');
//change the color of the cell

//ai
//initialize first attack to be completely random
/*if (
      player1.gameBoard.misses.length === 0 &&
      player1.gameBoard.hits.length === 0
    ) {*/
