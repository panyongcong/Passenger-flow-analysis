<template>
  <div class="device-main">
    <div class="device-head">
      <h4 style="font-family: STKaiti,KaiTi,KaiTi_GB2312,sans-serif">设备管理</h4>
    </div>
    <div class="device-table">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="name"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="data"
              label="设备运行最后日期">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'device',
  data () {
    return {
      tableData: []
    }
  }
}
</script>
<style>
  .device-head{
    text-align: center;
    line-height: 60px;
  }
  .device-table{
    text-align: center;
    line-height: 60px;
    width: 100%;
  }
</style>
