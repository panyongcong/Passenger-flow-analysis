<template>
  <div class="app-container">
    <div class="address-layout">
      <div class="layout-head">
        <div class="empty">
        </div>
        <div class="shopaddress">
          <el-select v-model="shopaddress" style="width: 150px" @change="changeaddress">
            <el-option v-for="(item, index) in addressdata"
                       :key="index"
                       :value="item.label"
                       :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="empty">
        </div>
        <div class="username">
          <el-tag type="success">用户名：{{username}}</el-tag>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">人流量</div>
            <div class="color-main address-content">
              <div>{{walkerNumber}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">客流量</div>
            <div class="color-main address-content">
              <div>{{consumerNumber}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">跳出量</div>
            <div class="color-main address-content">
              <div>{{jmpOut}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="padding-top: 20px">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">新顾客</div>
            <div class="color-main address-content">
              <div>{{newConsumer}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">当前店内顾客</div>
            <div class="color-main address-content">
              <div>{{dynamicConsumer}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">小时客流量统计</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6; width: 100%;">
            <el-date-picker
              style="float: right;z-index: 1"
              @change="changeday"
              v-model="value"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
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
      <div class="layout-title">小时进店量统计</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6; width: 100%;">
            <el-date-picker
              style="float: right;z-index: 1"
              @change="changeday1"
              v-model="value2"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData1"
                :settings="chartSettings1"
                :grid="grid">
              </ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'system',
  data () {
    return {
      value: '',
      value2: '',
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
      username: '',
      addressdata: []
    }
  },
  created () {
    this.gettoday()
    this.getData()
  },
  methods: {
    getData () {
      this.shopaddress = localStorage.getItem('address')
      this.username = localStorage.getItem('username')
      this.$axios({
        method: 'get',
        url: 'http://47.112.255.207:8081/findShop',
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 200) {
          console.log(res.data.data.length)
          console.log(res.data.data)
          for (let i = 0; i < res.data.data.length; i++) {
            let add = {}
            add.value = i
            add.label = res.data.data[i].address
            console.log(add)
            this.addressdata.push(add)
          }
        }
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
      this.shopaddress = localStorage.getItem('address')
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
        this.chartData = {
          columns: ['小时', '每个小时的客流量'],
          rows: []
        }
        console.log(res.data.data)
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
        console.log(this.chartData.rows)
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
    }
  }

}
</script>
<style>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }
  .address-layout {
  }
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }
  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
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
