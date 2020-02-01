<template>
  <div class="home-main">
    <el-container class="index-container">
      <el-container>
        <el-aside width="200px">
          <Menu></Menu>
        </el-aside>
        <el-main>
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
  }
}
</script>
<style>
  .index-container {
    height: 100%;
  }
</style>
