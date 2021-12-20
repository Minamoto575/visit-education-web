<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <!-- 模糊搜索栏 -->
        <el-col :xs="12" :sm="12" :md="6" :lg="4" :xl="2">
          <el-input
            v-model="listQuery.teacherName"
            class="filter-item"
            placeholder="导师姓名"
            style="width: 100%"
            @keyup.enter.native="handleListByTeacher"
          />
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="4" :xl="2">
          <el-button
            v-waves
            :disabled="this.listQuery.teacherName === ''"
            class="filter-item"
            icon="el-icon-search"
            type="primary"
            style="width: 100%"
            @click="handleListByTeacher"
          >
            搜索
          </el-button>
        </el-col>

        <!-- 组合搜索栏 -->
        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="4">
          <el-select
            v-model="listQuery.projectName"
            class="filter-item"
            clearable
            placeholder="项目名称"
            style="width: 100%"
            @change="projectChanged"
          >
            <el-option
              v-for="item in projectList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
          <el-select
            v-model="listQuery.schoolName"
            :disabled="listQuery.projectName === ''"
            class="filter-item"
            clearable
            placeholder="学校名称"
            style="width: 100%"
            @change="schoolChanged"
          >
            <el-option
              v-for="item in schoolList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
          <el-select
            v-model="listQuery.subjectName"
            :disabled="listQuery.schoolName === ''"
            class="filter-item"
            clearable
            disabele
            placeholder="学科名称"
            style="width: 100%"
          >
            <el-option
              v-for="item in subjectList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="2">
          <el-button
            v-waves
            :disabled=" this.listQuery.projectName === '' "
            class="filter-item"
            icon="el-icon-search"
            type="primary"
            style="width: 100%"
            @click="handleListByCombination"
          >
            搜索
          </el-button>
        </el-col>
        <el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="2">
          <el-button
            v-waves
            :disabled="this.listQuery.projectName === ''"
            class="filter-item"
            icon="el-icon-delete"
            type="primary"
            style="width: 100%"
            @click="handleDeleteBatch"
          >
            批量删除
          </el-button>
        </el-col>
        <el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="2">
          <el-button
            class="filter-item"
            icon="el-icon-edit"
            type="primary"
            style="width: 100%"
            @click="handleCreate"
          >
            添加
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
          <!-- excel导入 -->
          <upload-excel-component
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            class="filter-item"
            type="primary"
            style="width: 100%"
          />
        </el-col>
      </el-row>

      <!-- excel导出 -->
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        :disabled="this.list.length === 0"
      >
        导出
      </el-button> -->
    </div>
    <!-- 数据展示 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column fixed="left" align="center" label="序号" min-width="50" prop="id">
        <template slot-scope="{ $index }">
          <span>{{ (listQuery.page - 1) * listQuery.limit + $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="学校" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.schoolName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="学科专业名称" min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.subjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学科专业代码" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.subjectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导师姓名" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.teacherName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="课题名称"
        min-width="200"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" min-width="220">
        <template slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        min-width="180"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            size="medium"
            type="primary"
            @click="handleUpdate(row, $index)"
          >
            修改
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="medium"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :small="screenWidth < 800"
      :layout="screenWidth < 800 ? layout1 : layout2"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :total="total"
      style="text-align: center"
      @pagination="handlePagination"
    />

    <!-- 修改栏、添加栏 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
      >
        <el-form-item prop="schoolName">
          <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
            <el-input v-model="temp.schoolName" placeholder="学校名称" suffix-icon="" />
          </el-col>
        </el-form-item>
        <el-form-item prop="subjectName">
          <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
            <el-input v-model="temp.subjectName" placeholder="学科专业名称" />
          </el-col>
        </el-form-item>
        <el-form-item prop="subjectCode">
          <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
            <el-input v-model="temp.subjectCode" placeholder="学科专业代码" />
          </el-col>
        </el-form-item>
        <el-form-item prop="teacherName">
          <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
            <el-input v-model="temp.teacherName" placeholder="导师姓名" />
          </el-col>
        </el-form-item>
        <el-form-item prop="taskName">
          <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
            <el-input
              v-model="temp.taskName"
              placeholder="课题名称"
              :autosize="{ minRows: 1, maxRows: 2 }"
              resize="none"
              type="textarea"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="projectName">
          <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
            <el-input v-model="temp.projectName" placeholder="项目名称" />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogFormVisible = false"> 取消</el-button>-->
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import RecordAPI from '@/api/record'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'RecordManage',
  components: { Pagination, UploadExcelComponent },
  directives: { waves },
  filters: {},
  data() {
    return {
      projectList: [], // 项目列表
      schoolList: [], // 学校列表
      subjectList: [], // 课题列表
      tableKey: 0,
      list: [], // 展示的数据列表（只是分页的数据）
      total: 0, // 数据总数
      listLoading: false, // 加载标识符
      // 进行查询用到的数据
      listQuery: {
        page: 1,
        limit: 10,
        teacherName: '',
        projectName: '',
        schoolName: '',
        subjectName: ''
      },
      temp: {
        id: undefined,
        schoolName: '',
        subjectName: '',
        subjectCode: '',
        teacherName: '',
        taskName: '',
        projectName: ''
      },
      dialogFormVisible: false, // 添加更改栏是否展示
      dialogStatus: '', // 修改 or  添加
      textMap: {
        update: '修改记录',
        create: '添加记录'
      },
      // 数据项的约束
      rules: {
        schoolName: [
          { required: true, message: '学校不能为空', trigger: 'blur' }
        ],
        subjectName: [
          { required: true, message: '专业名称不能为空', trigger: 'blur' }
        ],
        subjectCode: [
          { required: true, message: '专业代码不能为空', trigger: 'blur' }
        ],
        teacherName: [
          { required: true, message: '导师姓名不能为空', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '课题名称不能为空', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      ModifyIndex: -1, // 当前修改数据项的索引
      presentedData: '', // 展示组合搜索的数据  还是教师名称搜索的数据
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      layout1: 'total, sizes, prev, next', // 分页布局1
      layout2: 'total, sizes, prev, pager, next, jumper' // 分页布局2
    }
  },
  created() {
    // 获取所有项目名称
    this.listProjects()

    // 获取所有记录
    this.listAllRecords()
  },
  mounted() {
    // 监视窗口宽度变化
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    init() {
    },
    // 获取所有记录
    listAllRecords() {
      this.listLoading = true
      RecordAPI.listAll(this.listQuery).then((response) => {
        if (response.code === 200) {
          this.list = response.extra.records
          this.total = response.extra.total
        } else {
          this.$message({
            message: '服务器出错!',
            type: 'error',
            duration: 3000
          })
        }
      })
      this.listLoading = false
    },
    // 查询系统所有项目
    listProjects() {
      RecordAPI.listProjects().then((response) => {
        this.projectList = response.extra.projects
      })
    },

    // 组合查询
    handleListByCombination() {
      this.listQuery.page = 1
      this.presentedData = 'combination'
      this.listByCombination()
    },

    // 组合查询
    listByCombination() {
      const query = this.listQuery
      if (
        query.projectName === ''
      ) {
        this.$message({
          message: '项目名称不能为空!',
          type: 'warning',
          duration: 3000
        })
      } else {
        this.listLoading = true
        RecordAPI.searchByCombination(this.listQuery).then((response) => {
          this.list = response.extra.records
          this.total = response.extra.total
          if (this.list.length === 0) {
            this.$message({
              message: '未找到相应的记录',
              type: 'warning',
              duration: 3000
            })
          }
        })
        this.listLoading = false
      }
    },

    // 根据教师名称模糊查询
    handleListByTeacher() {
      this.listQuery.page = 1
      this.presentedData = 'teacher'
      this.listByTeacher()
    },

    // 根据教师名称模糊查询
    listByTeacher() {
      if (this.listQuery.teacherName === '') {
        this.$message({
          message: '导师姓名不能为空!',
          type: 'warning',
          duration: 3000
        })
      } else {
        this.listLoading = true
        RecordAPI.searchByTeacherName(this.listQuery).then((response) => {
          this.list = response.extra.records
          this.total = response.extra.total
          if (this.list.length === 0) {
            this.$message({
              message: '未找到相应的记录',
              type: 'warning',
              duration: 3000
            })
          }
        })
        this.listLoading = false
      }
    },

    // 分页操作
    handlePagination(val) {
      console.log(val)
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
      if (this.presentedData === 'teacher') {
        // 导师名称模糊查询
        this.listByTeacher()
      } else if (this.presentedData === 'combination') {
        // 组合查询
        this.listByCombination()
      } else {
        // 查询所以数据
        this.listAllRecords()
      }
    },
    // 重置记录的中间结果
    resetTemp() {
      this.temp = {
        id: undefined,
        schoolName: '',
        subjectName: '',
        subjectCode: '',
        teacherName: '',
        taskName: '',
        projectName: ''
      }
    },

    // 添加记录
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 添加记录
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          RecordAPI.postRecord(this.temp).then((response) => {
            if (response.code === 200) {
              this.temp.id = response.extra.id
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.resetCombinationSearch()
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 3000
              })
            } else if (response.code === 202) {
              this.$message({
                type: 'warning',
                message: '已存在该记录',
                duration: 3000
              })
            } else {
              this.$notify({
                title: 'Fail',
                message: '添加失败',
                type: 'error',
                duration: 3000
              })
            }
          })
        }
      })
    },

    // 更新记录
    handleUpdate(row, index) {
      this.ModifyIndex = index // 当前修改的row
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 更新记录
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          RecordAPI.updateRecord(tempData).then((response) => {
            if (response.code === 200) {
              this.dialogFormVisible = false
              this.list[this.ModifyIndex] = Object.assign({}, this.temp)
              console.log(this.list[this.ModifyIndex])
              // this.tableKey = Math.random();
              this.tableKey = Math.random()
              this.resetCombinationSearch()
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
            } else {
              this.$notify({
                title: 'Fail',
                message: '修改失败',
                type: 'error',
                duration: 3000
              })
            }
          })
        }
      })
    },

    // 删除某条记录
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          RecordAPI.deleteRecord(row.id).then((response) => {
            if (response.code === 200) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 3000
              })
              this.list.splice(index, 1)
              // 列表所有均被删除
              if (this.list.length === 0) {
                if (this.listQuery.page === 1) {
                  // 全部删除则重置组合搜索栏
                  this.resetCombinationSearch()
                }
                this.listQuery.page = this.listQuery.page - 1
              }
              // 刷新列表
              if (this.listQuery.page > 0) {
                if (this.presentedData === 'teacher') {
                  this.listByTeacher()
                } else if (this.presentedData === 'combination') {
                  this.listByCombination()
                } else {
                  this.listAllRecords()
                }
              }
            } else {
              this.$notify({
                title: 'Fail',
                message: '删除失败',
                type: 'error',
                duration: 3000
              })
            }
          })
        })
        .catch(() => {
        })
    },

    // 批量删除记录 学科名称可以为空
    handleDeleteBatch() {
      if (this.listQuery.projectName === '') {
        this.$message({
          message: '项目名称不能为空',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.$confirm('此操作将永久这些记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          const data = {
            projectName: this.listQuery.projectName,
            schoolName: this.listQuery.schoolName,
            subjectName: this.listQuery.subjectName
          }
          RecordAPI.deleteBatch(data).then((response) => {
            if (response.code === 200) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 3000
              })
              // 更新项目列表
              this.listProjects()
              // 重置组合搜索栏
              this.resetCombinationSearch()
              // 删除后展示所以数据
              this.page = 1
              this.presentedData = 'all'
              this.listAllRecords()
            } else {
              this.$notify({
                title: 'Fail',
                message: '删除失败',
                type: 'error',
                duration: 3000
              })
            }
          })
        })
    },

    // 导出excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '总序号',
          '学校名称',
          '学科专业名称',
          '学科专业代码',
          '教师姓名',
          '课题名称',
          '项目名称'
        ]
        const filterVal = [
          'id',
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
          filename: '导出名单'
        })
        this.downloadLoading = false
      })
    },

    // json转化未object
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    },

    // 组合搜索栏项目发送改变触发
    projectChanged(value) {
      this.listQuery.schoolName = ''
      this.listQuery.subjectName = ''
      this.subjectList = []

      if (value !== null) {
        const data = {
          projectName: value
        }
        RecordAPI.listSchools(data).then((response) => {
          this.schoolList = response.extra.schools
        })
      } else {
        this.schoolList = []
      }
    },

    // 组合搜索栏学校发生改变触发
    schoolChanged(value) {
      this.listQuery.subjectName = ''
      const projectName = this.listQuery.projectName

      if (value !== null) {
        const data = {
          projectName: projectName,
          schoolName: value
        }
        RecordAPI.listSubjects(data).then((response) => {
          this.subjectList = response.extra.subjects
        })
      } else {
        this.subjectList = []
      }
    },
    // 导入excel前的验证
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (isLt2M) {
        return true
      }
      this.$message({
        message: '文件大小不能超过2M！',
        type: 'warning',
        duration: 3000
      })
      return false
    },

    // excel上传成功
    uploadSuccess({ results, header }) {
      this.listProjects()
      this.resetCombinationSearch()
      this.listQuery.page = 1
      this.listAllRecords()
    },

    // 重置组合搜索栏信息，任何更新可能导致其变化
    resetCombinationSearch() {
      this.listQuery.subjectName = ''
      this.listQuery.projectName = ''
      this.listQuery.schoolName = ''
    }
  }
}
</script>
