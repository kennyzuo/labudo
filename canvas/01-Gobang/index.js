class Piece {
  lastHoverPieceLocation = {}

  pieceArray = []

  pieceArea = {}

  // 最近落子的颜色 1: 白色； 2: 黑色
  type = 1

  constructor(
    options = {
      pieceSize: 8,
      gap: 24,
    }
  ) {
    let { gap, pieceSize } = options
    this.gap = gap
    this.pieceSize = pieceSize
    this.edge = gap * gap
    this.invalidRage = gap / 2 - pieceSize

    this.initCanvas()

    this.drawPieceGrid()

    this.bindEvent()
  }

  initCanvas() {
    this.canvasGrid = document.querySelector(".piece-grid")

    this.canvasPieceHover = document.querySelector(".piece-hover")

    this.canvasPiece = document.querySelector(".piece")

    let { canvasGrid, canvasPieceHover, canvasPiece, edge, gap } = this

    canvasGrid.height = edge + gap * 2
    canvasGrid.width = edge + gap * 2

    canvasPieceHover.height = edge + gap * 2
    canvasPieceHover.width = edge + gap * 2

    canvasPiece.height = edge + gap * 2
    canvasPiece.width = edge + gap * 2
  }

  drawPieceGrid() {
    const { canvasGrid, gap, edge } = this
    const ctx = canvasGrid.getContext("2d")
    let lineWidth = 1
    ctx.lineWidth = lineWidth
    ctx.strokeRect(gap, gap, edge, edge)
    for (let i = 1; i < gap; i++) {
      ctx.moveTo((i + 1) * gap, gap)
      ctx.lineTo((i + 1) * gap, gap + edge)

      ctx.moveTo(gap, (i + 1) * gap)
      ctx.lineTo(gap + edge, (i + 1) * gap)
    }

    ctx.stroke()
  }

  bindEvent() {
    this.canvasPiece.addEventListener("mousemove", this.mousemove.bind(this))
    this.canvasPiece.addEventListener("click", this.boardCheck.bind(this))
  }

  mousemove({ offsetX, offsetY }) {
    let location = this.canDrawPiece(offsetX, offsetY)
    if (!location) {
      this.clearPiece()
      this.lastHoverPieceLocation.isDraw = false
      return
    }

    if (
      this.lastHoverPieceLocation.x === location.x &&
      this.lastHoverPieceLocation.y === location.y &&
      this.lastHoverPieceLocation.isDraw
    ) {
      return
    } else {
      this.clearPiece()
      this.lastHoverPieceLocation = location
      const context = this.canvasPieceHover.getContext("2d")
      this.drawPiece(location, context)
      this.lastHoverPieceLocation.isDraw = true
    }
  }

  boardCheck({ offsetX, offsetY }) {
    let location = this.canDrawPiece(offsetX, offsetY)
    if (!location) {
      return
    }

    const context = this.canvasPiece.getContext("2d")

    let lastPiece = this.pieceArray[this.pieceArray.length - 1]
    if (lastPiece && lastPiece.x === location.x && lastPiece.y === location.y) {
      return
    } else {
      this.drawPiece(location, context, true)
      this.pieceArray.push({
        ...location,
      })

      this.pieceArea[`${location.locationX}${location.locationY}`] = {
        ...location,
        type: this.type,
      }

      this.type = this.type == 1 ? 2 : 1
    }
  }

  canDrawPiece(x, y) {
    let { gap, invalidRage, pieceArea, pieceSize } = this
    if (x < gap || y < gap || x > gap * (gap + 1) || y > gap * (gap + 1))
      return false

    let residueX = x % gap
    let residueY = y % gap
    let locationX = 0,
      locationY = 0

    let diffX = residueX - gap / 2
    let diffY = residueY - gap / 2

    if (Math.abs(diffX) < invalidRage || Math.abs(diffY) < invalidRage) {
      return false
    }

    // 确定点击最近的落子点
    if (diffX > 0) {
      locationX = x + gap - residueX
    } else {
      locationX = x - residueX
    }

    if (diffY > 0) {
      locationY = y + gap - residueY
    } else {
      locationY = y - residueY
    }

    // 判断该区域是否已有落子
    if (pieceArea[`${locationX}${locationY}`]) return false

    // 确定是否在落子区域
    if (
      Math.sqrt(Math.pow(locationX - x, 2) + Math.pow(locationY - y, 2)) <=
      pieceSize
    ) {
      return { x: locationX, y: locationY }
    }

    return false
  }

  drawPiece(location, context, insert) {
    if (!location) return
    let { x, y } = location
    let fillStyle
    if (this.type == 1) {
      fillStyle = insert ? "rgba(255, 255, 255)" : "rgba(255, 255, 255, 0.8)"
    } else {
      fillStyle = insert ? "rgba(0, 0, 0)" : "rgba(0, 0, 0, 0.8)"
    }
    context.fillStyle = fillStyle

    context.beginPath()

    context.arc(x, y, this.pieceSize, 0, Math.PI * 2)

    context.fill()
  }

  clearPiece() {
    this.canvasPieceHover.width = this.canvasPieceHover.width
    this.canvasPieceHover.height = this.canvasPieceHover.height
  }
}

window.onload = function () {
  new Piece()
}
