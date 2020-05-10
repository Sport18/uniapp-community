<template>
	<view>
		<!-- 帖子详情页详细信息 -->
		<common-list :item="info" isDetail @doComment="doComment" @doShare="doShare" @follow="follow" @doSupport="doSupport">
			<view class="">{{info.content}}</view>
			<view>
				<image v-for="(item, index) in images" :key="index" :src="item.url" class="w-100" mode="widthFix" @click="preview(index)"></image>
			</view>
		</common-list>
		
		<divider></divider>
		<view class="p-2 font-md font-weight-bold">最新评论 {{info.comment_count}}</view>

		<view class="px-2">
			<view class="uni-comment-list">
				<view class="uni-comment-face">
					<image src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png" mode="widthFix"></image>
				</view>
				<view class="uni-comment-body">
					<view class="uni-comment-top">
						<text>小猫咪</text>
					</view>
					<view class="uni-comment-content">支持国产，支持DCloud!</view>
					<view class="uni-comment-date">
						<view>2天前</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view style="height: 100rpx;"></view>
		<!-- 底部输入框 -->
		<buttom-input @submit="submit"></buttom-input>
		<!-- 分享弹出层 -->
		<more-share ref="share"></more-share>
	</view>
</template>

<script>
	import commonList from '@/components/common/common-list.vue';
	import buttomInput from '@/components/common/buttom-input.vue';
	import moreShare from '@/components/common/more-share.vue';
	export default {
		components: {
			commonList,
			buttomInput,
			moreShare
		},
		data() {
			return {
				// 当前帖子信息
				info: {},
				images: [],
				commentList: []
			}
		},
		onLoad(e) {
			// 初始化
			if (e.detail) {
				this.__init(JSON.parse(e.detail))
			}
		},
		computed: {
			imagesList() {
				return this.images.map(item => item.url)
			}
		},
		onNavigationBarButtonTap() {
			this.$refs.share.open({
				title: this.info.title,
				shareText: this.info.title,
				href:"https://uniapp.dcloud.io",
				image: this.info.titlepic,
			})
		},
		onBackPress() {
			this.$refs.share.close()
		},
		methods: {
			__init(data) {
				// 修改标题
				uni.setNavigationBarTitle({
					title: data.title
				})
				this.info = data
				this.info.content = ''
				this.$H.get('/post/'+this.info.id).then(res => {
					this.info.content = res.detail.content
					this.images = res.detail.images
				})
			},
			// 点击评论
			doComment() {
				console.log('评论');
			},
			// 点击分享
			doShare() {
				console.log('分享');
			},
			// 关注
			follow() {
				this.info.isFollow = true
				uni.showToast({
					title: '关注成功'
				});
			},
			// 顶踩操作
			doSupport(e) {
				// 之前操作过
				if (this.info.support.type === e.type) {
					return uni.showToast({
						title: '你已经操作过了',
						icon: 'none'
					})
				}
				let msg = e.type === 'support' ? '顶' : '踩'
				// 之前没有操作
				if (this.info.support.type === '') {
					this.info.support[e.type + '_count']++
				} else if (this.info.support.type === 'support' && e.type === 'unsupport') {
					this.info.support.support_count--
					this.info.support.unsupport_count++
				} else if (this.info.support.type === 'unsupport' && e.type === 'support') {
					this.info.support.support_count++
					this.info.support.unsupport_count--
				}
				this.info.support.type = e.type
				uni.showToast({
					title: msg + '成功'
				});
			},
			// 预览图片
			preview(index) {
				uni.previewImage({
					current: index,
					urls: this.imagesList,
				});
			},
			// 提交评论
			submit(data) {
				console.log(data);
			}
		}
	}
</script>

<style>

</style>
