<template>
  <div v-if="showpage">
    <el-button type="primary" round @click="btn" style="margin-bottom: 30px;float: right;margin-top: 30px;margin-right: 30px">添加探针</el-button>
    <el-button type="primary" round @click="btnquery" style="margin-bottom: 30px;float: right;margin-top: 30px;margin-right: 30px">查询探针</el-button>
    <el-input v-model="flashPromotion_query.machineId" style="width: 250px;float: right;margin-top: 30px;" :placeholder=placeholder @focus="blurSearchFor()" @blur="blurSear" v-if="showinput"></el-input>
    <el-button type="primary" round @click="btn2" style="margin-bottom: 30px;float: left;margin-top: 30px;margin-left: 30px">刷新</el-button>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="设备ID" width="100" align="center">
          <template slot-scope="scope">{{scope.row.machineId}}</template>
        </el-table-column>
        <el-table-column label="探针地址" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="rssi" width="140" align="center">
          <template slot-scope="scope">{{scope.row.rssi}}</template>
        </el-table-column>
        <el-table-column label="leastRssi" width="140" align="center">
          <template slot-scope="scope">{{scope.row.leastRssi}}</template>
        </el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="success"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
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
    <el-dialog
      title="添加探针"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="flashPromotion"
               ref="flashPromotionForm"
               label-width="150px" size="small">
        <el-form-item label="探针ID：">
          <el-input v-model="flashPromotion.machineId" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="探针rssi：">
          <el-input v-model="flashPromotion.rssi" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="探针leastRssi：">
          <el-input v-model="flashPromotion.leastRssi" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改探针"
      :visible.sync="dialogVisible_edit"
      width="40%">
      <el-form :model="flashPromotion_edit"
               label-width="150px" size="small">
        <el-form-item label="探针ID：">
          <el-input v-model="flashPromotion_edit.machineId" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="探针rssi：">
          <el-input v-model="flashPromotion_edit.rssi" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="探针leastRssi：">
          <el-input v-model="flashPromotion_edit.leastRssi" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_edit = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogedit()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'probeinfo',
  data () {
    return {
      list: [],
      list1: [],
      showinput: true,
      showpage: false,
      listLoading: false,
      dialogVisible: false,
      dialogVisible_edit: false,
      dialogVisible_query: false,
      flashPromotion: {
        address: '',
        machineId: '',
        rssi: '-50',
        leastRssi: '-100',
        username: ''
      },
      flashPromotion_edit: {
        machineId: '',
        rssi: '',
        leastRssi: ''
      },
      flashPromotion_query: {
        machineId: ''
      },
      flag: false,
      placeholder: '根据设备id查询设备,支持模糊查找'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleDelete (index, rows) {
      var param = {machineId: this.list1[index].machineId}
      this.$axios.delete('http://47.112.255.207:8081/deleteMachineByMachineId', {params: param}).then(res => {
        if (res.data.code === 200) {
          this.init()
        }
        if (res.data.code === 402) {
          Message.warning('设备删除失败')
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 443) {
          alert('无权限操作')
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    handleUpdate (index, rows) {
      this.flashPromotion_edit.rssi = this.$store.state.rssi
      this.flashPromotion_edit.leastRssi = this.$store.state.leastRssi
      this.flashPromotion_edit.machineId = this.list1[index].machineId
      this.dialogVisible_edit = true
    },
    handleDialogedit () {
      let flashPromotionedit = this.$qs.stringify(this.flashPromotion_edit)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/editMachine',
        data: flashPromotionedit,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.dialogVisible_edit = false
          this.$store.commit('addrssi', {rssi: this.flashPromotion_edit.rssi, leastRssi: this.flashPromotion_edit.leastRssi})
          this.init()
        }
        if (res.data.code === 401) {
          Message.warning('设备编辑失败')
        }
        if (res.data.code === 402) {
          Message.warning('rssi和最小限制leastRssi只能设置负数')
        }
        if (res.data.code === 403) {
          Message.warning('rssi和最小限制leastRssi设置不能等于0')
        }
        if (res.data.code === 405) {
          Message.warning('rssi不能小于最小限制leastRssi')
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 443) {
          this.dialogVisible_edit = false
          alert('无权限操作')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    btn () {
      this.dialogVisible = true
    },
    btn2 () {
      this.init()
    },
    init () {
      this.list = []
      this.showinput = true
      let shopaddress = localStorage.getItem('address')
      let user = this.$store.state.bossname
      this.$axios.get('http://47.112.255.207:8081/findMachineByAddress', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: shopaddress,
          username: user
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.showpage = true
          if (res.data.data.length !== 0) {
            this.flag = true
          }
          this.list = res.data.data
          this.list1 = res.data.data
        }
        if (res.data.code === 443) {
          this.showpage = false
          this.$router.push('/Noauthority')
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
    handleDialogConfirm () {
      if (this.flashPromotion.machineId === '' || this.flashPromotion.rssi === '' || this.flashPromotion.leastRssi === '') {
        if (this.flashPromotion.machineId === '') {
          alert('请输入设备ID')
        }
        if (this.flashPromotion.rssi === '') {
          alert('请输入设备rssi')
        }
        if (this.flashPromotion.leastRssi === '') {
          alert('请输入设备leastRssi')
        }
      } else {
        this.flashPromotion.address = localStorage.getItem('address')
        this.flashPromotion.username = this.$store.state.bossname
        let flashPromotion = this.$qs.stringify(this.flashPromotion)
        this.$axios({
          method: 'post',
          url: 'http://47.112.255.207:8081/insertMachine',
          data: flashPromotion,
          Headers: {
            'Authorization': ' '
          },
          crossDomain: true
        }).then(res => {
          if (res.data.code === 200) {
            Message.success('设备添加成功')
            this.dialogVisible = false
            this.init()
          }
          if (res.data.code === 401) {
            Message.warning('设备已被添加,请不要重复添加')
          }
          if (res.data.code === 402) {
            Message.warning('rssi和最小限制leastRssi只能设置负数')
          }
          if (res.data.code === 403) {
            Message.warning('rssi和最小限制leastRssi设置不能等于0')
          }
          if (res.data.code === 405) {
            Message.warning('rssi不能小于最小限制leastRssi')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
          if (res.data.code === 443) {
            alert('无权限操作')
          }
        })
      }
    },
    btnquery () {
      if (this.flashPromotion_query.machineId === '') {
      } else {
        this.$axios.get('http://47.112.255.207:8081/searchMachineByMachineId', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            machineId: this.flashPromotion_query.machineId,
            address: localStorage.getItem('address')
          },
          crossDomain: true
        }).then(res => {
          this.dialogVisible_query = false
          if (res.data.code === 200) {
            this.showinput = false
            this.flashPromotion_query.machineId = ''
            this.list = res.data.data
            this.list1 = res.data.data
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    blurSearchFor () {
      if (this.placeholder === '根据设备id查询设备,支持模糊查找') {
        this.placeholder = ''
      }
    },
    blurSear () {
      this.placeholder = '根据设备id查询设备,支持模糊查找'
    }
  }
}
</script>
<style>
</style>
