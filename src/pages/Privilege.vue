<template>
  <div>
    <el-button type="primary" round @click="btn2" style="margin-bottom: 30px;margin-top: 30px;margin-left: 30px">刷新</el-button>
    <el-button type="primary" round @click="btnquery" style="margin-bottom: 30px;float: right;margin-top: 30px;margin-right: 30px">查询店员</el-button>
    <el-input v-model="flashPromotion_query.name" style="width: 250px;float: right;margin-top: 30px;" :placeholder=placeholder @focus="blurSearchFor()" @blur="blurSear" v-if="showinput"></el-input>
    <el-table :data="list"
              v-loading="listLoading" border>
      <el-table-column label="店主用户名" align="center">
        <template slot-scope="scope">{{scope.row.username}}</template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="权限|店员" align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="success"
                     @click="handlecheck(scope.$index, scope.row)">
            操作
          </el-button>
          <el-button size="mini"
                     type="success"
                     @click="handlequer(scope.$index, scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Privilege',
  data () {
    return {
      bossname: [],
      list: [],
      listLoading: false,
      showinput: true,
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
      let _this = this
      _this.showinput = true
      this.$axios.get('http://47.112.255.207:8081/searchPersonal_InformationListExcludePassword', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          param: '2'
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 200) {
          _this.list = res.data.data
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
    handlequer (index, rows) {
      let name = this.list[index].username
      this.$store.commit('addbossnamebystaff', {bossname: name})
      this.$router.push('/Jurisdiction')
    }
  }
}
</script>

<style scoped>

</style>
