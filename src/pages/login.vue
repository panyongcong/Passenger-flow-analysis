<template>
  <div class="login">
    <div class="login-con">
      <el-form
        style="margin-top: 40px"
        :model="loginForm"
        status-icon
        :rules="ruls"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.number="loginForm.username" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off" style="width: 100%" @blur="getloginaddress"></el-input>
        </el-form-item>
        <el-form-item label="店铺位置" style="width: 100%" v-if="ok">
          <el-select v-model="loginForm.address" placeholder="请选择位置" style="width: 100%">
            <el-option v-for="(item, index) in addressdata"
                       :key="index"
                       :value="item.label"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width: 70%">登录</el-button>
          <el-button @click="rgister" style="width: 24%">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Homelogin',
  data () {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    var vapass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        address: ''
      },
      ruls: {
        password: [{ validator: vapass, trigger: 'blur' }],
        username: [{ validator: checkUser, trigger: 'blur' }]
      },
      addressdata: [],
      ok: false,
      flag: false
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    getloginaddress () {
      if (this.loginForm.username === '' || this.loginForm.password === '') { // 失去焦点用户名和密码都不为空时获取店铺地址
      } else {
        let _this = this
        let loginForm = this.$qs.stringify(this.loginForm)
        this.$axios({
          method: 'post',
          url: 'http://47.112.255.207:8081/loginUser',
          data: loginForm,
          Headers: {
            'Authorization': ' '
          },
          crossDomain: true
        }).then(res => {
          _this.userToken = res.data.data.token
          sessionStorage.setItem('name', _this.loginForm.username)
          console.log(res.data.data.token)
          console.log(res.data.data.uid)
          _this.changeLogin({ Authorization: this.userToken })
          if (res.data.code === 200) {
            _this.flag = true
            if (res.data.data.uid === '1') {
              let UserRole = 'admin'
              localStorage.setItem('userRole', UserRole)
            }
            if (res.data.data.uid === '2') {
              let UserRole = 'boss'
              localStorage.setItem('userRole', UserRole)
              this.getbossaddress()
            }
            if (res.data.data.uid === '3') {
              _this.loginForm.address = res.data.data.address
              let UserRole = 'staff'
              localStorage.setItem('userRole', UserRole)
            }
          }
          if (res.data.code === 401) {
          }
        }).catch(error => {
          console.log('登录失败')
          console.log(error)
        })
      }
    },
    getbossaddress () {
      this.$axios({
        method: 'get',
        url: 'http://47.112.255.207:8081/findShop',
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 200) {
          console.log(res.data.data.length)
          console.log(res.data.data)
          for (let i = 0; i < res.data.data.length; i++) {
            let add = {}
            add.value = i
            add.label = res.data.data[i].address
            console.log(add)
            this.addressdata.push(add)
          }
          console.log(this.addressdata)
          this.ok = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    login () {
      if (this.flag === true) {
        if (this.loginForm.address === '') {
          alert('请选择店铺位置')
        } else {
          localStorage.setItem('address', this.loginForm.address)
          localStorage.setItem('username', this.loginForm.username)
          this.$router.push('/system')
        }
      }
      if (this.flag === false) {
        alert('账号或密码错误')
      }
    },
    rgister () {
      let _this = this
      _this.$router.push('/register')
    }
  }
}
</script>
<style>
  .login {
    position:absolute;
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/beijing.jpg");
    background-repeat: no-repeat;
    background-size:100% 100%;
  }
  .login-con{
    margin-top: 200px;
    width: 30%;
    height: 40%;
    margin-left: 33%;
    padding: 20px 20px;
  }
</style>
