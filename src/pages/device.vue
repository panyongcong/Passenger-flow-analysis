<template>
  <div>
    <el-button type="primary" icon="el-icon-back" style="background-color: white;color: black;border: 1px solid #263A4A;margin: 10px" @click="back">退后</el-button>
    <el-table :data="tableData"
            v-loading="listLoading" border>
    <el-table-column label="店铺名字" align="center">
      <template slot-scope="scope">{{scope.row.address}}</template>
    </el-table-column>
    <el-table-column label="设备 | 操作" align="center">
      <template slot-scope="scope">
        <el-button size="mini"
                   type="success"
                   @click="handlecheck(scope.$index, scope.row)">
          查看
        </el-button>
        <el-button size="mini"
                   type="danger"
                   @click="handleDelete(scope.$index, scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
import { MessageBox } from 'element-ui'
export default {
  name: 'device',
  data () {
    return {
      tableData: [],
      tableData1: [],
      listLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$axios.get('http://47.112.255.207:8081/findShopByBossName', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: this.$store.state.shopname
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 402) {
          alert('查询店铺失败')
        }
        if (res.data.code === 401) {
          alert('该店主还没有添加任何店铺,或者该店主还没有注册请核对店主信息')
        }
        if (res.data.code === 200) {
          this.tableData = []
          for (let i = 0; i < res.data.data.address.length; i++) {
            let add = {}
            add.address = res.data.data.address[i]
            this.tableData.push(add)
          }
          this.tableData1 = this.tableData
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    handleDelete (index, rows) {
      let message = '确定删除地址为：' + this.tableData1[index].address + '的店铺吗?'
      MessageBox.confirm(message, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        let address = this.tableData1[index].address
        var param = {address: address}
        this.$axios.delete('http://47.112.255.207:8081/delectShop', {params: param}).then(res => {
          if (res.data.code === 200) {
            this.init()
          }
          if (res.data.code === 402) {
            alert('店铺删除失败')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
      }).catch()
    },
    handlecheck (index, rows) {
      localStorage.setItem('address', this.tableData1[index].address)
      this.$router.push('/Probelist')
    },
    back () {
      this.$router.push('/profile')
    }
  }
}
</script>
<style>
</style>
