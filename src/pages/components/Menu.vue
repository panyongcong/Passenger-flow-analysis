<template>
  <div class="aside-container">
    <el-row class="tac">
      <el-col :span="20" style="width: 100%;height: 100%">
        <el-menu
          default-active="/system"
          router
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item index="/system">
            <i class="el-icon-s-home"></i>
            <span slot="title">客流信息</span>
          </el-menu-item>
          <el-menu-item index="/shopinfo">
            <i class="el-icon-s-home"></i>
            <span slot="title">门店分布</span>
          </el-menu-item>
          <el-menu-item index="/probeinfo">
            <i class="el-icon-document"></i>
            <span slot="title">店铺管理</span>
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
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
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
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
