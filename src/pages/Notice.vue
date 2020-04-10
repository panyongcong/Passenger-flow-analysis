<template>
  <div v-if="showpage">
    <div style="width: 100%;height: 50px" v-if="showadd">
      <el-button type="primary" size="small" style="float: right;margin-top: 5px;margin-right: 5px;background-color: white;color: black;border: 0;" @click="Release">
        <img src="../assets/images/edit.png">
      </el-button>
    </div>
    <el-row v-for="(item, index) in noticdata"
            :key="index">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>公告</span>
          <el-button style="float: right; padding: 3px 0; margin-left: 5px" type="text" @click="del(index)">删除</el-button>
          <el-button style="float: right; padding: 3px 0" type="text" @click="See(index)">查看</el-button>
        </div>
        <div>
          {{item.notice}}
        </div>
        <div class="bottom clearfix" style="font-size: 8px;color: #8c939d">
          <time class="time" style="float: left;margin-right: 5px">{{ item.date }}</time>
          <div :style="{color: item.status === '已读' ? 'blue' : 'red'}">{{item.status}}</div>
        </div>
      </el-card>
    </el-row>
    <el-dialog title="发布公告" :visible.sync="dialogFormVisible"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               width="40%">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnnotice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="店主公告" :visible="dialogFormSee"
               :close-on-press-escape="false"
               width="40%">
      <div style="font-size: 10px">
        {{contentdate}}
      </div>
      <br>
      <div style="font-size: 20px">
        {{content}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSee = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormSee = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'Notice',
  data () {
    return {
      noticdata: [],
      noticdata1: [],
      dialogFormVisible: false,
      textarea: '',
      gettime: '',
      dialogFormSee: false,
      content: '',
      contentdate: '',
      showadd: true,
      showpage: false,
      showdel: false
    }
  },
  created () {
    this.checkPrivilege()
  },
  methods: {
    checkPrivilege () {
      let role = localStorage.getItem('userRole')
      if (role === 'boss') {
        this.showadd = true
        this.showdel = true
      } else {
        this.showadd = false
        this.showdel = false
      }
      this.$axios.get('http://47.112.255.207:8081/checkBoss_NoticePermission', {
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.showpage = true
          this.init()
        }
        if (res.data.code === 401) {
          console.log('服务器错误')
        }
        if (res.data.code === 443) {
          this.showpage = false
          this.$router.push('/Noauthority')
        }
      })
    },
    init () {
      this.$axios.get('http://47.112.255.207:8081/getBoss_Notice', {
        Headers: {
          'Authorization': ' '
        },
        params: {
          username: localStorage.getItem('name')
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.noticdata1 = res.data.data
          this.noticdata = res.data.data
          for (let i = 0; i < this.noticdata1.length; i++) {
            let value = this.noticdata1[i].date
            var dateee = new Date(value).toJSON()
            this.noticdata1[i].date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            if (this.noticdata1[i].status === 0) {
              this.noticdata1[i].status = '已读'
            } else {
              this.noticdata1[i].status = '未读'
            }
          }
          console.log(this.noticdata)
        }
        if (res.data.code === 401) {
          alert('服务器错误')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    del (index) {
      var param = {username: this.noticdata[index].username, id: this.noticdata[index].id}
      let message = '确定删除内容为：' + this.noticdata[index].notice + '的公告吗?'
      MessageBox.confirm(message, '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('http://47.112.255.207:8081/deleteBoss_Notice', {params: param}).then(res => {
          if (res.data.code === 200) {
            this.init()
          }
          if (res.data.code === 402) {
            Message.warning('公告删除失败')
          }
          if (res.data.code === 444) {
            alert('未登录')
            this.$router.push('/')
          }
        }).catch(error => {
          console.log('失败')
          console.log(error)
        })
      }).catch()
    },
    Release () {
      this.dialogFormVisible = true
    },
    btnnotice () {
      let _this = this
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      let noticedata = {}
      noticedata.username = this.$store.state.bossname
      noticedata.notice = _this.textarea
      noticedata.date = _this.gettime
      noticedata = this.$qs.stringify(noticedata)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/editBoss_Notice',
        data: noticedata,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.dialogFormVisible = false
          Message.success('操作成功')
          this.init()
        }
        if (res.data.code === 401) {
          Message.warning('操作失败')
        }
      })
    },
    See (index) {
      this.content = this.noticdata[index].notice
      this.contentdate = this.noticdata[index].date
      this.dialogFormSee = true
      let senddata = {}
      senddata.username = this.noticdata[index].username
      senddata.status = 0
      senddata.id = this.noticdata[index].id
      senddata = this.$qs.stringify(senddata)
      console.log(senddata)
      this.$axios({
        method: 'post',
        url: 'http://47.112.255.207:8081/changeBoss_NoticeStatus',
        data: senddata,
        Headers: {
          'Authorization': ' '
        },
        crossDomain: true
      }).then(res => {
        if (res.data.code === 200) {
          this.init()
          console.log(res.data.data)
          console.log('成功')
        }
        if (res.data.code === 401) {
          console.log('服务器错误')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    margin: 0 auto;
    margin-top: 30px;
    width: 80%;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
</style>
