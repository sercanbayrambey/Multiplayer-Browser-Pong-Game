#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('pong:server');
var http = require('http');
var socketIO = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8080');
console.log('PORT', port)
app.set('port', port);

/**
 * Create HTTP server.
 */



 
var server = http.createServer(app);
var io = socketIO(server);

class PongGame
{

    //TODO ADD PLAYER
    constructor()
    {
        this.test = [];
        this.balls = [];
        this.players = [];
        this.CANVAS_WIDTH = 1000;
        this.CANVAS_HEIGHT = 600;
        this.time;
        this.timer;
        this.StatusText;
        this.GameStarted = false;
        this.init();
       
    }


    init() {   

      if(this.players.length>1)
      {
        this.StatusText = "Oyuncu bağlandı, 3 saniye içinde oyun başlıyor!!";
        setTimeout(this.StartGame.bind(this),3000);

      }
      else
      {
        this.StatusText= "Oyuncu bekleniyor...";
        this.GameStarted = false;
        clearInterval(this.timer);
        setTimeout(this.init.bind(this),1000);
        
      }

      }

      StartGame()
      {
        this.StatusText = "";
        this.GenerateBall();
        this.timer = setInterval(this.update.bind(this),1000/120);
        this.GameStarted = true;
      }

      StartNewRound()
      {

        this.StatusText = "";
        this.GenerateBall();
        this.timer = setInterval(this.update.bind(this),1000/120);

      }


      RestartRound(whoLose)
      {

      if(whoLose == 0)
      {
        this.StatusText = game.players[1].name + " " + "skor aldı !!";
        this.players[1].score++;
      }
      else
        {
        this.StatusText = game.players[0].name + " " + "skor aldı !!";
        this.players[1].score++;
        }

      clearInterval(this.timer);
      setTimeout(this.StartNewRound.bind(this),1500);

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
            this.players[1].x = this.CANVAS_WIDTH-50;
            this.players[1].y = 100;
        }

    }

   


    GenerateBall()
    {
        this.balls = [];
        var ball = new Ball();
        ball.r = 15;
        ball.x = this.CANVAS_WIDTH/2+ball.r; 
        ball.y = this.CANVAS_HEIGHT/2+ball.r;
        ball.velocityX = -ball.ballSpeed;
        ball.velocityY =  ball.ballSpeed;
        this.balls.push(ball);
 
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
        this.ballSpeed = 5;
     
    }



    update()
    {
        //PLAYER COLLISION DETECTS
            //Player 1 (Left Side)
              if(this.x-this.r<=game.players[0].x+game.players[0].w && this.x+this.r>=game.players[0].x+game.players[0].w && this.y + this.r >= game.players[0].y && this.y-this.r<=game.players[0].y + game.players[0].h)
              {
                this.velocityX*=-1;
                this.velocityY*=-1;
                console.log("İl");
              }
            else if(this.y+this.r>=game.players[0].y && this.y-this.r<=game.players[0].y && this.x-this.r<=game.players[0].x && this.x+this.r<=game.players[0].x+game.players[0].w)
              {
                this.velocityY*=-1;
                console.log("son");
              }
              if(this.y-this.r<=game.players[0].y+game.players[0].h && this.x-this.r<=game.players[0].x+game.players[0].w){
                this.velocityY*=-1;
              }
            







    
        if(this.x+this.r>=game.CANVAS_WIDTH)
            this.velocityX*=-1;
        if(this.y+this.r>=game.CANVAS_HEIGHT || this.y-this.r<=0)
            this.velocityY*=-1;

          
        if(this.x-this.r<=0 )
        {
          game.RestartRound(0);
        }

        else if(this.x+this.r>=game.CANVAS_WIDTH)
        {
        game.RestartRound(1);
        }
        
        this.x+=this.velocityX;  
        this.y+=this.velocityY;   


   }


}//class ball end



class Player
{
    constructor(id)
    {
        this.id = id;
        this.x;
        this.h = 100;
        this.y ;
        this.w = 30;
        this.velocityY=0;
        this.name;
        this.score;

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




    
setInterval( () =>
{
    io.sockets.emit('PLAYERS_UPDATE',game.players);
    io.sockets.emit('BALL_UPDATE',game.balls);
    io.sockets.emit('GAME_STATUS_UPDATE',game.StatusText,game.GameStarted);

},1000/70);






io.on('connection',function(socket)
  {
    console.log("Player connected!!");
    if(game.players.length <= 1 || game.players.length == undefined)
    {
      game.addNewPlayer(socket.id);  
    }
    
  
        socket.on('disconnect',function()
        {
           console.log("Player disconnected!");
           game.players = game.players.filter( player => player.id != socket.id );
           game.init();
        });


        socket.on('PLAYER_DIRECTION_UPDATE',function(data)
        {
          const player = game.players.filter( player => player.id == socket.id );
          if(data.velocity != undefined && player[0] != undefined)
              player[0].velocityY = data.velocity;

        });

        socket.on('PLAYER_NAME', function(name)
        {
          const player = game.players.filter( player => player.id == socket.id );
          var cutName = name.substring(0,8);
           player[0].name = cutName;     

        });


        
      
  });  

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);

}