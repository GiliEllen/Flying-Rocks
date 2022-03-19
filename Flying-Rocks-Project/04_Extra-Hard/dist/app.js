var body = document.querySelector('body');
var allRocks = document.querySelectorAll('.rock');
var allImages = document.querySelectorAll('img');
var imgArray = ["images/boom.png", "images/wow.png", "images/pow.png", "images/zap.png"];
var bombArray = []; // Array that holds each bomb
body.style.backgroundImage = "url(images/Background.jpg)";
var bombsUsed = 0; // Bombs used counter
var counterHolder = document.querySelector('.counter');
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var messegeBombLimit = document.querySelector('.messege_bomb_limit');
var gameOver = 10;
// Function:
// Moving rocks
function startGame() {
    setRocksRandomPosition(allRocks);
}
// Function:
// Runs check collision with bombs array for set interval
function mineDetection() {
    checkCollision(bombArray);
}
// Function:
// Gets all rocks
// For each rock sets random position
function setRocksRandomPosition(rocks) {
    rocks.forEach(function (element) {
        element.style.left = getRandomPosition(rocks)[0] + "px"; //getRandomPosition(rocks)[0] -> rock X position
        element.style.top = getRandomPosition(rocks)[1] + "px"; //getRandomPosition(rocks)[0] -> rock Y position
    });
}
// Function:
// Returns array with random (X,Y) point
function getRandomPosition(rocks) {
    /* Explanation randomPosition varibale:

    // randomPosition is an array.

    // randomPosition[0] - Represents left/X axies (Random Value between 0 - body width)

    // randomPosition[1] - Represents top/Y axies (Random Value between 0 - body height)*/
    var randomPosition = [Math.floor(Math.random() * body.offsetWidth),
        Math.floor(Math.random() * body.offsetHeight)];
    // Loop over all rocks
    for (var i = 0; i < rocks.length; i++) {
        if (randomPosition[0] + getRockDimenstion(rocks)[i]['rockWidth'] > body.offsetWidth) {
            randomPosition[0] -= getRockDimenstion(rocks)[i]['rockWidth'];
        }
        if (randomPosition[1] + getRockDimenstion(rocks)[i]['rockHeight'] > body.offsetHeight) {
            randomPosition[1] -= getRockDimenstion(rocks)[i]['rockHeight'];
        }
    }
    return randomPosition;
    /* Explanation if statement:

    // if random X axies + rockWidth bigger than body width

    // true: reduce from random X axies the rockWidth

    // if random Y axies + rockHeight bigger than body height

    // true: reduce from random Y axies the rockHeight */
}
// Function:
// Gets all rocks
// Returns rock object represents:
// rockWidth , rockHeight
function getRockDimenstion(rocks) {
    var rockArray = [];
    rocks.forEach(function (element) {
        var rock = {
            'rockWidth': element.offsetWidth,
            'rockHeight': element.offsetHeight
        };
        rockArray.push(rock);
    });
    return rockArray;
}
// Function
// Gets all rocks
// return rock object represents:
// leftPosition, rightPosition, topPoistion, bottomPoistion
function getRockPosition(rocks) {
    var ourRocks = [];
    rocks.forEach(function (element) {
        var rock = {
            'leftPosition': element.getBoundingClientRect().left,
            'rightPosition': element.getBoundingClientRect().right,
            'topPosition': element.getBoundingClientRect().top,
            'bottomPosition': element.getBoundingClientRect().bottom,
            'display': true
        };
        ourRocks.push(rock);
    });
    return ourRocks;
}
// Function
// Gets all rocks
// Sets each rock in random rotation between 0 to 360deg
function setRandomRotation(rocks) {
    rocks.forEach(function (element) {
        // element.style.rotate = `${Math.floor(Math.random() * 360)}deg`
        element.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
    });
}
// Function:
// Gets number to be max
// Returns number between 0 - max(number)//
function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}
// Function:
// Gets rocks index number and bomb index
// removes rock and bomb at indexes given
// spliced the bomb array to make room for more bombs
function removeRockAndBomb(rockIndex, bombIndex) {
    allRocks[rockIndex].remove();
    bombArray[bombIndex].remove();
    bombArray.splice(bombIndex, 1);
    gameOver--;
    // allRocks.splice(rockIndex, 1)
    return bombArray;
}
// Function:
// Gets rock index number
// Creating:
// 1. Expoltion
// 2. Audio
function createExplotion(rockIndex) {
    var rockPosition = getRockPosition(allRocks)[rockIndex]; // Gets Spesific rockPostion
    var explotion = document.createElement('div'); // Create explotion holder as div element
    explotion.classList.add('explode-holder'); // Added class to explotion holder
    body.append(explotion); // append explotion holder to body
    explotion.style.left = rockPosition['leftPosition'] + "px";
    explotion.style.top = rockPosition['topPosition'] + "px";
    var explotionImage = document.createElement('img'); // Create expoltion image as img element
    explotionImage.classList.add('explode-image'); // Added class to explotion image
    explotion.append(explotionImage); // append explotion image to explotion holder
    var randomIndex = getRandomNumber(imgArray.length); // get random number of image array
    explotionImage.src = imgArray[randomIndex]; // setting explotion image to the spesific image
    var explotionSound = document.createElement('audio');
    explotionSound.src = 'sounds/Snap.mp3';
    explotionSound.play();
    setTimeout(function () {
        explotion.remove();
    }, 500);
}
// Function
// Gets mouse event
// Checks if
// Creates:
// 1. bombHolder => div Element
// 2. bombImage => image Element
// 3. Sets bombHolder Position to Mouse click
// Returns: bombArray => array with all bombs (divs)
//
function createBomb(ev) {
    if (bombArray.length < 5) {
        bombsUsed += 1;
        counterHolder.innerText = "" + bombsUsed;
        var bomb = document.createElement('div'); // Creating div element
        bomb.classList.add('bomb-holder'); // Adding class to div
        bombArray.push(bomb); // Appending bomb to bombArray
        body.appendChild(bomb); // Appending bomb to body
        var bombImage = document.createElement('img'); // Creating img element
        bombImage.classList.add('bomb-image'); // Adding class to img
        bombImage.src = "images/Mine.png"; // Setting image src to mine
        bomb.appendChild(bombImage); // Appending bombImage to bombHodler
        var bombCenterHeight = ev.clientY - (bomb.offsetHeight) / 2; // calc center height
        var bombCenterWidth = ev.clientX - (bomb.offsetWidth) / 2; // clac center width
        bomb.style.top = bombCenterHeight + "px"; // Setting bomb in the center height
        bomb.style.left = bombCenterWidth + "px"; // Setting bomb in the center width
        return bombArray;
    }
    else {
        messegeBombLimit.innerHTML = "Bombs at limit!";
        setTimeout(function () {
            messegeBombLimit.innerHTML = "";
        }, 1000);
    }
}
// Function:
// Gets bombs array
// Check collision between rocks and bombs
// True:
//  Run create explotion
//  Run remove rock
function checkCollision(bombs) {
    for (var i = 0; i < allRocks.length; i++) {
        for (var j = 0; j < bombArray.length; j++) {
            if (getRockPosition(allRocks)[i]['leftPosition'] >= parseInt(bombs[j].style.left) &&
                getRockPosition(allRocks)[i]['leftPosition'] <= parseInt(bombs[j].style.left) + bombs[j].offsetWidth) { // X to the right, check to Y option
                if (getRockPosition(allRocks)[i]['topPosition'] >= parseInt(bombs[j].style.top) &&
                    getRockPosition(allRocks)[i]['topPosition'] <= parseInt(bombs[j].style.top) + bombs[j].offsetHeight) {
                    createExplotion(i);
                    removeRockAndBomb(i, j);
                }
                else if (getRockPosition(allRocks)[i]['bottomPosition'] >= parseInt(bombs[j].style.top) &&
                    getRockPosition(allRocks)[i]['bottomPosition'] <= parseInt(bombs[j].style.top) + bombs[j].offsetHeight) {
                    createExplotion(i);
                    removeRockAndBomb(i, j);
                }
            }
            else if (getRockPosition(allRocks)[i]['rightPosition'] >= parseInt(bombs[j].style.left) &&
                getRockPosition(allRocks)[i]['rightPosition'] <= parseInt(bombs[j].style.left) + bombs[j].offsetWidth) {
                if (getRockPosition(allRocks)[i]['topPosition'] >= parseInt(bombs[j].style.top) &&
                    getRockPosition(allRocks)[i]['topPosition'] <= parseInt(bombs[j].style.top) + bombs[j].offsetHeight) {
                    createExplotion(i);
                    removeRockAndBomb(i, j);
                }
                else if (getRockPosition(allRocks)[i]['bottomPosition'] >= parseInt(bombs[j].style.top) &&
                    getRockPosition(allRocks)[i]['bottomPosition'] <= parseInt(bombs[j].style.top) + bombs[j].offsetHeight) {
                    createExplotion(i);
                    removeRockAndBomb(i, j);
                }
            }
        }
    }
}
// Event Listener when click
// Checks if: rockLeftPosition <= *MouseXPosition* <= rockLeftPosition + rockWidth
// Checks if: rockRightPosition <= *MouseYPosition* <= rockRightPosition + rockHeight
// true: remove rock
body.addEventListener('click', function (ev) {
    ev.stopPropagation();
    if (gameOver > 0) {
        createBomb(ev);
    }
});
// DOM to body:
// Change the cursor to sniper
// function cursorChange() {
document.body.style.cursor = "url(images/sniper.png), auto";
// allRocks.forEach(element =>
//     element.style.cursor = "url(images/sniper.png), auto");
// bombArray.forEach(element =>
//     element.style.cursor = "url(images/sniper.png), auto");
// }
// Function:
// Gets an array of rocks
// for each rock:
// runs random number
// Changes width and height of rock in the array to random number //
function setRandomRockSize(rocks) {
    for (var i = 0; i < rocks.length; i++) {
        var randomSize = getRandomNumber(30);
        allRocks[i].style.width = randomSize + 50 + "px";
        allRocks[i].style.height = randomSize + 50 + "px";
    }
}
// Function:
// adds 1 to total sceonds var each second
// changes html counter text to the second that passed
// runs adding zero on each vaule to see if zero is needded at timer
function setTime() {
    if (gameOver > 0) {
        ++totalSeconds;
        secondsLabel.innerHTML = addingZero(totalSeconds % 60);
        var minuteVal = Math.floor(totalSeconds / 60);
        minutesLabel.innerHTML = addingZero(minuteVal);
    }
    else if (gameOver === 0) {
        clearInterval();
    }
}
function addingZero(sec) {
    var secString = sec + "";
    if (secString.length < 2) {
        return "0" + secString;
    }
    else {
        return secString;
    }
}
startGame();
setRandomRockSize(allRocks);
setRandomRotation(allRocks);
setTimeout(startGame, 500);
setInterval(startGame, 5000);
setInterval(checkGameOver, 100);
setInterval(setTime, 1000);
function checkGameOver() {
    if (gameOver > 0) {
        setInterval(mineDetection, 10);
    }
    else if (gameOver === 0) {
        messegeBombLimit.innerHTML = "Game Over " + winningTime(totalSeconds);
    }
}
function winningTime(winnerTime) {
    var minutes = Math.floor(winnerTime / 60);
    var seconds = winnerTime % 60;
    var winnnerSec = addingZero(seconds);
    var winnerMin = addingZero(minutes);
    return winnerMin + ":" + winnnerSec;
}
