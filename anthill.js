let canvas;
let context;

let cells;
let width;
let height;

let ants;

const PERIOD = 100;
const CELL = 15;
const CELL_EMPTY = 0;
const CELL_ANT = 1;
const CELL_BUSY_ANT = 2;
const CELL_GRUB = 3;
const CELL_WALL = 4;

const WALLS_PERCENTAGE = 0.10;
const MAX_WALL = 0.50;
const MIN_WALL = 0.05;
const ANTS_PERCENTAGE = 0.01;
const CHANCES_ANT_REMAINS_SAME_DIRECTION = 20;
const GRUBS_PERCENTAGE = 0.05;

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
    if ([CELL_ANT, CELL_BUSY_ANT, CELL_GRUB, CELL_WALL].includes(cell)) {
        switch (cell) {
            case CELL_ANT:
                context.fillStyle = "#426CFF";
                break;
            case CELL_BUSY_ANT:
                context.fillStyle = "#8bb3ff";
                break;
            case CELL_GRUB:
                context.fillStyle = "#D6EAFF";
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

function getRandomMovement(element) {
    do {
        element.incX = getRandomInc();
        element.incY = getRandomInc();
    } while ((element.incX === 0) && (element.incY === 0));
}

function getRandomNoDiagonalMovement(element) {
    do {
        element.incX = getRandomInc();
        element.incY = getRandomInc();
    } while (((element.incX === 0) && (element.incY === 0)) || ((element.incX !== 0) && (element.incY !== 0)));
}

function antRemainsSameDirection() {
    return getRandom(CHANCES_ANT_REMAINS_SAME_DIRECTION) !== 0;
}

function calculateMoveX(element) {
    return (element.x + element.incX + width) % width;
}

function calculateMoveY(element) {
    return (element.y + element.incY + height) % height;
}

function move(element) {
    element.x = calculateMoveX(element);
    element.y = calculateMoveY(element);
}

function moveAnts() {
    for (let i = 0; i < ants.length; i++) {
        let ant = ants[i];
        let newX = calculateMoveX(ant);
        let newY = calculateMoveY(ant);
        if ((cells[newY][newX] === CELL_EMPTY) && antRemainsSameDirection()) {
            cells[ant.y][ant.x] = CELL_EMPTY;
            move(ant);
            cells[ant.y][ant.x] = CELL_ANT;
        } else {
            getRandomMovement(ants[i]);
        }
    }
}

function frame() {
    moveAnts();
    drawAnthill();
}

function initWalls() {
    let walls = width * height * WALLS_PERCENTAGE;
    let minWall = Math.floor(Math.min(width, height) * MIN_WALL);
    let maxWall = Math.floor(Math.min(width, height) * MAX_WALL);
    let wall = {x: 0, y: 0, incX: 0, incY: 0};
    while (walls > 0) {
        length = getRandomMinMax(minWall, maxWall);
        getRandomNoDiagonalMovement(wall);
        wall.x = getRandom(width);
        wall.y = getRandom(height);
        for (let i = 0; (i < length) && (walls > 0); i++) {
            if (cells[wall.y][wall.x] === CELL_EMPTY) {
                cells[wall.y][wall.x] = CELL_WALL;
                walls--;
            }
            move(wall);
        }
    }
}

function initAnts() {
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
        getRandomMovement(ants[i]);
    }
}

function initGrubs() {
    let grubs = width * height * GRUBS_PERCENTAGE;
    while (grubs > 0) {
        let x = getRandom(width);
        let y = getRandom(height);
        if (cells[y][x] === CELL_EMPTY) {
            cells[y][x] = CELL_GRUB;
            grubs--;
        }
    }
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

    initWalls();
    initAnts();
    initGrubs();
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
