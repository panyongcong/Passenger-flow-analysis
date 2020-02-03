<template>
  <div class="shopinfo-main">
    <el-button type="primary" round>添加店面</el-button>
    <div class="allmap">
      <baidu-map class="bm-view" ak="OSCnM1z1OLFZMMrqjevm77yy8fbYMxbT">
      </baidu-map>
    </div>
  </div>
</template>
<script>
export default {
  name: 'shopinfo'
}
</script>
<style>
  .allmap{
    width: 100%;
    height: 300px;
  }
  .bm-view {
    width: 100%;
    height: 300px;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
