<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <!-- <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table> -->
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import RecordUtil from '@/api/record'

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
        return true
      }

      this.$message({
        message: '文件大小不能超过2M！',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      RecordUtil.uploadExcel(results).then(response =>{
        if(response.code==200){
          this.$message({
          message: '上传成功！',
          type: 'success'
          })
        }else{
          this.$message({
          message: '上传失败！',
          type: 'warning'
          })
        }
      })
      
      // this.tableData = results
      // this.tableHeader = header
    }
  }
}
</script>
