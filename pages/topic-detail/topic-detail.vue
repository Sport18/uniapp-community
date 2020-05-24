<template>
	<view>
		<topic-info :info="info"></topic-info>
		<divider></divider>

		<view class="p-2 flex align-center border-bottom" hover-class="bg-light" v-for="(item, index) in hotList" :key="index">
			<text class="iconfont icon-xihuan text-main"></text>
			<text class="font text-dark text-ellipsis">
				{{item.title}}
			</text>
		</view>
		<divider></divider>

		<!-- tab -->
		<view class="flex align-center py-2">
			<view class="flex-1 flex align-center justify-center" v-for="(item, index) in tabBars" :key="index" :class="index === tabIndex ? 'font-lg font-weight-bold text-main' : 'font-md'"
			 @click="changeTab(index)">
				{{item.name}}
			</view>
		</view>

		<!-- 列表 -->
		<template v-if="listData.length > 0">
			<block v-for="(item, index) in listData" :key="index">
				<common-list :item="item" :index="index"></common-list>
				<divider></divider>
			</block>
		</template>
		<template v-else>
			<no-thing></no-thing>
		</template>
		
		<!-- 上拉加载 -->
		<load-more :loadmore="loadtext"></load-more>
	</view>
</template>

<script>
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
	import topicInfo from '@/components/topic-detail/topic-info.vue';
	import commonList from '@/components/common/common-list.vue';
	import noThing from '@/components/common/no-thing.vue';
	import loadMore from '@/components/common/load-more.vue';
	export default {
		components: {
			topicInfo,
			commonList,
			noThing,
			loadMore
		},
		data() {
			return {
				info: {},
				hotList: [{
						title: '【新人必读】人类的悲伤并不想通'
					},
					{
						title: '【新人必读】人类的悲伤并不想通'
					}
				],
				tabIndex: 0,
				tabBars: [{
						name: '默认',
					},
					{
						name: '最新',
					}
				],
				// 默认
				list1: [],
				loadtext1: "上拉加载更多",
				page1: 1,
				firstLoad1: 1,
				// 最新
				list2: [],
				loadtext2: "上拉加载更多",
				page2: 1,
				firstLoad2: 1,
			}
		},
		computed: {
			// 当前列表数据
			listData() {
				if (this.tabIndex === 0) {
					return this.list1
				}
				return this.list2
			},
			// 当前上拉加载
			loadtext() {
				if (this.tabIndex === 0) {
					return this.loadtext1
				}
				return this.loadtext2
			}
		},
		onLoad(options) {
			if (options.detail) {
				this.info = JSON.parse(options.detail)
				uni.setNavigationBarTitle({
					title: this.info.title
				})
			}
			
			// 加载数据
			this.getData()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			// 加载数据
			getData() {
				let no = this.tabIndex+1
				let page = this['page'+no]
				let isrefresh = page == 1
				this.$H.get('/topic/'+this.info.id+'/post/'+page).then(res => {
					let list = res.list.map(v => {
						return this.$U.formatCommonList(v)
					})
					this['list'+no] = isrefresh ? [...list] : [...this['list'+no], ...list]
					this['loadtext'+no] = list.length < 10 ? '没有更多了' : '上拉加载更多'
					if (isrefresh) {
						this['firstLoad'+no] = true
					}
				}).catch(err => {
					if(!isrefresh) {
						this['page'+no]--
					}
				})
			},
			
			// 切换选项
			changeTab(index) {
				this.tabIndex = index
				if(!this['firstLoad'+(index+1)]) {
					this.getData()
				}
			},
			// 上拉加载
			loadMore(){
				// 拿到当前的索引
				let index = this.tabIndex
				let no = index+1
				// 判断是否处于可加载状态
				if (this.loadtext !== '上拉加载更多') return
				// 设置上拉加载状态
				this['loadtext'+no] = '加载中...'
				
				// 请求数据
				this['page'+no]++
				this.getData()
			}
		}
	}
</script>

<style>
	.filter {
		filter: blur(10px);
	}
</style>
