//阻止移动端页面滚动
$('body').on('touchmove', function(e) {
  e.preventDefault();
});

var bgWidth = 3000;
var bgHeight = 3000;
var bgNumber = 4;
var bgAngle = 360 / bgNumber;

//计算视点到图片面的距离
var translateZ = (function calTranslateZ(options) {
  return Math.round(options.width / (2 * Math.tan(Math.PI / options.number)))
})({
  width: bgWidth,
  number: bgNumber
})

var view = $("#bigcube");
var viewW = view.width();
var viewH = view.height();


var container = $(".container");

//渲染前后左右四个面
for (var i = 0; i < bgNumber; i++) {
  $("<img />").attr({"src": "http://ouyt4c4z5.bkt.clouddn.com/park-"+ i +".jpg"})
  .css({
    "position": "absolute",
    "user-select":"none",
    "width": bgWidth,
    "height": bgHeight,
    "left": (viewW - bgWidth) / 2,
    "top": (viewH - bgHeight) / 2,
    "transform": "rotateY(" + (180 - i * bgAngle) + "deg) translateZ("+ (-translateZ +3 ) +"px)", // translateZ + 3 是为了去掉图片拼合间的缝隙
    "transition":"all .5s ease"
  }).appendTo(".container")
}

//渲染上下两面
for(var j = 0; j < 2; j++){
  $("<img />").attr({"src": "http://ouyt4c4z5.bkt.clouddn.com/park-"+ (j + 4) +".jpg"})
  .css({
    "position": "absolute",
    "user-select":"none",
    "width": bgWidth,
    "height": bgHeight,
    "left": (viewW - bgWidth) / 2,
    "top": (viewH - bgHeight) / 2,
    "transform": "rotateX("+ (j ? 1: -1) * 90 +"deg) rotateZ("+(j ? 1: -1) * 90 +"deg) translateZ("+ (-translateZ+3) +"px)",// translateZ + 3 是为了去掉图片拼合间的缝隙
    "transition":"all .5s ease"
  }).appendTo(".container")
}


//初始化变量
var lastMouseX = 0,
  lastMouseY = 0,
  curMouseX = 0,
  curMouseY = 0,
  lastAngleX = 0,
  lastAngleY = 0,
  curAngleX = 0,
  curAngleY = 0,
  angleX = 0,
  angleY = 0;
var aimAngleX = 0,aimAngleY = 0;
var timer;
var timeoutTimer;

//处理requestAnimationFrame浏览器兼容问题
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
function(callback) {
  setTimeout(callback, 1000 / 60)
}

//触发click或移动端touch事件
$(document).on("mousedown touchstart", function(e) {
  //阻止默认事件
  e.preventDefault();
  // 移动设备支持多指触摸，与PC的鼠标不同，touches返回的数组。
  // 初始化lastMouseX，lastMouseY
  lastMouseX = e.pageX || e.touches[0].pageX;
  lastMouseY = e.pageY || e.touches[0].pageY;
  lastAngleX = aimAngleX;
  lastAngleY = aimAngleY;
  clearTimeout(timeoutTimer);

  $(document).on("mousemove touchmove",function(e) {
    curMouseX = e.pageX || e.touches[0].pageX;
    curMouseY = e.pageY || e.touches[0].pageY;
    getRotateAngle();
  });

  timer = requestAnimationFrame(animation);
});


$(document).on("mouseup touchend", function(e) {
  e.preventDefault();
  // touchend 不具有坐标信息，因此需以touchmove的最后一次点提供
  $(document).unbind("mousemove touchmove")
  timeoutTimer = setTimeout(function(){
    window.cancelAnimationFrame(timer)
  }, 2500)
});


function getRotateAngle() {
  // 通过位移换算为相应角度
  aimAngleX = 180 / Math.PI * (Math.atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX;

  // 上下旋转控制在90°以内，防止画面翻转
  var angle = 180 / Math.PI * (Math.atan((curMouseY - lastMouseY) / translateZ)) + lastAngleY;
  if (angle>90) {
    angle = 90;
  }else if (angle<-90) {
    angle=-90;
  }
  aimAngleY = angle;
}

// 旋转运动
function animation() {

  // 生成视觉差运动
  curAngleX += (aimAngleX - curAngleX) * 0.6;
  curAngleY += (aimAngleY - curAngleY) * 0.6;
  //旋转
  $("#cube").css({
    transform: "rotateX(" + (curAngleY) + "deg) rotateY(" + -curAngleX + "deg) rotateZ(0)"
  })

  timer = requestAnimationFrame(animation);
}
