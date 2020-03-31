<template>
  <div>
    <el-table :data="list"
            v-loading="listLoading" border>
    <el-table-column label="店主名字" align="center">
      <template slot-scope="scope">{{scope.row.username}}</template>
    </el-table-column>
    <el-table-column label="商店" align="center">
      <template slot-scope="scope">
        <el-button size="mini"
                   type="success"
                   @click="handlecheck(scope.$index, scope.row)">
          查看
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
export default {
  name: 'personal',
  data () {
    return {
      list: [],
      list1: [],
      listLoading: false
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
        url: 'http://47.112.255.207:8081/searchAllBoss'
      }).then(res => {
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        _this.list = res.data.data
        _this.list1 = res.data.data
      }).catch(error => {
        console.log('获取信息失败')
        alert('获取信息失败')
        console.log(error)
      })
    },
    handlecheck (index, rows) {
      let name = this.list1[index].username
      this.$store.commit('addshopname', {shopname: name})
      this.$router.push('/device')
    }
  }
}
</script>
<style>
</style>
