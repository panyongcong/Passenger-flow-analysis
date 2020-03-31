<template>
  <div class="shopinfo-main" style="position: relative">
    <div class="allmap" style="position: fixed">
      <baidu-map :mapClick="false" :center="center" :zoom="zoom" @click="getClickInfo" @ready="handler" style="height:1080px" :scroll-wheel-zoom='true'>
      </baidu-map>
    </div>
    <div style="position: absolute;margin-left: 30px;margin-top: 30px">
      <el-button type="primary" round @click="btn">添加店面</el-button>
    </div>
    <el-dialog title="店铺信息" :visible.sync="dialogTableVisible">
      <el-form>
        <el-form-item>
          <el-table :data="gridData" style="border-bottom: 15px">
            <el-table-column property="walkerNumber" label="人流量"></el-table-column>
            <el-table-column property="consumerNumber" label="客流量"></el-table-column>
            <el-table-column property="newConsumer" label="新客人量"></el-table-column>
            <el-table-column property="jmpOut" label="跳出量"></el-table-column>
            <el-table-column property="dynamicConsumer" label="当前店内客人量"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-delete" @click="deleteshop">删除该门店信息</el-button>
          <el-button type="primary" icon="el-icon-search" @click="checkshop" style="float: right">查看店内数据</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox } from 'element-ui'
export default {
  name: 'shopinfo',
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 12,
      mapVisible: false,
      locData: {
        longitude: '',
        latitude: '',
        address: ''
      },
      flag: 0,
      dialogTableVisible: false,
      gridData: [{
        walkerNumber: '',
        consumerNumber: '',
        newConsumer: '',
        jmpOut: '',
        dynamicConsumer: ''
      }],
      clickedshopaddress: '',
      showaddress: '',
      markerba: '',
      havashop: true // 判断是否有新店铺
    }
  },
  methods: {
    handler ({BMap, map}) {
      let _this = this // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (_this.havashop === false) {
          _this.center = {lng: r.longitude, lat: r.latitude}
        }
        _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude} // 自定义覆盖物
        _this.initLocation = false
      }, {enableHighAccuracy: true})
      window.map = map
      this.getshop()
      this.init()
    },
    init () {
      this.$axios.get('http://47.112.255.207:8081/findShop', {
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.havashop = true
          if (res.data.data.length !== 0) {
            this.center.lat = res.data.data[0].latitude
            this.center.lng = res.data.data[0].longitude
          }
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 402) {
          this.havashop = false
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    getshop () {
      this.$axios.get('http://47.112.255.207:8081/findShop', {
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            let lng = res.data.data[i].longitude
            let lat = res.data.data[i].latitude
            let myMarker = new BMap.Marker(new BMap.Point(lng, lat))
            let gc = new BMap.Geocoder()
            let point = new BMap.Point(lng, lat)
            let address = res.data.data[i].address
            gc.getLocation(point, res => {
              window.map.addOverlay(myMarker)
              this.addClickHandler(myMarker, address)
              this.addMouseover(myMarker, address, point)
              this.addMouseout(myMarker, address, point)
            })
          }
        }
        if (res.data.code === 444) {
          alert('未登录')
          this.$router.push('/')
        }
        if (res.data.code === 401) {
          alert('返回店铺失败')
        }
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    },
    getClickInfo (e) {
      if (this.flag === 1) {
        let _this = this
        var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        var gc = new BMap.Geocoder()
        var point = new BMap.Point(e.point.lng, e.point.lat)
        gc.getLocation(point, res => {
          _this.locData.address = res.address
          _this.locData.longitude = point.lng
          _this.locData.latitude = point.lat
          var mes = '确定要在:' + '经度:' + _this.locData.longitude + +'  ' + '维度:' + _this.locData.latitude + '  ' + _this.locData.address + '添加店铺吗？'
          MessageBox.confirm(mes, '提示', {
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonClass: '取消',
            type: 'warning'
          }).then(() => {
            _this.locData.address = _this.locData.address + '店'
            let locData = _this.$qs.stringify(_this.locData)
            this.$axios({
              method: 'post',
              url: 'http://47.112.255.207:8081/insertShop',
              data: locData,
              Headers: {
                'Authorization': ' '
              },
              crossDomain: true
            }).then(res => {
              console.log(res.data.code)
              if (res.data.code === 200) {
                window.map.addOverlay(myMarker)
                this.addClickHandler(myMarker, _this.locData.address)
                this.addMouseover(myMarker, _this.locData.address, point)
                this.addMouseout(myMarker, _this.locData.address, point)
              }
              if (res.data.code === 401) {
                alert('此处店铺已被添加,请不要重复添加')
              }
              if (res.data.code === 402) {
                alert('添加店铺异常')
              }
              if (res.data.code === 444) {
                alert('未登录')
                this.$router.push('/')
              }
            }).catch(error => {
              console.log('登录失败')
              console.log(error)
            })
          }).catch(() => {
          })
        })
        _this.locData.longitude = e.point.lng
        _this.locData.latitude = e.point.lat
        this.flag = 0
      }
    },
    btn () {
      this.flag = 1
      this.$alert('点击地图即可添加店面', '提示', {
        confirmButtonText: '确定'
      })
    },
    addClickHandler (myMarker, address) {
      myMarker.addEventListener('click', e => {
        this.clickedshopaddress = address
        this.markerba = myMarker.ba
        let aData = new Date()
        let value = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
        this.$axios.get('http://47.112.255.207:8081/getMainData', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            address: address,
            dateTime: value
          },
          crossDomain: true
        }).then(res => {
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
          this.gridData[0].walkerNumber = res.data.data.walkerNumber
          this.gridData[0].consumerNumber = res.data.data.consumerNumber
          this.gridData[0].newConsumer = res.data.data.newConsumer
          this.gridData[0].jmpOut = res.data.data.jmpOut
          this.gridData[0].dynamicConsumer = res.data.data.dynamicConsumer
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
        this.dialogTableVisible = true
      })
    },
    deleteshop () {
      let message = '确定删除地址为：' + this.clickedshopaddress + '的店铺吗?'
      MessageBox.confirm(message, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        var param = {address: this.clickedshopaddress}
        this.$axios.delete('http://47.112.255.207:8081/delectShop', {params: param}).then(res => {
          if (res.data.code === 200) {
            var allOverlay = window.map.getOverlays()
            for (let i = 0; i < allOverlay.length; i++) {
              if (allOverlay[i].ba === this.markerba) {
                window.map.removeOverlay(allOverlay[i])
              }
            }
            this.dialogTableVisible = false
            alert('删除成功')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
          if (res.data.code === 401) {
            alert('删除失败')
          }
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
      }).catch()
    },
    addMouseover (myMarker, address, point) {
      let opts = {
        width: 100,
        height: 80,
        title: '店铺信息'
      }
      let context = ''
      myMarker.addEventListener('mouseover', e => {
        this.$axios.get('http://47.112.255.207:8081/showDynamicCustomer', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            address: address
          },
          crossDomain: true
        }).then(res => {
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
          context = res.data.data
        }).catch(err => {
          console.log(err)
        })
        let shopadd = '<table>'
        shopadd = shopadd + '<tr><td> 店铺地址：' + address + '</td></tr>'
        shopadd = shopadd + '<tr><td> 店内人数：' + context + '</td></tr>'
        shopadd += '</table>'
        let infoWindow = new BMap.InfoWindow(shopadd, opts)
        window.map.openInfoWindow(infoWindow, point)
      })
    },
    addMouseout (myMarker, address, point) {
      let context = ''
      let opts = {
        width: 100,
        height: 200,
        title: '店铺信息'
      }
      myMarker.addEventListener('mouseout', e => {
        let shopadd = '<table>'
        shopadd = shopadd + '<tr><td> 店铺地址：' + address + '</td></tr>'
        shopadd = shopadd + '<tr><td> 店内人数：' + context + '</td></tr>'
        shopadd += '</table>'
        let infoWindow = new BMap.InfoWindow(shopadd, opts)
        window.map.closeInfoWindow(infoWindow, point)
      })
    },
    checkshop () {
      console.log(this.clickedshopaddress)
      localStorage.setItem('address', this.clickedshopaddress)
      this.$router.push('/system')
    }
  }
}
</script>
<style>
  .allmap{
    width: 100%;
    height: 100%;
  }
  .map {
    width: 100%;
    height: 500px;
  }
</style>
