import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    rssi: '-50',
    leastRssi: '-100',
    shopname: '',
    shopflag: false,
    bossname: '',
    staffname: '',
    name: ''
  },
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization
      console.log('store/index.js---到这里了!')
      localStorage.setItem('Authorization', user.Authorization)
    },
    addrssi (state, user) {
      state.rssi = user.rssi
      state.leastRssi = user.leastRssi
    },
    addshopname (state, user) {
      state.shopname = user.shopname
    },
    addshopflag (state, user) {
      state.shopflag = user.shopflag
    },
    addbossnamebystaff (state, user) {
      state.bossname = user.bossname
    },
    addstaffname (state, user) {
      state.staffname = user.staffname
    },
    addname (state, user) {
      state.name = user.name
    }
  }
})
