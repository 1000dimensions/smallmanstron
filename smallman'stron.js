
const tron = document.querySelector('#tron');
const context = tron.getContext('2d');
const grid = 15;

class Player{
	constructor(x, y, team){
		this.color = team || '#fff';
		this.x = x;
		this.sX = x;
		this.y = y;
		this.sY = y;	
		this.dead = false;
		this.direction = '';
		this.constructor.counter = (this.constructor.counter || 0) + 1;
		this._id = this.constructor.counter;
		Player.Programs.push(this)
	}
}
Player.Programs = [];
let p1 = new Player(grid * 6, grid* 10, '#75A4FF');
let p2 = new Player(grid* 10, grid* 10, '#FF5050');
function setKey(key, player, up, right, down, left) {
 	switch (key) {
		case up:
			if (player.direction !== 'DOWN') {
				player.key = 'UP';
			}
			break;
		case right:
			if (player.direction !== 'LEFT') {
				player.key = 'RIGHT';
			}
			break;
		case down:
			if (player.direction !== 'UP') {
				player.key = 'DOWN';
			}
			break;
		case left:
			if (player.direction !== 'RIGHT') {
				player.key = 'LEFT';
			}
      			break;
		default:
		break;
	}
}

function handleKeyPress(event) {
	var key = event.keyCode;

	if (key === 37 || key === 38 || key === 39 || key === 40) {
		event.preventDefault();
	}

	setKey(key, p1, 38, 39, 40, 37); // arrow keys
	setKey(key, p2, 87, 68, 83, 65); // WASD
}
var noCells = [];
document.addEventListener('keydown', handleKeyPress);

function drawGrid() {
	context.strokeStyle = '#001900';
	for(var i = 0; i <= tron.width / grid + 2; i +=2){
		for(var j = 0; j <= tron.height / grid + 2; j +=2) {
			context.strokeRect(0, 0, grid * i, grid * j);
		}
	}
	context.strokeStyle = '#000000';
	context.lineWidth = 2; 
	for(var i = 1; i <= tron.width / grid; i += 2) {
		for(var j = 1; j <= tron.height / grid; j += 2){
			context.strokeRect(0, 0, grid * i, grid * j);
		}
	}
}
drawGrid();

function drawSP(players) {
	players.forEach(p => {
		context.fillStyle = p.color;
		context.fillRect(p.x, p.y, grid, grid);
		context.strokeStyle = 'black';
		context.strokeRect(p.x, p.y, grid, grid);
        noCells.push(p.x + p.y);
        
	}); 
}
drawSP(Player.Programs);
var winnerColor = '';
let outcome, playerCount = Player.Programs.length;
console.log(playerCount);
console.log(winnerColor);
function draw() {
	if(Player.Programs.filter(p => !p.key).length === 0) {
		console.log(Player.Programs)
		}
		Player.Programs.forEach(p => {
			if (p.key) {
				p.direction = p.key;
				context.fillStyle = p.color;
				context.fillRect(p.x, p.y, grid, grid);
				context.strokeStyle = 'black';
				context.strokeRect(p.x, p.y, grid, grid);
                console.log(p.key);
				if (noCells.indexOf(p.x + "x" + p.y + "y") != -1 && p.dead === false) {
					p.dead = true; 
					p.direction = '';
					playerCount = 1; 
                       if(p.dead == true){
                           loserColor = p.color;
                           outcome = (loserColor + " loses");
                           showResults(loserColor);
                       }
				}
                noCells.push(p.x + 'x' + p.y + 'y');
                console.log(noCells);
				if(!p.dead) {
					if(p.direction == "LEFT") p.x -= grid;
					if(p.direction == "UP") p.y -= grid;
					if(p.direction == "RIGHT") p.x += grid;
					if(p.direction == "DOWN") p.y += grid;
				}
			}
		});
}
var game = setInterval(draw, 100);


function showResults(color) {
	const resultnode = document.createElement('div');
	resultnode.id = 'result';
	resultnode.style.color = color || '#fff';
	resultnode.style.position = 'fixed';
	resultnode.style.top = 0;
	resultnode.style.display = 'grid';
	resultnode.style.gridTemplateColums = '1fr';
	resultnode.style.width = '100%';
	resultnode.style.height = '100vh';
	resultnode.style.justifyContent = 'center';
	resultnode.style.alignItems = 'center';
	resultnode.style.background = '#000088';
	const resultText = document.createElement('h1');
	resultText.innerText = outcome;
    resultText.id = 'rText';
	resultText.style.fontFamily = 'Ubuntu';
	resultText.style.textTransform = 'uppercase';
	const replayB = document.createElement('button');
	replayB.innerText = 'Replay';
    replayB.id = "ReplayB";
	replayB.fontFamily = 'Ubuntu';
	replayB.style.textTransform = 'uppercase';
	replayB.style.padding = '10px 30px';
	replayB.style.fontSize = '1.2rem';
	replayB.style.margin = '0 auto';
	replayB.style.cursor = 'pointer';
	replayB.onclick = resetGame;
    
    resultnode.appendChild(resultText);
    resultnode.appendChild(replayB);
	document.querySelector('body').appendChild(resultnode);
    clearInterval(game);
}

function resetGame() {
	const result = document.getElementById('result');
	if(result) {
        result.remove();
    }


	context.clearRect(0, 0, tron.width, tron.height);
	drawGrid();

	noCells = [];
    
    Player.Programs = [];
    
    let p1 = new Player(grid * 6, grid* 10, '#75A4FF');
    let p2 = new Player(grid* 10, grid* 10, '#FF5050');
	
    playerCount = Player.Programs.length;
	drawSP(Player.Programs);
	
	outcome = '';
	loserColor = '';

	var game = setInterval(draw, 100);
}