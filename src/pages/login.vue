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
          <el-input type="password" v-model="loginForm.password" autocomplete="off" style="width: 100%"></el-input>
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
        password: ''
      },
      ruls: {
        password: [{ validator: vapass, trigger: 'blur' }],
        username: [{ validator: checkUser, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    login () {
      let _this = this
      this.$axios({
        method: 'post',
        url: '/login/check',
        data: _this.loginForm,
        Headers: {
          'Authorization': ' '
        }
      }).then(res => {
        _this.userToken = res.data.data
        console.log(this.userToken)
        _this.changeLogin({ Authorization: this.userToken })
        sessionStorage.setItem('name', _this.loginForm.username)
        _this.$router.push('/home')
        alert('登陆成功')
      }).catch(error => {
        _this.$router.push('/home')
        console.log('登录失败')
        alert('登录失败')
        console.log(error)
      })
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
