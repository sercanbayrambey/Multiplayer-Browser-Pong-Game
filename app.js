var express = require('express');
var app = express();
var server = require('http').Server(app);
var socket = require('socket.io')(server);

server.listen(3000,function()
{
    console.log("Server is running..");
});

app.get('/',function(req,res) 
{

res.sendFile(__dirname + '/index.html')

});

app.use('/public/',express.static(__dirname + '/public'));







class PongGame
{

    //TODO ADD PLAYER
    constructor()
    {
        this.test = [];
        this.balls = [];
        this.players = [];
        this.CANVAS_WIDTH = 800;
        this.CANVAS_HEIGHT = 600;
        this.time;
        this.startTime;
        this.GameStarted = false;
        this.newBallSpawned = false;
        console.log("222SD");
        this.init();
        this.GenerateBall();
        
    }


    init(){   
       /* 
        if(!this.GameStarted)
        {
            /*this.players = [];
            this.balls = [];
            
            this.FPS = 60;
            //GAME SETTINGS 
            this.startTime = Date.now();
            this.GameStarted = true; 
            //
        }*/

    }

    addNewPlayer(id)
    {
        var player = new Player(id);
        this.players.push(player);
//PLAYER WHO HAS 0 INDEX  ALWAYS  WILL BE LEFT SIDE
        this.players[0].x = 10;
        this.players[0].y = 100;
        if(this.players.length>1)
        {
            this.players[1].x = 750;
            this.players[1].y = 100;
        }

    }



    GenerateBall()
    {
        var ball = new Ball();
        ball.x = Math.random()*400+30;  
        ball.y =  Math.random()*400+30;
        ball.velocityX = 10;
        ball.velocityY = 10;
        ball.r = 15;
        this.balls.push(ball);
     
    }




    reset()
    {
        this.balls.shift();
        this.GenerateBall();
    }

    update()    
    {

        this.balls[0].update();
        for(var i=0;i<this.players.length;i++)
        {
            this.players[i].update();
        }
       
    }
   
}



class Ball{

    constructor()
    {
        this.x;
        this.y;
        this.velocityX;
        this.velocityY;
        this.r;
     
    }



    update()
    {
    
        if(this.x+this.r>=game.CANVAS_WIDTH)
            this.velocityX*=-1;
        if(this.y+this.r>=game.CANVAS_HEIGHT || this.y-this.r<=0)
            this.velocityY*=-1;

            //player[0] WHO HAS 0 INDEX  ALWAYS  WILL BE LEFT SIDE


            //COLLISIONS FOR LEFT SIDE players[0]  INDEX IS 0
         if(this.x <= game.players[0].x + game.players[0].w + this.r && (this.y>=game.players[0].y && this.y<=game.players[0].y +game.players[0].h ))
         {
              this.velocityX*=-1;
              
         }
        if(this.x-this.r<=game.players[0].x+game.players[0].w/2 && (this.y+this.r>=game.players[0].y || this.y-this.r<=game.players[0].y+game.players[0].h))
         game.reset();

         //COLLISIONS END FOR LEFT SIDE player

         //COLLISIONS FOR RIGHT SIDE players[1]
       
         if(game.players.length>1)
         {
                if(game.players[1].x<=this.x+this.r  && this.y >= game.players[1].y && this.y <= game.players[1].y+game.players[1].h)
                    this.velocityX*=-1;


                   if(this.x+this.r>=game.players[1].x+game.players[1].w/2 && (this.y+this.r>=game.players[1].y || this.y-this.r<=game.players[1].y    +game.players[1].h ))
                   game.reset();
            }
                
    if(this.x-this.r<=0 || this.x+this.r>=game.CANVAS_WIDTH)
     {
          game.reset();
     }
        
        this.x+=this.velocityX;  
        this.y+=this.velocityY;   

   }


}//class ball end



class Player
{
    constructor(id,gameID)
    {
        this.id = id;
        this.gameID = gameID;
        this.x;
        this.h = 100;
        this.y ;
        this.w = 30;
        this.velocityY=0;
        this.name;

    }
    

    update()
    {

        if(this.y<=0  && (this.velocityY<0) )
        {
            this.velocityY = 0;
        }
        
        if(this.y+this.h>=game.CANVAS_HEIGHT && (this.velocityY>0))
            {
              this.velocityY = 0;
            }

        if(this.velocityY!=0 )
        {

            this.y += this.velocityY;    
        }

    }

}




var game = new PongGame();
var gameID=0;

    setInterval( () =>  {
        if(game.players.length>1)
{
        game.update();}
    },1000/60);


    
setInterval( () =>
{
    socket.sockets.emit('PLAYERS_UPDATE',game.players);
    socket.sockets.emit('BALL_UPDATE',game.balls);

},1000/60);







socket.on('connection',function(socket)
{
    console.log("Player connected!!");
    game.addNewPlayer(socket.id);    
    
    
    
    socket.on('PLAYER_DIRECTION_UPDATE',function(data)
    {
       const player = game.players.filter( player => player.id == socket.id );
       if(data.velocity != undefined && player[0] != undefined)
          player[0].velocityY = data.velocity;

    });
    
    
    socket.on('disconnect',function()
    {
       console.log("Player disconnected!");
       game.players = game.players.filter( player => player.id != socket.id );
       console.log(game.players);
       
    });

 
});




