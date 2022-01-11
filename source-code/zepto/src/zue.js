/**
 * $ 是函数，内部执行 zue.init 返回 Z 对象实例
 * zue.init 根据传入参数 selector ，调用 zue.qsa(dom 查找) 或者 zepro.fragment() 返回 dom 对象数组
 * 执行 zue.Z() 内容实用 new Z() 返回对象实例
 * Z 构造函数，初始化 len、selector、将 dom 数组绑定在对象实例上
 */

// 自执行函数，返回 Zue 即 $ 函数

const Zue = (function () {
  let $,
    Z,
    zue = {},
    fragmentRE = /^\s*<(\w+|!)[^>]*>/

  const isString = (str) =>
    Object.prototype.toString.call(str) === "[object String]"

  Z = function (dom, selector) {
    this.length = dom.length || 0
    dom.length &&
      dom.forEach((item, index) => {
        this[index] = item
      })
    this.selector = selector
  }

  zue.Z = function (dom, selector) {
    return new Z(dom, selector)
  }

  // 更具 HTML 片段，创建 dom 数组
  zue.fragment = function (html) {
    let dom

    // 创建 div 容器
    let container = document.createElement("div")

    // 将 HTML 片段赋值给 innerHTML
    container.innerHTML = "" + html

    // 遍历 container childNodes，返回对应 dom 数组
    dom = Array.prototype.slice.call(container.childNodes).map((item) => {
      return container.removeChild(item)
    })

    return dom
  }

  /**
   *
   * 只处理 class、id、html 标签选择器情况
   * @param element
   * @param selector
   */
  zue.qsa = function (element, selector) {
    return element.querySelectorAll(selector)
  }

  zue.init = function (selector, context) {
    let dom = []

    /**
     * selector 情况判定
     * 1. 为空
     * 2. String
     * */

    // 1. 为空
    if (!selector) return zue.Z()
    // 2. String
    else if (isString(selector)) {
      // 去前后空格
      selector = selector.trim()
      // 判断是否为合法 html fragment
      if (selector[0] === "<" && fragmentRE.test(selector)) {
        // 根据 html fragment 创建 dom
        dom = zue.fragment(selector)
        selector = null
      }
      // 否则认为是选择器
      else {
        dom = zue.qsa(document, selector)
      }
    }

    return zue.Z(dom, selector)
  }

  $ = function (selector, context) {
    return zue.init(selector, context)
  }

  // 定义 $ 静态方法
  $.map = function (elements, cb) {
    let arryElements = Array.from(elements)
    return arryElements.map(cb)
  }

  // 定义 Z 对象原型方法，所有 Z 实例共享
  $.fn = {
    constructor: zue.Z,
    forEach: [].forEach,
    reduce: [].reduce,
    push: [].push,
    sort: [].sort,
  }

  // Z 原型指向 $.fn, 让 Z 实例共享 $.fn 上方法
  zue.Z.prototype = Z.prototype = $.fn

  return $
})()

// 给 window.Zue 赋值，如果 window.$ 没有值，使用 $ 别名
window.Zue = Zue
window.$ === undefined && (window.$ = Zue)
