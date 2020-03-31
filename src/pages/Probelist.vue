<template>
  <div>
    <el-button type="primary" icon="el-icon-back" style="background-color: white;color: black;border: 1px solid #263A4A;margin: 10px" @click="backup">退后</el-button>
    <el-button type="primary"  @click="btn2" style="margin: 10px;float: right;background-color: white;color: black;border: 1px solid #263A4A;">刷新</el-button>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
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
  name: 'Probelist',
  data () {
    return {
      list: [],
      list1: [],
      listLoading: false,
      dialogVisible: false,
      dialogVisible_edit: false,
      flashPromotion: {
        address: '',
        machineId: '',
        rssi: '-50',
        leastRssi: '-100'
      },
      flashPromotion_edit: {
        machineId: '',
        rssi: '',
        leastRssi: ''
      },
      flag: false
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
      })
    },
    btn2 () {
      this.init()
    },
    backup () {
      this.$router.push('/device')
    },
    init () {
      this.list = []
      let shopaddress = localStorage.getItem('address')
      this.$axios.get('http://47.112.255.207:8081/findMachineByAddress', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: shopaddress,
          username: this.$store.state.shopname
        },
        crossDomain: true
      }).then(res => {
        if (res.data.data.length !== 0) {
          this.flag = true
        }
        console.log(res.data.data)
        console.log(shopaddress)
        this.list = res.data.data
        this.list1 = res.data.data
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>
