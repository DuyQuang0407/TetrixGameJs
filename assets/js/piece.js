class Piece {
    constructor(ctx) {
        this.ctx = ctx
        this.color = COLORS[this.randomizePieceColor()]
        this.shape = SHAPES[this.randomizePieceType()]
        this.x = 3
        this.y = 0
    }

    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.strokeStyle = '#34495E'
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1)
                }
            })
        })
    }

    move(p) {
        this.shape = p.shape
        this.x = p.x
        this.y = p.y
    }

    randomizePieceType() {
        return Math.floor(Math.random() * SHAPES.length)
    }

    randomizePieceColor() {
        return Math.floor(Math.random() * COLORS.length)
    }
}