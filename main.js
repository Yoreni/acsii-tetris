//game data
var grid = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],/*after this is a buffer zone*/[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
var score = 0;
var lines = 0;
var level = 1;
var start = (new Date()).getTime();
var hold = 0;

var next = [];
var levelUp = 1000 * (Math.pow(2.2,Math.sqrt(level - 1)));
var bag = [1,2,3,4,5,6,7];
bag = shuffle(bag);

next.push(bag.shift());
next.push(bag.shift());
next.push(bag.shift());

var screenText = 
[
	[
		["|###ASCII#TETRIS##|"],
		["|#################|"],
		["|####Controls:####|"],
		["|Right#arrow:#move|"],
		["|right############|"],
		["|Left#arrow:#move#|"],
		["|Up#arrow:#rotate#|"],
		["|peice############|"],
		["|Down#Arrow:#soft#|"],
		["|drop#############|"],
		["|Space:#hard#drop#|"],
		["|C:#hold#peice####|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|###Press#space###|"],
		["|####to#start#####|"],
		["|#################|"],
		["|#################|"],
		["|#################|"]
	],
		[
		["|####GAME#OVER####|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|###refresh#the###|"],
		["|###page#to#play##|"],
		["|######again######|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"],
		["|#################|"]
	]
]

var cleared =
{
	lines: [],
	show: 0
}

var screen = 0;

var player =
{
	type: 1,
	pos: [],
	down: (new Date()).getTime() + 1000,
	centerX: 4.5,
	centerY: 18.5,
	flash: -1
}

var cheer =
{
	letters: "",
	expries: 0
}
var levelupExpries = 0

for(a = 0 ; a < 4 ; a++)
{
	player.pos.push(
	{
		"x": 0,
		"y": 0
	})
}

var lastTime = 0;

nextBrick(next.shift());
if(bag.length == 0)
{
	bag = [1,2,3,4,5,6,7];
	bag = shuffle(bag);
}
next.push(bag.shift());

function drawLine(line)
{
	blocks = grid[line];
	output = ""
	if(cleared.lines.includes(line))
	{
		output = "==========";
	}
	else
	{
		for(a = 0; a < 10 ; a++)
		{
			if(blocks[a] == 0)
			{
				output = output + "\u00A0";
			}
			else
			{
				output = output + "ABCDEFG"[grid[line][a] - 1];
			}
		}
	}
	//players's ghost
	var drawPlayer = []
	var down = 1;
	while(true)
	{
		var flag = true;
		for(a = 0 ; a < 4 ; a++)
		{
			if(player.pos[a].y - down >= 0)
			{
				flag = (grid[player.pos[a].y - down][player.pos[a].x] == 0);
			}
			else
			{
				flag = false;
			}
			if(!flag)
			{
				break;
			}
		}
		if(flag)
		{
			down++;
		}
		else
		{
			break;
		}
	}
	down--;
	if(down > 0)
	{
		for(a = 0 ; a < 4 ; a++)
		{
			if((player.pos[a].y - down) == line)
			{
				drawPlayer.push(player.pos[a]);
			}
		}
		for(const block of drawPlayer)
		{
			output = replaceAt(output,block.x,"X");
		}
	}
	//player
	if(player.flash == -1 || (player.flash > 0 && (player.flash % 400) >= 200))
	{
		drawPlayer = []
		for(a = 0 ; a < 4 ; a++)
		{
			if(player.pos[a].y == line)
			{
				drawPlayer.push(player.pos[a]);
			}
		}
		for(const block of drawPlayer)
		{
			output = replaceAt(output,block.x,"ABCDEFG"[player.type - 1]);
		}
	}
	return output;
}

function replaceAt(string, index, replace) 
{
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function randint(min,max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list)
{
	for(var a = 0 ; a < list.length ;  a++)
	{
		var b = list[a];
		var randomPlace = Math.floor(Math.random() * list.length);
		var c = list[randomPlace]
		list[randomPlace] = b;
		list[a] = c;
	}
	return list;
}

function nextBrick(brick)
{
	var up = 0;
	
	player.type = brick;
	player.centerX = 5;
	player.centerY = 18;
	player.flash = -1;
	
	if(brick == 1) //long peice
	{
		player.centerX = 4.5;
		player.centerY = 18.5;
		player.pos[3].y = 19; player.pos[3].x = 6;
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 19; player.pos[1].x = 4;
		player.pos[2].y = 19; player.pos[2].x = 3;
	}
	else if(brick == 2) //square
	{
		player.centerX = 4.5;
		player.centerY = 18.5;
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 19; player.pos[1].x = 4;
		player.pos[2].y = 18; player.pos[2].x = 5;
		player.pos[3].y = 18; player.pos[3].x = 4;
	}
	else if(brick == 3) //left L
	{
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 19; player.pos[1].x = 4;
		player.pos[2].y = 18; player.pos[2].x = 5;
		player.pos[3].y = 17; player.pos[3].x = 5;
	}
	else if(brick == 4) //right L
	{
		player.centerX = 4;
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 19; player.pos[1].x = 4;
		player.pos[2].y = 18; player.pos[2].x = 4;
		player.pos[3].y = 17; player.pos[3].x = 4;
	}
	else if(brick == 5) //left S
	{
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 19; player.pos[1].x = 4;
		player.pos[2].y = 18; player.pos[2].x = 5;
		player.pos[3].y = 18; player.pos[3].x = 6;
	}
	else if(brick == 6) //right S
	{
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 19; player.pos[1].x = 6;
		player.pos[2].y = 18; player.pos[2].x = 5;
		player.pos[3].y = 18; player.pos[3].x = 4;
	}
	else if(brick == 7) // T piece
	{
		player.pos[0].y = 19; player.pos[0].x = 5;
		player.pos[1].y = 18; player.pos[1].x = 4;
		player.pos[2].y = 18; player.pos[2].x = 5;
		player.pos[3].y = 18; player.pos[3].x = 6;
	}
	
	while(playerFits())
	{
		//moves the piece up if it does not fit
		for(b = 0 ; b < 4 ; b++)
		{
			player.pos[b].y += 1;
		}
		player.centerY -= 1;
		
		//tests for gameover
		var cord = 24;
		for(b = 0 ; b < 4 ; b++)
		{
			if(player.pos[b].y < cord)
			{
				cord = player.pos[b].y;
			}
		}
		
		if(cord > 19)
		{
			screen = 1;
		}
	}
}

function playerFits()
{
	var fits = true
	
	for(b = 0 ; b < 4 ; b++)
	{
		//alert(player.pos[b].y + "," + player.pos[b].x)
		fits = (grid[player.pos[b].y][player.pos[b].x] != 0)
		if(!fits)
		{
			break;
		}
	}
	
	return fits;
}



document.addEventListener('keydown', move); //moves the block
function move(e)
{
	key = e.keyCode;
	//alert(e.keyCode.toString());
	if(screen == -1)
	{
		if(key == 37) //left (move left)
		{
			if(playerCanGo("left",1))
			{
				for(b = 0 ; b < 4 ; b++)
				{	
					player.pos[b].x -= 1;
				}
				player.centerX -= 1;
				if(player.flash > 0)
				{
					player.flash += extraLockTime(level);
				}
			}
		}
		else if(key == 39) //right (move right)
		{
			if(playerCanGo("right",1))
			{
				for(b = 0 ; b < 4 ; b++)
				{
					player.pos[b].x += 1;
				}
				player.centerX += 1;
				if(player.flash > 0)
				{
					player.flash += extraLockTime(level);
				}
			}
		}
		else if(key == 38) //up (rotate right)
		{
			if(canRotate())
			{
				rotatePlayer("right");
			}
			if(player.flash > 0)
			{
				player.flash += extraLockTime(level);
			}
		}
		else if(key == 90) //up (rotate left)
		{
			if(canRotate())
			{
				rotatePlayer("left");
			}
			if(player.flash > 0)
			{
				player.flash += extraLockTime(level);
			}
		}
		else if(key == 40) //down (soft drop)
		{
			if(playerCanGo("down",1))
			{
				for(b = 0 ; b < 4 ; b++)
				{
					player.pos[b].y -= 1;
				}
				score += (1 + ((level - 1) / 4));
			}
			player.centerY -= 1;
		}
		else if(key == 32) //space (hard drop)
		{
			var down = 1;
			while(true)
			{
				var flag = true;
				for(a = 0 ; a < 4 ; a++)
				{
					if(player.pos[a].y - down >= 0)
					{
						flag = (grid[player.pos[a].y - down][player.pos[a].x] == 0);
					}
					else
					{
						flag = false;
					}
					if(!flag)
					{
						break;
					}
				}
				if(flag)
				{
					down++;
				}
				else
				{
					break;
				}
			}
			down--;
			
			for(b = 0 ; b < 4 ; b++)
			{
				player.pos[b].y -= down;
			}
			player.flash = 0;
			score += (down * 2 * (1 + ((level - 1) / 4)))
		}
		else if(key == 67) //C (hold)
		{
			var temp = player.type;
			if(hold > 0)
			{
				nextBrick(hold);
			}
			else
			{
				nextBrick(next.shift());
				if(bag.length == 0)
				{
					bag = [1,2,3,4,5,6,7];
					bag = shuffle(bag);
				}
				next.push(bag.shift());
			}
			hold = temp;
		}
	}
	else if(key == 32 && screen == 0)
	{
		screen = -1;
		document.getElementById("header").innerHTML = "+----------+-HOLD-+";
	}
}

function rotatePlayer(direction)
{
	var identity = [[0,-1],[1,0]]
	if(direction == "right")
	{
		var identity = [[0,1],[-1,0]]
	}
	for(a = 0 ; a < 4 ; a++)
	{
		//MATHS YAY
		var x = player.pos[a].x - player.centerX;
		var y = player.pos[a].y - player.centerY;
		var newX = (identity[0][0] * x) + (identity[0][1] * y);
		var newY = (identity[1][0] * x) + (identity[1][1] * y);
		player.pos[a].x = player.centerX + newX;
		player.pos[a].y = player.centerY + newY;
	}
}

function canRotate()
{
	var identity = [[0,-1],[1,0]];
	var cords = [];
	for(a = 0 ; a < 4 ; a++)
	{
		var x = player.pos[a].x - player.centerX;
		var y = player.pos[a].y - player.centerY;
		var newX = (identity[0][0] * x) + (identity[0][1] * y);
		var newY = (identity[1][0] * x) + (identity[1][1] * y);
		cords.push([player.centerX + newX,player.centerY + newY]);
	}
	var works = true;
	for(a = 0 ; a < 4 ; a++)
	{
		works = (grid[cords[a][1]][cords[a][0]] == 0 && cords[a][1] >= 0 && cords[a][1] <= 19 && cords[a][0] >= 0 && cords[a][0] <= 9)
		if(!works)
		{
			break;
		}
	}
	return works;
}

function playerCanGo(direction,step)
{
	var points = [];
	var stuck = false;
	var cord = 0;
	if(direction == "down")
	{
		cord = 20;
	}
	else if(direction == "left")
	{
		cord = 10;
	}
	//gets the highest/lowest value
	for(c = 0 ; c < 4 ; c++)
	{
		if(direction == "left")
		{
			if(player.pos[c].x < cord)
			{
				cord = player.pos[c].x;
			}
			if(!partOfPlayer(player.pos[c].x - step,player.pos[c].y))
			{
				points.push(player.pos[c]);
			}
		}
		else if(direction == "right")
		{
			if(player.pos[c].x > cord)
			{
				cord = player.pos[c].x;
			}
			if(!partOfPlayer(player.pos[c].x + step,player.pos[c].y))
			{
				points.push(player.pos[c]);
			}
		}
		else if(direction == "down")
		{
			if(player.pos[c].y < cord)
			{
				cord = player.pos[c].y;
			}
			if(!partOfPlayer(player.pos[c].x,player.pos[c].y - step))
			{
				points.push(player.pos[c]);
			}
		}
	}
	//next to another piece
	if(cord < 10 && direction == "right")
	{
		for(c = 0 ; c < points.length ; c++)
		{
			stuck = (grid[points[c].y][points[c].x + step] != 0)
			if(stuck)
			{
				break;
			}
		}
	}
	else if(cord > 0 && direction == "left")
	{
		for(c = 0 ; c < points.length ; c++)
		{
			stuck = (grid[points[c].y][points[c].x - step] != 0)
			if(stuck)
			{
				break;
			}
		}
	}
	else if(cord > 0 && direction == "down")
	{
		for(c = 0 ; c < points.length ; c++)
		{
			
			stuck = (grid[points[c].y - step][points[c].x] != 0);
			if(stuck)
			{
				break;
			}
		}
	}
	//returns the value
	if(direction == "right") return (cord < 10 && !stuck);
	else if(direction == "left") return (cord > 0 && !stuck);
	else if(direction == "down") return (cord > 0 && !stuck);
	else return null;
}

function partOfPlayer(x,y)
{
	var part = false
	var test =
	{
		"x": x,
		"y": y
	}
	for(d = 0 ; d < 4 ; d++)
	{
		part = (test == player.pos[d]);
		if(part)
		{
			break;
		}
	}
	return part;
}

function drawExtra(line)
{
	var output = "";
	if(line == 15)
	{
		output = "+-NEXT-+";
	}
	else
	{
		output = "|\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0|";
	}
	//draws hold
	output = drawDisplayBlock(output,hold,line,1,19);
	//draws next queue
	output = drawDisplayBlock(output,next[0],line,1,14);
	output = drawDisplayBlock(output,next[1],line,1,9);
	output = drawDisplayBlock(output,next[2],line,1,4);
	return output;
}

function drawDisplayBlock(string,type,line,x,y)
{
	if(type == 1 && line <= y && line >= (y - 3)) //long peice
	{
		string = replaceAt(string,x + 2,"A");
	}
	else if(type == 2 && line <= (y - 1) && line >= (y - 2)) //square
	{
		string = replaceAt(string,x + 2,"B");
		string = replaceAt(string,x + 3,"B");
	}
	else if(type == 3 && line <= y && line >= (y - 2))  //left L
	{
		if(line == y)
		{
			string = replaceAt(string,x + 2,"C");
			string = replaceAt(string,x + 3,"C");
		}
		else
		{
			string = replaceAt(string,x + 3,"C");
		}
	}
	else if(type == 4 && line <= y && line >= (y - 2)) //right L
	{
		if(line == y)
		{
			string = replaceAt(string,x + 2,"D");
			string = replaceAt(string,x + 3,"D");
		}
		else
		{
			string = replaceAt(string,x + 2,"D");
		}
	}
	else if(type == 5 && line <= (y - 1) && line >= (y - 2))  //left S
	{
		if(line == (y - 1))
		{
			string = replaceAt(string,x + 1,"E");
			string = replaceAt(string,x + 2,"E");
		}
		else
		{
			string = replaceAt(string,x + 2,"E");
			string = replaceAt(string,x + 3,"E");
		}
	}
	else if(type == 6 && line <= (y - 1) && line >= (y - 2)) //right S
	{
		if(line == (y - 1))
		{
			string = replaceAt(string,x + 2,"F");
			string = replaceAt(string,x + 3,"F");
		}
		else
		{
			string = replaceAt(string,x + 1,"F");
			string = replaceAt(string,x + 2,"F");
		}
	}
	else if(type == 7 && line <= (y - 1) && line >= (y - 2)) // T piece
	{
		if(line == (y - 1))
		{
			string = replaceAt(string,x + 1,"G");
			string = replaceAt(string,x + 2,"G");
			string = replaceAt(string,x + 3,"G");
		}
		else
		{
			string = replaceAt(string,x + 2,"G");
		}
	}
	return string;
}

function pad(x,length)
{
	x = Math.floor(x) + "";
	while(x.length < length)
	{
		x = "0" + x;
	}
	return x;
}

function formatTime(x)
{
	var ms = x % 1000
	var s = Math.floor(x / 1000) % 60
	var m = Math.floor(x / 60000)
	return pad(m,2) + ":" + pad(s,2) + "." + pad(ms,3);
}

function dropSpeed(level)
{
	return Math.ceil((1000 * Math.pow(0.96,level - 1)) / 10) * 10
}

function lockTime(level)
{
	if(level < 80)
	{
		return 500;
	}
	else
	{
		return 500 * Math.pow(0.94,level - 80)
	}
}

function extraLockTime(level)
{
	if(level < 90)
	{
		return 125;
	}
	else
	{
		return 125 - (5 * (level - 90));
	}
}

function forceStringLength(string,length)
{
	while(string.length <= length)
	{
		string = string + "\u00A0";
	}
	return string
}

String.prototype.replaceAll = function(search, replacement) { //thanks internet
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function gameLoop()
{
	var time = (new Date()).getTime();
	
	if(screen == -1)
	{
		if(player.down < time && playerCanGo("down",1))
		{
			player.flash = -1;
			for(b = 0 ; b < 4 ; b++)
			{
				player.pos[b].y -= 1;
			}
			player.centerY -= 1;
			player.down = time + dropSpeed(level);
		}
		else if(!playerCanGo("down",1) && player.flash == -1)
		{
			player.flash = lockTime(level);
		}
		else if(player.flash > 0)
		{
			player.flash -= (time - lastTime);
			if(player.flash < 0)
			{
				player.flash = 0;
			}
		}
		else if(player.flash == 0)
		{
			//set it here
			if(!playerCanGo("down",1))
			{
				for(b = 0 ; b < 4 ; b++)
				{
					grid[player.pos[b].y][player.pos[b].x] = player.type;
				}
			
				var lineNum = 0;
				for(const line of grid)
				{
					var lineCleared = true;
					for(const tile of line)
					{
						lineCleared = (tile > 0);
						if(!lineCleared)
						{
							break;
						}
					}
					if(lineCleared)
					{
						cleared.lines.push(lineNum)
					}
					lineNum++;
				}
				if(cleared.lines.length > 0)
				{
					lines += cleared.lines.length;
					cleared.show = time + 400;
				}
				
				nextBrick(next.shift());
				if(bag.length == 0)
				{
					bag = [1,2,3,4,5,6,7];
					bag = shuffle(bag);
				}
				next.push(bag.shift());
			}
			else
			{
				player.flash = -1;
			}
		}
		//render
		for(b = 0 ; b < 20 ; b++)
		{
			document.getElementById(b.toString()).innerHTML = "|" + drawLine(b) + drawExtra(b);
			if(time > cleared.show && cleared.lines.length > 0)
			{
				cleared.lines.sort();
				for(b = cleared.lines.length - 1; b >= 0 ; b--)
				{
					grid.splice(cleared.lines[b],1);
					grid.push([0,0,0,0,0,0,0,0,0,0]);
				}
				if(cleared.lines.length == 1)
				{
					score += (100 * (1 + ((level - 1) / 4)))
				}
				else if(cleared.lines.length == 2)
				{
					score += (300 * (1 + ((level - 1) / 4)))
					cheer.letters = "DOUBLE";
					cheer.expires = (new Date()).getTime() + 400;
				}
				else if(cleared.lines.length == 3)
				{
					score += (500 * (1 + ((level - 1) / 4)))
					cheer.letters = "TRIPLE";
					cheer.expires = (new Date()).getTime() + 500;
				}
				else if(cleared.lines.length == 4)
				{
					score += (800 * (1 + ((level - 1) / 4)))
					cheer.letters = "TETRIS";
					cheer.expires = (new Date()).getTime() + 600;
				}
				cleared.lines = [];
			}
		}
	
		var string = "+----------+------+";
		if(time < cheer.expires)
		{
			for(b = 0 ; b < cheer.letters.length ; b++)
			{
				string = replaceAt(string,2 + b,cheer.letters[b]);
			}
		}
		document.getElementById("cheer").innerHTML = string
	
	}
	else
	{
		//start = (new Date()).getTime();
		document.getElementById("cheer").innerHTML = "+-----------------+";
		document.getElementById("header").innerHTML = "+-----------------+";
		
		for(lineNo = 0; lineNo < 20 ; lineNo++)
		{
			var line = (screenText[screen][lineNo])[0].replaceAll("#","\xa0");
			var string = "";
			//alert(line);
			/*for(cha = 0 ; cha < 19 ; cha++/*screenText[screen][lineNo])
			{
				if(line[cha] == '#')
				{
					string = string + "\xa0";
				}
				else
				{
					string = string + line[cha];
				}
			}*/
			//string = string.replace("#","\u00A0")
			document.getElementById(((lineNo - 19) * -1).toString()).innerHTML = line;
		}
	}
	
		var levelText = "|" + forceStringLength("Level: " + level,16) + "|";
		
		if(score > levelUp)
		{
			level++
			levelUp = 1000 * (Math.pow(2.2,Math.sqrt(level - 1)))
			levelupExpries = (new Date()).getTime() + 500;
		}
	
	if(time < levelupExpries)
	{
		for(b = 0 ; b < ("LVL UP").length ; b++)
		{
			levelText = replaceAt(levelText,12 + b,("LVL UP")[b]);
		}
	}
	
	document.getElementById("level").innerHTML = levelText;
	document.getElementById("score").innerHTML = "|" + forceStringLength("Score: " + (Math.round(score) + "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),16) + "|" /*+ "/" + (Math.round(levelUp) + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")*/; 
	document.getElementById("lines").innerHTML = "|" + forceStringLength("Lines: " + lines,16) + "|";
	if(screen == -1)
	{
		document.getElementById("time").innerHTML = "|" + forceStringLength("Time: " + formatTime(time - start),16) + "|";
	}

	lastTime = time;
}
setInterval(gameLoop,10); 