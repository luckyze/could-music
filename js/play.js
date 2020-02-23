window.onload = function (){
	// console.log(location.href);
	let disc = $('.disc')[0];
	let playing = $('.playing')[0];
	let currentTime = $('.currentTime')[0];
	let duration = $('.duration')[0];
	let proBar = $('.pro-bar')[0];
	let proBg = $('.pro-bg')[0];
	let progress = $('.progress')[0];
	let playWrap = $('.play-wrap')[0];
	let lyricWrap = $('.lyric-wrap')[0];
	
	//提取id
	let mark = true;

	(function(str){
		if(!str.includes('?')) return;
		let arr = str.split("?")[1].split("&");
		arr.forEach((item,index) => {
			let dataArr = item.split('=');
			// datas[dataArr[0]] = dataArr[1];
			if(dataArr[0] == 'id'){
				localStorage.setItem(dataArr[0],dataArr[1])
			}
		})
		
	})(location.href);
	
	let datas = {};
	datas.id = localStorage.getItem('id');
	window._audio = document.createElement('audio');
	
	//获取歌曲详细
	$.get(
	`http://localhost:3000/song/detail?ids=${datas.id}`,
	function({songs: [{al:{picUrl}}]}){
		// console.log(picUrl);
		disc.innerHTML = `
		<img src="${picUrl}" >
		`
	}
	);
	
	//获取音乐播放
	$.get(
	`http://localhost:3000/song/url?id=${datas.id}`,
	function({data: [{ url }] }) {
		console.log(url);
		disc.style.animation = 'rotate 10s linear infinite';
		_audio.src = url;
		_audio.play();
		

		
		//监听音乐播放完毕
	    _audio.addEventListener('ended',function(){
			disc.style.animation = '';
		})
		
		//监听播放
		
		_audio.addEventListener('timeupdate',function(){
			nowTime();
		});
		
		//播放时间
		function nowTime() {
			//总时间
			duration.innerHTML = time(_audio.duration);
			currentTime.innerHTML = time(_audio.currentTime);
			
			//进度条
			
			let n = _audio.currentTime / _audio.duration;
			proBar.style.left = n * (progress.offsetWidth - proBar.offsetWidth) / 3.375 / 100 + 'rem';
		    proBg.style.width = n * (progress.offsetWidth - proBar.offsetWidth) / 3.375 / 100 + 'rem';
		    
		}
		
		//处理时间函数
		function time(cTime) {
			cTime = parseInt(cTime);
			let m = zero(Math.floor(cTime % 3600 / 60));
			let s = zero(Math.floor(cTime % 60));
			return `${m}:${s}`
		}
		
		//两位数时间格式
		function zero(num){
			return num <10 ? '0' + num : '' + num;
		}
		
		playing.onclick = function(){
			let str = '';
			let animation = '';
			if (mark) {
				_audio.pause();
				str = "icon-bofang";
				}else{
					_audio.play();
					str = "icon-zanting";
					disc.style.animation = 'rotate 10s linear infinite';
				}
				mark = !mark;
				this.innerHTML = `
				<span class="iconfont icon-48shangyishou"></span>
				<span class="iconfont ${str}"></span>
				<span class="iconfont icon-49xiayishou"></span>
				`;
				disc.style.animation = animation;
				return false;
			}
			
			//获取歌词
			playWrap.onclick = function(){
				disc.style.display = "none";
				$.get(
				`http://localhost:3000/lyric?id=${datas.id}`,
				function({ lrc: {lyric} }){
					console.log(lyric);
					let data = lyric.split('[');
					data.forEach((item,index) => {
						if(!item) return;
						let dataArr = item.split(']');
						
						let time = dataArr[0].split('.')[0];
						let lyricStr = dataArr[1];
						
						let timeArr = time.split(':');
						
						let timer = timeArr[0] * 60 + timeArr[1] * 1;
						
						let p = document.createElement('p');
						p.id = 'ly' + timer;
						p.className = 'lyr';
						p.innerHTML = lyricStr;
						lyricWrap.appendChild(p);
					})
					
					//获取所有的p标签
					let pArr = ([...$('.lyr')]);
					console.log(pArr);
					
					_audio.addEventListener('timeupdate',function(){
						// console.log('ly'+parseInt(_audio.currentTime))
						
						let currentTime = parseInt(_audio.currentTime);
						pArr.forEach((item,index) => {
							if(item.id == 'ly' + currentTime) {
								lyricWrap.style.marginTop = -(item.offsetTop/100) + 'rem';
								
								if(index > 0){
									pArr[index-1].style.color = '#7f7676';
								}
								
								item.style.color = "#fff";
							}
						})
					})
				}
				
				)
			}
		}

	)
}