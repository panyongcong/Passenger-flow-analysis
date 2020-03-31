<template>
  <div class="home-main" style="height: 100%;position:absolute;
    width: 100%">
    <el-container class="index-container">
      <el-container style="height: 100%">
        <el-aside width="15%" style="height: 100%">
          <div class="name">
            <div style="padding-top: 10px;color: #fbfdff">
              用户名：{{username}}
            </div>
          </div>
          <Menu style="width: 100%;height: 94%"></Menu>
        </el-aside>
        <el-main style="padding: 0px;">
          <div style="width: 100%;height: 41px;background-color: #263A4A">
            <div style="float: left;margin-top:5px;margin-left: 150px;margin-right: 5px">
              <img src="../assets/images/an.png">
            </div>
            <div style="float: left;color: white;margin-top: 10px;font-size: 20px">人流量分析系统</div>
            <el-button icon="el-icon-circle-close" style="float: right;background-color: #263A4A;border: 1px solid #263A4A;color: #fbfdff" @click="backup">退出</el-button>
          </div>
          <appMain></appMain>
        </el-main>
      </el-container>
    </el-container>
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
    return {
      username: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.username = localStorage.getItem('name')
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
</style>
