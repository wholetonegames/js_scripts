// https://rosettacode.org/wiki/A*_search_algorithm#JavaScript

interface Point {
    x: number;
    y: number;
}

interface CostNode {
    g: number; // g cost = distance from starting node
    h: number; // h cost (heuristic) = distance from goal node
}

interface NeighbourNode extends Point, CostNode {
    f: number; // f cost = g cost + h cost
    prt: Point;
}

interface NeighbourCost extends Point {
    c: number;
}

class AStarNode {
    constructor(
        public x: number,
        public y: number,
        public f: number,
        public g: number
    ) { }
}

export class AStar {
    private ctx: CanvasRenderingContext2D;
    private mazeMap: any[];
    private openSquareList: any[];
    private closedSquareList: any[];
    private readonly neighbours: NeighbourCost[] = [
        { x: 1, y: 0, c: 1 },
        { x: -1, y: 0, c: 1 },
        { x: 0, y: 1, c: 1 },
        { x: 0, y: -1, c: 1 },
        { x: 1, y: 1, c: 1.4 },
        { x: 1, y: -1, c: 1.4 },
        { x: -1, y: 1, c: 1.4 },
        { x: -1, y: -1, c: 1.4 }
    ];

    private mazeWidth = 11;
    private mazeHeight = 11;
    private path: any[];
    private inputMaze?: any[];

    private scaleBetween(unscaledNum: number, minAllowed: number,
        maxAllowed: number, min: number, max: number): number {
        return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
    }

    private getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): AStarNode {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(this.scaleBetween(event.clientX - rect.left, 0, 11, 0, 220));
        const y = Math.floor(this.scaleBetween(event.clientY - rect.top, 0, 11, 0, 220));

        return new AStarNode(x, y, 0, 0);
    }

    private findNeighbour(arr: any[], n: NeighbourNode): number {
        let a;
        for (let i = 0; i < arr.length; i++) {
            a = arr[i];
            if (n.x === a.x && n.y === a.y) return i;
        }
        return -1;
    }

    private addNeighbours(cur: AStarNode, goal: AStarNode): void {
        let p;
        for (let i = 0; i < this.neighbours.length; i++) {
            const n = {
                x: cur.x + this.neighbours[i].x,
                y: cur.y + this.neighbours[i].y,
                f: 0,
                g: 0,
                h: 0,
                prt: { x: cur.x, y: cur.y }
            };

            if ( !this.mazeMap[n.x] || this.mazeMap[n.x][n.y] === 1 || this.findNeighbour(this.closedSquareList, n) > -1)
                continue;
            n.g = cur.g + this.neighbours[i].c;
            n.h = Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y);
            p = this.findNeighbour(this.openSquareList, n);
            if (p > -1 && this.openSquareList[p].g + this.openSquareList[p].h <= n.g + n.h)
                continue;
            this.openSquareList.push(n);
        }
        this.openSquareList.sort((a: CostNode, b: CostNode) => {
            return (a.g + a.h) - (b.g + b.h);
        });
    }

    private createPath(): void {
        this.path = [];
        let a, b;
        a = this.closedSquareList.pop();
        this.path.push(a);
        while (this.closedSquareList.length) {
            b = this.closedSquareList.pop();
            if (b.x !== a.prt.x || b.y !== a.prt.y)
                continue;
            a = b; this.path.push(a);
        }
    }

    private solveMap(goal: AStarNode): void {
        this.drawMap();
        if (this.openSquareList.length < 1) {
            document.body.appendChild(document.createElement('p')).innerHTML = 'Impossible!';
            return;
        }
        const cur = this.openSquareList.splice(0, 1)[0];
        this.closedSquareList.push(cur);
        if (cur.x === goal.x && cur.y === goal.y) {
            this.createPath();
            this.drawMap();
            return;
        }
        this.addNeighbours(cur, goal);
        requestAnimationFrame((timestamp: number) => {
            this.solveMap(goal);
        });
    }

    private drawMap(): void {
        this.ctx.fillStyle = '#ee6'; this.ctx.fillRect(0, 0, 220, 220);
        for (let j = 0; j < this.mazeHeight; j++) {
            for (let i = 0; i < this.mazeWidth; i++) {
                switch (this.mazeMap[i][j]) {
                    case 0: continue;
                    case 1: this.ctx.fillStyle = '#990'; break;
                    case 2: this.ctx.fillStyle = '#090'; break;
                    case 3: this.ctx.fillStyle = '#900'; break;
                }
                this.ctx.fillRect(i, j, 1, 1);
            }
        }
        let a;
        if (this.path.length) {
            let txt = 'Path: ' + (this.path.length - 1) + '<br />[';
            for (let i = this.path.length - 1; i > -1; i--) {
                a = this.path[i];
                this.ctx.fillStyle = '#999';
                this.ctx.fillRect(a.x, a.y, 1, 1);
                txt += '(' + a.x + ', ' + a.y + ') ';
            }
            document.body.appendChild(document.createElement('p')).innerHTML = txt + ']';
            return;
        }
        for (let i = 0; i < this.openSquareList.length; i++) {
            a = this.openSquareList[i];
            this.ctx.fillStyle = '#909';
            this.ctx.fillRect(a.x, a.y, 1, 1);
        }
        for (let i = 0; i < this.closedSquareList.length; i++) {
            a = this.closedSquareList[i];
            this.ctx.fillStyle = '#009';
            this.ctx.fillRect(a.x, a.y, 1, 1);
        }
    }

    private createMapFromInput(): void {
        const maze: any[] = [];
        for (let i = 0; i < this.inputMaze[0].length; i += 2) {
            let colRow: any[] = [];
            for (let j = 0; j < this.inputMaze.length; j++) {
                const cell = this.inputMaze[j][i];
                const isWall = cell === '|' || cell === '-' || cell === '+';
                colRow.push(isWall ? 1 : 0);
            }
            maze.push(colRow);
        }

        this.mazeMap = maze;
        this.mazeHeight = maze.length;
        this.mazeWidth = maze[0].length;
    }
    private createMap(): void {
        this.mazeMap = new Array(this.mazeWidth);
        for (let i = 0; i < this.mazeWidth; i++) {
            this.mazeMap[i] = new Array(this.mazeHeight);
            for (let j = 0; j < this.mazeHeight; j++) {
                // outer walls
                if (!i || !j || i === this.mazeWidth - 1 || j === this.mazeHeight - 1) this.mazeMap[i][j] = 1;
                // floor
                else this.mazeMap[i][j] = 0;
            }
        }
        // walls
        this.mazeMap[5][3] = this.mazeMap[6][3] = this.mazeMap[7][3] = this.mazeMap[3][4] = this.mazeMap[7][4] = this.mazeMap[3][5] =
            this.mazeMap[7][5] = this.mazeMap[3][6] = this.mazeMap[4][6] = this.mazeMap[5][6] = this.mazeMap[6][6] = this.mazeMap[7][6] = 1;
        // this.mazeMap[start.x][start.y] = 2; this.mazeMap[goal.x][goal.y] = 3;
    }

    private startAlgo(point: AStarNode, goal: AStarNode): void {
        this.openSquareList = [], this.closedSquareList = [];
        this.path = [];
        if (this.inputMaze) {
            if (!this.mazeMap) {
                point = new AStarNode(1, 0, 0, 0);
                goal = new AStarNode(1, 1, 0, 0);
            }
            this.createMapFromInput();
        } else {
            this.createMap();
        }
        this.openSquareList.push(point);
        this.solveMap(goal);
    }

    private isNodeWall(node: AStarNode): boolean {
        return this.mazeMap[node.x][node.y] === 1;
    }

    constructor(inputMaze?: any[]) {
        this.inputMaze = inputMaze;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 220;
        this.ctx = canvas.getContext('2d');
        this.ctx.scale(20, 20);
        document.body.appendChild(canvas);

        const start = new AStarNode(1, 1, 0, 0);
        const goal = new AStarNode(8, 8, 0, 0);

        // Add event listener for `click` events.
        canvas.addEventListener('click', (event: MouseEvent) => {
            const pos = this.getCursorPosition(canvas, event);
            // don't try to solve when a wall is selected
            if (this.isNodeWall(pos)) {
                return;
            }
            const cur = this.path.splice(0, 1)[0];
            this.startAlgo(cur, pos);
        }, false);

        this.startAlgo(start, goal);
    }
}