
//import * as MyModual from "./TestModual";

let toggle = true;


// A Medium Maze
let test_maze_tiles =  [[true,true,true,true,true,true,true,true,true,true,true,true,true],
                        [true,false,false,false,false,true,false,false,false,true,false,true,true],
                        [true,false,true,true,true,true,false,true,false,false,false,true,true],
                        [true,false,false,false,true,false,false,true,true,true,true,true,true],
                        [true,true,false,true,true,false,true,true,false,false,false,false,true],
                        [true,false,false,true,true,false,true,false,false,true,true,false,true],
                        [true,false,true,false,true,false,false,false,true,true,true,false,true],
                        [true,false,false,false,true,false,true,true,true,false,false,false,true],
                        [true,true,false,true,true,false,true,false,false,false,true,false,true],
                        [true,false,false,false,false,false,true,false,true,true,true,false,true],
                        [true,true,true,true,true,false,true,false,true,false,false,false,true],
                        [true,false,false,false,false,false,true,false,false,true,false,true,true],
                        [true,true,true,true,true,true,true,true,true,true,true,true,true]];

// A mini Maze                        
// let test_maze_tiles = [[true,true,true,true,true],
//                        [true,false,true,false,true],
//                        [true,false,false,false,true],
//                        [true,false,true,false,true],
//                        [true,true,true,true,true]];

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
        } else if (tileType == "Wall_Tile.png") {
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
    constructor(size_x, size_y, tileMap, tiles = []) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.tiles = tiles;
        this.tileMap = tileMap;
        this.specialTile = new specialTile("A_Point.png", 6, 5);
        //console.log(this.specialTile);
        for (let i = 0; i<this.size_x; i++) {
            this.tiles[i] = [];
            for (let j = 0; j<this.size_y; j++) {
                this.tiles[i][j] = new tile(this.tileMap[i][j], this.tileMap[i][j], i, j, 0);
            }
        }
    }
    makeGrid() {

        /// Need to find put why this rotates the map 90 degrees clock-wise??
        /// then mirroed horizontaly?????

        // size_x = 5;
        // size_y = 5;
        // this.tiles = tiles;
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
                    toAddTile.src = "Floor_Tile.png";
                }
                toAddTile.classList.add("tile");
                toAddTile.id = "c" + j + "-" + i;
                toAddColum.appendChild(toAddTile);
                toAddRow.appendChild(toAddColum);
                //console.log("Tile" + " c" + i + "-" + j + " made");
                //console.log(toAddTile.src);
                //console.log(toAddRow.childElementCount);
            }
            document.querySelector("#map").appendChild(toAddRow);
            //console.log("row " + i + " made");
        }
        document.querySelector("#c" + this.specialTile.x_pos + "-" + this.specialTile.y_pos).src = "A_Point.png";
        
    }


    wallImgSelector(adjacent) {
        let count = 0;
        let rotation;
        for (let i=0; i <adjacent.length; i++) {
            if (!adjacent[i]) {
                count += 1;
            }
        }
        //console.log(count);
        switch (count) {
            case 0:
                // all adjacent tiles are floor insert future island tile here
                break;
            case 1:
                return "Wall_Tile.png";
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
                return "./Tiles/Wall_Deep_Tile.png";
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
                //this.tiles[i][0].rotation = "transform:rotate(270deg);";
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
    move(e) {
        //console.log(this.tiles[this.specialTile.x_pos][this.specialTile.y_pos].solid);

        switch (e.keyCode) {
            case 87:
                if(this.specialTile.y_pos > 0) {
                    //console.log(this.specialTile.x_pos + "-" + this.specialTile.y_pos);
                    if (!this.tiles[this.specialTile.x_pos][this.specialTile.y_pos-1].solid)  {
                        document.querySelector("#c" + this.specialTile.x_pos + "-" + this.specialTile.y_pos).src = "Floor_Tile.png";
                        this.specialTile.y_pos -= 1;
                        document.querySelector("#c" + this.specialTile.x_pos +"-" + this.specialTile.y_pos).src = this.specialTile.img;
                    }
                }
                break;
            case 68:
                // right
                if(this.specialTile.x_pos < this.size_x-1) {
                    if (!this.tiles[this.specialTile.x_pos+1][this.specialTile.y_pos].solid)  {
                        document.querySelector("#c" + this.specialTile.x_pos + "-" + this.specialTile.y_pos).src = "Floor_Tile.png";
                        this.specialTile.x_pos += 1;
                        document.querySelector("#c" + this.specialTile.x_pos +"-" + this.specialTile.y_pos).src = this.specialTile.img;
                    }
                }
                break;
            case 83:
                // down
                if(this.specialTile.y_pos < this.size_y-1) {
                    if (!this.tiles[this.specialTile.x_pos][this.specialTile.y_pos+1].solid)  {
                        document.querySelector("#c" + this.specialTile.x_pos + "-" + this.specialTile.y_pos).src = "Floor_Tile.png";
                        this.specialTile.y_pos += 1;
                        document.querySelector("#c" + this.specialTile.x_pos +"-" + this.specialTile.y_pos).src = this.specialTile.img;
                    }
                }
                break;
            case 65:
                // left
                if(this.specialTile.x_pos > 0) {
                    if (!this.tiles[this.specialTile.x_pos-1][this.specialTile.y_pos].solid)  {
                        document.querySelector("#c" + this.specialTile.x_pos + "-" + this.specialTile.y_pos).src = "Floor_Tile.png";
                        this.specialTile.x_pos -= 1;
                        document.querySelector("#c" + this.specialTile.x_pos +"-" + this.specialTile.y_pos).src = this.specialTile.img;
                    }
                }
                break;
            default:
                // some emergency code;
        }
        //console.log(this.specialTile.x_pos + "-" + this.specialTile.y_pos);
    }
}

let a_pos = [0,0];

let test_map = new map(13,13,test_maze_tiles);


function rapperMove(e) {
    test_map.move(e);
}

function onBoot() {
    //MyModual;
    //testModual();
    //console.log(test_map.tiles);//.wallImgSelector([true,true,true,false]));
    document.addEventListener("keydown", rapperMove);
    test_map.makeGrid();
}

window.addEventListener("load", onBoot);
