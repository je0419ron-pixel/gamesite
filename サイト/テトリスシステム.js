const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const blockSize = 30;

const ROWS = 20;
const COLS = 10;

let gameRunning = false;

/* ===== ステージ ===== */

const board = [];

for(let y = 0; y < ROWS; y++){

    board[y] = [];

    for(let x = 0; x < COLS; x++){

        board[y][x] = null;

    }
}

/* ===== テトロミノ ===== */

const tetriminos = [

    {
        color:"#4fc3f7",
        shape:[[1,1,1,1]]
    },

    {
        color:"#ffd54f",
        shape:[
            [1,1],
            [1,1]
        ]
    },

    {
        color:"#ba68c8",
        shape:[
            [0,1,0],
            [1,1,1]
        ]
    },

    {
        color:"#66bb6a",
        shape:[
            [0,1,1],
            [1,1,0]
        ]
    },

    {
        color:"#ef5350",
        shape:[
            [1,1,0],
            [0,1,1]
        ]
    },

    {
        color:"#42a5f5",
        shape:[
            [1,0,0],
            [1,1,1]
        ]
    },

    {
        color:"#ffb74d",
        shape:[
            [0,0,1],
            [1,1,1]
        ]
    }
];

let currentPiece = null;

/* ===== ブロック生成 ===== */

function createPiece(){

    const randomIndex =
        Math.floor(
            Math.random() *
            tetriminos.length
        );

    const piece =
        tetriminos[randomIndex];

    return{

        x:3,
        y:0,

        color:piece.color,
        shape:piece.shape
    };
}

/* ===== 固定ブロック描画 ===== */

function drawBoard(){

    for(let y = 0; y < ROWS; y++){

        for(let x = 0; x < COLS; x++){

            if(board[y][x]){

                ctx.fillStyle =
                    board[y][x];

                ctx.fillRect(
                    x * blockSize,
                    y * blockSize,
                    blockSize,
                    blockSize
                );

                ctx.strokeStyle =
                    "#ffffff";

                ctx.strokeRect(
                    x * blockSize,
                    y * blockSize,
                    blockSize,
                    blockSize
                );
            }
        }
    }
}

/* ===== 操作中ブロック描画 ===== */

function drawPiece(){

    currentPiece.shape.forEach(
        (row,rowIndex)=>{

        row.forEach(
            (value,colIndex)=>{

            if(value){

                ctx.fillStyle =
                    currentPiece.color;

                ctx.fillRect(
                    (currentPiece.x + colIndex)
                    * blockSize,

                    (currentPiece.y + rowIndex)
                    * blockSize,

                    blockSize,
                    blockSize
                );

                ctx.strokeStyle =
                    "#ffffff";

                ctx.strokeRect(
                    (currentPiece.x + colIndex)
                    * blockSize,

                    (currentPiece.y + rowIndex)
                    * blockSize,

                    blockSize,
                    blockSize
                );
            }
        });
    });
}

/* ===== 着地判定 ===== */

function collision(){

    for(
        let row = 0;
        row < currentPiece.shape.length;
        row++
    ){

        for(
            let col = 0;
            col < currentPiece.shape[row].length;
            col++
        ){

            if(
                !currentPiece.shape[row][col]
            ){
                continue;
            }

            const nextY =
                currentPiece.y +
                row +
                1;

            if(nextY >= ROWS){
                return true;
            }

            if(
                board[nextY]
                [
                    currentPiece.x + col
                ]
            ){
                return true;
            }

        }
    }

    return false;
}

/* ===== 固定 ===== */

function mergePiece(){

    currentPiece.shape.forEach(
        (row,rowIndex)=>{

        row.forEach(
            (value,colIndex)=>{

            if(value){

                board[
                    currentPiece.y +
                    rowIndex
                ][
                    currentPiece.x +
                    colIndex
                ] =
                currentPiece.color;
            }

        });
    });
}

/* ===== 描画 ===== */

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBoard();

    if(currentPiece){

        drawPiece();

    }
}

/* ===== 更新 ===== */

function update(){

    if(!gameRunning){
        return;
    }

    if(collision()){

        mergePiece();

        currentPiece =
            createPiece();

    }else{

        currentPiece.y++;

    }

    draw();
}

/* ===== ゲーム開始 ===== */

document
.getElementById("startButton")
.addEventListener(
    "click",
    ()=>{

        currentPiece =
            createPiece();

        gameRunning = true;

        draw();
    }
);

setInterval(
    update,
    500
);