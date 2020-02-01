<template>
  <div class="register">
    <div class="register-con">
      <el-form
        style="margin-top: 20px"
        :model="ruleForm"
        status-icon
        :rules="rls"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.number="ruleForm.username" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 70%">注册</el-button>
          <el-button @click="resetForm('ruleForm')" style="width: 24%">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'register',
  data () {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    var vapass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var varepass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        password: '',
        checkPass: '',
        username: ''
      },
      rls: {
        password: [{ validator: vapass, trigger: 'blur' }],
        checkPass: [{ validator: varepass, trigger: 'blur' }],
        username: [{ validator: checkUser, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      this.$axios({
        method: 'post',
        url: '/register',
        data: _this.ruleForm
      }).then(function (res) {
        if (res.code === '500') {
          alert('用户名已被占用')
        } else {
          alert('注册成功')
          _this.$router.push('/')
        }
      }).catch(function (err) {
        console.log(err)
        alert('注册失败')
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>
  .register {
    position:absolute;
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/rback.jpeg");
    background-repeat: no-repeat;
    background-size:100% 100%;
  }
  .register-con{
    border: 1px solid #ccc;
    background-color: white;
    margin-top: 200px;
    width: 30%;
    height: 40%;
    margin-left: 33%;
    padding: 20px 20px;
  }
</style>
