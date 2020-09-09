// 定义搜索引擎API.src中的{keyyword}代表搜索关键字
let api = [
  { name: "百度", src: "https://www.baidu.com/s?wd={keyword}" },
  { name: "淘宝", src: "https://s.taobao.com/search?q={keyword}" },
  { name: "Google", src: "https://www.google.com/search?q={keyword}" },
  { name: "京东", src: "https://search.jd.com/Search?keyword={keyword}" },
  { name: "Bilibili", src: "https://search.bilibili.com/all?keyword={keyword}" },
  { name: "GitHub", src: "https://github.com/search?q={keyword}" },
  { name: "MDN", src: "https://developer.mozilla.org/zh-CN/search?q={keyword}" },
  { name: "思否", src: "https://segmentfault.com/search?q={keyword}" },
  { name: "知乎", src: "https://www.zhihu.com/search?type=content&q={keyword}" },
  { name: "微信", src: "https://weixin.sogou.com/weixin?type=2&query={keyword}" },
  { name: "百度地图", src: "https://map.baidu.com/search/{keyword}/?querytype=s&wd=${keyword}" }
]
// 定义各个键盘按钮的预设网址
let myWebsite = JSON.parse(localStorage.getItem('myWebsite')) || {
  q: 'www.qq.com', w: 'www.weibo.com', e: '', r: '', t: '', y: '', u: '', i: 'www.iqiyi.com', o: '', p: '', a: '', s: '', d: '', f: '', g: 'www.google.com', h: '', j: '', k: '', l: '', z: '', x: '', c: '', v: '', b: 'www.baidu.com', n: '', m: ''
}
let searchFocus = true // 定义tab键切换搜索焦点的布尔值
let preScript           //定义一个preScript，用来保存前一个请求的srcipt标签
let iNow = -1           //定义搜索回调数据列表选中选项初始值为-1
// 初始化数据
init()
function init() {
  // 根据api，生成搜索引擎下拉列表并添加到页面
  arrayToHtmlList(api, "option", ".searchEngine")
  // 根据myWebsite，键盘数据
  objToHtmlList(myWebsite, "div", ".keybord-content")
  // 页面加载，默认焦点为搜索引擎
  $(".searchEngine").focus()
  // 给搜索框搜索图标绑定点击事件
  $(".searchIco").addEventListener("click", searchFn)
  // 绑定键盘按钮事件
  document.addEventListener('keydown', tabHandler)
  document.addEventListener('keydown', keyupHandler)
  document.addEventListener('keyup', keyupHandler)
  // 搜索栏获取焦点时，添加键盘事件
  $("#searchInput").addEventListener("focus", function () {
    document.removeEventListener("keydown", keyupHandler)
    document.removeEventListener("keyup", keyupHandler)
    document.addEventListener("keyup", getData)
    document.addEventListener("keydown", keydownHandler)
  })
  // 当搜索栏失去焦点时，移除键盘事件，清空搜索下拉列表
  $("#searchInput").addEventListener("blur", function () {
    document.addEventListener("keydown", keyupHandler)
    document.addEventListener("keydown", keyupHandler)
    document.addEventListener("keyup", keyupHandler)
    document.removeEventListener("keydown", keydownHandler)
    setTimeout(() => {
      document.removeEventListener("keyup", getData)
      searchList.style.display = 'none';
      searchList.innerHTML = "";
    }, 100);
  })
  // 绑定键盘修改事件
  $(".keybord-content").addEventListener("mousedown", keyboardHandler)
  $(".keybord-content").addEventListener("mouseup", keyboardHandler)
  $(".keybord-content").addEventListener("click", editHandler)
  // 鼠标移到按钮，显示修改按钮
  $(".keybord-content").addEventListener("mouseover", showEdit)
  $(".keybord-content").addEventListener("mouseout", showEdit)
}
// 获取元素节点
function $(elem) {
  return document.querySelector(elem)
}
// 将对象元素转换成指定标记，并将元素添加到指定元素标记内
function objToHtmlList(obj, element, listID) {
  let innerHTMLContent = ''
  for (let key in obj) {
    innerHTMLContent += `<${element} class="key key-${key}"><span class="keycode">${key.toUpperCase()}</span><span class="edit">Edit</span>${obj[key] === '' ? '' : `<img  src="https://${obj[key]}/favicon.ico">`}</${element}>`
  }
  $(listID).innerHTML += innerHTMLContent
}

// 将数组元素转换成指定标记，并将元素添加到指定元素标记内
function arrayToHtmlList(arr, element, listID) {
  return $(listID).innerHTML += arr.map(item => `<${element} value=${item.name}>${item.name}</${element}>`).join('')
}

// 根据搜索引擎和输入的关键字，跳转到对应的搜索页面
function searchFn(e) {
  let select = $(".searchEngine").value
  let keyword = $("#searchInput").value.toString()
  api.some(item => {
    if (item.name === select) {
      window.open(item.src.replace(/{keyword}/g, keyword))
      return true
    }
  })
}

// 实时获取输入栏关键词
function getData() {
  let oldValue = null;
  let select = $(".searchEngine").value
  //当前文本框的值不为空 且和之前不相同
  if (searchInput.value != '' && searchInput.value != oldValue) {
    let oScript = document.createElement('script');
    //创建script标签
    //获取时间戳
    let oTime = new Date().getTime()
    // oScript.src = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${searchInput.value}&json=1&p=3&cb=Aralic&${oTime}`;  //百度搜索
    // 选择搜索引擎
    switch (select) {
      case "百度":
        oScript.src = `http://suggestion.baidu.com/su?wd=${searchInput.value}&json=1&p=3&cb=Aralic&${oTime}` //百度搜索
        break;
      case "淘宝":
        oScript.src = `https://suggest.taobao.com/sug?code=utf-8&q=${searchInput.value}&callback=Aralic&${oTime}`;   //淘宝
        break;
      default:
        break;
    }
    //百度搜索
    document.body.appendChild(oScript);
    if (preScript) document.body.removeChild(preScript)
    preScript = oScript
  } else if (searchInput.value == '') {
    // 如果文本框值为空 清除searchList的内容并隐藏
    searchList.style.display = 'none';
    searchList.innerHTML = "";
  }
  oldValue = searchInput.value;
}

//jsonp的回调函数
function Aralic(data) {
  let select = $(".searchEngine").value
  if (select === "百度") {
    if (data.s.length) {
      //拼接字符串,生成搜索关键字列表
      searchList.innerHTML = data.s.map(item => `<li><a href="https://www.baidu.com/s?wd=${item}" target="_blank">${item}</a></li>`).join("")
      searchList.style.display = 'block';
      //绑定上下按钮以及enter按钮事件
      document.addEventListener("keydown", keydownHandler)
      // 鼠标滑过列表  改变颜色
      $('ol').addEventListener("mouseover", mouseoverHandler)
    } else {
      //无数据返回时候 ul内容置空并隐藏
      searchList.style.display = 'none';
      searchList.innerHTML = "";
    }
  }
  if (select === "淘宝") {
    // 淘宝window.taobao.sug
    // console.log(data.result.length);
    if (data.result.length) {
      if (data.result.length > 10) data.result.length = 10
      searchList.innerHTML = data.result.map(item => `<li><a href="https://www.taobao.com/s?wd=${item[0]}" target="_blank">${item[0]}</a></li>`).join("")
      searchList.style.display = 'block';
      //绑定上下按钮以及enter按钮事件
      document.addEventListener("keydown", keydownHandler)
      // 鼠标滑过列表  改变颜色
      $('ol').addEventListener("mouseover", mouseoverHandler)
    } else {
      //无数据返回时候 ul内容置空并隐藏
      searchList.style.display = 'none';
      searchList.innerHTML = "";
    }
  }
}

// 鼠标滑过列表  改变颜色
function mouseoverHandler(e) {
  if (e.target.constructor !== HTMLAnchorElement) return
  let aLi = searchList.getElementsByTagName('li')
  for (let i = 0; i < aLi.length; i++) {
    aLi[i].className = '';
    if (e.target.isEqualNode(aLi[i].children[0])) {
      iNow = i
      aLi[iNow].className = "active";
      searchInput.value = aLi[iNow].children[0].textContent;
    }
  }
}
//↑ ↓ enter 三个按键事件
function keydownHandler(e) {
  let aLi = searchList.getElementsByTagName('li');
  // console.log(aLi.length);
  if (e.keyCode == 13) {
    searchFn()
  }
  if (aLi.length == 0) return
  //↓键
  if (e.keyCode == 40) {
    e.preventDefault();
    for (let i = 0; i < aLi.length; i++) {
      aLi[i].className = '';
    }
    iNow++;
    if (iNow >= aLi.length) {
      iNow = 0;
    }
    //移除给文本框的绑定事件
    document.removeEventListener('keyup', getData);
    searchInput.value = aLi[iNow].children[0].textContent;
    aLi[iNow].className = "active";
    //↑键
  } else if (e.keyCode == 38) {

    e.preventDefault();
    for (let i = 0; i < aLi.length; i++) {
      aLi[i].className = '';
    }

    iNow--;
    if (iNow <= 0) {
      iNow = aLi.length - 1;
    }

    document.removeEventListener('keyup', getData);
    searchInput.value = aLi[iNow].children[0].textContent;
    aLi[iNow].className = "active";
    // enter键
  }
}

// 点击键盘按钮，跳转到指定的收藏网页
function keyupHandler(e) {
  let key = String.fromCharCode(e.keyCode)
  if (!/[A-Z]/.test(key)) return;
  let btn = $(`.key-${key.toLowerCase()}`)
  if (e.type === 'keydown') {
    btn.classList.add("key-active")
  };
  if (e.type === 'keyup') {
    btn.classList.remove("key-active")
    if (!myWebsite[String.fromCharCode(e.keyCode).toLowerCase()]) return
    window.open(`https://${myWebsite[String.fromCharCode(e.keyCode).toLowerCase()]}`)
  };

}
// tab键切换焦点
function tabHandler(e) {
  // tab键
  if (e.keyCode !== 9) return
  e.preventDefault()
  searchFocus = !searchFocus
  if (searchFocus) {
    $(".searchEngine").focus()
  } else if (!searchFocus) {
    searchInput.focus()
  }
}
// 显示修改按钮
function showEdit(e) {
  let el
  if (e.target.classList.contains("key")) el = e.target
  if (e.target.parentElement.classList.contains("key")) el = e.target.parentElement
  if (!el) return
  if (e.type === "mouseover") {
    el.children[1].style = "display:block"

  }
  if (e.type === "mouseout") {
    el.children[1].style = "display:none"
  }
}
// 点击键盘按钮,跳转到对应收藏的网站
function keyboardHandler(e) {
  let el
  if (e.target.classList.contains("key")) el = e.target
  if (e.target.parentElement.classList.contains("key")) el = e.target.parentElement
  if (!el) return
  if (e.target.classList.contains("edit")) return
  if (e.type === "mousedown") el.classList.add("key-active")
  if (e.type === "mouseup") {
    el.classList.remove("key-active")
    // 打开按钮对应的收藏的网址
    if (!myWebsite[el.firstChild.textContent.toLowerCase()]) return
    window.open(`https://${myWebsite[el.firstChild.textContent.toLowerCase()]}`)
  }
}
// 修改收藏的网页
function editHandler(e) {
  if (!e.target.classList.contains("edit")) return
  let el = e.target.parentElement
  let key = e.target.previousSibling.textContent.toLowerCase()
  let src = myWebsite[key]
  let input = prompt("请输入网址", src)
  console.log(input);
  if (input == null) return
  // myWebsite[key] = input
  // 输入的网址为空，如果有img标签，则删除，同时保存输入值
  if (!input) {
    if (el.lastElementChild.constructor === HTMLImageElement) el.lastElementChild.remove()
    myWebsite[key] = ""
    localStorage.setItem("myWebsite", JSON.stringify(myWebsite))
    return
  }
  let img
  if (!src) {
    img = new Image()
    img.src = `https://${input}/favicon.ico`
    el.appendChild(img)
  } else {
    img = e.target.nextElementSibling
    img.src = `https://${input}/favicon.ico`
  }
  img.addEventListener("error", imgError)
  myWebsite[key] = input
  localStorage.setItem("myWebsite", JSON.stringify(myWebsite))
}
function imgError(e) {
  myWebsite[e.target.parentElement.firstChild.textContent.toLowerCase()] = "";
  e.target.remove()
  localStorage.setItem("myWebsite", JSON.stringify(myWebsite))
}
