class tile {
    constructor(solid, img, x_pos, y_pos, rotation){
        this.solid = solid;
        this.img = img;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.rotation = rotation;
    }

    setImg(newImg) {
        this.img = newImg;
    }

    getImg() {
        return this.img;
    }

    tileRotator(adjacent, tileType) {
        if (tileType == "./Tiles/Wall_Between_Tile.png") {
            if (adjacent[1]) {
                return "transform:rotate(90deg);";
            }
        } else if (tileType == "./Tiles/Wall_Corner_Tile.png"){
            if (adjacent[0] && adjacent[1]) {
                return "transform:rotate(360deg);";
            } else if ((adjacent[0] && adjacent[2]) || (adjacent[1] && adjacent[2])) {
                return "transform:rotate(90deg);";
            } else if ((adjacent[3] && adjacent[1]) || (adjacent[0] && adjacent[3])) {
                return "transform:rotate(270deg);";
            } else if (adjacent[3] && adjacent[2]) {
                return "transform:rotate(180deg);";
            }
        } else if (tileType == "./Tiles/Wall_Head_Tile.png") {
            if (adjacent[1]) {
                return "transform:rotate(90deg);";
            } else if (adjacent[2]) {
                return "transform:rotate(180deg);";
            } else if (adjacent[3]) {
                return "transform:rotate(270deg);";
            }
        } else if (tileType == "./Tiles/Wall_Single_Tile.png") {
            if (!adjacent[1]) {
                return "transform:rotate(180deg);";
            } else if (!adjacent[0]) {
                return "transform:rotate(90deg);";
            } else if (!adjacent[2]) {
                return "transform:rotate(270deg);";
            }
        }
    }
}

class specialTile {
    constructor(img, x_pos, y_pos) {
        this.img = img;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
    }
}

class map {
    constructor(size_x, size_y) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.tiles = [];
        this.victoryTotal = 35;
        this.scores = [];
        this.toAdd = false;
        this.tileMap = this.genFullMaze();
        this.ATile = new specialTile("./Tiles/A_Tile.png", 6, 5);
        this.BTIle = new specialTile("./Tiles/B_Tile.png", 3, 3);
        this.tileFiller();
    }

    tileFiller() {
        for (let i = 0; i<this.size_x; i++) {
            this.tiles[i] = [];
            for (let j = 0; j<this.size_y; j++) {
                this.tiles[i][j] = new tile(this.tileMap[i][j], this.tileMap[i][j], i, j, 0);
            }
        }
    }

    genMaze(partialMaze, currentTile, perviousTile) {
        /// Logical error in maze generation
        /// neighbouring tiles incorectly checking to see if unintended paths are opened.
        /// leaveing generation here not quite the intent but nice.
        /// Honestly might be better
        let newTile;
        let directionList = [0,1,2,3]
        for (let i = directionList.length-1; i >= 0; i--) {
            let rngIndex = Math.floor(Math.random()*directionList.length);
            let temp = directionList[i];
            directionList[i] = directionList[rngIndex];
            directionList[rngIndex] = temp;
        }
        for (let i = 0; i < directionList.length; i++){
            let direction = directionList[i];
            switch(direction) {
                case 0:
                    newTile = new tile(false,"./Tiles/Floor_Tile.png", currentTile.x_pos-1, currentTile.y_pos, 0);
                    break;
                case 1:
                    newTile = new tile(false,"./Tiles/Floor_Tile.png", currentTile.x_pos+1, currentTile.y_pos, 0);
                    break;
                case 2:
                    newTile = new tile(false,"./Tiles/Floor_Tile.png", currentTile.x_pos, currentTile.y_pos-1, 0);
                    break;
                case 3:
                    newTile = new tile(false,"./Tiles/Floor_Tile.png", currentTile.x_pos, currentTile.y_pos+1, 0);
                    break;
                default:
                    break;
            }

            if (newTile.x_pos == perviousTile.x_pos && newTile.y_pos == perviousTile.y_pos) {
                continue;
            } else if (newTile.x_pos < 1 || newTile.x_pos > this.size_x-2) {

                continue;
            } else if (newTile.y_pos < 1 || newTile.y_pos > this.size_y-2) {
                continue;
            } else if (!partialMaze[newTile.x_pos][newTile.y_pos]) {
                continue;
            } else if (!(partialMaze[newTile.x_pos+1][newTile.y_pos]) && (currentTile.x_pos != newTile.x_pos+1 && currentTile.y_pos != newTile.y_pos)) {
                continue;
            } else if (!(partialMaze[newTile.x_pos-1][newTile.y_pos]) && (currentTile.x_pos != newTile.x_pos-1 && currentTile.y_pos != newTile.y_pos)) {
                continue;
            } else if (!(partialMaze[newTile.x_pos][newTile.y_pos+1]) && (currentTile.x_pos != newTile.x_pos && currentTile.y_pos != newTile.y_pos+1)) {
                continue;
            } else if (!(partialMaze[newTile.x_pos][newTile.y_pos-1]) && (currentTile.x_pos != newTile.x_pos || currentTile.y_pos != newTile.y_pos-1)) {
                continue;
            } else {
                partialMaze[newTile.x_pos][newTile.y_pos] = false;
                this.genMaze(partialMaze, newTile, currentTile);
            }
        }
        return (partialMaze);
    }

    genFullMaze() {
        /// Not really generating the maze fully just a tile map
        let tileMap = [];
        for(let i = 0; i < this.size_x; i++) {
            tileMap[i] = []
            for(let j = 0; j < this.size_y; j++) {
                tileMap[i][j] = true;
            }
        }
        let startTile =  new tile(false, "./Tiles/Floor_Tile.png", 3, 3, 0);
        return this.genMaze(tileMap, startTile, startTile);
    }

    makeGrid() {
        /// Need to find out why this rotates the map 90 degrees clock-wise??
        /// then mirroed horizontaly?????
        /// not a problem but imortent to rememeber if I come back to this

        this.correctWalls();
        let toAddRow;
        let toAddColum;
        let toAddTile;
        for (let i = 0; i<this.size_y; i++) {
            toAddRow = document.createElement("tr");
            for (let j = 0; j<this.size_x; j++) {
                toAddColum = document.createElement("td");
                toAddTile = document.createElement("img");
                if (this.tiles[j][i].solid) {
                    toAddTile.src = this.tiles[j][i].img;
                    toAddTile.style = this.tiles[j][i].rotation;
                } else {
                    toAddTile.src = "./Tiles/Floor_Tile.png";
                }
                toAddTile.classList.add("tile");
                toAddTile.id = "c" + j + "-" + i;
                toAddColum.appendChild(toAddTile);
                toAddRow.appendChild(toAddColum);
            }
            document.querySelector("#map").appendChild(toAddRow);
        }

        while (true) {
            this.BTIle.x_pos = Math.floor(Math.random()*this.size_x);
            this.BTIle.y_pos = Math.floor(Math.random()*this.size_y);
            if (!this.tiles[this.BTIle.x_pos][this.BTIle.y_pos].solid) {
                break;
            }
        }
        document.querySelector("#c" + this.BTIle.x_pos + "-" + this.BTIle.y_pos).src = "./Tiles/B_Tile.png";

        while (true) {
            this.ATile.x_pos = Math.floor(Math.random()*this.size_x);
            this.ATile.y_pos = Math.floor(Math.random()*this.size_y);
            if (!this.tiles[this.ATile.x_pos][this.ATile.y_pos].solid) {
                if (this.ATile.x_pos != this.BTIle.x_pos || this.ATile.y_pos != this.BTIle.y_pos) {
                    break;
                }
            }
        }
        document.querySelector("#c" + this.ATile.x_pos + "-" + this.ATile.y_pos).src = "./Tiles/A_Tile.png";
    }


    wallImgSelector(adjacent) {
        let count = 0;
        let rotation;
        for (let i=0; i <adjacent.length; i++) {
            if (!adjacent[i]) {
                count += 1;
            }
        }
        switch (count) {
            case 0:
                return "./Tiles/Wall_Deep_Tile.png";
                break;
            case 1:
                return "./Tiles/Wall_Single_Tile.png";
                break;
            case 2:
                if ((adjacent[1] && adjacent[3]) || (adjacent[0] && adjacent[2])) {
                    return "./Tiles/Wall_Between_Tile.png"
                } else {
                    return "./Tiles/Wall_Corner_Tile.png"
                }
                break;
            case 3:
                return "./Tiles/Wall_Head_Tile.png";
                break;
            case 4:
                return "./Tiles/Wall_Island_Tile.png";
                break;
            default:
                // error code goes here
                break;
        }
    }

    correctWalls() {
        let adjacent = [];
        let count = 0;
        for (let i = 1; i<this.size_y-1; i++) {
            for (let j = 1; j<this.size_x-1; j++) {
                if (this.tiles[i][j].solid) {
                    adjacent = [true,true,true,true];
                    count = 0;
                    for (let k=-1; k< 2; k+=2) {
                        adjacent[1+k] = this.tiles[i+k][j].solid;
                        adjacent[2+k] = this.tiles[i][j+k].solid;
                    }
                    this.tiles[i][j].setImg(this.wallImgSelector(adjacent));
                    this.tiles[i][j].rotation = this.tiles[i][j].tileRotator(adjacent,this.tiles[i][j].getImg());
                }
            }
        }
        for (let i = 0; i < this.size_x; i++) {
            if (this.tiles[1][i].solid) {
                this.tiles[0][i].setImg("./Tiles/Wall_Deep_Tile.png");
            } else {
                this.tiles[0][i].setImg("./Tiles/Wall_Single_Tile.png");
                this.tiles[0][i].rotation = "transform:rotate(270deg);";
            }
        }
        for (let i = 0; i < this.size_x; i++) {
            if (this.tiles[this.size_y-2][i].solid) {
                this.tiles[this.size_y-1][i].setImg("./Tiles/Wall_Deep_Tile.png");
            } else {
                this.tiles[this.size_y-1][i].setImg("./Tiles/Wall_Single_Tile.png");
                this.tiles[this.size_y-1][i].rotation = "transform:rotate(90deg);";
            }
        }
        for (let i = 0; i < this.size_y; i++) {
            if (this.tiles[i][1].solid) {
                this.tiles[i][0].setImg("./Tiles/Wall_Deep_Tile.png");
            } else {
                this.tiles[i][0].setImg("./Tiles/Wall_Single_Tile.png");
            }
        }
        for (let i = 0; i < this.size_y; i++) {
            if (this.tiles[i][this.size_x-2].solid) {
                this.tiles[i][this.size_x-1].setImg("./Tiles/Wall_Deep_Tile.png");
            } else {
                this.tiles[i][this.size_x-1].setImg("./Tiles/Wall_Single_Tile.png");
                this.tiles[i][this.size_x-1].rotation = "transform:rotate(180deg);";
            }
        }
    }

    collisionCheck(new_x, new_y) {
        if (this.tiles[new_x, new_y].solid) {
            return true;
        }
        return false;
    }

    newMap() {
        document.querySelector("#c" + this.ATile.x_pos + "-" + this.ATile.y_pos).src = "./Tiles/Floor_Tile.png";
        document.querySelector("table").innerHTML = "";
        this.tileMap = this.genFullMaze();
        this.tileFiller();
        this.makeGrid();
    }

    victoryCheck() {
        /// Victory condition
        if (this.ATile.x_pos == this.BTIle.x_pos && this.ATile.y_pos == this.BTIle.y_pos) {
            this.victoryTotal++;
            this.toAdd = true;
            document.querySelector("h1").innerHTML = "Maze Game: Current Wins " + this.victoryTotal;

            this.newMap();
            
        }
    }

    addTime() {
        if (this.toAdd) {
            this.toAdd = false;
            return true;
        }
        return false;
    }

    move(e) {
        switch (e.keyCode) {
            case 87:
                // up
                if(this.ATile.y_pos > 0) {
                    if (!this.tiles[this.ATile.x_pos][this.ATile.y_pos-1].solid)  {
                        document.querySelector("#c" + this.ATile.x_pos + "-" + this.ATile.y_pos).src = "./Tiles/Floor_Tile.png";
                        this.ATile.y_pos -= 1;
                        document.querySelector("#c" + this.ATile.x_pos +"-" + this.ATile.y_pos).src = this.ATile.img;
                    }
                }
                break;
            case 68:
                // right
                if(this.ATile.x_pos < this.size_x-1) {
                    if (!this.tiles[this.ATile.x_pos+1][this.ATile.y_pos].solid)  {
                        document.querySelector("#c" + this.ATile.x_pos + "-" + this.ATile.y_pos).src = "./Tiles/Floor_Tile.png";
                        this.ATile.x_pos += 1;
                        document.querySelector("#c" + this.ATile.x_pos +"-" + this.ATile.y_pos).src = this.ATile.img;
                    }
                }
                break;
            case 83:
                // down
                if(this.ATile.y_pos < this.size_y-1) {
                    if (!this.tiles[this.ATile.x_pos][this.ATile.y_pos+1].solid)  {
                        document.querySelector("#c" + this.ATile.x_pos + "-" + this.ATile.y_pos).src = "./Tiles/Floor_Tile.png";
                        this.ATile.y_pos += 1;
                        document.querySelector("#c" + this.ATile.x_pos +"-" + this.ATile.y_pos).src = this.ATile.img;
                    }
                }
                break;
            case 65:
                // left
                if(this.ATile.x_pos > 0) {
                    if (!this.tiles[this.ATile.x_pos-1][this.ATile.y_pos].solid)  {
                        document.querySelector("#c" + this.ATile.x_pos + "-" + this.ATile.y_pos).src = "./Tiles/Floor_Tile.png";
                        this.ATile.x_pos -= 1;
                        document.querySelector("#c" + this.ATile.x_pos +"-" + this.ATile.y_pos).src = this.ATile.img;
                    }
                }
                break;
            default:
                // some emergency code;
        }
        this.victoryCheck();
    }
}

// This is the map
let test_map = new map(13,13);

// Time & game state variables + methods
// not in a class as event listeners didn't like it
// actualy really bugs me to have this much just floating
// but time is up
let startTime = 20;
let time = startTime;
let gameOver = true;

function rapperMove(e) {
    test_map.move(e);
}

function highScoreMaker() {
    /// Updates the high score chart on the side
    /// perminace between page loads would be nice
    /// for now out of time
    test_map.scores.push(test_map.victoryTotal);
    test_map.scores.sort((a, b) => a - b);
    document.querySelector("#highScores").innerHTML = "";
    let title = document.createElement("li");
    title.classList.add("title");
    title.innerHTML = "High Scores:";
    document.querySelector("#highScores").appendChild(title);
    for (let i = test_map.scores.length-1; i >= 0; i--) {
        let score = document.createElement("li");
        score.innerHTML = test_map.scores[i];
        score.classList.add("score");
        document.querySelector("#highScores").appendChild(score);
    }

}

function start(e) {
    if (e.keyCode == 82) {
        highScoreMaker();
        test_map.victoryTotal = 0;
        document.removeEventListener("keydown", start);
        document.addEventListener("keydown", rapperMove);
        time++;
        setInterval(timeOut, 1000);
        gameOver = false;
    }
}

function reset(e) {
    switch (e.keyCode) {
        case 82:
            document.removeEventListener("keydown", reset);
            document.addEventListener("keydown", rapperMove);
            gameOver = false;
            test_map.newMap();
            test_map.victoryTotal = 0;
            time = startTime;
            document.querySelector("#timer").innerHTML = "Timer: " + time;
            break;
        default:
            break;
    }
}

function timeOut() {
    /// Handels the timer
    time--;
    if (test_map.addTime()) {
        time += 2;
    }
    if (time < 0 && gameOver == false) {
        time = 0;
        document.removeEventListener("keydown", rapperMove);
        gameOver = true;
        highScoreMaker();
        document.addEventListener("keydown", reset);
        document.querySelector("h1").innerHTML = "Maze Game!";
    }
    if (time >= 0) {
        document.querySelector("#timer").innerHTML = "Timer: " + time;
    } else {
        document.querySelector("#timer").innerHTML = "Please press R to play again.";
    }
}



function onBoot() {
    test_map.makeGrid();
    document.querySelector("#timer").innerHTML = "Please press R to play";
    document.addEventListener("keydown", start);
    readScores();
    saveJsonObjToFile();
}

window.addEventListener("load", onBoot);
