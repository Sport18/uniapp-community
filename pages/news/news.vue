<template>
	<view>
		<!-- 导航 -->
		<uni-nav-bar :border="false" :fixed="true" :statusBar="true" @click-right="openAddInput">
			<view class="flex align-center justify-center font-weight-bold w-100">
				<view class="mx-1" v-for="(item, index) in tabBars" :key="index" :class="tabIndex === index ? 'font-lg text-main' : 'font-md text-light-muted'"
				 @click="changeTab(index)">
					{{item.name}}
				</view>
			</view>
			<text slot="right" class="iconfont icon-fatie_icon"></text>
		</uni-nav-bar>

		<!-- 内容 -->
		<swiper :current="tabIndex" :duration="150" @change="onChangeTab" :style="'height:'+scrollH+'px;'">
			<!-- 关注 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="'height:'+scrollH+'px;'" @scrolltolower="loadmoreEvent">
					<block v-for="(item, index) in list" :key="index">
						<common-list :item="item" :index="index" @doSupport="doSupport"></common-list>
						<divider></divider>
					</block>
					<load-more :loadmore="loadmore"></load-more>
				</scroll-view>
			</swiper-item>
			<!-- 话题 -->
			<swiper-item style="touch-action: none">
				<scroll-view scroll-y="true" :style="'height:'+scrollH+'px;'">
					<!-- 热门分类 -->
					<hot-cate :hotcate="hotcate"></hot-cate>
					<!-- 搜索框 -->
					<view class="p-2">
						<view class="bg-light flex rounded align-center py-2 justify-center text-secondary" @click="openSearch">
							<text class="iconfont icon-sousuo mr-2"></text>
							搜索话题
						</view>
					</view>
					<!-- 轮播图 -->
					<swiper class="px-2 pb-2" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
						<block v-for="(item, index) in swiperList" :key="index">
							<swiper-item>
								<image :src="item.src" style="height: 300rpx;" class="w-100 rounded"></image>
							</swiper-item>
						</block>
					</swiper>
					<divider></divider>
					<!-- 最近更新 -->
					<view class="p-2 font-md">最近更新</view>
					<!-- 话题列表组件 -->
					<block v-for="(item, index) in topicList" :key="index">
						<topic-list :item="item" :index="index"></topic-list>
					</block>
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
			isFollow: true,
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
			isFollow: true,
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
			isFollow: true,
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
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue';
	import commonList from '@/components/common/common-list.vue';
	import loadMore from '@/components/common/load-more.vue';
	import hotCate from '@/components/news/hot-cate.vue';
	import topicList from '@/components/news/topic-list.vue';
	export default {
		components: {
			uniNavBar,
			commonList,
			loadMore,
			hotCate,
			topicList
		},
		data() {
			return {
				scrollH: 500,
				tabIndex: 0,
				tabBars: [{
					name: "关注",
				}, {
					name: "话题",
				}],
				// 关注列表
				list: [],
				// 1. 上拉加载更多 2.加载中... 3.没有更多了
				loadmore: "上拉加载更多",

				hotcate: [],
				topicList: [],
				swiperList: []
			}
		},
		onLoad() {
			// 计算屏幕宽度
			uni.getSystemInfo({
					success: res => {
						this.scrollH = res.windowHeight - res.statusBarHeight - 44
					}
				}),
			// 加载测试数据
			this.list = demo
			
			//获取数据
			this.getTopicNav()
			this.getHotTopic()
			this.getSwipers()
		},
		methods: {
			// 获取热门分类
			getTopicNav() {
				this.$H.get('/topicclass').then(res => {
					this.hotcate = res.list.map(item => {
						return {
							id: item.id,
							name: item.classname
						}
					})
				})
			},
			// 获取热门话题
			getHotTopic() {
				this.$H.get('/hottopic').then(res => {
					this.topicList = res.list.map(item => {
						return {
							id: item.id,
							cover: item.titlepic,
							title: item.title,
							desc: item.desc,
							today_count: item.todaypost_count,
							new_count: item.post_count
						}
					})
				})
			},
			// 获取轮播图
			getSwipers() {
				this.$H.get('/adsense/0').then(res => {
					this.swiperList = res.list
				})
			},


			// 打开发布页
			openAddInput() {
				uni.navigateTo({
					url: '../add-input/add-input',
				});
			},
			// 切换选项卡
			changeTab(index) {
				this.tabIndex = index
			},
			// 监听滑动
			onChangeTab(e) {
				this.tabIndex = e.detail.current
			},
			// 顶踩操作
			doSupport(e) {
				// 拿到当前对象 
				let item = this.list[e.index]
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
			// 上拉加载
			loadmoreEvent() {
				// 验证当前是否处于可加载状态
				if (this.loadmore !== '上拉加载更多') return
				// 设置加载状态
				this.loadmore = '加载中...'
				// 模拟请求数据
				setTimeout(() => {
					// 加载数据
					this.list = [...this.list, ...this.list]
					// 设置加载转态
					this.loadmore = '上拉加载更多'
				}, 2000);
			},
			// 打开搜索页
			openSearch() {
				uni.navigateTo({
					url: '../search/search?type=topic',
				});
			}
		}
	}
</script>

<style>
	.page {
		touch-action: none;
	}
</style>
