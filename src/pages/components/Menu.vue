<template>
  <div class="aside-container">
    <el-row class="tac">
      <el-col :span="10" style="width: 100%;height: 100%">
        <el-menu
          router
          class="el-menu-vertical-demo"
          background-color="#2F4050"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item index="/system" v-if="ok">
            <i class="el-icon-s-home"></i>
            <span slot="title">客流信息</span>
          </el-menu-item>
          <el-menu-item index="/shopinfo" v-if="okboss">
            <i class="el-icon-location-outline"></i>
            <span slot="title">门店分布</span>
          </el-menu-item>
          <el-menu-item index="/probeinfo" v-if="okboss">
            <i class="el-icon-setting"></i>
            <span slot="title">设备管理</span>
          </el-menu-item>
          <el-menu-item index="/profile" v-if="okadmin">
            <i class="el-icon-document"></i>
            <span slot="title">管理页面</span>
          </el-menu-item>
          <el-menu-item index="/Administrators" v-if="okadmin">
            <i class="el-icon-document"></i>
            <span slot="title">管理店面</span>
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
      ok: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
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
</style>
