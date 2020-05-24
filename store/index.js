import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) 

export default new Vuex.Store({
	state: {
		// 登录状态
		loginStatus: false,
		user: {
			// "id": 7,
			// "username": "zcs",
			// "userpic": "https://ceshi2.dishait.cn//uploads/20200115/d72df651d52ae5af9d9ff9b416ced797.jpg",
			// "password": true,
			// "phone": "17674026323",
			// "email": "123@163.com",
			// "status": 1,
			// "create_time": null,
			// "logintype": "username",
			// "token": "684a01b64e867e1ec377a6472302ca3e690e4dde",
			// "userinfo": {
			// 	"id": 1,
			// 	"user_id": 7,
			// 	"age": 23,
			// 	"sex": 2,
			// 	"qg": 1,
			// 	"job": "IT",
			// 	"path": "吉林省-长春市-南关区",
			// 	"birthday": "1996-06-29"
			// }
		}
	},
	mutations: {
		
	}
})