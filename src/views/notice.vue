<template>
  <div class="app-container">
    <el-row>
      <el-input
        ref="noticeInput"
        v-model="noticeContent"
        :autosize="{ minRows: 4, maxRows: 4 }"
        type="textarea"
        style="margin-top: 10px; width: 70%; margin-left: 15%;font-size:18px"
      />
    </el-row>
    <div align="center" style="margin-top:30px">
      <!--        <el-button @click="dialogFormVisible = false"> 取消</el-button>-->
      <el-button
        type="primary"
        style=""
        @click="postNotice()"
      >
        发布通知
      </el-button>
    </div>
  </div>
</template>

<script>
import NoticeAPI from '@/api/notice'

export default {
  data() {
    return {
      noticeContent: ''
    }
  },
  created() {
    // 获取所有项目名称
    this.getLatestNotice()
  },
  methods: {
    // 查询最新的通知
    getLatestNotice() {
      NoticeAPI.getLatestNotice().then((response) => {
        this.noticeContent = response.extra.notice.content
      })
    },
    postNotice() {
      if (this.noticeContent === '') {
        this.$message({
          type: 'info',
          message: '通知不能为空'
        })
      } else {
        console.log(this.noticeContent)
        NoticeAPI.postNotice(this.noticeContent).then((response) => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '通知发布成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '通知发布失败'
            })
          }
        })
      }
    }
  }
}
</script>
