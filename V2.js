//===== GLOBAL VARIABLES ======
let population; //represent the population in the generation
let generation = 0;//represent the current generation
let grid;//the current generation grid representation
let nextGrid; //the next generation grid representation
const SQUARE_SIZE = 10;
let cols,rows;
let canPress = true;//FLAG toallow user to press mouse 
let intervalID = null;
//the eight neighbours of any given cell (horizontal,vertical,diagonal)
const NEIGHBOURS = [ 
    [-1,-1],[-1,0],[-1,1],
    [0,-1],         [0,1],
    [1,-1],[1,0],[1,1]
];
const LiveCells = new Set(); //keep track of live cells only
//==== FUNCTIONS ====

//create a 2D array
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

//the needed setup initialization
function setup() {
    createCanvas(400, 400); // Create a 400 by 400 canvas to draw onto
    cols = width / SQUARE_SIZE;// cols = 400 / SQUARE_SIZE
    rows = height / SQUARE_SIZE;// rows = 400 / SQUARE_SIZE
    grid = make2DArray(cols, rows);
    nextGrid = make2DArray(cols, rows);
    drawGrid();
    population = countPopulation();
    updatePopulationDisplay(); 
}
//function to redraw the grid
function drawGrid(){
    background(0);
    for(let i = 0;i< cols;i++){
        for(let j = 0;j< rows;j++){
            stroke(255);
            fill(grid[i][j]*255);
            let x = i * SQUARE_SIZE;
            let y = j * SQUARE_SIZE;
            square(x,y,SQUARE_SIZE);
        }
    }
}
//mouse clicked function
function mousePressed(){
    if(canPress){
        let row = floor(mouseX / SQUARE_SIZE);
        let col = floor(mouseY / SQUARE_SIZE);
        grid[row][col] = grid[row][col] === 0 ? 1 : 0;
        population = countPopulation();
        updatePopulationDisplay();
        if(grid[row][col] === 1)
            console.log("Row: "+ row +", Col: "+col);
        if(!(LiveCells.has(row,col)))//only checking the row but not the row and col
            console.log("Added to Set: Row: "+row+" col: "+col);
            LiveCells.add(row,col); 
        //redraw grid
        drawGrid();
    } 
}

//when the start button is clicked, the function will initialize
function startGame(){
    //only start if not already running
    if(intervalID === null){
        intervalID = setInterval(
    function draw(){
        drawGrid();
        disableMousePress();//cannot press mouse
        //let nextGrid = make2DArray(cols, rows);
        // Iterate through the grid and move each cell independently
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j]; // State of the current cell
                let LiveNeighbours = NumLiveNeighbours(grid,i,j);
                if (state === 1) {
                    //Conways First Rule of Game of Life
                    if(LiveNeighbours < 2){
                        nextGrid[i][j] = 0;//Dies
                        //population--;
                    }
                    //conways Second Rule of Game of Life
                    else if(LiveNeighbours <= 3){
                        nextGrid[i][j] = 1;//Lives
                        //population++;
                    
                    }
                    //Conways Third Rule of Game of Life
                    else{
                        nextGrid[i][j] = 0;//dies if more than three live neighbours
                        //population--;
                    }
                }else{ //state === 0
                    //Conways Fourth Rule of Game of Life
                    if(LiveNeighbours == 3){
                        nextGrid[i][j] = 1;//any cell with exactly three live neighbours live's
                        //population++;
                    }
                }
            }
        }
        
        // Update grids for next frame
        grid = nextGrid;
        population = countPopulation();
        generation++;
        updateGenerationDisplay();
        updatePopulationDisplay();
        },100)
    }
}
//pause the game
function pauseGame(){
    clearInterval(intervalID);
    intervalID = null;
    disableMousePress();//cannot use mouse
}
//reset the game
function resetGame(){
    //pause if its running
    pauseGame();
    enableMousePress();
    population = 0;
    updatePopulationDisplay();
    generation = 0;
    updateGenerationDisplay();
    //reset the drawing board
    for(let i = 0;i < cols;i++){
        for(let j = 0; j < rows;j++){
            grid[i][j] = 0;
        }
    }
     drawGrid();
}
//function to count the population of the generation
function countPopulation(){
    let count = 0;
    for(let i = 0;i < cols;i++){
        for(let j = 0;j < rows;j++){
            if(grid[i][j] === 1)count++;
        }
    }
    return count;
}

//function to anable the mouse pressing on the grid
function enableMousePress(){
    canPress = true;
}

//function to disable the mouse pressing on the grid
function disableMousePress(){
    canPress = false;
}

//function to update the display of the population
function updatePopulationDisplay(){
    document.getElementById("dynamic-population").textContent = population;
}

//function to update the display of the generation
function updateGenerationDisplay(){
    document.getElementById("dynamic-generation").textContent = generation;
}

//method to return the number of neighbours in cell
function NumLiveNeighbours(matrix,posX,posY){
    let LNeighbours = 0;
    //need to check current cells live neighbours
    for(let [dx,dy] of NEIGHBOURS){
        let [newX,newY] = get_toroidal_coordinates(posX + dx,posY + dy,cols,rows);
        if(matrix[newX][newY] == 1){
            LNeighbours++;
        }
    }
    return LNeighbours;//returns all the live neighbours of current cell
}

//function to "wrap" the coordinates around the grid
function get_toroidal_coordinates(x,y,width,height){
    let new_x = (x + width)%width;
    let new_y = (y + height)%height;

    return [new_x,new_y];
}