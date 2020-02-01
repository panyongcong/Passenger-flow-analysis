<template>
  <div class="personal-main">
    <div class="personal-head">
      <h4 style="font-family: STKaiti,KaiTi,KaiTi_GB2312,sans-serif">个人用户信息</h4>
    </div>
    <div class="personal-index">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="userForm"
            border>
            <el-table-column
              prop="username"
              label="用户名">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="昵称">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱">
            </el-table-column>
            <el-table-column
              prop="description"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="账号创建时间">
            </el-table-column>
            <el-table-column
              prop="lastLoginTime"
              label="最后登录时间">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'personal',
  data () {
    return {
      userForm: [],
      userForm2: []
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
        url: '/profile'
      }).then(res => {
        var data = res.data.data
        console.log(data)
        const dataarray = res.data.data
        _this.userForm2 = dataarray
        if (_this.userForm2[0].status === '1') {
          _this.userForm2[0].status = '启用'
          console.log(_this.userForm2[0].status)
        } else {
          _this.userForm2[0].status = '禁用'
        }
        _this.userForm = _this.userForm2
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
  .personal-head{
    text-align: center;
    line-height: 60px;
  }
  .personal-index{
    line-height: 60px;
  }

</style>
