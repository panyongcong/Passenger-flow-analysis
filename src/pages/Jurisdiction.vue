<template>
  <div v-if="showpage">
    <el-button type="primary" icon="el-icon-back" circle @click="backup" style="background-color: white;color: black;border: 0;float: left;margin-top: 5px;margin-left: 30px" v-if="showback"></el-button>
    <el-button type="primary" round @click="btn2" style="margin-bottom: 30px;margin-top: 30px;margin-left: 30px">刷新</el-button>
    <el-button type="primary" round @click="btnquery" style="margin-bottom: 30px;float: right;margin-top: 30px;margin-right: 30px">查询店员</el-button>
    <el-input v-model="flashPromotion_query.name" style="width: 250px;float: right;margin-top: 30px;" :placeholder=placeholder @focus="blurSearchFor()" @blur="blurSear" v-if="showinput"></el-input>
    <el-table :data="list"
              v-loading="listLoading" border>
      <el-table-column label="店员用户名" align="center">
        <template slot-scope="scope">{{scope.row.username}}</template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="店员工号" align="center">
        <template slot-scope="scope">{{scope.row.job_number}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="success"
                     @click="handlecheck(scope.$index, scope.row)">
            授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Jurisdiction',
  data () {
    return {
      list: [],
      showpage: false,
      list1: [],
      listLoading: false,
      showinput: true,
      showback: false,
      placeholder: '根据姓名,工号,用户名支持模糊查找',
      flashPromotion_query: {
        name: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.list = []
      this.showinput = true
      let role = localStorage.getItem('userRole')
      if (role === 'admin') {
        this.showback = true
      }
      this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationList', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          param: this.$store.state.bossname
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 443) {
          this.showpage = false
          this.$router.push('/Noauthority')
        }
        if (res.data.code === 200) {
          this.showpage = true
          for (let i = 0; i < res.data.data.length; i++) {
            let add = {}
            add.username = res.data.data[i].username
            add.name = res.data.data[i].name
            add.job_number = res.data.data[i].job_number
            this.list.push(add)
          }
        }
      }).catch(error => {
        console.log('获取信息失败')
        alert('获取信息失败')
        console.log(error)
      })
    },
    handlecheck (index, rows) {
      let name = this.list[index].username
      this.$store.commit('addstaffname', {staffname: name})
      this.$router.push('/Management')
    },
    btnquery () {
      this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationByUsernameOrNameExcludePassword', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          param: this.flashPromotion_query.name
        },
        crossDomain: true
      }).then(res => {
        this.dialogVisible_query = false
        if (res.data.code === 200) {
          this.list = []
          this.showinput = false
          this.flashPromotion_query.name = ''
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].uid === 3) {
              this.list[i] = res.data.data[i]
              this.list[i] = res.data.data[i]
            } else {
            }
          }
          if (this.list.length === 0) {
            Message.warning('查找失败')
          }
          console.log(this.list)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    blurSearchFor () {
      if (this.placeholder === '根据设备id查询设备,支持模糊查找') {
        this.placeholder = ''
      }
    },
    blurSear () {
      this.placeholder = '根据设备id查询设备,支持模糊查找'
    },
    btn2 () {
      this.init()
    },
    backup () {
      this.$router.push('/Privilege')
    }
  }
}
</script>

<style>

</style>
