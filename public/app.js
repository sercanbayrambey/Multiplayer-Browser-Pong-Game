
class PongGame
{
    constructor()
    {
        this.socket = io();
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d"); 
        document.addEventListener('keydown', this.onKeyPress.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        this.GameStarted = true;
        this.CANVAS_WIDTH = 800;
        this.CANVAS_HEIGHT = 600;
        this.players = [];

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
        },1000/60);
    }

    loop()
    {
        this.draw();
    }

    draw()  
    {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
        if(!this.GameStarted)//GAME OVER TEXT
            {
                this.ctx.fillStyle = "red";
                this.ctx.font = "40px Verdana";
                this.ctx.textAlign = "center";
                this.ctx.fillText("Game OVER :(", this.CANVAS_WIDTH/2,this.CANVAS_HEIGHT/2);
            }

            //SCORE
        this.ctx.fillStyle = "red";
        this.ctx.font = "40px Verdana";
        this.ctx.textAlign = "left";
        this.ctx.fillText( this.time = Math.floor((Date.now() - this.startTime) / 1000).toString(),0,this.CANVAS_HEIGHT-5);
        
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
            this.socket.emit('PLAYER_DIRECTION_UPDATE', {  velocity: -10 });
        }
        else if (e.keyCode === 83 ) {//DOWN
        
            this.socket.emit('PLAYER_DIRECTION_UPDATE', {  velocity: 10 });
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
        this.ctx.fillStyle = "green";
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
const game = new PongGame();

  
// Sayfa yüklendiğinde oyunu oynanabilir hale getir:
window.onload = () => game.init();
