<template>
	<view>
		<!-- 时间戳 -->
		<view v-if="shortTime" class="py-2 flex align-center justify-center font-sm text-light-muted">
			{{shortTime}}
		</view>
		<!-- 消息气泡 -->
		<view class="flex align-start px-2" :style="isSelf ? 'flex-direction: row-reverse;' : ''">
			<image :src="item.avator" style="width: 100rpx; height: 100rpx;" class="rounded-circle"></image>
			<view class="bg-light p-2 rounded mx-2" style="max-width: 400rpx;">
				{{item.data}}
			</view>
		</view>
	</view>
	
</template>

<script>
	// 模拟当前用户的userid
	const uid = 1;
	import $T from '@/common/time.js';
	export default {
		props: {
			item: Object,
			index: Number,
			pretime: [Number,String]
		},
		computed: {
			// 是否是登录用户本人
			isSelf() {
				return uid === this.item.user_id
			},
			// 转化时间
			shortTime() {
				return $T.getChatTime(this.item.create_time, this.pretime)
			}
		}
	}
</script>

<style>
</style>
