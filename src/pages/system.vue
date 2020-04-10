<template>
  <div class="app-container">
    <div class="address-layout">
      <div class="layout-head">
        <div style="float: left;font-size: 20px;margin-top: 10px;margin-right: 10px;margin-left: 10px">店铺地址:</div>
        <div class="shopaddress" style="float: left;">
          <el-select v-model="shopaddress" style="width: 250px" @change="changeaddress">
            <el-option v-for="(item, index) in addressdata"
                       :key="index"
                       :value="item.label"
                       :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="shoptime" style="float: right">
          <div style="float: left;font-size: 20px;margin-top: 10px;margin-right: 10px">日期:</div>
          <el-date-picker
            style="z-index: 1;margin-right: 30px"
            @change="changeday3"
            v-model="value3"
            align="right"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </div>
      <el-row :gutter="20" style="width: 100%;float: left;margin-top: 10px">
        <el-col :span="3" style="width: 200px;margin-left: 30px">
          <div class="out-border">
            <div class="layout-title" style="text-align: center;font-size: 18px">人流量</div>
            <div class="color-main address-content">
              <div style="text-align: center;">{{walkerNumber}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" style="width: 200px;margin-left: 30px">
          <div class="out-border">
            <div class="layout-title" style="text-align: center;font-size: 18px">客流量</div>
            <div class="color-main address-content">
              <div style="text-align: center;">{{consumerNumber}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" style="width: 200px;margin-left: 30px">
          <div class="out-border">
            <div class="layout-title" style="text-align: center;font-size: 18px">跳出量</div>
            <div class="color-main address-content">
              <div style="text-align: center;">{{jmpOut}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" style="width: 200px;margin-left: 30px">
          <div class="out-border">
            <div class="layout-title" style="text-align: center;font-size: 18px">新顾客</div>
            <div class="color-main address-content">
              <div style="text-align: center;">{{newConsumer}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" style="width: 200px;margin-left: 30px">
          <div class="out-border">
            <div class="layout-title" style="text-align: center;font-size: 18px">当前店内顾客</div>
            <div class="color-main address-content">
              <div style="text-align: center;">{{dynamicConsumer}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title" style="background-color: white;margin-right: 30px;text-align: center">小时客流量统计</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px;width: 100%;">
            <div style="float: left;margin-top: 11px;font-weight: bold;margin-left: 40px;font-size: 20px">日期：</div>
            <el-date-picker
              style="z-index: 1;width: 50%;"
              @change="changeday"
              v-model="value"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div style="width: 100%;">
              <ve-line
                :legend-visible="false"
                width="550px"
                height="360px"
                :data="chartData"
                :settings="chartSettings"
                :grid="grid">
              </ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title" style="background-color: white;text-align: center">小时进店量统计</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px;width: 100%;">
            <div style="float: left;margin-top: 11px;font-weight: bold;margin-left: 40px;font-size: 20px">日期：</div>
            <el-date-picker
              style="z-index: 1;margin-left: 5px;float: left"
              @change="changeday1"
              v-model="value2"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1">
            </el-date-picker>
            <div style="width: 100%;float: right;padding: 0">
              <ve-line
                :legend-visible="false"
                width="550px"
                height="360px"
                :data="chartData1"
                :settings="chartSettings1"
                :grid="grid">
              </ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="请选择店铺"
      :visible.sync="dialogVisible"
      width="30%">
      <el-select v-model="shopaddress" style="width: 250px;margin-left: 50px" @change="changeaddress">
        <el-option v-for="(item, index) in addressdata"
                   :key="index"
                   :value="item.label"
                   :label="item.label"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooceaddress">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="由于店铺被删除请重新选择"
      :visible.sync="dialogVisiblebystaff"
      width="30%">
      <el-select v-model="shopaddress" style="width: 250px;margin-left: 50px">
        <el-option v-for="(item, index) in addressdatabystaff"
                   :key="index"
                   :value="item.label"
                   :label="item.label"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblebystaff = false">取 消</el-button>
        <el-button type="primary" @click="chooceaddressbystaff">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'system',
  data () {
    return {
      dialogVisible: false,
      dialogVisiblebystaff: false,
      value: '',
      value2: '',
      value3: '',
      shopaddress: '',
      orderCountDate: '',
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: {left: ['每个小时的客流量']},
        labelMap: {'每个小时的客流量': '每个小时的客流量'}},
      chartSettings1: {
        xAxisType: 'time',
        area: true,
        axisSite: {left: ['每个小时的进店量']},
        labelMap: {'每个小时的进店量': '每个小时的进店量'}},
      chartData: {
        columns: [],
        rows: []
      },
      grid: {
        right: '10%'
      },
      chartData1: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: false,
      walkerNumber: '',
      consumerNumber: '',
      newConsumer: '',
      jmpOut: '',
      dynamicConsumer: '',
      pickerOptions: {disabledDate (time) {
        return time.getTime() > Date.now()
      },
      shortcuts: [{
        text: '今天',
        onClick (picker) {
          picker.$emit('pick', new Date())
        }
      }, {
        text: '昨天',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', date)
        }
      }, {
        text: '一周前',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', date)
        }
      }]},
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      pickerOptions2: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]},
      username: '',
      addressdata: [],
      addressdatabystaff: [],
      flaghaveshop: false // 判断这人有没有店铺
    }
  },
  created () {
    this.judge()
  },
  methods: {
    judge () {
      let role = localStorage.getItem('userRole')
      if (role === 'boss') {
        this.getData()
      }
      if (role === 'staff') {
        this.checkShop()
      }
    },
    checkJurisdiction () {
      this.$axios.get('http://47.112.255.207:8081/findShop', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: this.$store.state.bossname
        },
        crossDomain: true
      }).then(res => {
        this.addressdata = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            let add = {}
            add.value = i
            add.label = res.data.data[i].address
            this.addressdata.push(add)
          }
          this.shopaddress = this.addressdata[0].label
        }
        if (res.data.code === 443) {
          let add = {}
          add.value = 0
          add.label = localStorage.getItem('address')
          this.addressdata.push(add)
          this.shopaddress = this.addressdata[0].label
        }
      })
    },
    checkShop () {
      this.$axios.get('http://47.112.255.207:8081/checkShop', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: localStorage.getItem('address')
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.shopaddress = localStorage.getItem('address')
          this.gettoday()
          this.checkJurisdiction()
        }
        if (res.data.code === 402) {
          this.chooseaddressbystaff()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    chooseaddressbystaff () {
      this.$axios.get('http://47.112.255.207:8081/findShopByBNameOnlyStaff', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: this.$store.state.bossname
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            let add = {}
            add.value = i
            add.label = res.data.data[i].address
            this.addressdatabystaff.push(add)
          }
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
      }).catch(err => {
        console.log(err)
      })
      this.dialogVisiblebystaff = true
    },
    chooceaddressbystaff () {
      let addressstaff = {username: localStorage.getItem('name'), address: this.shopaddress}
      addressstaff = this.$qs.stringify(addressstaff)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/changeBondShop',
        data: addressstaff,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          console.log('成功')
          localStorage.setItem('address', this.shopaddress)
          this.gettoday()
          this.checkJurisdiction()
          this.dialogVisiblebystaff = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chooceaddress () {
      this.$store.commit('addshopflag', {shopflag: true})
      localStorage.setItem('address', this.shopaddress)
      this.dialogVisible = false
      this.gettoday()
    },
    init () {
      if (this.$store.state.shopflag === false) { // 刚从登录页面过来需要弹窗
        if (this.flaghaveshop === false) {
          this.dialogVisible = true
          this.shopaddress = this.addressdata[0].label
        } else {
          this.dialogVisible = false
          alert('请去添加店铺')
        }
      } else {
        this.dialogVisible = false // 表示登录过了无需在弹窗
        this.shopaddress = localStorage.getItem('address')
        this.gettoday()
      }
    },
    timer () {
      return setInterval(() => {
        this.gettoday()
        this.getData()
      }, 5000)
    },
    destroyed () {
      clearInterval(this.timer)
    },
    getData () {
      this.addressdata = []
      this.$axios.get('http://47.112.255.207:8081/findShopByUsernameCheckPermission', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: this.$store.state.bossname
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.checkJurisdiction()
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 402) {
          this.flaghaveshop = true
        }
        this.init()
      }).catch(err => {
        console.log(err)
      })
    },
    changeaddress () {
      localStorage.setItem('address', this.shopaddress)
      this.gettoday()
    },
    gettoday () {
      var aData = new Date()
      this.value = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
      this.value2 = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
      this.value3 = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
      this.getcustomerdata()
      this.getChartdata()
      this.getPassengerflow()
    },
    changeday1 () {
      this.getChartdata()
    },
    changeday () {
      this.getPassengerflow()
    },
    getPassengerflow () {
      this.$axios.get('http://47.112.255.207:8081/getCustomerPerHour', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: this.shopaddress,
          dateTime: this.value
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        this.chartData = {
          columns: ['小时', '每个小时的客流量'],
          rows: []
        }
        for (let i = 0; i < res.data.data.length; i++) {
          let add = {}
          if (res.data.data[i].Hours === 0) {
            add.小时 = this.value + ' ' + res.data.data[i].hours + '0:00:00'
          } else {
            add.小时 = this.value + ' ' + res.data.data[i].hours + ':00:00'
          }
          add.每个小时的客流量 = res.data.data[i].hour_customer_number
          this.chartData.rows.push(add)
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    getcustomerdata () {
      this.$axios.get('http://47.112.255.207:8081/getMainData', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: this.shopaddress,
          dateTime: this.value2
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        this.walkerNumber = res.data.data.walkerNumber
        this.consumerNumber = res.data.data.consumerNumber
        this.newConsumer = res.data.data.newConsumer
        this.jmpOut = res.data.data.jmpOut
        this.dynamicConsumer = res.data.data.dynamicConsumer
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    getChartdata () {
      this.$axios.get('http://47.112.255.207:8081/getInCustomerPerHour', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          address: this.shopaddress,
          dateTime: this.value2
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        this.chartData1 = {
          columns: ['小时', '每个小时的进店量'],
          rows: []
        }
        for (let i = 0; i < res.data.data.length; i++) {
          let add = {}
          if (res.data.data[i].hours === 0) {
            add.小时 = this.value2 + ' ' + res.data.data[i].hours + '0:00:00'
          } else {
            add.小时 = this.value2 + ' ' + res.data.data[i].hours + ':00:00'
          }
          add.每个小时的进店量 = res.data.data[i].hour_in_customer_number
          this.chartData1.rows.push(add)
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    changeday3 () {
      this.value = this.value3
      this.value2 = this.value3
      this.changeday()
      this.changeday1()
    }
  }

}
</script>
<style>
  .app-container {
    margin-top: 10px;
  }
  .address-layout {
  }
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
    border-radius:15px 15px 0 0;
  }
  .out-border {
    border: 1px solid #DCDFE6;
    border-radius:15px
  }

  .statistics-layout {
    float: left;
    width: 50%;
  }
  .address-content{
    padding: 20px;
    font-size: 18px;
  }
  .layout-head{
    height: 50px;
    width: 100%;
    border-bottom: 50px;
  }
  .shopaddress{
    float: right;
    height: 50px;
    width: 150px;
  }
  .empty{
    float: right;
    height: 50px;
    width: 50px;
  }
  .username{
    float: right;
    height: 50px;
    width: 50px;
  }
</style>
