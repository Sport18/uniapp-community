<template>
	
	<!-- 样式列表 -->
	<view class="p-2 flex align-center border-bottom border-light-secondary" hover-class="bg-light">
		<image :src="item.avatar" class="rounded-circle mr-2" style="width: 100rpx; height: 100rpx;"></image>
		<view class="flex flex-column flex-1">
			<text class="font-md text-dark">{{item.username }}</text>
			<uni-badge :text="item.age" :type="item.sex === 1 ? 'error' : 'primary'" size="small">
				<text v-if="item.sex > 0" class="iconfont text-white font-sm mr-1" style="margin-right: 5rpx;" :class="item.sex === 1 ? 'icon-nv' : 'icon-nan'"></text>
			</uni-badge>
		</view>
		<view class="uni-icon uni-icon-checkbox-filled text-light-muted" :class="item.isFollow ? 'text-light-muted' : 'text-main'"></view>
	</view>
	
</template>

<script>
	import uniBadge from '@/components/uni-ui/uni-badge/uni-badge.vue';
	export default {
		components: {
			uniBadge
		},
		props: {
			item: Object,
			index: Number
		},
	}
</script>

<style>
</style>
