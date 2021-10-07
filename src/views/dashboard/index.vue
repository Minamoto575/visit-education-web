<template>
  <div class="app-container">
    <div class="filter-container" style="text-align:center">
      <!-- 模糊搜索栏 -->
      <el-input
        v-model="listQuery.teacherName"
        placeholder="导师名称"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleListByTeacher"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-right: 10px"
        icon="el-icon-search"
        :disabled="this.listQuery.teacherName === ''"
        @click="handleListByTeacher"
      >
        搜索
      </el-button>

      <!-- 组合搜索栏 -->
      <el-select
        v-model="listQuery.projectName"
        placeholder="项目名称"
        clearable
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @change="projectChanged"
      >
        <el-option
          v-for="item in projectList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-select
        v-model="listQuery.schoolName"
        placeholder="学校名称"
        clearable
        :disabled="listQuery.projectName === ''"
        class="filter-item"
        style="width: 200px; margin-right: 10px"
        @change="schoolChanged"
      >
        <el-option
          v-for="item in schoolList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-select
        v-model="listQuery.subjectName"
        placeholder="学科名称"
        clearable
        :disabled="listQuery.schoolName === ''"
        disabele
        class="filter-item"
        style="width: 200px; margin-right: 10px"
      >
        <el-option
          v-for="item in subjectList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        :disabled="
          this.listQuery.projectName === '' ||
          this.listQuery.schooletName === '' ||
          this.listQuery.subjectName === ''
        "
        icon="el-icon-search"
        @click="handleListByCombination"
      >
        搜索
      </el-button>
    </div>

    <!-- 数据展示 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 98%;margin-left:1%"
    >
      <el-table-column label="序号" prop="id" align="center" min-width="5%">
        <template slot-scope="{ $index }">
          <span>{{ (listQuery.page - 1) * listQuery.limit + $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="学校" min-width="8%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.schoolName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="学科专业名称" min-width="12%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.subjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学科专业代码" min-width="6%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.subjectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导师姓名" min-width="8%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.teacherName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="课题名称"
        min-width="14%"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="12%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="text-align:center"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
import RecordAPI from "@/api/record";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "VisitorTable",
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
        teacherName: "",
        projectName: "",
        schoolName: "",
        subjectName: "",
      },

      presentedData: "", //展示组合搜索的数据  还是教师名称搜索的数据
    };
  },
  created() {
    //获取所有项目名称
    this.listProjects();
  },
  methods: {
    init() {},

    //查询系统所有项目
    listProjects() {
      RecordAPI.listProjects().then((response) => {
        this.projectList = response.extra.projects;
      });
    },

    //组合查询
    handleListByCombination() {
      this.listQuery.page = 1;
      this.presentedData = "combination";
      this.listByCombination();
    },

    //组合查询
    listByCombination() {
      this.listLoading = true;
      RecordAPI.searchByCombination(this.listQuery).then((response) => {
        this.list = response.extra.records;
        this.total = response.extra.total;
        if (this.list.length === 0) {
          this.$message({
            message: "未找到相应的记录",
            type: "info",
          });
        }
      });
      this.listLoading = false;
    },

    //根据教师名称模糊查询
    handleListByTeacher() {
      this.listQuery.page = 1;
      this.presentedData = "teacher";
      this.listByTeacher();
    },

    //根据教师名称模糊查询
    listByTeacher() {
      if (this.listQuery.teacherName !== "") {
        this.listLoading = true;
        RecordAPI.searchByTeacherName(this.listQuery).then((response) => {
          this.list = response.extra.records;
          this.total = response.extra.total;
          if (this.list.length === 0) {
            this.$message({
              message: "未找到相应的记录",
              type: "info",
            });
          }
        });
        this.listLoading = false;
      }
    },

    //分页操作
    handlePagination(val) {
      console.log(val);
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      if (this.presentedData === "teacher") {
        this.listByTeacher();
      } else {
        this.listByCombination();
      }
    },

    //组合搜索栏项目发送改变触发
    projectChanged(value) {
      this.listQuery.schoolName = "";
      this.listQuery.subjectName = "";
      this.subjectList = [];

      if (value !== null) {
        var data = {
          projectName: value,
        };
        RecordAPI.listSchools(data).then((response) => {
          this.schoolList = response.extra.schools;
        });
      } else {
        this.schoolList = [];
      }
    },

    //组合搜索栏学校发生改变触发
    schoolChanged(value) {
      this.listQuery.subjectName = "";
      var projectName = this.listQuery.projectName;

      if (value !== null) {
        var data = {
          projectName: projectName,
          schoolName: value,
        };
        RecordAPI.listSujects(data).then((response) => {
          this.subjectList = response.extra.subjects;
        });
      } else {
        this.subjectList = [];
      }
    },

    //重置组合搜索栏信息，任何更新可能导致其变化
    resetCombinationSearch() {
      this.listProjects();
      this.listQuery.subjectName = "";
      this.listQuery.projectName = "";
      this.listQuery.schoolName = "";
    },
  },
};
</script>
