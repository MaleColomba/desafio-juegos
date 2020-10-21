var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2,
    y = canvas.height - 30,
    dx = 2,
    dy = -2,
    ballRadius = 10;


var paddleHeight = 10,
    paddleWidth = 75,
    paddleX = (canvas.width-paddleWidth)/2, //posicionamiento al medio de la Barra
    paddleDx = 7,
    rightPressed,
    leftPressed;

var brickRowCount = 3, //Numero de filas
    brickColumnCount = 5, //Numero de columnas
    brickWidth = 75, //Ancho del ladrillo
    brickHeight = 20, //Alto del ladrillo
    brickPadding = 10, //Hueco entre ladrillos
    brickOffsetTop = 30,
    brickOffsetLeft =30;

var bricks = [];
    for(c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1}; //posiciones de los ladrillos en filas(x) y columnas(y). Status: muestra si el ladrillo esta activo 
        }
    }

var score = 0;

var lives = 1;

    //Movimiento de la barra

function keyDownHandler(e){
	if(e.keyCode==39){
		rightPressed=true;
	} else if (e.keyCode==37){
		leftPressed=true;
	    }	
	}
	
function keyUpHandler(e){
	if(e.keyCode==39){
		rightPressed=false;
	} else if(e.keyCode==37){		
		leftPressed=false;
		}
    }
    
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

    // Pelota

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

    // Barra

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

    // Ladrillos

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "pink";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                if(score == brickRowCount*brickColumnCount) {
                    alert("Ganaste");
                    document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Puntaje: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Vidas: " + lives, canvas.width-65, 20);
}

    // Dibuja en el canvas
function draw(){

	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBricks();
	drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    
    // Pelota: Choca con el costado derecho || choca con el lado izquierdo
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    }
    // Pelota: Choca con lo la parte de arriba || (aunque no esta) choca con la parte de abajo
    if(y + dy < ballRadius){
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) { //vidas
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    // Barra: Movimiento por teclas y choque contra las paredes del canvas
    if(rightPressed && (paddleX + paddleWidth) < canvas.width){
        paddleX += paddleDx;
    } else if (leftPressed && paddleX > 0){
        paddleX -= paddleDx;
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();