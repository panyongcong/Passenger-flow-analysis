<template>
  <div class="shopinfo-main">
    <el-button type="primary" round @click="btn">添加店面</el-button>
    <div class="allmap">
      <baidu-map :center="center" :zoom="zoom" @click="getClickInfo" @ready="handler" style="height:1080px" :scroll-wheel-zoom='true'>
      </baidu-map>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'element-ui'
export default {
  name: 'shopinfo',
  data () {
    return {
      center: {lng: 121.833138, lat: 39.081725},
      zoom: 12,
      mapVisible: false,
      locData: {
        longitude: '',
        latitude: '',
        address: ''
      },
      flag: 0
    }
  },
  methods: {
    handler ({BMap, map}) {
      let _this = this // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        console.log(r)
        _this.center = {lng: r.longitude, lat: r.latitude} // 设置center属性值
        _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude} // 自定义覆盖物
        _this.initLocation = true
      }, {enableHighAccuracy: true})

      window.map = map
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
          console.log(_this.locData.address) // 地址信息
          var mes = '确定要在:' + '经度:' + _this.locData.longitude + +'  ' + '维度:' + _this.locData.latitude + '  ' + _this.locData.address + '添加店铺吗？'
          MessageBox.confirm(mes, '提示', {
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonClass: '取消',
            type: 'warning'
          }).then(() => {
            window.map.addOverlay(myMarker)
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
      this.$axios({
        method: 'get',
        url: 'http://47.112.255.207:8081/test',
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        console.log(res.data)
        alert('成功')
      }).catch(error => {
        console.log('失败')
        console.log(error)
      })
    }
  }
}
</script>
<style>
  .allmap{
    margin-top: 50px;
    width: 100%;
    height: 100%;
  }
  .map {
    width: 100%;
    height: 500px;
  }
</style>
