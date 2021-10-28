<template>
  <div>
    <input
      ref="excel-upload-input"
      accept=".xlsx, .xls"
      class="excel-upload-input"
      type="file"
      @change="handleClick"
    >
    <el-button
      :loading="loading"
      icon="el-icon-upload"
      style="margin-left: 16px"
      type="primary"
      @click="handleUpload"
    >
      导入
    </el-button>
    <el-checkbox v-model="doCheck" style="margin-left: 10px">后台检查</el-checkbox>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import RecordAPI from '@/api/record'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function // eslint-disable-line
  },
  data() {
    return {
      loading: false,
      doCheck: true,
      errorsList: [],
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({header, results}) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('一次只能上传一个文件!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('只支持.xlsx, .xls, .csv格式!')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.$confirm('已选中一个文件，是否开始上传?', '提示', {
        confirmButtonText: '开始',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upload(rawFile)
      }).catch(() => {
      })
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // 上传到后端
        const data = new FormData()
        data.append('file', rawFile)
        console.log(this.doCheck ? '后台开启检查' : '后台关闭检查')
        RecordAPI.uploadExcel(data, this.doCheck).then((response) => {
          console.log(this.doCheck)
          if (response.code === 200) {
            // 前端展示处理
            const reader = new FileReader()
            reader.onload = (e) => {
              const data = e.target.result
              const workbook = XLSX.read(data, {type: 'array'})
              const firstSheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[firstSheetName]
              const header = this.getHeaderRow(worksheet)
              const results = XLSX.utils.sheet_to_json(worksheet)
              this.generateData({header, results})
            }
            reader.readAsArrayBuffer(rawFile)
            this.loading = false
            this.$alert(response.msg, '所有记录上传成功', {
              type: 'success'
            })
          } else {
            this.errorsList = response.extra.errors
            this.$alert('部分记录上传失败，具体原因请查看excel《错误信息汇总》', '部分记录上传失败', {
              type: 'error'
            })
            this.handleDownload()
            this.loading = false
          }
          resolve()
        })
      })
    },

    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    },
    // 导出excel错误信息
    handleDownload() {
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          'sheet名称',
          '错误类型',
          '总序号',
          '学校名称',
          '学科专业名称',
          '学科专业代码',
          '教师姓名',
          '课题名称',
          '项目名称'
        ]
        const filterVal = [
          'sheetName',
          'errorType',
          'rowIndex',
          'schoolName',
          'subjectName',
          'subjectCode',
          'teacherName',
          'taskName',
          'projectName'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '错误信息汇总'
        })
      })
    },

    // json转化为object
    formatJson(filterVal) {
      return this.errorsList.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
