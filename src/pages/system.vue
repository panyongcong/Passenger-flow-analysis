<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">人流量</div>
            <div class="color-main address-content">
              <div>50</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">客流量</div>
            <div class="color-main address-content">
              <div>50</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">跳出量</div>
            <div class="color-main address-content">
              <div>50</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="padding-top: 20px">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">新顾客</div>
            <div class="color-main address-content">
              <div>50</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">老顾客</div>
            <div class="color-main address-content">
              <div>50</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">当前店内顾客</div>
            <div class="color-main address-content">
              <div>50</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">客流统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月顾客总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">10000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周顾客总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">1000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月新顾客数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周新顾客数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings">
              </ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {str2Date} from '@/utils/date'
const DATA_FROM_BACKEND = {
  columns: ['date', 'DayCount'],
  rows: [
    {date: '2018-11-01', DayCount: 10},
    {date: '2018-11-02', DayCount: 20},
    {date: '2018-11-03', DayCount: 33},
    {date: '2018-11-04', DayCount: 50},
    {date: '2018-11-05', DayCount: 80},
    {date: '2018-11-06', DayCount: 60},
    {date: '2018-11-07', DayCount: 20},
    {date: '2018-11-08', DayCount: 60},
    {date: '2018-11-09', DayCount: 50},
    {date: '2018-11-10', DayCount: 30},
    {date: '2018-11-11', DayCount: 20},
    {date: '2018-11-12', DayCount: 80},
    {date: '2018-11-13', DayCount: 100},
    {date: '2018-11-14', DayCount: 10},
    {date: '2018-11-15', DayCount: 40}
  ]
}
export default {
  name: 'system',
  data () {
    return {
      pickerOptions: {shortcuts: [{
        text: '最近一周',
        onClick (picker) {
          const end = new Date()
          let start = new Date()
          start.setFullYear(2018)
          start.setMonth(10)
          start.setDate(1)
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一月',
        onClick (picker) {
          const end = new Date()
          let start = new Date()
          start.setFullYear(2018)
          start.setMonth(10)
          start.setDate(1)
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }]},
      orderCountDate: '',
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: {right: ['DayCount']},
        labelMap: {'DayCount': '一天顾客数'}},
      chartData: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: false
    }
  },
  created () {
    this.initOrderCountDate()
    this.getData()
  },
  methods: {
    handleDateChange () {
      this.getData()
    },
    initOrderCountDate () {
      let start = new Date()
      start.setFullYear(2018)
      start.setMonth(10)
      start.setDate(1)
      const end = new Date()
      end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7)
      this.orderCountDate = [start, end]
    },
    getData () {
      setTimeout(() => {
        this.chartData = {
          columns: ['date', 'DayCount'],
          rows: []
        }
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          let item = DATA_FROM_BACKEND.rows[i]
          let currDate = str2Date(item.date)
          let start = this.orderCountDate[0]
          let end = this.orderCountDate[1]
          if (currDate.getTime() >= start.getTime() && currDate.getTime() <= end.getTime()) {
            this.chartData.rows.push(item)
          }
        }
        this.dataEmpty = false
        this.loading = false
      }, 1000)
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
</style>
