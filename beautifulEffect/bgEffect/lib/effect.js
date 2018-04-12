(function(window , undefind){		//canvas特效
	function canvasEffect(options) {
		var defaults = {
			ele : $("body")[0] ,  //覆盖元素
			type : "snow" ,  //snow为雪花，band为彩带，star为星星
			particleMax : 200 , 	//元素最大数
			particleCount : 100 , //使用元素数目
			bandColorArr : ["#82F269", "#F61326", "#F6F313", "#518DF6"] , //彩带颜色数组
			vy : 1 ,	//Y轴上的运动速度
			vyFloat : 1.5 ,		//Y轴速度浮动的系数
			vx : 0.5 ,	//X轴上的运动速度
			vxFloat : 1 ,		//X轴速度浮动的系数
			w : 8 , //元素的宽度
			wFloat : 2 , 	//宽度的浮动系数
			h : 12 , //元素的高度
			hFloat : 4 , //高度的浮动系数
			o : 0.4 , //元素的透明度
			oFloat : 0.5 ,	//透明度的浮动系数
			r : 1 ,	//半径
			rFloat : 2	,//半径的浮动值
			snowColor : "#FFF"	//雪花的颜色
		}
		var opts = $.extend(true, defaults, options || {});
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			width = opts.ele.clientWidth,
			height = opts.ele.clientHeight,
			i = 0 , active = false , objFlakes = [] , objFlake,
			lastDate = 0 , dateDel = 0 ,  isChange = false;
		var starPic = new Image();
		starPic.src = "img/star.png";
		canvas.style.position = 'absolute';
		canvas.style.left = canvas.style.top = '0';
		var Objflake = function() {
			this.reset();	//初始化
		};
		Objflake.prototype.reset = function() {
			this.x = Math.random() * width;
			this.y = Math.random() * -height;
			this.vy = opts.vy + Math.random()*opts.vyFloat;
			this.vx = opts.vx - Math.random()*opts.vxFloat;
			this.w = opts.w + Math.random()*opts.wFloat;
			this.h = opts.h + Math.random()*opts.hFloat;
			this.o = opts.o + Math.random()*opts.oFloat;
			this.color = opts.bandColorArr[parseInt(Math.random() * opts.bandColorArr.length)];
			this.c = Math.random() > 0.5 ? 1 : -1;
			this.r = opts.r + Math.random()*opts.rFloat;
			this.picNo = Math.floor(Math.random() * 7);
		};
		function generatebandFlakes() {	//初始化元素个数
			objFlakes = [];
			for (i = 0; i < opts.particleMax; i++) {
				objFlake = new Objflake();
				objFlake.reset();
				objFlakes.push(objFlake);
			}
		}
		generatebandFlakes();
		function update() {	//更新
			ctx.clearRect(0, 0, width, height);
			if (!active) {
				return;
			}
			if(opts.type == "star"){
				var nowDate = Date.now();
				dateDel += nowDate - lastDate;
				lastDate = nowDate;
				isChange = (dateDel > 60);
				if(isChange){
					dateDel = 0;
				}
			}
			for (i = 0; i < opts.particleCount; i++) {
				objFlake = objFlakes[i];
				objFlake.y += objFlake.vy;
				objFlake.x += objFlake.vx;
				if(opts.type == "snow"){
					drawSnow(objFlake.x, objFlake.y, objFlake.r , objFlake.o);
				}else if(opts.type == "band"){
					drawBand(objFlake.x, objFlake.y, objFlake.color, objFlake.w,
						objFlake.h, objFlake.c, objFlake.o);
				}else if(opts.type == "star"){
					if(isChange){
						objFlake.picNo += 1;
						objFlake.picNo = objFlake.picNo%7;
					}
					ctx.drawImage(starPic, objFlake.picNo * 7, 0, 7, 7, objFlake.x, objFlake.y, 7, 7);
				}
				if (objFlake.y > height) {
					objFlake.reset();
				}
			}
			requestAnimFrame(update);
		}
		//画彩带
		function drawBand(x, y, color, w, h, c, alpha, isRotate, rotatePI) {
			var leakdep = h < 10 ? 2 : 8;
			var leak = c > 0 ? leakdep : -(leakdep);
			ctx.save();
			ctx.fillStyle = color;
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.moveTo(x, y - h);
			ctx.lineTo(x + w, y - h);
			ctx.quadraticCurveTo(x + w + c, y - h / 2, x + w + leak, y);
			ctx.lineTo(x + leak, y);
			ctx.quadraticCurveTo(x + c, y - h / 2, x, y - h);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		//画雪花
		function drawSnow(x  , y  , r , o){
			ctx.save();
			ctx.fillStyle = opts.snowColor;
			ctx.globalAlpha = o;
			ctx.beginPath();
			ctx.arc(x , y , r , 0, Math.PI * 2, false);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		function onResize() {
			width = opts.ele.clientWidth;
			height = opts.ele.clientHeight;
			canvas.width = width;
			canvas.height = height;
			lastDate = Date.now();
			var wasActive = active;
			active = width > 300;
			if (!wasActive && active) {
				requestAnimFrame(update);
			}
		}
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();
		onResize();
		window.addEventListener('resize', onResize, false);
		opts.ele.appendChild(canvas);
	}
	window.canvasEffect = canvasEffect;
})(window);