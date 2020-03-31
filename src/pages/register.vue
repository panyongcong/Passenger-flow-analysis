<template>
  <div class="register">
    <div>
      <el-button type="primary" icon="el-icon-back" style="background-color: white;color: black;border: 0px solid #263A4A;margin: 10px" @click="backup">返回</el-button>
    </div>
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
        <el-form-item label="角色">
          <el-select v-model="ruleForm.uid" placeholder="请选择角色" style="width: 100%" @change="changeselect">
            <el-option label="店员" value="3"></el-option>
            <el-option label="店长" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店主用户名" style="width: 100%" v-if="ok">
          <el-input id="shoppowner_name" v-model="ruleForm.Shopowner_name" @change="getaddress()"></el-input>
        </el-form-item>
        <el-form-item label="店铺位置" style="width: 100%" v-if="ok">
          <el-select v-model="ruleForm.address" placeholder="请选择位置" style="width: 100%">
            <el-option v-for="(item, index) in shopaddress"
                       :key="index"
                       :value="item.label"
                       :label="item.label"></el-option>
          </el-select>
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
        username: '',
        uid: '',
        Shopowner_name: '',
        address: ''
      },
      rls: {
        password: [{ validator: vapass, trigger: 'blur' }],
        checkPass: [{ validator: varepass, trigger: 'blur' }],
        username: [{ validator: checkUser, trigger: 'blur' }]
      },
      ok: false,
      shopaddress: []
    }
  },
  methods: {
    backup () {
      this.$router.push('/')
    },
    submitForm (formName) {
      let _this = this
      console.log(_this.ruleForm)
      let registerForm = {}
      if (_this.ruleForm.uid === '2') {
        registerForm.uid = _this.ruleForm.uid
        registerForm.username = _this.ruleForm.username
        registerForm.password = _this.ruleForm.password
        registerForm.address = ''
      }
      if (_this.ruleForm.uid === '3') {
        registerForm.uid = _this.ruleForm.uid
        registerForm.username = _this.ruleForm.username
        registerForm.password = _this.ruleForm.password
        registerForm.address = _this.ruleForm.address
      }
      registerForm = this.$qs.stringify(registerForm)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/register',
        data: registerForm,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 401) {
          alert('注册店员身份要查询店主的店铺,并且选择店铺进行绑定')
        }
        if (res.data.code === 402) {
          alert('你所注册的用户名已经存在')
        }
        if (res.data.code === 403) {
          alert('注册失败，请与管理员联系')
        }
        if (res.data.code === 200) {
          this.$router.push('/')
          alert('注册成功')
        }
      }).catch(error => {
        console.log('登录失败')
        alert('登录失败')
        console.log(error)
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    changeselect (value) {
      if (value === '3') {
        this.ok = true
      } else {
        this.ok = false
      }
    },
    getaddress () {
      this.$axios.get('http://47.112.255.207:8081/findShopByBossName', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: this.ruleForm.Shopowner_name
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 401) {
          alert('该店主还没有添加任何店铺,或者该店主还没有注册请核对店主信息')
        }
        if (res.data.code === 402) {
          alert('查询店铺失败')
        }
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.address.length; i++) {
            let add = {}
            add.value = i
            add.label = res.data.data.address[i]
            this.shopaddress.push(add)
          }
          console.log(this.shopaddress)
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
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
    margin-top: 100px;
    width: 30%;
    height: 40%;
    margin-left: 33%;
    padding: 20px 20px;
  }
</style>
