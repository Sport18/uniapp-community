<template>
	<view>
		<uni-nav-bar :border="false"></uni-nav-bar>
		<view class="iconfont icon-guanbi flex align-center justify-center font-lg" style="width: 100rpx; height: 100rpx;"
		 hover-class="bg-light" @click="back"></view>

		<view class="text-center" style="padding-top: 120rpx; padding-bottom: 70rpx; font-size: 55rpx;">
			{{status ? '手机验证登录' : '账号密码登录'}}
		</view>

		<view class="px-2">
			<template v-if="!status">
				<view class="mb-2">
					<input type="text" v-model="username" class="uni-input border-bottom" placeholder="昵称/手机号/邮箱" />
				</view>
				<view class="mb-2 flex align-stretch">
					<input type="text" v-model="password" class="uni-input border-bottom" placeholder="请输入密码" />
					<view class="border-bottom flex align-center justify-center font text-muted" style="width: 140rpx;">
						忘记密码
					</view>
				</view>
			</template>
			<template v-else>
				<view class="mb-2 flex">
					<view class="border-bottom flex align-center justify-center font px-2">
						+86
					</view>
					<input type="text" v-model="phone" class="uni-input border-bottom" placeholder="手机号" />
				</view>
				<view class="mb-2 flex align-stretch">
					<input type="text" v-model="code" class="uni-input border-bottom" placeholder="请输入验证码" />
					<view class="border-bottom flex align-center justify-center font-sm text-white" :class="codeTime > 0 ? 'bg-main-disabled' : 'bg-main'" style="width: 140rpx;" @click="getCode">
						{{codeTime > 0 ? codeTime + ' s' : '获取验证码'}}
					</view>
				</view>
			</template>
		</view>

		<view class="py-2 px-3">
			<button class="text-white" style="border-radius: 50rpx; border: 0;" type="primary" :disabled="disabled" :class="disabled ? 'bg-main-disabled' : 'bg-main'" @click="submit">登录</button>
		</view>
		
		<view class="flex align-center justify-center pt-2 pb-4">
			<view class="text-primary font-sm" @click="changeStatus">{{status ? '账号密码登录' : '验证码登录'}}</view>
			<text class="text-muted mx-2">|</text>
			<view class="text-primary font-sm">登录遇到问题</view>
		</view>
		
		<view class="flex align-center justify-center">
			<view style="height: 1rpx; background-color: #dddddd; width: 100rpx;"></view>
			<view class="mx-2 text-muted">社交账号登录</view>
			<view style="height: 1rpx; background-color: #dddddd; width: 100rpx;"></view>
		</view>
		
		<other-login></other-login>
		
		<view class="flex align-center justify-center text-muted">
			注册即代表同意<text class="text-primary">《xxx社区协议》</text>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue';
	import otherLogin from '@/components/common/other-login.vue';
	export default {
		components: {
			uniNavBar,
			otherLogin
		},
		data() {
			return {
				status: false,
				username: "",
				password: "",
				phone: "",
				code: "",
				codeTime: 0
			}
		},
		computed: {
			disabled() {
				if ((this.username === '' || this.password === '') && (this.phone === '' || this.code === '')) {
					return true
				}
				return false
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 初始化表单
			initForm() {
				this.username = ''
				this.password = ''
				this.phone = ''
				this.code = ''
			},
			// 切换登录方式
			changeStatus() {
				this.initForm()
				this.status = !this.status
			},
			// 获取验证码
			getCode() {
				// 防止重复获取
				if (this.codeTime > 0) {
					return
				}
				// 验证手机号
				if(!this.validate()) return
				// 倒计时
				this.codeTime = 3
				let timer = setInterval(() => {
					if (this.codeTime >= 1) {
						this.codeTime --
					} else {
						this.codeTime = 0
						clearInterval(timer)
					}
				}, 1000)
			},
			// 表单验证
			validate() {
				var mPattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}/;
				if(!mPattern.test(this.phone)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					})
					return false
				}
				return true
			},
			// 提交
			submit() {
				// 表单验证
				if(!this.validate()) return
				
				// 提交后端
				// 登录成功处理
			}
		}
	}
</script>

<style>

</style>
