<template>
  <div class="app-container">
    <upload-excel-component
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
    />
    <!-- <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table> -->
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (isLt2M) {
        RecordUtil.uploadExcel(file).then((response) => {
          if (response.code == 200) {
            this.$message({
              message: '上传成功！',
              type: 'success',
              duration: 3000
            })
          } else {
            this.$message({
              message: '上传失败！',
              type: 'warning',
              duration: 3000
            })
          }
        })
        return true
      }

      this.$message({
        message: '文件大小不能超过2M！',
        type: 'warning',
        duration: 3000
      })
      return false
    },
    handleSuccess({ results, header }) {

      // this.tableData = results
      // this.tableHeader = header
    }
  }
}
</script>
