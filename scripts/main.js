let scoreBlock;
let score = 0;

const config = {
    step: 0,
    maxStep: 25,
    sizeCell: 16,
    sizeBerry: 16 / 4
}

const snake = {
    x: 160,
    y: 160,
    dx: config.sizeCell,
    dy: 0,
    tails: [],
    maxTails: 3
}

let berry = {
    x: 0,
    y: 0
} 

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");

// Элементы управления для мобильных устройств
let touchUp = document.getElementById("touch-up");
let touchLeft = document.getElementById("touch-left");
let touchDown = document.getElementById("touch-down");
let touchRight = document.getElementById("touch-right");

// Переменные для обработки свайпов
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

drawScore();
randomPositionBerry();

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++config.step < config.maxStep) {
        return;
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBerry();
    drawSnake();
}
requestAnimationFrame(gameLoop);

function drawSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();

    snake.tails.unshift({ x: snake.x, y: snake.y });

    if (snake.tails.length > snake.maxTails) {
        snake.tails.pop();
    }

    snake.tails.forEach(function(el, index) {
        if (index == 0) {
            context.fillStyle = "#FA0556";
        } else {
            context.fillStyle = "#A00034";
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

        if (el.x === berry.x && el.y === berry.y) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }

        for (let i = index + 1; i < snake.tails.length; i++) {
            if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
                refreshGame();
            }
        }
    });
}

function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
}

function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034";
    context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI);
    context.fill();
}

function randomPositionBerry() {
    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

function incScore() {
    score++;
    drawScore();
}

function drawScore() {
    scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Клавиатурное управление (для десктопа)
document.addEventListener("keydown", function(e) {
    if (e.code == "KeyW" || e.code == "ArrowUp") {
        if (snake.dy !== config.sizeCell) {
            snake.dy = -config.sizeCell;
            snake.dx = 0;
        }
    } else if (e.code == "KeyA" || e.code == "ArrowLeft") {
        if (snake.dx !== config.sizeCell) {
            snake.dx = -config.sizeCell;
            snake.dy = 0;
        }
    } else if (e.code == "KeyS" || e.code == "ArrowDown") {
        if (snake.dy !== -config.sizeCell) {
            snake.dy = config.sizeCell;
            snake.dx = 0;
        }
    } else if (e.code == "KeyD" || e.code == "ArrowRight") {
        if (snake.dx !== -config.sizeCell) {
            snake.dx = config.sizeCell;
            snake.dy = 0;
        }
    }
});

// Обработка свайпов для мобильных устройств
canvas.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
    event.preventDefault();
}, false);

canvas.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
    event.preventDefault();
}, false);

function handleSwipe() {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    
    // Определяем направление свайпа
    if (Math.abs(dx) > Math.abs(dy)) {
        // Горизонтальный свайп
        if (dx > 0) {
            // Свайп вправо
            if (snake.dx !== -config.sizeCell) {
                snake.dx = config.sizeCell;
                snake.dy = 0;
            }
        } else {
            // Свайп влево
            if (snake.dx !== config.sizeCell) {
                snake.dx = -config.sizeCell;
                snake.dy = 0;
            }
        }
    } else {
        // Вертикальный свайп
        if (dy > 0) {
            // Свайп вниз
            if (snake.dy !== -config.sizeCell) {
                snake.dy = config.sizeCell;
                snake.dx = 0;
            }
        } else {
            // Свайп вверх
            if (snake.dy !== config.sizeCell) {
                snake.dy = -config.sizeCell;
                snake.dx = 0;
            }
        }
    }
}

// Кнопки управления для мобильных устройств (альтернативный способ)
if (touchUp && touchLeft && touchDown && touchRight) {
    touchUp.addEventListener('touchstart', function(e) {
        if (snake.dy !== config.sizeCell) {
            snake.dy = -config.sizeCell;
            snake.dx = 0;
        }
        e.preventDefault();
    });
    
    touchLeft.addEventListener('touchstart', function(e) {
        if (snake.dx !== config.sizeCell) {
            snake.dx = -config.sizeCell;
            snake.dy = 0;
        }
        e.preventDefault();
    });
    
    touchDown.addEventListener('touchstart', function(e) {
        if (snake.dy !== -config.sizeCell) {
            snake.dy = config.sizeCell;
            snake.dx = 0;
        }
        e.preventDefault();
    });
    
    touchRight.addEventListener('touchstart', function(e) {
        if (snake.dx !== -config.sizeCell) {
            snake.dx = config.sizeCell;
            snake.dy = 0;
        }
        e.preventDefault();
    });
}

// Предотвращаем скролл страницы при свайпах на игровом поле
document.body.addEventListener('touchmove', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });