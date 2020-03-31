<template>
  <div class="login">
    <div class="login-con">
      <div style="float: left;margin-top:5px;margin-left: 140px;margin-right: 5px">
        <img src="../assets/images/an.png">
      </div>
      <div style="float: left;color: white;margin-top: 10px;font-size: 20px;text-align: center;">人流量分析系统</div>
      <el-form
        style="margin-top: 40px;width: 100%;margin-top: 50px"
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
          <el-input type="password" v-model="loginForm.password" autocomplete="off" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button type="primary" @click="login" style="width: 45%">登录</el-button>
          <el-button @click="rgister" style="width:45%;float: right">注册</el-button>
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
  created () {
    this.init()
  },
  methods: {
    ...mapMutations(['changeLogin']),
    init () {
      this.$axios.get('http://47.112.255.207:8081/logout', {
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.$router.push('/')
        }
        if (res.data.code === 401) {
          alert('退出失败')
        }
      }).catch(error => {
        console.log(error)
      })
      localStorage.removeItem('Authorization')
      this.$store.commit('addshopflag', {shopflag: false})
    },
    login () {
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        alert('账号和密码不能为空')
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
          _this.changeLogin({ Authorization: this.userToken })
          if (res.data.code === 200) {
            localStorage.setItem('name', this.loginForm.username)
            _this.flag = true
            if (res.data.data.uid === '1') {
              let UserRole = 'admin'
              this.ok = false
              localStorage.setItem('userRole', UserRole)
              _this.$router.push('/profile')
            }
            if (res.data.data.uid === '2') {
              let UserRole = 'boss'
              localStorage.setItem('userRole', UserRole)
              _this.$router.push('/system')
            }
            if (res.data.data.uid === '3') {
              localStorage.setItem('address', res.data.data.address)
              let UserRole = 'staff'
              localStorage.setItem('userRole', UserRole)
              _this.$router.push('/system')
            }
          }
          if (res.data.code === 401) {
            alert('账号密码错误')
          }
        }).catch(error => {
          alert('登录失败')
          console.log('登录失败')
          console.log(error)
        })
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
