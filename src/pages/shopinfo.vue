<template>
    <div class="shopinfo-main">
      <div class="shopinfo-head">
        <h4 style="font-family: STKaiti,KaiTi,KaiTi_GB2312,sans-serif">商铺信息</h4>
      </div>
      <div class="shopinfo-index">
        <el-row>
          <el-col :span="24">
            <el-table
              :data="shopForm"
              border
              width="100%">
              <el-table-column
                prop="sid"
                label="店铺号">
              </el-table-column>
              <el-table-column
                prop="sname"
                label="店铺名称">
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
              </el-table-column>
              <el-table-column
                prop="linkman"
                label="联系人">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="联系电话">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
  </div>
</template>
<script>
export default {
  name: 'shop',
  data () {
    return {
      shopForm: []
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
        url: '/shopinfo'
      }).then(res => {
        var data = res.data
        console.log(data)
        const dataarray = res.data.data
        _this.shopForm = dataarray
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
  .shopinfo-head{
    text-align: center;
    line-height: 60px;
  }
  .shopinfo-index{
    text-align: center;
    line-height: 60px;
    width: 100%;
  }
</style>
