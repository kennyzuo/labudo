const gap = 24,
  edge = gap * gap,
  pieceradius = 8,
  invalidRage = gap / 2 - pieceradius
let lasttype = 1

// 定义棋子数据结构
class Piece {
  constructor(xNum, yNum, type, isClick, isHover) {
    this.type = type
    this.isClick = isClick
    this.isHover = isHover

    this.computeLocation(xNum, yNum)
  }

  computeLocation(xNum, yNum) {
    this.x = (xNum + 1) * gap
    this.y = (yNum + 1) * gap
  }

  init() {
    this.isHover = false
    this.isClick = false
    this.type = -1
  }
}

// 栈
class Stack {
  constructor() {
    this.arry = []
  }
  pop() {
    return this.arry.pop()
  }

  push(item) {
    return this.arry.push(item)
  }

  top() {
    let len = this.arry.length
    return len ? this.arry[len - 1] : null
  }

  length() {
    return this.arry.length
  }
}

// 游戏类
class PieceGame {
  constructor() {
    this.initData()
    this.initCanvas()
    this.renderGrid()
    this.bindEvent()
  }

  initData() {
    let arry = new Array(gap)
    for (let i = 0; i <= gap; i++) {
      arry[i] = new Array(gap)
      for (let j = 0; j <= gap; j++) {
        arry[i][j] = 0
      }
    }
    this.locationArray = arry
    this.pieceStack = new Stack()
  }

  initCanvas() {
    this.canvasPiece = document.querySelector(".piece")
    this.canvasPiece.height = edge + gap * 2
    this.canvasPiece.width = edge + gap * 2
    this.ctx = this.canvasPiece.getContext("2d")
  }

  renderGrid() {
    const grid = document.querySelector(".piece-grid")

    grid.height = edge + gap * 2
    grid.width = edge + gap * 2
    const ctx = grid.getContext("2d")
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

    let lastLocationPiece = this.pieceStack.top()

    if (lastLocationPiece && lastLocationPiece.isHover) {
      this.pieceStack.pop()
    }

    if (location) {
      let { x, y } = location
      if (this.locationArray[x][y]) return

      let piece = new Piece(x, y, lasttype, false, true)
      this.pieceStack.push(piece)
    }

    this.drawPiece()
  }

  boardCheck({ offsetX, offsetY }) {
    let location = this.canDrawPiece(offsetX, offsetY)

    let lastLocationPiece = this.pieceStack.top()

    if (lastLocationPiece && lastLocationPiece.isHover) {
      this.pieceStack.pop()
    }

    if (!location) {
      return
    }
    let { x, y } = location
    if (this.locationArray[x][y]) return
    this.locationArray[x][y] = lasttype
    let piece = new Piece(x, y, lasttype, true, false)

    this.pieceStack.push(piece)
    this.drawPiece()
    const result = this.checkWin({ x, y, type: lasttype })

    if (result) {
      alert(`${lasttype == 1 ? "白子" : "黑子"}赢了`)
      this.replay()
    } else {
      lasttype = lasttype == 1 ? 2 : 1
    }
  }

  canDrawPiece(x, y) {
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

    // 确定是否在落子区域
    if (Math.sqrt(Math.hypot(locationX - x, locationY - y)) <= pieceradius) {
      return { x: locationX / gap - 1, y: locationY / gap - 1 }
    }

    return false
  }

  replay() {
    let { canvasPiece } = this
    this.initData()
    canvasPiece.width = canvasPiece.width
    canvasPiece.height = canvasPiece.height
  }

  drawPiece() {
    let { ctx, pieceStack } = this
    ctx.clearRect(0, 0, this.canvasPiece.width, this.canvasPiece.height)

    for (let { x, y, type, isClick, isHover } of pieceStack.arry) {
      if (type == 0) continue
      let fillStyle
      if (type == 1) {
        fillStyle = isClick ? "rgba(255, 255, 255)" : "rgba(255, 255, 255, 0.8)"
      }

      if (type == 2) {
        fillStyle = isClick ? "rgba(0, 0, 0)" : "rgba(0, 0, 0, 0.8)"
      }

      ctx.fillStyle = fillStyle

      ctx.beginPath()

      ctx.arc(x, y, pieceradius, 0, Math.PI * 2)

      ctx.fill()
    }
  }

  checkWin({ x, y, type }) {
    let rightStr = `${type}${type}${type}${type}${type}`
    let i = 1
    let allDirectStr = new Array(4).fill(type)

    while (i <= 4) {
      allDirectStr[0] = `${this.locationArray[x - i][y] || 0}${
        allDirectStr[0]
      }${this.locationArray[x + i][y] || 0}`

      allDirectStr[1] = `${this.locationArray[x][y - i] || 0}${
        allDirectStr[1]
      }${this.locationArray[x][y + i] || 0}`

      allDirectStr[2] = `${this.locationArray[x - i][y - i] || 0}${
        allDirectStr[2]
      }${this.locationArray[x + i][y + i] || 0}`

      allDirectStr[3] = `${this.locationArray[x - i][y + i] || 0}${
        allDirectStr[3]
      }${this.locationArray[x + i][y - i] || 0}`
      i++
    }

    let result = allDirectStr.some((item) => {
      return item.includes(rightStr)
    })
    return result
  }
}

// 新建示例，开始游戏
new PieceGame()
