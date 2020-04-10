<template>
  <div v-if="showpage">
    <div style="width: 100%;height: 50px">
      <el-button type="primary" icon="el-icon-back" circle @click="backup" style="background-color: white;color: black;border: 0;float: left;margin-top: 5px;margin-left: 30px" v-if="showback"></el-button>
      <el-button type="primary" round @click="btn2" style="float: left;margin-top: 5px;margin-left: 30px">刷新</el-button>
      <el-button type="primary" round @click="btnquery" style="margin-top: 5px;float: right;margin-left: 10px;margin-right: 10px">查询信息</el-button>
      <el-input v-model="flashPromotion_query.staffdata" style="width: 250px;float: right;margin-top: 5px;" :placeholder=placeholder @focus="blurSearchFor()" @blur="blurSear" v-if="showinput"></el-input>
    </div>
    <div>
      <el-row v-for="(item, index) in infdata"
              :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>店员信息</span>
            <el-button style="float: right; padding: 3px 0;color: red" type="text" @click="del(index)">删除用户</el-button>
            <el-button style="float: right; padding: 3px 0;margin-right: 15px" type="text" @click="modify(index)">修改密码</el-button>
          </div>
          <div style="margin-bottom: 5px">
            用户名：{{item.username}}
          </div>
          <div style="margin-bottom: 5px">
            工号：{{item.job_number}}
          </div>
          <div style="margin-bottom: 5px">
            姓名： {{item.name}}
          </div>
          <div style="margin-bottom: 5px">
            电话：{{item.phone}}
          </div>
          <div style="margin-bottom: 5px">
            入职时间：{{item.entry_time}}
          </div>
          <div style="margin-bottom: 5px">
            工号：{{item.job_number}}
          </div>
          <div>
            账号密码：{{item.password}}
          </div>
        </el-card>
      </el-row>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               width="40%">
      <el-form :model="ruleForm"
               :rules="rls"
               ref="ruleForm">
        <el-form-item label="旧密码" prop="Oldpass">
          <el-input type="password" v-model="ruleForm.Oldpass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnmodify">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
export default {
  name: 'information',
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
      showpage: false,
      showback: false,
      dialogFormVisible: false,
      staffname: '',
      ruleForm: {
        password: '',
        checkPass: '',
        showinput: true,
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
      let role = localStorage.getItem('userRole')
      if (role === 'admin') {
        this.showback = true
      }
      this.showinput = true
      this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationList', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          param: this.$store.state.bossname
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        console.log(res.data.data)
        if (res.data.code === 200) {
          this.showpage = true
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].uid === 3) {
              this.infdata.push(res.data.data[i])
            } else {
            }
          }
          if (this.infdata.length === 0) {
            Message.warning('查找失败')
          }
        }
        if (res.data.code === 401) {
          console.log('服务器错误')
        }
        if (res.data.code === 443) {
          this.showpage = false
          this.$router.push('/Noauthority')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    modify (index) {
      this.staffname = this.infdata[index].username
      this.dialogFormVisible = true
    },
    btnmodify () {
      if (this.ruleForm.Oldpass === '' || this.ruleForm.password === '' || this.ruleForm.checkPass === '') {
      } else {
        let mes = '确定修改：' + this.staffname + '的密码吗?'
        MessageBox.confirm(mes, '提示', {
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonClass: '取消',
          type: 'warning'
        }).then(() => {
          let datamodify = {}
          datamodify.username = this.staffname
          datamodify.password = this.ruleForm.Oldpass
          datamodify.newPassword = this.ruleForm.password
          datamodify = this.$qs.stringify(datamodify)
          this.$axios({
            method: 'post',
            url: 'http://47.112.255.207:8081/updatePassword',
            data: datamodify,
            Headers: {
              'Authorization': ' '
            },
            crossDomain: true
          }).then(res => {
            if (res.data.code === 200) {
              this.dialogFormVisible = false
              this.init()
            }
            if (res.data.code === 401) {
              console.log('操作失败')
            }
            if (res.data.code === 402) {
              console.log('原密码错误')
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
        })
      }
    },
    btnquery () {
      this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationByUsernameOrName', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          param: this.flashPromotion_query.staffdata
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.infdata = res.data.data
          this.showinput = false
          this.flashPromotion_query.staffdata = ''
        }
      }).catch(err => {
        console.log(err)
      })
    },
    blurSearchFor () {
      if (this.placeholder === '可以根据姓名,工号,用户名模糊查询') {
        this.placeholder = ''
      }
    },
    blurSear () {
      this.placeholder = '可以根据姓名,工号,用户名模糊查询'
    },
    btn2 () {
      this.init()
    },
    backup () {
      this.$router.push('/informationadmin')
    },
    del (index) {
      let message = '确定用户名为：' + this.infdata[index].username + '的账号吗?'
      MessageBox.confirm(message, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        var param = {uid: 3, username: this.infdata[index].username}
        this.$axios.delete('http://47.112.255.207:8081/deleteUser', {params: param}).then(res => {
          if (res.data.code === 200) {
            this.init()
            alert('删除成功')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
          if (res.data.code === 401) {
            alert('删除失败')
          }
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
      }).catch()
    }
  }
}
</script>

<style>
  .box-card {
    margin: 0 auto;
    margin-top: 5px;
    width: 80%;
  }
</style>
