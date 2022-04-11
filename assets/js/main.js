const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')

ctx.canvas.width = COLS * BLOCK_SIZE
ctx.canvas.height = ROWS * BLOCK_SIZE

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

const moves = {
    [KEY.LEFT]: (p) => ({...p, x: p.x - 1 }),
    [KEY.DOWN]: (p) => ({...p, y: p.y + 1 }),
    [KEY.RIGHT]: (p) => ({...p, x: p.x + 1 }),
    [KEY.UP]: (p) => board.rotate(p),
    [KEY.SPACE]: (p) => ({...p, y: p.y + 1 })
}

let requestId = null
let time = { start: 0, elapsed: 0, level: 1000 }

let accountValue = {
    score: 0,
    lines: 0,
    level: 0
}

let account = new Proxy(accountValue, {
    set: (target, key, value) => {
        target[key] = value
        updateAccount(key, value)
        return true
    }
})

function play() {
    resetGame()
    addEventListener()
    if (requestId) {
        cancelAnimationFrame(requestId)
    }
    animate()
}

function animate(now = 0) {
    time.elapsed = now - time.start
    if (time.elapsed > time.level) {
        time.start = now
        if (!board.drop()) {
            gameOver()
            return
        }
    }
    draw()
    requestId = requestAnimationFrame(animate)
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress)
    document.addEventListener('keydown', handleKeyPress)
}

function handleKeyPress(event) {
    event.preventDefault()
    if (moves[event.keyCode]) {
        let p = moves[event.keyCode](board.piece)
        if (event.keyCode === KEY.SPACE) {
            while (board.valid(p)) {
                board.piece.move(p)
                account.score += POINTS.HARD_DROP
                p = moves[KEY.SPACE](board.piece)
            }
            return
        }
        if (board.valid(p)) {
            // Thay doi toa do theo ban phim mui ten 
            board.piece.move(p)
            if (event.keyCode === KEY.DOWN) {
                account.score += POINTS.SOFT_DROP
            }
            // draw()
        }
    }
}

function draw() {

    board.draw()
}

function gameOver() {
    cancelAnimationFrame(requestId)
    ctx.fillStyle = 'black'
    ctx.fillRect(10, 3, 8, 1.2)
    ctx.font = '1px Arial'
    ctx.fillStyle = 'red'
    ctx.fillText('GAME OVER', 1.8, 4)
}

function updateAccount(key, value) {
    let element = document.getElementById(key)
    if (element) {
        element.textContent = value
    }
}

function resetGame() {
    account.score = 0
    account.level = 0
    account.lines = 0
    board = new Board(ctx)
    time = { start: performance.now(), elapsed: 0, level: LEVEL[0] }
}