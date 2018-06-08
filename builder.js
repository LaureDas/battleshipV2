var Ship = function(name, length) {
  this.name = name;
  this.length = length;
  this.score = 1;
  var x = [];
  for (var i = 0; i < this.length; i++) {
    x.push(false);
  }
  this.shipHits = x;
  this.shipLocations = [];
};

Ship.prototype.hit = function(hitLocation) {
  this.shipHits[hitLocation] = true;
};

Ship.prototype.isSunk = function() {
  return this.shipHits.every(val => {
    return val == true;
  });
};

var GameBoard = function(size) {
  this.contents = [];
  this.size = size;
  this.misses = [];
  this.hits = [];
  this.shotStack = [0];
};

GameBoard.prototype.addShip = function(start, inclination, ship) {
  var takenCell = [];
  var validCell = true;
  var cell = {};

  //creating a new cell that occupies the length of the ship
  for (var i = 0; i < ship.length; i++) {
    if (inclination == 1) {
      // horizontal inclination
      cell = { x: start.x + i, y: start.y };
    } else if (inclination == 0) {
      // vertical inclination
      cell = { x: start.x, y: start.y + i };
    }

    //check if this new cell is valid (in limits of the size of board and not already taken)
    if (!this.valid(cell)) {
      validCell = false;
    }
    //if it is, then, we push this new cell to the Taken cells array
    takenCell.push(cell);
    //ship.shipLocations.push(cell);
  }

  if (validCell) {
    takenCell.forEach(function(x) {
      //push cells in ship constructor too
      ship.shipLocations.push(x);
    });

    //console.log("shiploc", ship.shipLocations);
    //create an array of objects containing the positions and respective name of the ships
    this.contents.push({ cells: takenCell, ship: ship });
    return true;
  }
  return false;
};

//valid function: checks whether no ships overlap
GameBoard.prototype.cellTaken = function(cell) {
  var taken = false;
  this.contents.forEach(function(x) {
    x.cells.forEach(function(insideSquare) {
      if (insideSquare.x == cell.x && insideSquare.y == cell.y) {
        taken = true;
      }
    });
  });
  return taken;
};

//checks whether our cell objects are in range of gameboard
GameBoard.prototype.cellOutsideBoundary = function(cell) {
  var out = false;
  if (cell.x >= this.size) {
    out = true;
  } else if (cell.x < 0) {
    out = true;
  } else if (cell.y >= this.size) {
    out = true;
  } else if (cell.y < 0) {
    out = true;
  }
  return out;
};
//adding the two functions in one
GameBoard.prototype.valid = function(cell) {
  if (!this.cellOutsideBoundary(cell) && !this.cellTaken(cell)) {
    return true;
  } else {
    return false;
  }
};

//place ships randomly
GameBoard.prototype.placeShips = function(shipsArr) {
  var ships = shipsArr;
  var gameBoard = this;
  var orientations = [0, 1];
  ships.forEach(function(ship) {
    var added = false;
    var orientation = Math.floor(Math.random() * 2);
    var randomXLocation = Math.floor(Math.random() * 10);
    var randomYLocation = Math.floor(Math.random() * 10);
    while (added == false) {
      if (
        gameBoard.addShip(
          { x: randomXLocation, y: randomYLocation },
          orientation,
          ship
        )
      ) {
        added = true;
      } else {
        //if ever does not work, we start again with new random values
        orientation = Math.floor(Math.random() * 2);
        randomXLocation = Math.floor(Math.random() * 10);
        randomYLocation = Math.floor(Math.random() * 10);
      }
    }
  });
};

//place ships according to player's choice - IF I HAVE THE TIME

//receiveAttack: hits and misses
GameBoard.prototype.receiveAttack = function(cell) {
  if (this.cellTaken(cell)) {
    this.hitShipInCell(cell);
    this.hits.push(cell);
  } else {
    this.misses.push(cell);
  }
};

GameBoard.prototype.hitShipInCell = function(cell) {
  this.contents.forEach(function(x) {
    x.cells.forEach(function(insideSquare) {
      if (insideSquare.x == cell.x && insideSquare.y == cell.y) {
        //console.log("there");
        for (var i = 0; i < x.ship.shipHits.length; i++) {
          //console.log("hw");
          if (
            x.ship.shipLocations[i].x == insideSquare.x &&
            x.ship.shipLocations[i].y == insideSquare.y
          ) {
            //console.log("TRUE");
            x.ship.shipHits[i] = true;
          }
        }
      }
      if (x.ship.isSunk() && x.ship.score > 0) {
        $(".popup").html("The player has sunk the opponent's " + x.ship.name);
        $(".popup").fadeIn(1000);
        x.ship.score--;
      }
    });
  });
};

//check status of GameBoard - all sunk or not
GameBoard.prototype.allSink = function() {
  var allSink = true;
  this.contents.forEach(function(x) {
    if (!x.ship.isSunk()) {
      allSink = false;
    }
  });
  return allSink;
};

GameBoard.prototype.aiTriesToThink = function() {
  var left = [];
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      var leftCellAttempt = { x: i, y: j };
      if (
        !this.hits.find(function(cell) {
          return cell.x == i && cell.y == j;
        }) &&
        !this.misses.find(function(cell) {
          return cell.x == i && cell.y == j;
        })
      ) {
        left.push(leftCellAttempt);
      }
    }
  }
  return left;
};

//PLAYER constructor

var Player = function(person) {
  this.player = person;
  this.gameBoard = new GameBoard(10);
};

Player.prototype.attack = function(cell, computer) {
  computer.gameBoard.receiveAttack(cell);
};

Player.prototype.AItakeOverHumanAttack = function(human) {
  var array = human.gameBoard.aiTriesToThink();
  var newRandCell = array[Math.floor(Math.random() * array.length)];
  human.gameBoard.receiveAttack(newRandCell);
  return newRandCell;
};

/*
GameBoard.prototype.placeShips = function(){
  var shipObj=[];
  //create Ship instances and assign position
  for(var i=0; i<arrayShips.length; i++){
      var ship = new Ship(arrayShips[i].name, arrayShips[i].length);
      shipObj.push(ship);
    }*/

//console.log(gameBoard1.placeShips());

//console.log(shipObj); ok array of objects

/*var horizontal=false;
	  for(var z = 0; z < shipObj.length; z++){
      
      console.log('hi', shipObj[z].position);
      if(shipObj[z].position.xStart === shipObj[z].position.xEnd){
        horizontal=true;
        console.log('oo');
      }
      else{
        horizontal=false;
        console.log('there');
      }
		  var r1= shipObj[z].position.xS;
      var c1= shipObj[z].position.yS;
      var r2= shipObj[z].position.xE;
      var c2= shipObj[z].position.yE;
      if(horizontal){
       // this.gameBoard[r1][c1+z]+=1;
        }
      if(!horizontal){
       // this.gameBoard[r1+z][c1]+=1;
      }
      */
