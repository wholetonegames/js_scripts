// https://rosettacode.org/wiki/A*_search_algorithm#JavaScript

var ctx,
    mazeMap,
    openSquareList,
    closedSquareList,
    start = {
        x: 1,
        y: 1,
        f: 0, // f cost = g cost + h cost
        g: 0 // g cost = distance from starting node
        // h cost (heuristic) = distance from goal node
    },
    mazeWidth = 10,
    mazeHeight = 10,
    neighbours,
    path;

function findNeighbour(arr, n) {
    var a;
    for (var i = 0; i < arr.length; i++) {
        a = arr[i];
        if (n.x === a.x && n.y === a.y) return i;
    }
    return -1;
}
function addNeighbours(cur, goal) {
    var p;
    for (var i = 0; i < neighbours.length; i++) {
        var n = {
            x: cur.x + neighbours[i].x,
            y: cur.y + neighbours[i].y,
            g: 0,
            h: 0,
            prt: { x: cur.x, y: cur.y }
        };
        if (mazeMap[n.x][n.y] == 1 || findNeighbour(closedSquareList, n) > -1)
            continue;
        n.g = cur.g + neighbours[i].c;
        n.h = Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y);
        p = findNeighbour(openSquareList, n);
        if (p > -1 && openSquareList[p].g + openSquareList[p].h <= n.g + n.h)
            continue;
        openSquareList.push(n);
    }
    openSquareList.sort(function (a, b) {
        return (a.g + a.h) - (b.g + b.h);
    });
}
function createPath() {
    path = [];
    var a, b;
    a = closedSquareList.pop();
    path.push(a);
    while (closedSquareList.length) {
        b = closedSquareList.pop();
        if (b.x != a.prt.x || b.y != a.prt.y) continue;
        a = b; path.push(a);
    }
}
function solveMap(goal) {
    drawMap();
    if (openSquareList.length < 1) {
        document.body.appendChild(document.createElement("p")).innerHTML = "Impossible!";
        return;
    }
    var cur = openSquareList.splice(0, 1)[0];
    closedSquareList.push(cur);
    if (cur.x == goal.x && cur.y == goal.y) {
        createPath(); 
        drawMap();
        return;
    }
    addNeighbours(cur, goal);
    requestAnimationFrame(function (timestamp) {
        solveMap(goal);
    })
}
function drawMap() {
    ctx.fillStyle = "#ee6"; ctx.fillRect(0, 0, 200, 200);
    for (var j = 0; j < mazeHeight; j++) {
        for (var i = 0; i < mazeWidth; i++) {
            switch (mazeMap[i][j]) {
                case 0: continue;
                case 1: ctx.fillStyle = "#990"; break;
                case 2: ctx.fillStyle = "#090"; break;
                case 3: ctx.fillStyle = "#900"; break;
            }
            ctx.fillRect(i, j, 1, 1);
        }
    }
    var a;
    if (path.length) {
        var txt = "Path: " + (path.length - 1) + "<br />[";
        for (var i = path.length - 1; i > -1; i--) {
            a = path[i];
            ctx.fillStyle = "#999";
            ctx.fillRect(a.x, a.y, 1, 1);
            txt += "(" + a.x + ", " + a.y + ") ";
        }
        document.body.appendChild(document.createElement("p")).innerHTML = txt + "]";
        return;
    }
    for (var i = 0; i < openSquareList.length; i++) {
        a = openSquareList[i];
        ctx.fillStyle = "#909";
        ctx.fillRect(a.x, a.y, 1, 1);
    }
    for (var i = 0; i < closedSquareList.length; i++) {
        a = closedSquareList[i];
        ctx.fillStyle = "#009";
        ctx.fillRect(a.x, a.y, 1, 1);
    }
}
function createMap() {
    mazeMap = new Array(mazeWidth);
    for (var i = 0; i < mazeWidth; i++) {
        mazeMap[i] = new Array(mazeHeight);
        for (var j = 0; j < mazeHeight; j++) {
            // outer walls
            if (!i || !j || i == mazeWidth - 1 || j == mazeHeight - 1) mazeMap[i][j] = 1;
            // floor
            else mazeMap[i][j] = 0;
        }
    }
    // walls
    mazeMap[5][3] = mazeMap[6][3] = mazeMap[7][3] = mazeMap[3][4] = mazeMap[7][4] = mazeMap[3][5] =
        mazeMap[7][5] = mazeMap[3][6] = mazeMap[4][6] = mazeMap[5][6] = mazeMap[6][6] = mazeMap[7][6] = 1;
    // mazeMap[start.x][start.y] = 2; mazeMap[goal.x][goal.y] = 3;
}
function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor(scaleBetween(event.clientX - rect.left, 0, 10, 0, 200));
    var y = Math.floor(scaleBetween(event.clientY - rect.top, 0, 10, 0, 200));

    return { x: x, y: y, f: 0, g: 0 };
}
function startAlgo(point, goal) {
    openSquareList = [], closedSquareList = [];
    path = [];
    createMap();
    openSquareList.push(point);
    solveMap(goal);
}
function init() {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = 200;
    ctx = canvas.getContext("2d");
    ctx.scale(20, 20);
    document.body.appendChild(canvas);

    neighbours = [
        { x: 1, y: 0, c: 1 },
        { x: -1, y: 0, c: 1 },
        { x: 0, y: 1, c: 1 },
        { x: 0, y: -1, c: 1 },
        { x: 1, y: 1, c: 1.4 },
        { x: 1, y: -1, c: 1.4 },
        { x: -1, y: 1, c: 1.4 },
        { x: -1, y: -1, c: 1.4 }
    ];

    var goal = { x: 8, y: 8, f: 0, g: 0 };

    // Add event listener for `click` events.
    canvas.addEventListener('click', function (event) {
        var pos = getCursorPosition(canvas, event);
        // don't try to solve when a wall is selected
        if(mazeMap[pos.x][pos.y] === 1){
            return;
        } 
        var cur = path.splice(0, 1)[0];
        startAlgo(cur, pos);
    }, false);

    startAlgo(start, goal);
}