/* ****************************************************************************
 * Clone of 2048 Game from http://gabrielecirulli.github.io/2048/
 * Game for education of js, we need to go deeper and do something more difficult 
 * ****************************************************************************
Tasks:
0. main code added 2015.10.20(2 hours)
1. Add calculated Scores after each step to the field(OK) 2015.10.20(5 minutes)
2. Add Best score stored in (LocalStorage) (OK) 2015.10.21(15 minutes: Googling, Reading and coding)
3. Abort Union after union fields (OK)2015.10.26 (30 minutes)
4. Fix New Game button(OK) 2015.10.21(5 minutes)
5. Vertical align scores divs(OK)(5 minutes)
6. Add an OOP-style(OK) 2015.10.29(30minutes minutes)
7. Additional: Add choose between two mode (1. Cyclic Union tiles and 2. Union only tales)
8. Some googling about JS, coding style, adding comments and other procrastination(~30 minutes)

9. Testing: ??? It's very interesting game)
//Total works: ~4h0m +/- Testing
*/

var manager;
document.addEventListener("DOMContentLoaded", function () {
  // Wait till the browser is ready to render the game (avoids glitches)
  window.requestAnimationFrame(function () {
    manager = new GameManager(4,4);
  });
});

function GameManager(sizeX, sizeY) {
    this.scores=0;
    this.field=null;
    this.BestScores=0;
    this.avaliableSteps=1;
    this.isGameWinMessageShowed=0;
    if (localStorage["BestScores"]) 
    {
	this.BestScores=localStorage["BestScores"];
    } 
    this.NewGame(sizeX,sizeY);
}

GameManager.prototype.NewGame=function(n,m){
	this.scores=0;
	//Get best scores from localStorage
	if (!localStorage["BestScores"]){
		localStorage["BestScores"]=0;
		this.BestScores=0;
	} else{
		this.BestScores=localStorage["BestScores"];
	}
	this.avaliableSteps=1;
        //Create a Field, 2 start tiles
	this.field=this.CreateField(n,m);
	this.createNewValueForTile();
	this.createNewValueForTile();
        //Refresh game field and scores indicators
	this.refreshField();
	this.refreshScores();
};

document.onkeydown = function(e) {
	e = e || window.event;
        //Get a keycode
	switch(e.which || e.keyCode) {
		case 37:
			manager.moveLeft();
			break;
		case 38:
			manager.moveUp();
			break;
		case 39:
			manager.moveRight();
			break;	
		case 40:
			manager.moveDown();
			break;
		break;
	}
        // Refreshing Gamefield and Scores
	manager.refreshField();
	manager.refreshScores();
        //Maybe  we have win???
	if (!manager.isGameWinMessageShowed)
		manager.GameWin();
        //Calculate avaliable steps
        //Maybe we have failed???
	manager.countAvaliableSteps();
	if (manager.avaliableSteps==0) {
		manager.GameOver();
	}
}

GameManager.prototype.GameOver=function ()
{
        alert ("GameOver! Your score="+this.scores);
};

GameManager.prototype.GameWin=function ()
{	
	var m=this.field.length;
	var n=this.field[0].length;
        var i,j;
	if (!this.isGameWinMessageShowed)
	{
	for (j=0;j<m;j++)
		{
			for (i=0;i<n;i++)
			{
				if ((this.field[j][i]==2048)&&(!this.isGameWinMessageShowed))
				{
					alert('Congratulations! You win this game and you may continue or play another game!');
					this.isGameWinMessageShowed=1;
					break;
				}
					
			}
		}
	}
};

GameManager.prototype.CreateField=function(x,y)
{
	//console.log("CreateFieldCalled");
	var mas = [];
	for (var j = 0; j < x; j++){
		mas[j] = [];
		for (var i = 0; i < y; i++){
			mas[j][i] = 0;
	}}
	return mas;
};

GameManager.prototype.createNewValueForTile=function()
{
        //console.log("createNewValueForTile");
        //Get size of array
	var x=this.field.length;
	var y=this.field[0].length;
	var isReady=0;
	var i=0;
	while (!isReady) {
		i++;
		var x1=Math.floor((Math.random() * x)); 
		var y1=Math.floor((Math.random() * y)); 
		var value=Math.random();
                //Some random magic for value of new tile
		if (value>0.8) value=4; 
			else value=2;
		if (this.field[x1][y1]==0) {
			isReady=1;
			this.field[x1][y1]=value;
			
		}
	}
};

GameManager.prototype.generateLine=function()
{
        var i,j;
	var m=this.field.length;
	var n=this.field[0].length;
	var line="<TABLE>";
	for (j=0;j<m;j++)
	{
		line=line+"<TR>";
		for (i=0;i<n;i++)
		{
			line=line+"<TD class=\"x"+this.field[j][i]+"\">"+this.field[j][i]+"</TD>";
		}
		line=line+"</TR>";
	}
	var line=line+"</TABLE>";
	return line;
};

GameManager.prototype.refreshField=function ()
{
	var str=this.generateLine();
	var tableContainer = document.getElementById("tableContainer");
	tableContainer.innerHTML =  str;
};

GameManager.prototype.refreshScores=function ()
{
	var YourScoreDiv = document.getElementById("YourScoreDiv");
	YourScoreDiv.innerHTML =  "Your:"+this.scores;
        //Check if our scores - we need to improve BestScores record
	if (this.scores>this.BestScores) 
	{
		this.BestScores=this.scores;
		localStorage["BestScores"]=this.BestScores;
	}
	var BestScoreDiv = document.getElementById("BestScoreDiv");
	BestScoreDiv.innerHTML =  "Best:"+this.BestScores;
}

GameManager.prototype.countAvaliableSteps=function(){	
	this.avaliableSteps=0;
	m=this.field.length;
	n=this.field[0].length;
        //TRy to find free cells
	for (j=0;j<m;j++)
	{
		for (i=0;i<n;i++)
		{
			if (this.field[j][i]==0)
				this.avaliableSteps++;
		}
	}
	//TRy to find cells with Vertical union
	for (j=0;j<m;j++)
	{
		for (i=0;i<n-1;i++)
		{
			if (this.field[j][i]==this.field[j][i+1])
				this.avaliableSteps++;
		}
	}
	//TRy to find cells with Horizontal union
	for (j=0;j<m-1;j++)
	{
		for (i=0;i<n;i++)
		{
			if (this.field[j][i]==this.field[j+1][i])
				this.avaliableSteps++;
		}
	}
};

GameManager.prototype.moveLeft=function ()
{
        //array of union
	m=this.field.length;
	n=this.field[0].length;
	var arrayOfMovement = [];
	for (var j = 0; j < m; j++){
		arrayOfMovement[j] = [];
		for (var i = 0; i < n; i++){
			arrayOfMovement[j][i] = 0;
	}}
	
	var changes= 1;
	var startcycle=1;
	while (changes)
	{
		changes=0;
		for (j=0;j<m;j++)
		{
			for (i=0;i<(n-1);i++)
			{
				if (this.field[j][i]==0)
				{
					if (this.field[j][i+1])
						{
                                                        //swap elements
							this.field=swapArrayElements(this.field,j,i,j,i+1);
							changes++;
							//
							arrayOfMovement=swapArrayElements(arrayOfMovement,j,i,j,i+1);
						}
				}
				//Union with 
				else if (this.field[j][i+1]==this.field[j][i]){
					if (!(arrayOfMovement[j][i+1])&& !(arrayOfMovement[j][i]))
					{
                                            this.scores+=this.field[j][i];
                                            this.field[j][i]+=this.field[j][i+1];
                                            this.field[j][i+1]=0;
                                            changes++;

                                            arrayOfMovement[j][i]=1;
					}
				}
			}
		}
		if (changes) startcycle=0;
	}
	if (!startcycle) 
		this.createNewValueForTile();
	return this.field;
};

GameManager.prototype.moveRight=function ()
{
        //array of union
        m=this.field.length;
	n=this.field[0].length;
	var arrayOfMovement = [];
	for (var j = 0; j < m; j++){
		arrayOfMovement[j] = [];
		for (var i = 0; i < n; i++){
			arrayOfMovement[j][i] = 0;
	}}	
	
	var changes= 1;
	var startcycle=1;
	while (changes)
	{
		changes=0;
		for (j=0;j<m;j++)
		{
			for (i=n-1;i>0;i--)
			{
				if (this.field[j][i]==0)
				{
					if (this.field[j][i-1])
						{
                                                        //swap elements
							this.field=swapArrayElements(this.field,j,i,j,i-1);
							changes++;
							arrayOfMovement=swapArrayElements(arrayOfMovement,j,i,j,i-1);
						}
				}
				//Union with 
				else if (this.field[j][i]==this.field[j][i-1]){
				if (!(arrayOfMovement[j][i])&& !(arrayOfMovement[j][i-1]))
					{
						this.scores+=this.field[j][i];
						this.field[j][i]+=this.field[j][i-1];
						this.field[j][i-1]=0;
						changes++;
						
						arrayOfMovement[j][i]=1;
					}
				}
			}
		}
		if (changes) startcycle=0;
	}
	if (!startcycle) 
		this.createNewValueForTile();

	return this.field;;
};

GameManager.prototype.moveUp=function ()
{
        //array of union
        m=this.field.length;
	n=this.field[0].length;
	var arrayOfMovement = [];
	for (var j = 0; j < m; j++){
		arrayOfMovement[j] = [];
		for (var i = 0; i < n; i++){
			arrayOfMovement[j][i] = 0;
	}}
	
	var changes= 1;
	var startcycle=1;
	while (changes)
	{
		changes=0;
		for (j=0;j<m-1;j++)
		{
			for (i=0;i<n;i++)
			{
				if (this.field[j][i]==0)
				{
					if (this.field[j+1][i])
						{
                                                        //swap elements
							this.field=swapArrayElements(this.field,j,i,j+1,i);
							changes++;
							//
							arrayOfMovement=swapArrayElements(arrayOfMovement,j,i,j+1,i);
						}
				}
				//Union with 
				else if (this.field[j][i]==this.field[j+1][i]){
					if (!(arrayOfMovement[j][i])&& !(arrayOfMovement[j+1][i])){
						this.scores+=this.field[j][i];
						this.field[j][i]+=this.field[j+1][i];
						this.field[j+1][i]=0;
						changes++;
						
						arrayOfMovement[j][i]=1;
					}
				}					
			}
		}
		if (changes) startcycle=0;
	}
	if (!startcycle) 
		this.createNewValueForTile();
	return this.field;;
};

GameManager.prototype.moveDown=function ()
{
        //array of union
        m=this.field.length;
	n=this.field[0].length;
	var arrayOfMovement = [];
	for (var j = 0; j < m; j++){
		arrayOfMovement[j] = [];
		for (var i = 0; i < n; i++){
			arrayOfMovement[j][i] = 0;
	}}
	
	var changes= 1;
	var startcycle=1;
	while (changes)
	{
		changes=0;
		for (j=m-1;j>0;j--)
		{
			for (i=0;i<n;i++)
			{
				if (this.field[j][i]==0)
				{
					if (this.field[j-1][i])
						{
                                                        //swap elements
							this.field=swapArrayElements(this.field,j,i,j-1,i);
							changes++;
							
							arrayOfMovement=swapArrayElements(arrayOfMovement,j,i,j-1,i);
						}
				}
				//Union with 
				else if (this.field[j][i]==this.field[j-1][i]){
					if (!(arrayOfMovement[j][i])&& !(arrayOfMovement[j-1][i])){
						this.scores+=this.field[j][i];
						this.field[j][i]+=this.field[j-1][i];
						this.field[j-1][i]=0;
						changes++;
						
						arrayOfMovement[j][i]=1;
					}
				}					
			}
		}
		if (changes) startcycle=0;
	}
	if (!startcycle) 
		this.createNewValueForTile();
	return this.field;
};

//Just additional fiunction to help us swap elements of 2-dimensial array
function swapArrayElements(mas,x1,y1,x2,y2)
{
	var temp=mas[x1][y1];
	mas[x1][y1]=mas[x2][y2];
	mas[x2][y2]=temp;
	return mas;
}