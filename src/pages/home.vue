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
            <el-button icon="el-icon-circle-close" style="float: right;background-color: #263A4A;border: 1px solid #263A4A;color: #fbfdff">退出</el-button>
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
