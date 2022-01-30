interface Maze {
    col: number;
    row: number;
    horiz: any[][];
    verti: any[][];
}

export class MazeGenerator {
    private maze: Maze;
    exportArray: any[];
    private mazeString: string;

    constructor(col: number, row: number) {
        this.maze = this.makeMaze(col, row);
        this.mazeString = this.display(this.maze);
        const elem = document.createElement('pre');
        elem.innerHTML = this.mazeString;
        document.body.appendChild(elem);
    }

    private makeMaze(col: number, row: number): Maze {
        let n = col * row - 1;
        if (n < 0) {
            return;
        }
        let horiz: any[][] = new Array<any>(col + 1);
        let verti: any[][] = new Array<any>(col + 1);
        let here = [Math.floor(Math.random() * col), Math.floor(Math.random() * row)];
        let path = [here];
        let unvisited: any[][] = [];

        for (let j = 0; j < col + 1; j++) {
            horiz[j] = [];
            verti[j] = [];
        }
        for (let j = 0; j < col + 2; j++) {
            unvisited[j] = [];
            for (let k = 0; k < row + 1; k++) {
                unvisited[j].push(j > 0 && j < col + 1 && k > 0 && (j !== here[0] + 1 || k !== here[1] + 1));
            }

        }
        while (0 < n) {
            const potential: any[] = [
                [here[0] + 1, here[1]],
                [here[0], here[1] + 1],
                [here[0] - 1, here[1]],
                [here[0], here[1] - 1]
            ];
            const neighbors = [];
            for (let j = 0; j < 4; j++) {
                if (unvisited[potential[j][0] + 1][potential[j][1] + 1]) {
                    neighbors.push(potential[j]);
                }
            }

            if (neighbors.length) {
                n = n - 1;
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                unvisited[next[0] + 1][next[1] + 1] = false;
                if (next[0] === here[0])
                    horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
                else
                    verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
                path.push(here = next);
            } else {
                here = path.pop();
            }
        }
        return { col: col, row: row, horiz: horiz, verti: verti };
    }

    private display(m: Maze): string {
        this.exportArray = [];
        for (let j = 0; j < m.col * 2 + 1; j++) {
            const line = [];
            if (0 === j % 2)
                for (let k = 0; k < m.row * 4 + 1; k++)
                    if (0 === k % 4)
                        line[k] = '+';
                    else
                        if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 4)])
                            line[k] = ' ';
                        else
                            line[k] = '-';
            else
                for (let k = 0; k < m.row * 4 + 1; k++)
                    if (0 === k % 4)
                        if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1])
                            line[k] = ' ';
                        else
                            line[k] = '|';
                    else
                        line[k] = ' ';
            if (0 === j) line[1] = line[2] = line[3] = ' ';
            if (m.col * 2 - 1 === j) line[4 * m.row] = ' ';
            this.exportArray.push(line);
        }
        const text = [];
        for (const line of this.exportArray) {
            text.push(line.join('') + '\r\n');
        }
        return text.join('');
    }
}

