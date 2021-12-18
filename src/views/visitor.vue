<template>
  <div class="app-container">
    <div class="welcome_header">
      国内访问学者查询系统
    </div>
    <el-divider />
    <div class="krl">
      <el-row :gutter="10">
        <el-col class="krl2" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
          <el-select
            v-model="listQuery.projectName"
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
        <el-col class="krl2" :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
          <el-select
            v-model="listQuery.schoolName"
            :disabled="listQuery.projectName === ''"
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
        <el-col class="krl2" :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
          <el-select
            v-model="listQuery.subjectName"
            :disabled="listQuery.schoolName === ''"
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
        <el-col class="krl2" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
          <el-button
            v-waves
            :disabled="
              this.listQuery.projectName === '' ||
                this.listQuery.schoolName === '' ||
                this.listQuery.subjectName === ''
            "
            icon="el-icon-search"
            type="primary"
            style="width: 100%"
            @click="handleListByCombination"
          >
            搜索
          </el-button>
        </el-col>
        <el-col class="krl2" :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
          <!-- 模糊搜索栏 -->
          <el-input
            v-model="listQuery.teacherName"
            placeholder="导师姓名"
            style="width: 100%"
            @keyup.enter.native="handleListByTeacher"
          />
        </el-col>
        <el-col class="krl2" :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
          <el-button
            v-waves
            :disabled="this.listQuery.teacherName === ''"
            icon="el-icon-search"
            type="primary"
            style="width: 100%"
            @click="handleListByTeacher"
          >
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>

    <p style="width:80%;margin-left:10%;margin-top: 30px">
      <el-row style="display: inline-block; font-size: 1rem">
        <span>
          {{ noticeContent }}
        </span>
      </el-row>
    </p>

    <!-- 数据展示 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 80%; margin-left: 10%; margin-top: 30px"
    >
      <el-table-column fixed="left" align="center" label="序号" min-width="50" prop="id">
        <template slot-scope="{ $index }">
          <span>{{ (listQuery.page - 1) * listQuery.limit + $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="学校" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ row.schoolName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="学科专业名称" min-width="120">
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
        min-width="140"
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
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :total="total"
      style="text-align: center"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
import RecordAPI from '@/api/record'
import NoticeAPI from '@/api/notice'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Visitor',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      projectList: [],
      schoolList: [],
      subjectList: [],
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        teacherName: '',
        projectName: '',
        schoolName: '',
        subjectName: ''
      },
      presentedData: '', // 展示组合搜索的数据  还是教师名称搜索的数据
      noticeContent: '',
      noticeTime: ''
    }
  },
  created() {
    // 获取所有项目名称
    this.listProjects()
    this.getLatestNotice()
  },
  methods: {
    init() {
    },

    // 查询最新的通知
    getLatestNotice() {
      NoticeAPI.getLatestNotice().then((response) => {
        this.noticeContent = response.extra.notice.content
        this.noticeTime = response.extra.notice.gmtCreate
      })
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
        query.projectName === '' ||
        query.schoolName === '' ||
        query.subjectName === ''
      ) {
        this.$message({
          message: '组合搜索栏存在空项!',
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
        this.listByTeacher()
      } else {
        this.listByCombination()
      }
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

    // 重置组合搜索栏信息，任何更新可能导致其变化
    resetCombinationSearch() {
      this.listProjects()
      this.listQuery.subjectName = ''
      this.listQuery.projectName = ''
      this.listQuery.schoolName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome_header {
  text-align: center;
  font-size: min(5vw,60px);
  color: #0095da;
}

.krl {
  width: 80%;
  margin-left: 10%;
  //margin: 0 50px 0 50px;
}

.krl2{
  margin-top: 10px;
}

.visitor-filter-container{
  //z-index:999;
  //background-image: url("../assets/welcome-search.png");
  //background-size: auto;
  //background-size: cover;
}

</style>
