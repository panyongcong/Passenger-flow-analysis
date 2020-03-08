<template>
  <div class="home-main" style="height: 100%;position:absolute;
    width: 100%">
    <el-container class="index-container">
      <el-container style="height: 100%">
        <el-aside width="200px">
          <Menu></Menu>
        </el-aside>
        <el-main>
          <div class="layout-head">
            <div class="empty">
            </div>
            <div class="shopaddress">
              <el-tag>店铺位置：{{shopaddress}}</el-tag>
            </div>
            <div class="empty">
            </div>
            <div class="username">
              <el-tag type="success">用户名：{{username}}</el-tag>
            </div>
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
      shopaddress: '',
      username: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.shopaddress = localStorage.getItem('address')
      this.username = localStorage.getItem('username')
    }
  }
}
</script>
<style>
  .layout-head{
    height: 50px;
    width: 100%;
  }
  .shopaddress{
    float: right;
    height: 50px;
    width: 50px;
  }
  .empty{
    float: right;
    height: 50px;
    width: 50px;
  }
  .username{
    float: right;
    height: 50px;
    width: 50px;
  }
  .index-container {
    height: 100%;
  }
</style>
