//マップの作成（さくせい）
let map = [
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
];

//----------------------------------------------------------------

const SMOOTH = 0;//補完処理

const INTERVAL = 15;//フレームレート設定

const VTL_WIDTH = 512;//マップの幅の総ピクセル数
const VTL_HEIGHT = 512;//マップの高さの総ピクセル数

const MAP_WIDTH = 16;//マップの幅（マス）
const MAP_HEIGHT = 16;//マップの高さ（マス）

const TILESIZE = 32;

let vScreen;//仮想画面
let rScreen;//実画面
let rWidth;//実画面の幅
let rHeight;//実画面の高さ

let mapImg;//マップチップ画像
let ricoImg;//マップチップ画像

const img = {//画像パス
    map: "/img/map.png",
    rico: "/img/rico.png"
};

const loadImage = () => {
    mapImg = new Image();
    mapImg.src = img.map;

    ricoImg = new Image();
    ricoImg.src = img.rico;
};

let playerX = 0;
let playerY = 0;
let playerMove = 0;

let key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';

//----------------------------------------------------

window.addEventListener('load', () => {
    loadImage();
    vScreen = document.createElement('canvas');
    vScreen.width = VTL_WIDTH;
    vScreen.height = VTL_HEIGHT;

    canvasSize();
    window.addEventListener("resize", () => { canvasSize(); });

    mainLoop();
});

const canvasSize = () => {
    const c = document.querySelector('#canvas');
    c.width = window.innerWidth / 1.15;
    c.height = window.innerHeight / 1.15;

    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = SMOOTH;

    rWidth = c.width;
    rHeight = c.height;

    if (rWidth / VTL_WIDTH < rHeight / VTL_HEIGHT) {
        rHeight = rWidth * VTL_HEIGHT / VTL_WIDTH;
    } else {
        rWidth = rHeight * VTL_WIDTH / VTL_HEIGHT;
    }
};

const mainLoop = () => {
    realPaint();
    addEventListener("keydown", keydownfunc, false);
    addEventListener("keyup", keyupfunc, false);
    keyInput();
    KeyOutput();
    requestAnimationFrame(mainLoop);
};

const realPaint = () => {
    vtrPaint();

    const c = document.querySelector('#canvas');
    const ctx = c.getContext("2d");

    ctx.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);
};

const vtrPaint = () => {
    const ctx = vScreen.getContext("2d");
    paintField(ctx);
};

const paintField = (ctx) => {
    for (let dy = 0; dy < map.length; dy++) {
        for (let dx = 0; dx < map[dy].length; dx++) {
            ctx.drawImage(
                mapImg,
                TILESIZE * map[dy][dx], 0, TILESIZE, TILESIZE,
                TILESIZE * dx, TILESIZE * dy, TILESIZE, TILESIZE
            );
        }
    }

    ctx.drawImage(ricoImg, playerX, playerY);
};

const keyInput = () => {
    //方向キーが押されている場合（ばあい）は、りこちゃんが移動する
    if (playerMove === 0) {
        if (key.left === true) {
            let x = playerX / TILESIZE;
            let y = playerY / TILESIZE;
            x--;
            if (map[y][x] === 0) {
                playerMove = TILESIZE;
                key.push = 'left';
            }
        }
        if (key.right === true) {
            let x = playerX / TILESIZE;
            let y = playerY / TILESIZE;
            x++;
            if (map[y][x] === 0) {
                playerMove = TILESIZE;
                key.push = 'right';
            }
        }
        if (key.up === true) {
            let x = playerX / TILESIZE;
            let y = playerY / TILESIZE;
            if (y > 0) {
                y--;
                if (map[y][x] === 0) {
                    playerMove = TILESIZE;
                    key.push = 'up';
                }
            }
        }
        if (key.down === true) {
            let x = playerX / TILESIZE;
            let y = playerY / TILESIZE;
            if (y < MAP_WIDTH - 1) {
                y++;
                if (map[y][x] === 0) {
                    playerMove = TILESIZE;
                    key.push = 'down';
                }
            }
        }
    }
};

const KeyOutput = () => {//rico.moveが0より大きい場合は、4pxずつ移動（いどう）を続ける
    if (playerMove > 0) {
        playerMove -= 2;
        if (key.push === 'left') playerX -= 2;
        if (key.push === 'up') playerY -= 2;
        if (key.push === 'right') playerX += 2;
        if (key.push === 'down') playerY += 2;
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