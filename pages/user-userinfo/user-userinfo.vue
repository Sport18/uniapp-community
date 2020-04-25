<template>
	<view>
		<uni-list-item title="头像" @click="changeUserpic">
			<view slot="right" class="flex align-center">
				<image :src="userpic" style="width: 100rpx; height: 100rpx;" class="rounded-circle"></image>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="昵称">
			<view slot="right" class="flex align-center">
				<input class="uni-input text-right" v-model="username" />
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="性别" @click="changeSex">
			<view slot="right" class="flex align-center">
				<text slot="right">{{sexText}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<picker mode="date" :value="birthday" @change="onDateChange">
			<uni-list-item title="生日">
				<view slot="right" class="flex align-center">
					<text slot="right">{{birthday}}</text>
					<text class="iconfont icon-bianji1 ml-2"></text>
				</view>
			</uni-list-item>
		</picker>
		<uni-list-item title="情感" @click="changeEmotion">
			<view slot="right" class="flex align-center">
				<text slot="right">{{emotionText}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="职业" @click="changeJob">
			<view slot="right" class="flex align-center">
				<text slot="right">{{job}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="家乡" @click="showCityPicker">
			<view slot="right" class="flex align-center">
				<text slot="right">{{pickerText}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>

		<view class="py-2 px-3">
			<button class="bg-main text-white" style="border-radius: 50rpx; border: 0;" type="primary">完成</button>
		</view>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvuePicker" :deepLength="deepLength" :pickerValueDefault="cityPickerValueDefault"
		 @onConfirm="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-city-picker>
	</view>
</template>

<script>
	const sexArray = ['保密', '男', '女']
	const emotionArray = ['保密', '未婚', '已婚']
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	import mpvueCityPicker from '@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue';
	export default {
		components: {
			uniListItem,
			mpvueCityPicker
		},
		data() {
			return {
				userpic: '/static/default.jpg',
				username: '昵称',
				sex: 0,
				emotion: 0,
				job: "保密",
				birthday: "2019-03-23",
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 1],
				deepLength: 3,
				pickerText: ""
			}
		},
		provide() {
			return {
				list: this
			}
		},
		computed: {
			sexText() {
				return sexArray[this.sex]
			},
			emotionText() {
				return emotionArray[this.emotion]
			}
		},
		// 监听返回
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		// 监听页面卸载
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		methods: {
			// 修改头像
			changeUserpic() {
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					sourceType: ["album", "camera"],
					success: (res) => {
						this.userpic = res.tempFilePaths[0]
					}
				})
			},
			// 修改性别
			changeSex() {
				uni.showActionSheet({
					itemList: sexArray,
					success: (res) => {
						this.sex = res.tapIndex
					}
				});
			},
			// 修改情感
			changeEmotion() {
				uni.showActionSheet({
					itemList: emotionArray,
					success: (res) => {
						this.emotion = res.tapIndex
					}
				});
			},
			// 修改职业
			changeJob() {
				let JobArray = ['IT', '教师', '农民']
				uni.showActionSheet({
					itemList: JobArray,
					success: (res) => {
						this.job = JobArray[res.tapIndex]
					}
				});
			},
			// 修改生日
			onDateChange(e) {
				this.birthday = e.detail.value
			},
			// 打开三级联动选择器
			showCityPicker() {
				this.$refs.mpvuePicker.show();
			},
			// 三级联动提交事件
			onConfirm(e) {
				this.pickerText = e.label
			},
		}
	}
</script>

<style>

</style>
