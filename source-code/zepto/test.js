// 测试 HTML 片段
const fragment = $(
  "<div>我是 div<span>我是 span</span><a>我是 a</a></a></div><p>我就是个 P <a>xxx</a></p>"
) 
console.log(fragment)

// 测试 class
const classItems = $(".nav-item")
console.log(classItems)

// 测试 id
const IDItems = $("#logo")
console.log(IDItems)

// 测试 html 标签
const divItems = $("div")
console.log(divItems)
