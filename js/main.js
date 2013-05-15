// Constants
var GRID_SIZE = 10;

var BOWL_RADIUS = 28;
var GRID_LENGTH = 60;

// game vars
var twins;
var bowlCollection = [];
var colorCollection = [];

var selectedBowl1;
var selectedBowl2;

$(document).ready(function() {
  createGame(GRID_SIZE);
});

/**
 * create a canvas element
 * @param {string} id id of new canvas element
 * @returns {html object} created canvas element
 */
/*
 function createCanvas(id) {
 var newCanvas =
 $('<canvas/>', {'id': id, 'class': ''})
 .width(GRID_LENGTH)
 .height(GRID_LENGTH);
 
 $('#twinContainer').append(newCanvas);
 // return $('#'+id);
 }
 */

function createGame(gridSize) {
  // get canvas
  twins = oCanvas.create({
    canvas: '#canvasTwin',
    background: '#ccc',
    disableScrolling: true
  });

  getColorCollection(gridSize * gridSize);
  showBowls(gridSize - 1, gridSize - 1);


  // set listener
  twins.bind("click tap", function() {
    // read click object
    selectedBowl2 = getBowlByCoordinate(twins.mouse.x, twins.mouse.y);
    // selectedBowl2 = getBowlByCoordinate(twins.touch.x, twins.touch.y);

    // bowl must be alive (not already dead)
    if (selectedBowl2) {
      // is already a bullet selected
      if (selectedBowl1 != null) {
        // not two times the same bowl
        if (selectedBowl2 !== selectedBowl1) {
          // console.log('farbe von Kugel 2 ist: ' + selectedBowl2.fill);
          // console.log('farbe von Kugel 1 ist: ' + selectedBowl1.fill);

          // they must have the same color
          if (selectedBowl2.fill == selectedBowl1.fill) {
            // color is the same

            // check if connection possible
            // callSubCheckWay(3, selectedBowl2, selectedBowl1, relY, relX, relDirIndex)
            var directions = ['n', 'e', 's', 'w'];
            $wayIsFound = false;
            directions.some(function(dir) {
              if (checkWay(dir, 2, selectedBowl1, selectedBowl2, true, false)) {
                $wayIsFound = true;
                return true;
              }
              return false;
            });

            if ($wayIsFound) {
              // remove both bowls and set to dead
              selectedBowl1.fill = '';
              selectedBowl1.stroke = '';
              selectedBowl2.fill = '';
              selectedBowl2.stroke =  '';
              selectedBowl1.redraw();
              selectedBowl2.redraw();
              selectedBowl1.dead = true;
              selectedBowl2.dead = true;

              selectedBowl2 = null;
            }
          } else {
            selectedBowl1.stroke = '';
            selectedBowl1.redraw();
            // console.log('farbe ist ungleich');
          }
        }
      } else {
        // console.log('kugel 1 ist noch nicht gesetzt.');
      }

      // swap bowl 2 to next bowl 1
      selectedBowl1 = selectedBowl2;

      // console.log(': ' + selectedBowl1.fill);
    }
  });



  /*
   // read
   twins.setLoop(function() {
   // console.log(twins.touch.x + ' - ' + twins.touch.y);
   if (twins.mouse.click()) {
   getBowlByCoordinate(twins.mouse.x, twins.mouse.y);
   }
   // console.log(twins.mouse.x + ' - ' + twins.mouse.y);
   }).start();
   */
}

function showBowls(x, y) {
  // bowlCollection = new Array[x, y];
  var tempBowlCollection;
  var ellipse;

  for (var iY = 0; iY <= y+2; iY++) {
    tempBowlCollection = [];
    for (var iX = 0; iX <= x+2; iX++) {
      if (iX == 0 || iX == x+2 || iY == 0 || iY == y+2) {
        // border element
        ellipse = twins.display.ellipse({
          x: iX * GRID_LENGTH + (GRID_LENGTH / 2),
          y: iY * GRID_LENGTH + (GRID_LENGTH / 2),
          radius: BOWL_RADIUS,
          dead: false,
          posX: iX,
          posY: iY,
          border: true
        });
      } else {
        ellipse = twins.display.ellipse({
          x: iX * GRID_LENGTH + (GRID_LENGTH / 2),
          y: iY * GRID_LENGTH + (GRID_LENGTH / 2),
          radius: BOWL_RADIUS,
          fill: useColor(),
          dead: false,
          posX: iX,
          posY: iY,
          border: false
        });
      }
      
      // add to temporary collection
      tempBowlCollection[iX] = ellipse;

      twins.addChild(ellipse);
    }
    bowlCollection[iY] = tempBowlCollection;
  }

  // console.log(bowlCollection[1][1].custom);
}

/**
 * generate a color collection to global var colorCollection
 * @param {int} count number of bowls
 * @returns {undefined} nothing
 */
function getColorCollection(count) {
  var colors = [
    'Red', // 
    'Yellow', // 
    'Blue', // 
    'Purple', // 
    'Gold', // 
    'LawnGreen', // 
    'Maroon', // 
    'Teal', // 
    'SpringGreen', // 
    'PowderBlue'    // 
  ];

  // each color is used 2 times
  count = count / 2;
  var colorIndex = 0;

  for (var i = 0; i < count; i++) {
    if (colorIndex >= colors.length) {
      colorIndex = 0;
    }
    // for both bowls
    colorCollection.push(colors[colorIndex]);
    colorCollection.push(colors[colorIndex]);
    colorIndex++;
  }

  // return availableColor;
}

function useColor() {
  // get a color from collection and delete it
  randomColorIndex = Math.floor(Math.random() * colorCollection.length);
  currentColor = colorCollection[randomColorIndex];
  colorCollection.splice(randomColorIndex, 1);
  return currentColor;
}

function getBowlByCoordinate(x, y) {
  bX = Math.floor(x / GRID_LENGTH);
  bY = Math.floor(y / GRID_LENGTH);
  currentBowl = bowlCollection[bY][bX];
  
  if (typeof(currentBowl) !== 'undefined' && !currentBowl.border) {
    if (currentBowl.dead == false) {
      currentBowl.stroke = "3px #000";
      currentBowl.redraw();
      // console.log('geklickt wurde: ' + bowlCollection[bY][bX].fill);
      return bowlCollection[bY][bX];
    }
  }
  return false;
}

/**
 * Find the way to end bowl (recursivly)
 * @param {type} direction
 * @param {type} availableTurns
 * @param {type} startBowl
 * @param {type} endBowl
 * @returns {Boolean} found the end
 */
function checkWay(direction, availableTurns, startBowl, endBowl, isStart, directionSwitch) {
  /*
  startBowl.stroke = '2px green';
  startBowl.redraw();
  
  endBowl.stroke = '2px blue';
  endBowl.redraw();
  */
 
  // define abort return (finish states)
  if (startBowl === endBowl) {
    // console.log('Weg zwischen Kugel ist okay.');
    return true;
  }
  
  if (isStart) {
    // is the bowl dead, then return to last parent call
    if (startBowl.dead === true || typeof(startBowl) === 'undefined') {
      console.log('Der Weg zwischen den Kugel ist versperrt.');
      return false; 
    }
  } else {
    // if bowl alive, way is not free
    if (startBowl.dead === false) {
      console.log('Der Weg zwischen den Kugel ist versperrt.');
      return false; 
    }
  }
  
  console.log('search in ' + direction);
  
  // search continue
  switch (direction) {
    case 'n':
      relDirIndex = checkIfDirectionHaveToSwitch(directionSwitch, availableTurns, 1);
      if (callSubCheckWay(availableTurns, startBowl, endBowl, -1, 0, relDirIndex)) {
        return true;
      }
      break;
    case 's':
      relDirIndex = checkIfDirectionHaveToSwitch(directionSwitch, availableTurns, 1);
      if (callSubCheckWay(availableTurns, startBowl, endBowl, 1, 0, relDirIndex)) {
        return true;
      }
      break;
    case 'e':
      relDirIndex = checkIfDirectionHaveToSwitch(directionSwitch, availableTurns, 0);
      if (callSubCheckWay(availableTurns, startBowl, endBowl, 0, 1, relDirIndex)) {
        return true;
      }
      break;
    case 'w':
      relDirIndex = checkIfDirectionHaveToSwitch(directionSwitch, availableTurns, 0);
      if (callSubCheckWay(availableTurns, startBowl, endBowl, 0, -1, relDirIndex)) {
        return true;
      }
      break;
  }
  
  console.log(direction + ' ist versperrt');
  
  return false;
}

/**
 * 
 * @param {type} availableTurns
 * @param {type} startBowl
 * @param {type} endBowl
 * @param {type} relY
 * @param {type} relX
 * @param {type} relDirIndex
 * @returns {Boolean} found the end
 */
function callSubCheckWay(availableTurns, startBowl, endBowl, relY, relX, relDirIndex) {
  if (availableTurns > 0) {
    // Here you have to turn
    console.log('relY is: '+relY);
    console.log('relX is: '+relX);
    // turn in subcall
    relDir = getRelativeDirection(startBowl, endBowl);
    availableTurnsTemp = availableTurns - 1;
    startBowlTemp = bowlCollection[startBowl.posY + relY][startBowl.posX + relX];
    endBowlTemp = endBowl;
    // relDir on x is in 1
    if (checkWay(relDir[relDirIndex], availableTurnsTemp, startBowlTemp, endBowlTemp, false, true)) {
      return true;
    }
  }
  // invert relDirIndex -> search in other dimension
  console.log('search now after: '+relDir[(-1)* relDirIndex + 1]);
  if (checkWay(relDir[(-1)* relDirIndex + 1], availableTurns+1, startBowlTemp, endBowlTemp, false, false)) {
    return true;
  }
  return false;
}

function getRelativeDirection(startBowl, endBowl) {
  // calc the next search
  
  relativeY = startBowl.posY - endBowl.posY;
  relativeX = startBowl.posX - endBowl.posX;
  
  if (relativeY < 0) {
    // south
    relativDirY = 's';
  } else if(relativeY > 0) {
    relativDirY = 'n';
  } else {
    relativDirY = null;
  }
  
  if (relativeX < 0) {
    relativDirX = 'e';
  } else if(relativeX > 0) {
    relativDirX = 'w';
  } else {
    relativDirX = null;
  }
  
  return [relativDirY, relativDirX];
}

/**
 * check if the direction have to switch
 * @param {type} directionSwitch
 * @param {type} availableTurns
 * @param {type} relDirIndex
 * @returns {Number} return the correct direction
 */
function checkIfDirectionHaveToSwitch(directionSwitch, availableTurns, relDirIndex) {
  //is the available turn odd change relDirIndex because direction is invers to start direction
  if (directionSwitch) {
    if (availableTurns % 2 == 1) {
      console.log('switch direct route');
      relDirIndex = (-1)* relDirIndex + 1;
    } 
  }
  return relDirIndex;
}