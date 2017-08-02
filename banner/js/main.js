(function(document , undefined){

	init();
	
	/*页面初始化*/
	function init(){		
		var arr = ['img/1.jpg' , 'img/2.jpg' , 'img/3.jpg' , 'img/4.jpg'];
		loadImg(arr , undefined , startDraw);
	}

	/*开始绘制*/
	function startDraw(imgObjArr){
		var canvas = document.getElementById("main") ,	canvasSquareSize , imgSquareSize , squareArr = [] , zIndex = 0 , isAuto = true , 
			ctx = canvas.getContext("2d") , imgObj = imgObjArr[0] , squareNum = 30 , autoTimer , autoSpeed = 4000 ,
			windowsWidth = document.body.offsetWidth;
		
		var nextImgObj = imgObjArr[1];
		
		/*执行函数*/
		function start(){
			initDomAndParam();
			initShow();
			autoSwitch();
			canvas.addEventListener("click" , hanleClickEvent , false);
			window.onblur = function(){
				if(autoTimer) clearInterval(autoTimer);
			}
			window.onfocus = function(){
				autoSwitch();
			}
		}
		
		/*初始化canvas DOM 属性 以及 参数*/
		function initDomAndParam(){
			canvas.width = Math.round(0.85 * windowsWidth);
			canvas.height = Math.round((imgObj.height * canvas.width) / imgObj.width);
			canvasSquareSize = Math.round(Math.max(canvas.width , canvas.height)/squareNum);
			imgSquareSize = Math.round(Math.max(imgObj.width , imgObj.height)/squareNum);
			for(var xIndex = 0 ; xIndex < Math.ceil(canvas.width/canvasSquareSize) ; xIndex++){
				for(var yIndex = 0 ; yIndex < Math.ceil(canvas.height/canvasSquareSize) ; yIndex++){
					squareArr.push(new Square(xIndex , yIndex , imgObj));
				}
			}
		}
		
		/*绘制 初次显示的图片*/
		function initShow(){
			for(var i = 0 , item ; item = squareArr[i++];){
				item.drawImg(ctx);
			}
		}
		
		/*自动轮播*/
		function autoSwitch(){
			if(!isAuto) return;
			var centerPos = {			//页面中心点
				x : Math.round(Math.ceil(canvas.width/canvasSquareSize)/2) , 
				y : Math.round(Math.ceil(canvas.height/canvasSquareSize)/2),
			} , autoFunc = function(){
				zIndex = (zIndex + 1)%imgObjArr.length;
				switchImg(imgObjArr[zIndex] , centerPos , squareArr , "auto");
			}
			autoTimer = setInterval(autoFunc , autoSpeed);
		}
		
		/*处理点击事件*/
		function hanleClickEvent(e){
			zIndex = (zIndex + 1)%imgObjArr.length;
			switchImg(imgObjArr[zIndex] , getPos(windowToCanvas(e.clientX, e.clientY)) , squareArr , "click");
			
			function windowToCanvas(x, y) { //window坐标转canvas坐标
			    return {
			        x: Math.round(x - canvas.getBoundingClientRect().left - document.body.scrollLeft),
			        y: Math.round(y - canvas.getBoundingClientRect().top - document.body.scrollTop)
			    }
			}
			function getPos(obj){
				return {
					x : Math.round(obj.x / canvasSquareSize) , 
					y : Math.round(obj.y / canvasSquareSize)
				}
			}
		}
		
		/*图片切换  img 图片对象 startPos 切换的启示位置*/
		function switchImg(newImg , startPos , squareArr , type){
			if(type == "click") clearInterval(autoTimer);
			canvas.removeEventListener("click" , hanleClickEvent , false);
			var distance = 0;
			var timer = setInterval(function(){
				var switchSquareArr = getSquaresByDistance(distance , startPos , squareArr);
				if(switchSquareArr.length == 0){
					clearInterval(timer);
					canvas.addEventListener("click" , hanleClickEvent , false);
					if(type == "click") autoSwitch();
					return;
				}
				for(var i = 0 , square ; square = switchSquareArr[i++];){
					square.clearImg(ctx);
					square.setImg(newImg);
					square.drawImg(ctx);
				}
				distance++;
			} , 20);
		}
		
		/*根据距离获取对象数组*/
		function getSquaresByDistance(distance , startPos , squareArr){
			var retArr = [] , startX = startPos.x , startY = startPos.y;
			for(var index = 0 , square ; square = squareArr[index++]; ){
				if((Math.abs(startX - square.xIndex) + Math.abs(startY - square.yIndex)) == distance){
					retArr.push(square);
				}
			}
			return retArr;
		}
		
		/*正方形对象*/
		function Square(xIndex , yIndex , img){
			this.xIndex = xIndex;
			this.yIndex = yIndex;
			this.img = img;
		}
		Square.prototype.setImg = function(newImg){		//设置新图片
			this.img = newImg;
		}
		Square.prototype.drawImg = function(ctx){		//绘制方法
			ctx.beginPath();
			ctx.drawImage(this.img , this.xIndex*imgSquareSize , this.yIndex*imgSquareSize , imgSquareSize , imgSquareSize ,
					this.xIndex*canvasSquareSize , this.yIndex*canvasSquareSize , canvasSquareSize , canvasSquareSize);
			ctx.closePath();
		}
		Square.prototype.clearImg = function(ctx){			//清空正方形内的图片
			ctx.clearRect(this.xIndex*canvasSquareSize , this.yIndex*canvasSquareSize , canvasSquareSize , canvasSquareSize);
		}
		
		start();
	}

	/*图片加载方法*/
	function loadImg(arr , singleOverCallback , allOverCallback){		
		var havaDoneNum = 0 , imgObjArr = [];
		for(var i = 0 , item ; item = arr[i++];){
			var img = new Image();
			imgObjArr.push(img);
			img.src = item;
			img.onload = imgOnLoad;
		}

		function imgOnLoad(){
			havaDoneNum++;
			if(singleOverCallback && typeof singleOverCallback == "function"){
				singleOverCallback.call(this , havaDoneNum);
			}
			if(havaDoneNum == arr.length && allOverCallback &&
					typeof allOverCallback == "function"){
				allOverCallback.call(this , imgObjArr);
			}
		}
	}
})(document)