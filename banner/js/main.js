(function(document , undefined){

	init();
	
	/*页面初始化*/
	function init(){		
		var arr = ['img/1.jpg' , 'img/2.jpg' , 'img/3.jpg' , 'img/4.jpg'];
		loadImg(arr , undefined , startDraw);
	}

	/*开始绘制*/
	function startDraw(imgObjArr){
		var canvas = document.getElementById("main") ,	size ,
			ctx = canvas.getContext("2d") , imgObj = imgObjArr[0] , 
			windowsWidth = document.body.offsetWidth;
		
		start();
		
		/*执行函数*/
		function start(){
			initCanvasDom();
			draw();
		}
		
		/*初始化canvas DOM 属性 以及 参数*/
		function initDomAndParam(){
			canvas.width = Math.round(0.85 * windowsWidth);
			canvas.height = Math.round((imgObj.height * canvas.width) / imgObj.width);
			size = Math.round(Math.min(canva.width , canvas.height)/20);
		}
		
		/*绘制*/
		function draw(){
			ctx.drawImage(imgObj , 0 , 0 , imgObj.width , imgObj.height ,
					0 , 0 , canvas.width , canvas.height);
		}
		
		/*绘制正方形*/
		function square(xNum , yNum , img){
			this.xNum = xNum;
			this.yNum = yNum;
			this.img = img;
		}
		square.prototype.
			
		
		
		
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