function fib(n) {
  if (n <= 1) return n

  let p = 0,
    q = 1,
    r = 1

  for (let i = 3; i < n; i++) {
    p = q
    q = r
    r = (p + q) % 1000000007
  }
  return r
}

const testArry = [0, 1, 3, 4, 10, 20, 30, 40, 42, 100]
testArry.forEach((item) => {
  console.log(item, fib(item))
})

