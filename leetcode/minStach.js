class MinStack {
  queue = []
  minQueue = []

  push(val) {
    this.queue.push(val)
    if (this.minQueue.length === 0) {
      this.minQueue.push(val)
      return
    }

    let currentMin = this.minQueue[this.minQueue.length - 1]
    if (currentMin >= val) this.minQueue.push(val)
  }
  pop() {
    let val = this.queue.pop()
    let currentMin = this.minQueue[this.minQueue.length - 1]
    if(val === currentMin) this.minQueue.pop()
    return val
  }
  min() {
    return this.minQueue[this.minQueue.length - 1] || 0
  }
  top() {
    return this.queue.pop()
  }
}

