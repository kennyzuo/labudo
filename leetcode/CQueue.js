class CQueue {
  queue = []

  constructor() {}

  appendTail(val) {
    this.queue.push(val)
  }

  deleteHead() {
    let val = this.queue.shift()
    return val === undefined ? -1 : val
  }
}
