/**
 * P5.js
 * Maze Generation: Random Prim's Algorithm
 * 
 * July 18, 2018
 */
//Global variables 
var grids = []; // holds cell nodes 
var neigbors = []; // holds neigboring cell
var w = 30, cols, rows, currentCell; //width, col, row, currentCell

/**
 * Sets up the canvans to draw
 */
function setup() {
    createCanvas(900, 900);
    rows = floor(width/w);
    cols = floor(height/w);
    //create number of cells 
    for (var j = 0; j<rows; j++)
        for(var i = 0; i<cols; i++)
        {
            var cell = new cells(i, j);
            grids.push(cell);
        }
        
        var index = floor(random(0, grids.length-1));
        currentCell = grids[index];
}
/**
 * draws functions
 */
function draw() {
    background(0);
    //draw the cells 
    for(var g = 0; g<grids.length; g++)
        grids[g].show();

    currentCell.visited = true;
    var nextCell = currentCell.neighboringCells(); //select neighboring cell of current Cell randomly 
    if(nextCell)
    {
        nextCell.visited = true;
        removeWall(currentCell, nextCell)
        currentCell = nextCell;
    }

}
/**
 * gets column index
 * @param {*} i 
 * @param {*} j 
 */
function index (i,j)
{
    if(i < 0 || j < 0 || j > rows-1 || i> cols-1)
        return -1;
    return i+j*cols;
}
/**
 * Get a number of wall removed from a cell 
 * @param {*grids.walls} a 
 */
function falseWalls(a){
    var count = 0;
    for (var i = 0; i<a.length; i++)
    {
        if(a[i] == false)
            count++;
    }
    return count;
}
/**
 * if the next cell is not a neigbor of current cell, 
 * this function gets called to remove nextCell walls randomly  
 * @param {nextCell} b 
 * @param {number of removed walls} bfalse 
 * @param {*} c 
 */
function issolatedCells (b, bfalse, c){
    var nGrids = (cols*rows)-1;
    var r = floor(random(0,3))
    var n;
    if(r === 1){
        if(b.ind+1 < nGrids){
            n = grids[b.ind+1]
            if( bfalse < c) {b.walls[r] = false; n.walls[3] = false};
        }
    }
        
    else if(r == 3){
        if(b.ind-1 > 0){
            n = grids[b.ind-1]
            if( bfalse < c){b.walls[r] = false; n.walls[1] = false;}
        }
    }
       
    if(r === 0){
        if(b.ind-cols > 0){
            n = grids[b.ind-cols]
            if( bfalse < c){b.walls[r] = false; n.walls[2] = false;}
        }
    }
    else if(r == 2){
        if(b.ind+cols < nGrids){
            n = grids[b.ind+cols]
            if( bfalse < c) {b.walls[r] = false; n.walls[0] = false;}
        }
    }

}
/**
 * removes walls from selected cells
 * @param {currentCell} a 
 * @param {NextCell} b 
 */
function removeWall(a, b)
{
    //gets the difference index space between a and b  
    var z =  a.ind - b.ind;  
    //number of walls removed from a and b cells   
    var afalse = falseWalls(a.walls)
    var bfalse = falseWalls(b.walls)
    var c = 2;// max wall that can be removed checker 
    if(z === 1)
    {
       if( afalse < c) a.walls[3] = false;
       if( bfalse < c) b.walls[1] = false
    }else if(z === -1)
    {
        if( afalse < c) a.walls[1] = false
        if( bfalse < c) b.walls[3] = false  
    }else if(z === cols){
        if( afalse < c) a.walls[0] = false
        if( bfalse < c) b.walls[2] = false
    }else if(z < -1)
    {
        z*=-1;
        if(z === cols)
        {
            if( afalse < c) a.walls[2] = false
            if( bfalse < c) b.walls[0] = false 
        }
        else{
            issolatedCells(b, bfalse, c);
        }
    }else{
        issolatedCells(b, bfalse, c);
    }
}

/**
 * cell nodes class 
 * @param {coordinate x} i 
 * @param {coordinate y} j 
 */
function cells (i, j){

    this.i = i;
    this.j = j;
    this.ind = index(i,j);
    this.visited = false;
    this.walls = [true, true, true, true];
    //gets neigboring cells and stores them in neigbors array if not selected 
    this.neighboringCells = function(){
      
        for (var k = 0; k<4; k++)
        {
            var ii = k == 1 ? i+1: k == 3 ? i-1 : i;
            var jj = k == 0 ? j-1: k == 2 ? j+1 : j;

            var neigbor = grids[index(ii, jj)]
            if (neigbor && !neigbor.visited) {
                neigbors.push (neigbor);
            }
        }
        if(neigbors.length > 0) //iterates until neigboring cells are empty
        {
            var rand = floor(random(0, neigbors.length));
            var selectedNegbor = neigbors[rand];
            neigbors.splice(rand, 1);
            return selectedNegbor;
        }
        else
            return undefined;
    }
    //draws the lines 
    this.show = function(){
        var x = this.i*w;
        var y = this.j*w;
        stroke(0);
        if(this.walls[0]) line(x,y, x+w, y)
        if(this.walls[1]) line(x+w,y, x+w, y+w)
        if(this.walls[2]) line(x+w,y+w, x, y+w)
        if(this.walls[3]) line(x,y+w, x, y)

        if(this.visited ){
            noStroke();
            fill(255);
            rect(x, y, w, w);
        }
        if(currentCell === this && neigbors.length > 0){
            noStroke();
            fill(255, 0, 0);
            rect(x, y, w, w);
        }
        if(neigbors.includes(this))
        {
            noStroke();
            fill(255, 0, 255);
            rect(x, y, w, w);
        }
    }
}

