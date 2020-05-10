<template>
	<view>
		<template v-if="searchList.length === 0">
			<!-- 搜索历史 -->
			<view class="py-2 font-md px-2">搜索历史</view>
			<view class="flex flex-wrap">
				<view class="border rounded font mx-2 my-1 px-2" hover-class="bg-light" @click="clickSearchHistory(item)" v-for="(item,index) in list"
				 :key="index">{{item}}</view>
			</view>
		</template>

		<template v-else>
			<!-- 数据列表 -->
			<block v-for="(item, index) in searchList" :key="index">
				<template v-if="type === 'post'">
					<!-- 帖子 -->
					<common-list :item="item" :index="index"></common-list>
				</template>
				<template v-else-if="type === 'topic'">
					<!-- 话题 -->
					<topic-list :item="item" :index="index"></topic-list>
				</template>
				<template v-else>
					<!-- 用户 -->
					<user-list :item="item" :index="index"></user-list>
				</template>
			</block>
			
			<!-- 上拉加载 -->
			<load-more :loadmore="loadmore"></load-more>
		</template>

	</view>
</template>

<script>
	import commonList from '@/components/common/common-list.vue';
	import topicList from '@/components/news/topic-list.vue';
	import userList from '@/components/user-list/user-list.vue';
	import loadMore from '@/components/common/load-more.vue';
	export default {
		components: {
			commonList,
			topicList,
			userList,
			loadMore
		},
		data() {
			return {
				searchText: "",
				list: ['uni-app第二季商城类项目', '你是世界', '该如何才能摆脱', '记住目前的心情'],
				// 搜索结果
				searchList: [],
				// 当前搜索类型
				type: "post",
				loadmore: "上拉加载更多",
				page: 1
			}
		},
		onLoad(e) {
			if (e.type) {
				this.type = e.type
			}
			let pageTitle = '帖子'
			switch (this.type) {
				case 'post':
					pageTitle = '帖子'
					break;
				case 'topic':
					pageTitle = '话题'
					break;
				case 'user':
					pageTitle = '用户'
					break;
			}
			// 修改搜索占位符
			// #ifdef APP-PLUS
			let currentWebview = this.$mp.page.$getAppWebview();
			let tn = currentWebview.getStyle().titleNView;
			tn.searchInput.placeholder = '搜索' + pageTitle;
			currentWebview.setStyle({
				titleNView: tn
				// #endif
			})
		},
		// 监听导航栏输入
		onNavigationBarSearchInputChanged(e) {
			this.searchText = e.text
		},
		// 监听导航栏搜索按钮点击事件
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				this.searchEvent()
			}
		},
		// 监听下拉刷新
		onPullDownRefresh() {
			this.getData()
		},
		methods: {
			// 点击搜索历史
			clickSearchHistory(text) {
				this.searchText = text
				this.searchEvent()
			},
			// 搜索事件
			searchEvent() {
				// 收起键盘
				uni.hideKeyboard()
				// 请求搜索
				this.getData()
			},
			
			// 获取数据
			getData(isrefresh = true) {
				// 显示loading状态
				uni.showLoading({
					title: '加载中...'
				});
				// 请求搜索
				if (isrefresh) {
					this.page = 1
				}
				this.$H.post('/search/' + this.type, {
					keyword: this.searchText,
					page: this.page
				}).then(res => {
					// 整理格式
					let list = res.list.map(v => {
						return this.$U.formatCommonList(v)
					})
					
					// 渲染页面
					this.searchList = isrefresh ? [...list] : [...this.searchList, ...list]
					// 加载情况
					this.loadmore = list.length < 10 ? '没有更多了' : '上拉加载更多'
					
					// 隐藏loading状态
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			},
		} 
	}
</script>

<style>

</style>
