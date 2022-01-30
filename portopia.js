// linear investigation game
const HALL = 0;
const KITCHEN = 1;
const SEARCH = 0;
const THINK = 1;

// to make it non linear, replace the list with a directed graph
const goals = [
    {location: HALL, action:SEARCH},
    {location: KITCHEN, action:THINK}
]

let goalsIndex = 0;

const isPlayerGoal = (playerObj, currentGoal) => {
    let answer = true;
    Object.keys(playerObj).forEach(k=>{
        if(playerObj[k] !== currentGoal[k]){
            answer = false
        } 
    })
    return answer
}

while(goalsIndex < goals.length){
    const loc = prompt("0- hall, 1- kitchen");
    const location = parseInt(loc);
    const act = prompt("0- search, 1- think");
    const action = parseInt(act);
    const playerChoices = {location, action}
    if(isPlayerGoal(playerChoices, goals[goalsIndex])){
        console.log('right!');
        goalsIndex += 1;
    } else {
        console.log('wrong...');
    }
}
console.log('end');