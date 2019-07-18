let canvas;
let context;

let cells;
let width;
let height;

let ants;

const PERIOD = 100;
const CELL = 10;
const CELL_EMPTY = 0;
const CELL_ANT = 1;
const CELL_LARVA = 2;
const CELL_WALL = 3;

const ANTS_PERCENTAGE = 0.02;
const CHANCES_ANT_REMAINS_SAME_DIRECTION = 20;

function getRandom(max) {
    return getRandomMinMax(0, max - 1);
}

function getRandomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomInc() {
    return getRandomMinMax(-1, 1);
}

function drawBackground() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCell(x, y) {
    let cell = cells[y][x];
    if ([CELL_ANT, CELL_LARVA, CELL_WALL].includes(cell)) {
        switch (cell) {
            case CELL_ANT:
                context.fillStyle = "#426CFF";
                break;
            case CELL_LARVA:
                context.fillStyle = "#C9E8FB";
                break;
            case CELL_WALL:
                context.fillStyle = "#FF822D";
                break;
        }
        let posX = CELL * x;
        let posY = CELL * y;
        context.fillRect(posX, posY, CELL - 1, CELL - 1);
    }
}

function drawAnthill() {
    drawBackground();
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawCell(x, y);
        }
    }
}

function getRandomAntMovement(ant) {
    do {
        ant.incX = getRandomInc();
        ant.incY = getRandomInc();
    } while ((ant.incX === 0) && (ant.incY === 0));
}

function antRemainsSameDirection() {
    return getRandom(CHANCES_ANT_REMAINS_SAME_DIRECTION) !== 0;
}

function moveX(ant) {
    return (ant.x + ant.incX + width) % width;
}

function moveY(ant) {
    return (ant.y + ant.incY + height) % height;
}

function moveAnts() {
    for (let i = 0; i < ants.length; i++) {
        let ant = ants[i];
        let newX = moveX(ant);
        let newY = moveY(ant);
        if ((cells[newY][newX] === CELL_EMPTY) && antRemainsSameDirection()) {
            cells[ant.y][ant.x] = CELL_EMPTY;
            ant.x = moveX(ant);
            ant.y = moveY(ant);
            cells[ant.y][ant.x] = CELL_ANT;
        } else {
            getRandomAntMovement(ants[i]);
        }
    }
}

function frame() {
    moveAnts();
    drawAnthill();
}

function initAnthill() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    width = Math.floor(canvas.width / CELL);
    height = Math.floor(canvas.height / CELL);
    cells = [];
    cells.length = height;
    for (let y = 0; y < height; y++) {
        cells[y] = [];
        cells[y].length = width;
        for (let x = 0; x < width; x++) {
            cells[y][x] = CELL_EMPTY;
        }
    }
    ants = [];
    ants.length = Math.floor(width * height * ANTS_PERCENTAGE);
    for (let i = 0; i < ants.length; i++) {
        let x, y, cell;
        do {
            x = getRandom(width);
            y = getRandom(height);
            cell = cells[y][x];
        } while (cell !== CELL_EMPTY);
        cells[y][x] = CELL_ANT;
        ants[i] = {x: x, y: y, incX: 0, incY: 0};
        getRandomAntMovement(ants[i]);
    }
}

function anthill(id) {
    canvas = document.getElementById(id);
    context = canvas.getContext('2d');
    initAnthill();
    drawAnthill();

    setInterval(frame, PERIOD);
    window.addEventListener("resize", function() {
        initAnthill();
    });
}
