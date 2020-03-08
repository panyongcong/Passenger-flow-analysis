<template>
  <div>
    <el-button type="primary" round @click="btn" style="margin-bottom: 50px;float: right">添加探针</el-button>
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
        <el-table-column label="探针强度" width="140" align="center">
          <template slot-scope="scope">{{scope.row.rssi}}</template>
        </el-table-column>
        <el-table-column label="启动/禁用" width="200" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
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
        <el-form-item label="探针位置：">
          <el-input v-model="flashPromotion.add" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="放置时间：">
          <el-date-picker
            v-model="flashPromotion.startDate"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-radio-group v-model="flashPromotion.status">
            <el-radio :label="1">启动</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
const defaultFlashPromotion = {
  id: null,
  add: null,
  rssi: null,
  status: 0
}
export default {
  name: 'probeinfo',
  data () {
    return {
      list: [],
      list1: [],
      listLoading: false,
      dialogVisible: false,
      flashPromotion: Object.assign({}, defaultFlashPromotion)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    btn () {
      this.dialogVisible = true
      this.flashPromotion = Object.assign({}, defaultFlashPromotion)
    },
    init () {
      this.$axios.get('http://47.112.255.207:8081/findMachineByAddress', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: '云浮店'
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.data)
        this.list = res.data.data
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    }
  }
}
</script>
<style>
</style>
