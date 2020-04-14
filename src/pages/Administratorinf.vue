<template>
  <div>
    <div style="width: 100%;height: 50px">
      <el-button type="primary" round @click="btn2" style="float: left;margin-top: 5px;margin-left: 30px">刷新</el-button>
      <el-button type="primary" round @click="btnquery" style="margin-top: 5px;float: right;margin-left: 10px;margin-right: 10px">查询信息</el-button>
      <el-input v-model="flashPromotion_query.staffdata" style="width: 250px;float: right;margin-top: 5px;" :placeholder=placeholder @focus="blurSearchFor()" @blur="blurSear" v-if="showinput"></el-input>
    </div>
    <el-row v-for="(item, index) in infdata"
            :key="index">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>管理员信息</span>
          <el-button style="float: right; padding: 3px 0;margin-right: 15px" type="text" @click="modify(index)">重置密码</el-button>
        </div>
        <div style="margin-bottom: 5px">
          用户名：{{item.username}}
        </div>
        <div style="margin-bottom: 5px">
          姓名： {{item.name}}
        </div>
        <div style="margin-bottom: 5px">
          电话：{{item.phone}}
        </div>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui'
export default {
  name: 'Administratorinf',
  data () {
    var checkOldpass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
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
      infdata: [],
      dialogFormVisible: false,
      bossname: [],
      staffname: '',
      ruleForm: {
        password: '',
        checkPass: '',
        Oldpass: ''
      },
      rls: {
        password: [{ validator: vapass, trigger: 'blur' }],
        checkPass: [{ validator: varepass, trigger: 'blur' }],
        Oldpass: [{ validator: checkOldpass, trigger: 'blur' }]
      },
      flashPromotion_query: {
        staffdata: ''
      },
      showinput: true,
      placeholder: '可以根据姓名,工号,用户名模糊查询'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.showinput = true
      this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationList', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          param: '1'
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.infdata = res.data.data
        }
        if (res.data.code === 401) {
          console.log('服务器错误')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    modify (index) {
      this.staffname = this.infdata[index].username
      let namedata = {}
      namedata.username = this.staffname
      let name = this.$qs.stringify(namedata)
      let message = '确定重置用户名为：' + this.infdata[index].username + '的账号吗?'
      MessageBox.confirm(message, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: 'http://47.112.255.207:8081/resetPassword',
          data: name,
          Headers: {
            'Authorization': ' '
          },
          crossDomain: true
        }).then(res => {
          if (res.data.code === 200) {
            alert('重置成功')
          }
          if (res.data.code === 401) {
            alert('服务器错误')
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch()
    },
    btnquery () {
      if (this.flashPromotion_query.staffdata === '') {
      } else {
        this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationByUsernameOrName', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            param: this.flashPromotion_query.staffdata,
            status: 1
          },
          crossDomain: true
        }).then(res => {
          this.infdata = []
          console.log(res.data.data)
          if (res.data.code === 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].uid === 1) {
                this.infdata.push(res.data.data[i])
              } else {
              }
            }
            this.showinput = false
            this.flashPromotion_query.staffdata = ''
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    blurSearchFor () {
      if (this.placeholder === '可以根据姓名,用户名模糊查询') {
        this.placeholder = ''
      }
    },
    blurSear () {
      this.placeholder = '可以根据姓名,工号,用户名模糊查询'
    },
    btn2 () {
      this.init()
    },
    query (index) {
      this.$store.commit('addbossnamebystaff', {bossname: this.infdata[index].username})
      this.$router.push('/information')
    }
  }
}
</script>

<style>
  .box-card {
    margin: 0 auto;
    margin-top: 10px;
    width: 80%;
  }
</style>
