let futsu_ga_ichiban = {
    mapName: "testMap",
    map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    moveAllow: [0, 3, 4, 5, 7],//指定したマップチップの衝突判定
    MAP_IMG_PATH: "/img/map3.png",//マップチップ画像
    MAP_WIDTH: 15,//マスの数（幅）
    MAP_HEIGHT: 15,//マスの数（高さ）
    TILESIZE: 32,//マップチップのサイズ(px)
    TILECOLUMN: 4,//マップチップ画像（列）
    TILEROW: 2,//マップチップ画像（行）
    firstPlayerPos: {
        p1: {
            x: 32,
            y: 32
        },
        p2: {
            x: 32,
            y: 32
        },
        p3: {
            x: 32,
            y: 32
        },
        p4: {
            x: 32,
            y: 32
        },
    }
};

const map1 = JSON.parse(JSON.stringify(futsu_ga_ichiban));

//----------------------------------------------------------------

const SMOOTH = 0;//補完処理

const img = {//画像パス
    chr: "/img/chr.png"
};

let mapImg;//マップチップ画像
let chrImg;//マップチップ画像

let vScreen;//仮想画面
let rScreen;//実画面

let rWidth;//実画面の幅
let rHeight;//実画面の高さ

let defaultMoveSpeed = 8;

let playerX = 32;
let playerY = 32;
let playerMove = 0;

let key = {
    up: false,
    down: false,
    left: false,
    right: false
};

//----------------------------------------------------

window.addEventListener('load', () => {
    firstProcesses(map1);
    mainLoop(map1);
});

const firstProcesses = (map) => {
    loadImage(map);
    vScreen = document.createElement('canvas');
    vScreen.width = (map.TILESIZE * map.MAP_WIDTH);
    vScreen.height = (map.TILESIZE * map.MAP_HEIGHT);

    canvasSize(map);
    window.addEventListener("resize", () => { canvasSize(map); });
};

const loadImage = (map) => {
    mapImg = new Image();
    mapImg.src = map.MAP_IMG_PATH;

    chrImg = new Image();
    chrImg.src = img.chr;
};

const canvasSize = (map) => {
    const c = document.querySelector('#canvas');
    c.width = window.innerWidth / 1.15;
    c.height = window.innerHeight / 1.15;

    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = SMOOTH;

    rWidth = c.width;
    rHeight = c.height;

    if (rWidth / (map.TILESIZE * map.MAP_WIDTH) < rHeight / (map.TILESIZE * map.MAP_HEIGHT)) {
        rHeight = rWidth * (map.TILESIZE * map.MAP_HEIGHT) / (map.TILESIZE * map.MAP_WIDTH);
    } else {
        rWidth = rHeight * (map.TILESIZE * map.MAP_WIDTH) / (map.TILESIZE * map.MAP_HEIGHT);
    }
};

const mainLoop = (map) => {
    realPaint();
    addEventListener("keydown", keydownfunc, false);
    addEventListener("keyup", keyupfunc, false);
    keyInput(map);
    KeyOutput(defaultMoveSpeed);
    requestAnimationFrame(() => {
        mainLoop(map);
    });
};

const realPaint = () => {
    vtrPaint();

    const c = document.querySelector('#canvas');
    const ctx = c.getContext("2d");

    ctx.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);
};

const vtrPaint = () => {
    const ctx = vScreen.getContext("2d");
    paintAll(ctx);
};


const paintAll = (ctx) => {
    paintField(ctx, map1);
    ctx.drawImage(chrImg, playerX, playerY);
};

const paintField = (ctx, map) => {
    for (let dy = 0; dy < map.map.length; dy++) {
        for (let dx = 0; dx < map.map[dy].length; dx++) {
            paintMapTile(ctx, mapImg, map.TILESIZE, map.TILECOLUMN, dy, dx, map.map[dy][dx]);
        }
    }
};

const paintMapTile = (ctx, map, ts, tc, dy, dx, idx) => {
    ctx.drawImage(
        map,
        ts * (idx % tc), ts * Math.floor(idx / tc), ts, ts,
        ts * dx, ts * dy, ts, ts
    );
};

const keyInput = (map) => {
    if (playerMove === 0) {
        const { left, right, up, down } = key;
        const x = playerX / map.TILESIZE;
        const y = playerY / map.TILESIZE;

        if (left && map.moveAllow.includes(map.map[y][x - 1])) {
            playerMove = map.TILESIZE;
            key.push = 'left';
        }
        if (right && map.moveAllow.includes(map.map[y][x + 1])) {
            playerMove = map.TILESIZE;
            key.push = 'right';
        }
        if (up && y > 0 && map.moveAllow.includes(map.map[y - 1][x])) {
            playerMove = map.TILESIZE;
            key.push = 'up';
        }
        if (down && y < map.MAP_WIDTH - 1 && map.moveAllow.includes(map.map[y + 1][x])) {
            playerMove = map.TILESIZE;
            key.push = 'down';
        }
    }
};

const KeyOutput = (moveSpeed) => {
    if (playerMove > 0) {
        playerMove -= moveSpeed;
        if (key.push === 'left') playerX -= moveSpeed;
        if (key.push === 'up') playerY -= moveSpeed;
        if (key.push === 'right') playerX += moveSpeed;
        if (key.push === 'down') playerY += moveSpeed;
    }
};

//キーボードが押されたときに呼び出される関数（かんすう）
const keydownfunc = (event) => {
    let key_code = event.keyCode;
    if (key_code === 37) key.left = true;
    if (key_code === 38) key.up = true;
    if (key_code === 39) key.right = true;
    if (key_code === 40) key.down = true;
    event.preventDefault();		//方向キーでブラウザがスクロールしないようにする
};

//キーボードが放（はな）されたときに呼び出される関数
const keyupfunc = (event) => {
    let key_code = event.keyCode;
    if (key_code === 37) key.left = false;
    if (key_code === 38) key.up = false;
    if (key_code === 39) key.right = false;
    if (key_code === 40) key.down = false;
};