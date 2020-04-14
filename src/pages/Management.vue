<template>
  <div>
    <div style="width: 45%;float: right;font-size: 20px;height: 34px">
      <div style="margin-left: 180px;margin-top: 7px">
        用户名：{{stafname}}
      </div>
    </div>
    <div style="width: 45%;float: right;font-size: 20px;height: 34px;margin-top: 7px">
      <div style="margin-left: 140px">
        姓名：{{name}}
      </div>
    </div>
    <el-button type="primary" icon="el-icon-back" circle @click="backup" style="background-color: white;color: black;border: 0;width: 10%;float: right"></el-button>
    <el-table :data="list"
              v-loading="listLoading" border>
      <el-table-column label="权限" align="center">
        <template slot-scope="scope">{{scope.row.chinese_name}}</template>
      </el-table-column>
      <el-table-column label="授权/撤权" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="100"
            inactive-value="0"
            @change="changeSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Management',
  data () {
    return {
      list: [],
      list1: [],
      listLoading: false,
      value: '100',
      rowsdata: {
        username: '',
        pid: ''
      },
      stafname: '',
      name: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let _this = this
      _this.list = []
      this.stafname = this.$store.state.staffname
      this.name = this.$store.state.name
      this.$axios.get('http://47.112.255.207:8081/searchPermission', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: this.$store.state.staffname
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            let add = {}
            add.chinese_name = res.data.data[i].chinese_name
            add.pid = res.data.data[i].pid
            if (res.data.data[i].status === 0) {
              add.status = '0'
            } else {
              add.status = '100'
            }
            _this.list.push(add)
          }
        }
      }).catch(error => {
        console.log('获取信息失败')
        alert('获取信息失败')
        console.log(error)
      })
    },
    changeSwitch (row) {
      this.rowsdata.username = this.$store.state.staffname
      this.rowsdata.pid = row.pid
      console.log(row.pid)
      console.log(this.rowsdata.username)
      let rowsdatas = this.$qs.stringify(this.rowsdata)
      if (row.status === '100') {
        console.log(row.status)
        this.$axios({
          method: 'post',
          url: 'http://47.112.255.207:8081/addPermission',
          data: rowsdatas,
          Headers: {
            'Authorization': ' '
          },
          crossDomain: true
        }).then(res => {
          console.log(res.data.code)
          if (res.data.code === 200) {
            console.log('修改成功')
          }
          if (res.data.code === 402) {
            alert('操作失败,请联系管理员')
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (row.status === '0') {
        var param = {username: this.$store.state.staffname, pid: row.pid}
        this.$axios.delete('http://47.112.255.207:8081/deletePermission', {params: param}).then(res => {
          if (res.data.code === 200) {
            console.log('撤权成功')
          }
          if (res.data.code === 402) {
            alert('操作失败,请联系管理员')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
      }
    },
    backup () {
      let role = localStorage.getItem('userRole')
      if (role === 'admin') {
        this.$router.push('/Privilege')
      } else {
        this.$router.push('/Jurisdiction')
      }
    }
  }
}
</script>

<style>

</style>
