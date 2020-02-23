window.onload = function () {
	//获取元素
	let recHead = $('.rec-header')[0];
	let recList = $('.rec-list')[0];
	let control = $('.control')[0];
	
	//获取背景图
	$.get(
	   `http://localhost:3000/banner`,
	   function({banners}) {
		  // console.log(banners)
		   recHead.style.background = `
		   url(${banners[0].imageUrl}) no-repeat 0 0/auto 100%
		   `
	   }
	);
	
	let idList = [];
	let imgList = [];
	let nameList = [];
	//获取推荐音乐
	$.get(
	`http://localhost:3000/personalized/newsong`,
	function({result}) {
		// console.log(result)
		recList.innerHTML = '';
		result.forEach((item,index) => {
			idList.push(item.id);
			imgList.push(item.song.album.picUrl);
			nameList.push(item.name);
			
			recList.innerHTML += `
			<li class="rec-item">
				<a class="playing" href="#">
					<div class="item-info">
						<div class="info-img">
							<img src="${item.song.album.picUrl}" >
						</div>
						<div class="info">
							<div class="info-title">
								${item.name}
							</div>
							<div class="info-desc">
								${item.song.album.name}
							</div>
						</div>
					</div>
					<div class="item-play">
						<span class="iconfont icon-bofang-yuanshijituantubiao"></span>
						<span class="iconfont icon-gengduo"></span>
					</div>
					
				</a>
			</li>
			`
			
		});
		
		// console.log(imgList);
		// console.log(nameList);
		
		
		let playing =[...$('.playing')];
		window._audio = document.createElement('audio');
		
		playing.forEach((item,index) => {
			item.index = index;
			item.onclick = function (){
				
				control.style.display = 'block';
				
				//获取音乐播放
				$.get(
					`http://localhost:3000/song/url?id=${idList[this.index]}`,
					function({data}){
						console.log(data)
						_audio.src = data[0].url;
						_audio.play();
					}
				);
				
				//更改控件内容
				control.innerHTML = `
					<a href="./play.html?id=${idList[this.index]}">
						<div class="control-content">
							<div class="con-img">
								<img src="${imgList[this.index]}" />
							</div>
							<div class="con-info">
								<div class="con-title">
									${nameList[this.index]}
								</div>
								<div class="con-desc">
									滑动可以切换音乐
								</div>
							</div>
						</div>
						
						<div class="con-play">
							<div class="con-playing">
								<span class="iconfont icon-zanting"></span>
							</div>
							<span class="iconfont icon-SongListgedan"></span>
						</div>
					</a>
				`
				
			}
		})
		
		
	  }
   )	
}