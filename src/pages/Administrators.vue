<template>
  <div class="allmap">
    <baidu-map :mapClick="false" :center="center" :zoom="zoom" @ready="handler" style="height:1080px" :scroll-wheel-zoom='true'>
    </baidu-map>
  </div>
</template>

<script>
export default {
  name: 'Administrators',
  data () {
    return {
      center: {lng: 121.833138, lat: 39.081725},
      zoom: 12,
      mapVisible: false,
      boss: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handler ({BMap, map}) {
      let _this = this // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        _this.center = {lng: r.longitude, lat: r.latitude} // 设置center属性值
        _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude} // 自定义覆盖物
        _this.initLocation = true
      }, {enableHighAccuracy: true})

      window.map = map
    },
    init () {
      let _this = this
      this.$axios({
        method: 'get',
        url: 'http://47.112.255.207:8081/searchAllBoss'
      }).then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
          _this.boss.push(res.data.data[i].username)
        }
        console.log(_this.boss)
        _this.getaddree()
      }).catch(error => {
        console.log('获取信息失败')
        alert('获取信息失败')
        console.log(error)
      })
    },
    getaddree () {
      for (let i = 0; i < this.boss.length; i++) {
        console.log(this.boss)
        this.$axios.get('http://47.112.255.207:8081/findShopByBName', {
          Headers: {
            'Authorization': ' '
          },
          params: {
            username: this.boss[i]
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
              let name = res.data.data[i].username
              let address = res.data.data[i].address
              gc.getLocation(point, res => {
                window.map.addOverlay(myMarker)
                this.addMouseover(myMarker, address, name, point)
                this.addMouseout(myMarker, address, name, point)
              })
            }
          }
          if (res.data.code === 401) {
            alert('返回店铺失败')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
      }
    },
    addMouseover (myMarker, address, name, point) {
      let opts = {
        width: 50,
        height: 50,
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
          context = res.data.data
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
        }).catch(err => {
          console.log(err)
        })
        let shopadd = '<table>'
        shopadd = shopadd + '<tr><td> 店内人数：' + context + '</td></tr>'
        shopadd = shopadd + '<tr><td> 店主名字：' + name + '</td></tr>'
        shopadd += '</table>'
        let infoWindow = new BMap.InfoWindow(shopadd, opts)
        window.map.openInfoWindow(infoWindow, point)
      })
    },
    addMouseout (myMarker, address, name, point) {
      let context = ''
      let opts = {
        width: 50,
        height: 50,
        title: '当前店内人数'
      }
      myMarker.addEventListener('mouseout', e => {
        console.log('1')
        let shopadd = '<table>'
        shopadd = shopadd + '<tr><td> 店内人数：' + context + '</td></tr>'
        shopadd = shopadd + '<tr><td> 店主名字：' + name + '</td></tr>'
        shopadd += '</table>'
        let infoWindow = new BMap.InfoWindow(shopadd, opts)
        window.map.closeInfoWindow(infoWindow, point)
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
</style>
