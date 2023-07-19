const left = document.querySelector(".left");
const up = document.querySelector(".up");
const right = document.querySelector(".right");
const down = document.querySelector(".down");


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const bntPlay = document.querySelector(".btn-play"); 

const size = 30 ;
const audio = new Audio ("assets/assets_audio.mp3");

const initialPosition = {x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () =>{
    score.innerText = parseInt(score.innerText) + 10;
}

const randomNumber = (min , max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () =>{
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const randomColor = () =>{
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`

}



const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

let direction , loopId

const drawFood = () =>{
    const {x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 50;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size , size)
    ctx.shadowBlur = 0;
}

const drawSnake = () => {


    snake.forEach((position, index) => {
        ctx.beginPath();
        ctx.arc(position.x + size / 2, position.y + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = position.color; // Usamos a cor definida anteriormente ao adicionar um círculo
        ctx.fill();
    });
};

const moveSnake = () =>{
    if(!direction) return

    const head = snake[snake.length -1];    
    
    if(direction == "right"){
        snake.push({ x: head.x + size, y:head.y})
    }
    
    if(direction == "left"){
        snake.push({ x: head.x - size, y:head.y})
    }
    
    if(direction == "down"){
        snake.push({ x: head.x , y:head.y + size})
    }
    
    if(direction == "up"){
        snake.push({ x: head.x , y:head.y - size})
    }
     
    snake.shift();
};

const drawGrid = ()=>{
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for(let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke()
    };

    
};

const chackEat = () => {
    const head = snake[snake.length -1];  

    if(head.x == food.x && head.y == food.y){
        incrementScore();
        snake.push(head);
        audio.play();
        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    };
};

const checkCollision = () =>{
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckindex = snake.length -2;

    const wallCollision = 
        head.x <0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) =>{
        return index < neckindex && position.x == head.x &&  position.y == head.y 
    });
        if(wallCollision || selfCollision){
            gamaOver()
        };

};

const gamaOver = () =>{
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(5px)"
}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake ()
    drawSnake ()
    chackEat()
    checkCollision()

    loopId = setTimeout(() =>{
        gameLoop()

    },100);
};

gameLoop ();

document.addEventListener("keydown", ({ key}) =>{
    if(key == "ArrowRight" &&  direction != "left") {
        direction  = "right"
    }
    if(key == "ArrowLeft" && direction != "right") {
        direction  = "left"
    }
    if(key == "ArrowDown" && direction != "up") {
        direction  = "down"
    }
    if(key == "ArrowUp" && direction != "down") {
        direction  = "up"
    }
   
})

bntPlay.addEventListener("click", ()=>{
   score.innerText = "00";
   menu.style.display = "none";
   canvas.style.filter = "none";

   snake = [initialPosition];
})

up.addEventListener("click", () => {
    if (direction !== "down") {
        direction = "up";
    }
});

left.addEventListener("click", () => {
    if (direction !== "right") {
        direction = "left";
    }
});

right.addEventListener("click", () => {
    if (direction !== "left") {
        direction = "right";
    }
});

down.addEventListener("click", () => {
    if (direction !== "up") {
        direction = "down";
    }
});




