<template>
  <div class="probeinfo-main">
    <div class="probeinfo-head">
      <h4 style="font-family: STKaiti,KaiTi,KaiTi_GB2312,sans-serif">店铺探针信息</h4>
    </div>
    <div class="probeinfo-index">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="probeForm"
            border
            width="100%">
            <el-table-column
              prop="pid"
              label="探针号">
            </el-table-column>
            <el-table-column
              prop="pname"
              label="探针名">
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="last_time"
              label="最后提交时间">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="sid"
              label="店铺号">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'probeinfo',
  data () {
    return {
      probeForm: [],
      probeForm2: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let _this = this
      this.$axios({
        method: 'get',
        url: '/probeinfo'
      }).then(res => {
        var data = res.data.data
        console.log(data)
        const dataarray = res.data.data
        _this.probeForm2 = dataarray
        if (_this.probeForm2[0].status === '1') {
          _this.probeForm2[0].status = '启用'
          console.log(_this.probeForm2[0].status)
        } else {
          _this.probeForm2[0].status = '禁用'
        }
        _this.probeForm = _this.probeForm2
      }).catch(error => {
        console.log('获取信息失败')
        alert('获取信息失败')
        console.log(error)
      })
    }
  }
}
</script>
<style>
  .probeinfo-head{
    text-align: center;
    line-height: 60px;
  }
  .probeinfo-index{
    text-align: center;
    line-height: 60px;
    width: 100%;
  }
</style>
