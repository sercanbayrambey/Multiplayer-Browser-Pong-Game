
class PongGame
{
    constructor(name)
    {
        //this.socket = io("https://pong-sercan.herokuapp.com/");
        this.socket = io("localhost:8080");
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d"); 
        document.addEventListener('keydown', this.onKeyPress.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        this.CANVAS_WIDTH = 1000;
        this.CANVAS_HEIGHT = 600;
        this.name = name;
        this.GameStarted;
        this.players = [];
        this.statusText = "";

        this.socket.emit('PLAYER_NAME',name);


        this.socket.on('PLAYERS_UPDATE',(players) =>
        {
            const NewPlayers = [];
            for (var i = 0; i < players.length; i++) {
               
                const newPlayer = new Player(this.ctx,this);
                newPlayer.x = players[i].x;
                newPlayer.y = players[i].y;
                newPlayer.h = players[i].h;
                newPlayer.w = players[i].w;
                newPlayer.id = players[i].id;
                newPlayer.name = players[i].name;
                NewPlayers.push(newPlayer);
            }
            this.players = NewPlayers;
            
        });

        this.socket.on('GAME_STATUS_UPDATE',(statusText,status) =>
        {
            this.GameStarted = status;
            this.statusText = statusText;
        });
        



        this.socket.on('BALL_UPDATE',(balls) =>
        {
            const Balls = [];
            for (var i = 0; i < balls.length; i++) {
               
                const ball = new Ball(this.ctx,this);
                ball.x = balls[i].x;
                ball.y = balls[i].y;
                ball.r = balls[i].r;
                ball.velocityX = balls[i].velocityX;
                ball.velocityY = balls[i].velocityY;
                Balls.push(ball);
            }
            this.balls = Balls;        
        });
    
    }


    init(){   
        setInterval( () =>  {
            this.loop();
        },1000/120);
    }


    

    loop()
    {
        if(this.players.length>0)
            this.draw();
    }

    draw()  
    {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);

        if(this.statusText != "")
        {
                this.ctx.fillStyle = "red";
                this.ctx.font = "40px Verdana";
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.statusText, this.CANVAS_WIDTH/2,this.CANVAS_HEIGHT/2);
        }
     
        
        for(var i=0;i<this.balls.length;i++)
        {
            this.balls[i].draw();
        }

        for(var i=0;i<this.players.length;i++)
        {
            this.players[i].draw();
        }
     

    }

    onKeyPress(e)
    {
        
        if (e.keyCode === 87) {//UP
            this.socket.emit('PLAYER_DIRECTION_UPDATE', {  velocity: -5 });
        }
        else if (e.keyCode === 83 ) {//DOWN
        
            this.socket.emit('PLAYER_DIRECTION_UPDATE', {  velocity: 5 });
        }

    
    }

    onKeyUp(e)
    {

        
        if (e.keyCode === 87 ) {//UP
            this.socket.emit('PLAYER_DIRECTION_UPDATE', { velocity: 0 });
        }
        else if (e.keyCode === 83 ) {//DOWN
            this.socket.emit('PLAYER_DIRECTION_UPDATE', {  velocity: 0 });
        }

    
    }


    
}




class Ball{
    constructor(ctx,game)
    {
        this.ctx = ctx;
        this.game = game;
        this.x;
        this.y;
        this.velocityX;
        this.velocityY;
        this.r;
          
    }

    draw()
    {
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

}//class ball end


class Player
{
    constructor(ctx,game,id)
    {
        this.ctx = ctx;
        this.x;
        this.h = 100;
        this.y ;
        this.id;
        this.w = 30;
        this.velocityY=0;
        this.name;
    }

    draw()
    {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(this.x,this.y,this.w,this.h);

        this.ctx.font = "10px Comic Sans MS";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.name, this.x+15,this.y+this.h+10);
    }


}



// Yeni oyun oluştur:


  
// Sayfa yüklendiğinde oyunu oynanabilir hale getir:


function StartGame(name)
{
    const game = new PongGame(name);
     game.init();
}
