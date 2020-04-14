<template>
  <div class="aside-container">
    <el-row class="tac">
      <el-col :span="10" style="width: 100%;height: 100%">
        <el-menu
          router
          class="el-menu-vertical-demo"
          default-active="/system"
          background-color="#2F4050"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item index="/system" v-if="ok" style="width: 100%">
            <i class="el-icon-s-home"></i>
            <span slot="title">客流信息</span>
          </el-menu-item>
          <el-menu-item index="/shopinfo" v-if="ok">
            <i class="el-icon-location-outline"></i>
            <span slot="title">门店分布</span>
          </el-menu-item>
          <el-menu-item index="/probeinfo" v-if="ok">
            <i class="el-icon-setting"></i>
            <span slot="title">设备管理</span>
          </el-menu-item>
          <el-menu-item index="/profile" v-if="okadmin">
            <i class="el-icon-view"></i>
            <span slot="title">页面管理</span>
          </el-menu-item>
          <el-submenu index="1" v-if="okadmin">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/informationadmin">
                <i class="el-icon-s-custom"></i>
                <span slot="title">店主管理</span>
              </el-menu-item>
              <el-menu-item index="/Administratorinf">
                <i class="el-icon-s-custom"></i>
                <span slot="title">管理员管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/Privilege" v-if="okadmin">
            <i class="el-icon-document"></i>
            <span slot="title">权限管理</span>
          </el-menu-item>
          <el-menu-item index="/Administrators" v-if="okadmin">
            <i class="el-icon-s-home"></i>
            <span slot="title">店面管理</span>
          </el-menu-item>
          <el-menu-item index="/Jurisdiction" v-if="okboss">
            <i class="el-icon-document"></i>
            <span slot="title">权限管理</span>
          </el-menu-item>
          <el-menu-item index="/information" v-if="okboss">
            <i class="el-icon-s-custom"></i>
            <span slot="title">店员信息</span>
          </el-menu-item>
          <el-menu-item index="/Approval" v-if="okboss">
            <i class="el-icon-circle-plus-outline"></i>
            <span slot="title">注册审批
            </span>
            <div style="width:18px;height:18px;background-color:red;border-radius:50%;float: right;margin-top: 20px;margin-right: 60px;color: white;line-height:18px;text-align:center;font-size: 10px"
                 v-if="Approvalflag">
              <p>
                {{value}}
              </p>
            </div>
          </el-menu-item>
          <el-menu-item index="/Notice" v-if="ok">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">店主公告
            </span>
            <div style="width:18px;height:18px;background-color:red;border-radius:50%;float: right;margin-top: 20px;margin-right: 60px;color: white;line-height:18px;text-align:center;font-size: 10px"
            v-if="Noticflag">
              <p>
                {{value2}}
              </p>
            </div>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Menu',
  components: {
  },
  data () {
    return {
      okadmin: false,
      okboss: false,
      ok: false,
      value: '',
      value2: '',
      notic: [],
      Approvalflag: false,
      Noticflag: false
    }
  },
  created () {
    this.init()
    this.getnoticenum()
    this.getApprovalnum()
    this.timer()
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    timer () {
      return setInterval(() => {
        this.getnoticenum()
        this.getApprovalnum()
      }, 1000)
    },
    destroyed () {
      clearInterval(this.timer)
    },
    init () {
      let role = localStorage.getItem('userRole')
      if (role === 'admin') {
        this.okadmin = true
        this.ok = false
        this.okboss = false
      }
      if (role === 'boss') {
        this.ok = true
        this.okboss = true
        this.okadmin = false
      }
      if (role === 'staff') {
        this.ok = true
        this.okboss = false
        this.okadmin = false
      }
    },
    getApprovalnum () {
      this.$axios.get('http://47.112.255.207:8081/searchRegister_ApprovalByBossname', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          bossname: this.$store.state.bossname
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.value = res.data.data.length
          if (this.value === 0) {
            this.Approvalflag = false
          } else {
            this.Approvalflag = true
          }
          if (this.value >= 99) {
            this.value = '99+'
          }
        }
        if (res.data.code === 401) {
          console.log('服务器错误')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getnoticenum () {
      this.$axios.get('http://47.112.255.207:8081/getBoss_Notice', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: localStorage.getItem('name')
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.notic = res.data.data
          this.addnumnotic()
        }
        if (res.data.code === 401) {
          console('服务器错误')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addnumnotic () {
      var num = 0
      for (let i = 0; i < this.notic.length; i++) {
        if (this.notic[i].status === 1) {
          num = num + 1
        }
      }
      if (num === 0) {
        this.Noticflag = false
      } else {
        this.Noticflag = true
        this.value2 = num
      }
      if (this.value2 >= 99) {
        this.value2 = '99+'
      }
    }
  },
  beforeDestroy () {
    this.destroyed()
  }
}
</script>
<style>
  .aside-container {
    height: 100%;
  }
  .tac {
    height: 100%;
  }
  .el-menu-vertical-demo {
    width: 100%;
    height: 100%;
  }
</style>
