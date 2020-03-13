<template>
  <div class="home-main" style="height: 100%;position:absolute;
    width: 100%">
    <el-container class="index-container">
      <el-container style="height: 100%">
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
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style>
  .index-container {
    height: 100%;
  }
</style>
