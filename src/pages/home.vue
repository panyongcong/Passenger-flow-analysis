<template>
  <div class="home-main" style="height: 100%;position:absolute;
    width: 100%">
    <el-container class="index-container">
      <el-aside width="15%" style="height: 100%">
        <div class="name">
          <div style="padding-top: 10px;color: #fbfdff">
            用户名：{{username}}
            <div style="float: right;">
              <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">个人信息</el-dropdown-item>
                  <el-dropdown-item command="b">修改密码</el-dropdown-item>
                  <el-dropdown-item command="c" v-if="showres">管理员注册</el-dropdown-item>
                  <el-dropdown-item command="d">修改信息</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <Menu style="width: 100%;height: 94%"></Menu>
      </el-aside>
      <el-container>
        <el-header style="width: 100%;padding: 0;height: 41px">
          <div style="width: 100%;height: 41px;background-color: #263A4A">
            <div style="float: left;margin-top:5px;margin-left: 150px;margin-right: 5px">
              <img src="../assets/images/an.png">
            </div>
            <div style="float: left;color: white;margin-top: 10px;font-size: 20px">人流量分析系统</div>
            <el-button icon="el-icon-circle-close" style="float: right;background-color: #263A4A;border: 1px solid #263A4A;color: #fbfdff" @click="backup">退出</el-button>
          </div>
        </el-header>
        <el-main style="padding: 0;">
          <appMain></appMain>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="账号信息"
      :visible.sync="dialogVisible"
      width="30%">
      <div style="margin-bottom: 30px;font-size: 15px;margin-left: 30px">姓名：{{Realname}}</div>
      <div style="font-size: 15px;margin-left: 30px">手机号码：{{PhoneNumber}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="账号信息"
      :visible.sync="dialogVisible_staff"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false">
      <div style="margin-bottom: 15px;font-size: 15px;margin-left: 30px;border-top: 1px black">用户姓名：{{Realname}}</div>
      <div style="margin-bottom: 15px;font-size: 15px;margin-left: 30px">手机号码：{{PhoneNumber}}</div>
      <div style="margin-bottom: 15px;font-size: 15px;margin-left: 30px">入职工号：{{worknumber}}</div>
      <div style="margin-left: 30px;font-size: 15px;float: left;margin-top: 10px">入职日期：</div>
      <el-date-picker
        style="z-index: 1;float: left;width: 150px"
        v-model="workdata"
        size="small"
        align="right"
        type="date"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <span slot="footer" class="dialog-footer" style="margin-top: 10px">
        <el-button @click="dialogVisible_staff = false">取 消</el-button>
        <el-button type="primary" @click="btn">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               width="40%">
      <el-form :model="ruleForm"
               :rules="rls"
               ref="ruleForm"
               label-width="150px">
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
    <el-dialog title="注册管理员账号" :visible.sync="dialogFormregister"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :show-close="false"
               width="40%">
      <el-form :model="formedit" :rules="ruleregister" label-width="150px" size="small">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="formedit.username" autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formedit.password" autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="formedit.checkPass" autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormregister = false">取 消</el-button>
        <el-button type="primary" @click="btnresgister">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="填写个人信息" :visible.sync="dialogFormeditboss"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :show-close="false"
               width="40%">
      <el-form :model="form" :rules="rules" label-width="150px" size="small">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="form.phone" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormeditboss = false">取 消</el-button>
        <el-button type="primary" @click="editinf">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="填写个人信息" :visible.sync="dialogFormeditstaff"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :show-close="false"
               width="40%">
      <el-form :model="formstaff" :rules="rulesstaff" label-position="right" label-width="150px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formstaff.name" autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="formstaff.phone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="job_number">
          <el-input v-model="formstaff.job_number" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="入职日期" prop="entry_time">
          <el-date-picker
            style="width: 250px"
            v-model="formstaff.entry_time"
            size="big"
            align="right"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormeditstaff = false">取 消</el-button>
        <el-button type="primary" @click="editinf">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import appMain from './components/appMain'
import Menu from './components/Menu'
import { MessageBox } from 'element-ui'
export default {
  name: 'Homepage',
  components: {
    Menu,
    appMain
  },
  data () {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'))
      } else {
        callback()
      }
    }
    var checktime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('入职时间不能为空'))
      } else {
        callback()
      }
    }
    var checkjob = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('工号不能为空'))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
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
    var vapass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formedit.checkPass !== '') {
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
    var varepass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formedit.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      username: '',
      dialogFormeditboss: false,
      dialogFormeditstaff: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogVisible_staff: false,
      dialogFormregister: false,
      Realname: '',
      PhoneNumber: '',
      worknumber: '',
      workdata: '',
      gitdata: {},
      ruleForm: {
        password: '',
        checkPass: '',
        Oldpass: ''
      },
      form: {
        name: '',
        phone: ''
      },
      formstaff: {
        name: '',
        phone: '',
        job_number: '',
        entry_time: ''
      },
      formedit: {
        username: '',
        password: '',
        checkPass: ''
      },
      rls: {
        password: [{ validator: vapass, trigger: 'blur' }],
        checkPass: [{ validator: varepass, trigger: 'blur' }],
        Oldpass: [{ validator: checkOldpass, trigger: 'blur' }]
      },
      rules: {
        name: [{validator: checkUser, trigger: 'change'}],
        phone: [{validator: checkPhone, trigger: 'change'}]
      },
      rulesstaff: {
        name: [{validator: checkUser, trigger: 'change'}],
        phone: [{validator: checkPhone, trigger: 'change'}],
        job_number: [{validator: checkjob, trigger: 'change'}],
        entry_time: [{validator: checktime, trigger: 'change'}]
      },
      showres: false,
      ruleregister: {
        username: [{validator: checkUser, trigger: 'blur'}],
        password: [{ validator: vapass1, trigger: 'blur' }],
        checkPass: [{ validator: varepass1, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.username = localStorage.getItem('name')
      let role = localStorage.getItem('userRole')
      if (role === 'boss') {
        this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationByUsername', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            username: this.username
          },
          crossDomain: true
        }).then(res => {
          console.log(res.data.code)
          if (res.data.code === 200) {
            this.Realname = res.data.data.name
            this.PhoneNumber = res.data.data.phone
          }
          if (res.data.code === 201) {
            this.dialogFormeditboss = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (role === 'staff') {
        this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationByUsername', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            username: this.username
          },
          crossDomain: true
        }).then(res => {
          console.log(res.data.code)
          if (res.data.code === 200) {
            this.Realname = res.data.data.name
            this.PhoneNumber = res.data.data.phone
            this.worknumber = res.data.data.job_number
            this.workdata = res.data.data.entry_time
          }
          if (res.data.code === 201) {
            this.dialogFormeditstaff = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (role === 'admin') {
        this.showres = true
        this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationByUsername', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            username: this.username
          },
          crossDomain: true
        }).then(res => {
          console.log(res.data.code)
          if (res.data.code === 200) {
            this.Realname = res.data.data.name
            this.PhoneNumber = res.data.data.phone
          }
          if (res.data.code === 201) {
            this.dialogFormeditboss = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    backup () {
      let mes = '确定退出：' + this.username + '账号吗?'
      MessageBox.confirm(mes, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
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
      }).catch()
    },
    handleCommand (command) {
      let role = localStorage.getItem('userRole')
      if (command === 'a') {
        if (role === 'boss' || role === 'admin') {
          this.init()
          this.dialogVisible = true
        }
        if (role === 'staff') {
          this.init()
          this.dialogVisible_staff = true
        }
      }
      if (command === 'b') {
        this.dialogFormVisible = true
      }
      if (command === 'c') {
        this.dialogFormregister = true
      }
      if (command === 'd') {
        if (role === 'boss' || role === 'admin') {
          this.form.phone = this.PhoneNumber
          this.form.name = this.Realname
          this.dialogFormeditboss = true
        }
        if (role === 'staff') {
          this.formstaff.phone = this.PhoneNumber
          this.formstaff.name = this.Realname
          this.formstaff.job_number = this.worknumber
          this.formstaff.entry_time = this.workdata
          this.dialogFormeditstaff = true
        }
      }
    },
    btn () {
      this.dialogVisible_staff = false
      this.gitdata.username = this.username
      this.gitdata.job_number = this.worknumber
      this.gitdata.name = this.Realname
      this.gitdata.phone = this.phone
      this.gitdata.entry_time = this.workdata
      let loginForm = this.$qs.stringify(this.gitdata)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/editPersonal_Information',
        data: loginForm,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          console.log('成功')
        }
        if (res.data.code === 401) {
          console.log('失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    btnmodify () {
      if (this.ruleForm.Oldpass === '' || this.ruleForm.password === '' || this.ruleForm.checkPass === '') {
      } else {
        let mes = '确定修改：' + this.username + '的密码吗?'
        MessageBox.confirm(mes, '提示', {
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonClass: '取消',
          type: 'warning'
        }).then(() => {
          let datamodify = {}
          datamodify.username = this.username
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
              this.again()
            }
            if (res.data.code === 401) {
              console.log('操作失败')
            }
            if (res.data.code === 402) {
              alert('原密码错误')
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
        })
      }
    },
    again () {
      this.$axios.get('http://47.112.255.207:8081/logout', {
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          alert('修改成功请重新登录')
          this.$router.push('/')
        }
        if (res.data.code === 401) {
          alert('退出失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    editinf () {
      let editdata = {}
      let role = localStorage.getItem('userRole')
      if (role === 'boss' || role === 'admin') {
        let phone = this.form.phone
        let flagphone = false
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
          flagphone = false
        } else {
          flagphone = true
        }
        if (this.form.name === '' || this.form.phone === '' || flagphone === false) {
        } else {
          var aData = new Date()
          let value = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
          editdata.username = this.username
          editdata.job_number = ''
          editdata.name = this.form.name
          editdata.phone = this.form.phone
          editdata.entry_time = value
          editdata = this.$qs.stringify(editdata)
          this.$axios({
            method: 'post',
            url: 'http://47.112.255.207:8081/editPersonal_Information',
            data: editdata,
            Headers: {
              'Authorization': ' '
            },
            crossDomain: true
          }).then(res => {
            if (res.data.code === 200) {
              this.dialogFormeditboss = false
            }
            if (res.data.code === 401) {
              console.log('失败')
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
      if (role === 'staff') {
        let phone1 = this.formstaff.phone
        let flagphone1 = false
        if (!(/^1[3456789]\d{9}$/.test(phone1))) {
          flagphone1 = false
        } else {
          flagphone1 = true
        }
        if (this.formstaff.job_number === '' || this.formstaff.name === '' || this.formstaff.phone === '' || this.formstaff.entry_time === '' || flagphone1 === false) {
        } else {
          editdata.username = this.username
          editdata.job_number = this.formstaff.job_number
          editdata.name = this.formstaff.name
          editdata.phone = this.formstaff.phone
          editdata.entry_time = this.formstaff.entry_time
          editdata = this.$qs.stringify(editdata)
          this.$axios({
            method: 'post',
            url: 'http://47.112.255.207:8081/editPersonal_Information',
            data: editdata,
            Headers: {
              'Authorization': ' '
            },
            crossDomain: true
          }).then(res => {
            if (res.data.code === 200) {
              this.dialogFormeditstaff = false
            }
            if (res.data.code === 401) {
              console.log('失败')
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    btnresgister () {
      let registerdata = {}
      registerdata.uid = 1
      registerdata.username = this.formedit.username
      registerdata.password = this.formedit.password
      registerdata.address = ''
      registerdata.bossname = ''
      registerdata = this.$qs.stringify(registerdata)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/register',
        data: registerdata,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        this.dialogFormregister = false
        if (res.data.code === 402) {
          alert('你所注册的用户名已经存在')
        }
        if (res.data.code === 403) {
          alert('注册失败，请与管理员联系')
        }
        if (res.data.code === 200) {
          alert('注册成功')
        }
      }).catch(error => {
        console.log('登录失败')
        console.log(error)
      })
    }
  }
}
</script>
<style>
  .index-container {
    height: 100%;
  }
  .name {
    width: 100%;
    height: 6%;
    background-color: #263A4A;
    font-size: 18px;
    text-align: center;
  }
  .el-icon-arrow-down {
    font-size: 12px;
    color: white;
  }
  .el-dialog__body {
    border-top: 1px solid black;
  }
</style>
