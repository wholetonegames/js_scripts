import { AStar } from './a_star';
import { MazeGenerator } from './maze-gen';

// row and column
const m = new MazeGenerator(5, 5);
const a_star = new AStar(m.exportArray);
