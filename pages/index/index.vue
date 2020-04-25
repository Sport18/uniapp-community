<template>
	<view>
		<!-- 顶部选项卡 -->
		<scroll-view scroll-x :scroll-into-view="scrollInto" scroll-with-animation class="scroll-row" style="height: 100rpx;">
			<view v-for="(item,index) in tabBars" :key="index" class="scroll-row-item px-3 py-2 font-md" :id="'tab'+index"
			 :class="tabIndex === index?'text-main font-lg font-weight-bold':''" @click="changeTab(index)">{{item.name}}
			</view>
		</scroll-view>

		<swiper :duration="150" :current="tabIndex" @change="onChangeTab" :style="'height:'+scrollH+'px;'">
			<swiper-item v-for="(item,index) in newsList" :key="index">
				<scroll-view scroll-y="true" :style="'height:'+scrollH+'px;'" @scrolltolower="loadmore(index)">
					<template v-if="item.list.length > 0">
						<!-- 列表 -->
						<block v-for="(item2,index2) in item.list" :key="index2">
							<!-- 样式列表 -->
							<common-list :item="item2" :index="index2" @follow="follow" @doSupport="doSupport"></common-list>
							<!-- 分割线 -->
							<divider></divider>
						</block>
						<!-- 上拉加载 -->
						<load-more :loadmore="item.loadmore"></load-more>
					</template>
					<!-- 无数据 -->
					<template v-else>
						<no-thing></no-thing>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	// 测试数据
	const demo = [{
			username: "昵称",
			userpic: "/static/default.jpg",
			newstime: "2019-10-20 下午4:30",
			isFollow: false,
			title: "我是标题！",
			titlepic: "/static/demo/datapic/3.jpg",
			support: {
				type: "support", // 顶
				support_count: 1,
				unsupport_count: 2
			},
			comment_count: 2,
			share_num: 2
		},
		{
			username: "昵称",
			userpic: "/static/default.jpg",
			newstime: "2019-10-20 下午4:30",
			isFollow: false,
			title: "我是标题！",
			titlepic: "",
			support: {
				type: "unsupport", // 踩
				support_count: 1,
				unsupport_count: 2
			},
			comment_count: 2,
			share_num: 0
		},
		{
			username: "昵称",
			userpic: "/static/default.jpg",
			newstime: "2019-10-20 下午4:30",
			isFollow: false,
			title: "我是标题！",
			titlepic: "",
			support: {
				type: "", // 未操作
				support_count: 1,
				unsupport_count: 2
			},
			comment_count: 2,
			share_num: 0
		}
	]
	import commonList from '@/components/common/common-list.vue';
	import loadMore from '@/components/common/load-more.vue';
	export default {
		components: {
			commonList,
			loadMore
		},
		data() {
			return {
				// 列表高度
				scrollH: 600,
				title: 'Hello',
				scrollInto: "",
				tabIndex: 0,
				// 顶部选项卡
				tabBars: [{
					name: "关注"
				}, {
					name: "推荐"
				}, {
					name: "体育"
				}, {
					name: "财经"
				}, {
					name: "娱乐"
				}, {
					name: "军事"
				}, {
					name: "历史"
				}, {
					name: "本地"
				}, ],
				newsList: []

			}
		},
		// 监听点击导航栏搜索框
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '../search/search?type=post',
			});
		},
		// 监听导航栏按钮点击事件
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../add-input/add-input'
			})
		},
		onLoad() {
			console.log(this.$C.webUrl);
			// 计算屏幕宽度
			uni.getSystemInfo({
				success: res => {
					this.scrollH = res.windowHeight - uni.upx2px(200)
				}
			})
			// 工具选项生成列表
			this.getData()
		},
		methods: {
			// 获取数据
			getData() {
				var arr = []
				for (let i = 0; i < this.tabBars.length; i++) {
					// 生成列表模板
					let obj = {
						// 1. 上拉加载更多 2.加载中... 3.没有更多了
						loadmore: "上拉加载更多",
						list: []
					}
					if (i < 2) {
						obj.list = demo
					}
					arr.push(obj)
				}
				this.newsList = arr
			},
			// 关注
			follow(e) {
				let list = this.newsList[this.tabIndex].list
				list[e].isFollow = true
				uni.showToast({
					title: '关注成功'
				});
			},
			// 顶踩操作
			doSupport(e) {
				let list = this.newsList[this.tabIndex].list
				// 拿到当前对象 
				let item = list[e.index]
				let msg = e.type === 'support' ? '顶' : '踩'
				// 之前没有操作
				if (item.support.type === '') {
					item.support[e.type + '_count']++
				} else if (item.support.type === 'support' && e.type === 'unsupport') {
					item.support.support_count--
					item.support.unsupport_count++
				} else if (item.support.type === 'unsupport' && e.type === 'support') {
					item.support.support_count++
					item.support.unsupport_count--
				}
				item.support.type = e.type
				uni.showToast({
					title: msg + '成功'
				});
			},
			// 切换选项
			changeTab(index) {
				if (this.tabIndex === index) {
					return
				}
				this.tabIndex = index
				this.scrollInto = 'tab' + index
			},
			//监听滑动
			onChangeTab(e) {
				this.changeTab(e.detail.current)
			},
			// 上拉加载更多
			loadmore(index) {
				// 拿到当前列表
				let item = this.newsList[index]
				// 判断是否处于可加载状态(上拉加载更多)
				if (item.loadmore !== '上拉加载更多') return
				// 修改当前列表加载状态
				item.loadmore = '加载中...'
				// 模拟数据请求
				setTimeout(() => {
					// 加载数据
					item.list = [...item.list, ...item.list]
					// 恢复加载状态
					item.loadmore = '上拉加载更多'
				}, 2000)
			}
		},
	}
</script>

<style>

</style>
