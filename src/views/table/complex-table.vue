<template>
  <div class="app-container">
    <div class="filter-container" style="text-align:center">
      <!-- 模糊搜索栏 -->
      <el-input
        v-model="listQuery.teacherName"
        placeholder="导师姓名"
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

      <!-- 添加记录 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>

      <!-- excel导入 -->
      <upload-excel-component
        class="filter-item"
        style="margin-left: -5px; margin-right: 10px"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
      />

      <!-- excel导出 -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        :disabled="this.list.length === 0"
      >
        导出
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

      <!-- 操作栏 -->
      <el-table-column
        label="操作"
        align="center"
        min-width="10%"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="medium"
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
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="text-align:center"
      @pagination="handlePagination"
    />

    <!-- 修改栏、添加栏 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="学校" prop="schoolName">
          <el-input v-model="temp.schoolName" />
        </el-form-item>
        <el-form-item label="学科专业名称" prop="subjectName">
          <el-input v-model="temp.subjectName" />
        </el-form-item>
        <el-form-item label="学科专业代码" prop="subjectCode">
          <el-input v-model="temp.subjectCode" />
        </el-form-item>
        <el-form-item label="导师姓名" prop="teacherName">
          <el-input v-model="temp.teacherName" />
        </el-form-item>
        <el-form-item label="课题名称" prop="taskName">
          <el-input
            v-model="temp.taskName"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 4, maxRows: 4 }"
          />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="temp.projectName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
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
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import RecordAPI from "@/api/record";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination, UploadExcelComponent },
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
      temp: {
        id: undefined,
        schoolName: "",
        subjectName: "",
        subjectCode: "",
        teacherName: "",
        taskName: "",
        projectName: "",
      },
      dialogFormVisible: false, //添加更改栏是否展示
      dialogStatus: "", //修改 or  添加
      textMap: {
        update: "修改",
        create: "添加",
      },
      //数据项的约束
      rules: {
        schoolName: [
          { required: true, message: "学校不能为空", trigger: "blur" },
        ],
        subjectName: [
          { required: true, message: "专业名称不能为空", trigger: "blur" },
        ],
        subjectCode: [
          { required: true, message: "专业代码不能为空", trigger: "blur" },
        ],
        teacherName: [
          { required: true, message: "导师姓名不能为空", trigger: "blur" },
        ],
        taskName: [
          { required: true, message: "课题名称不能为空", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
      },
      downloadLoading: false,
      ModifyIndex: -1,
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
    //重置记录的中间结果
    resetTemp() {
      this.temp = {
        id: undefined,
        teschoolName: "",
        subjectName: "",
        subjectCode: "",
        teacherName: "",
        taskName: "",
        projectName: "",
      };
    },

    //添加记录
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //添加记录
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          RecordAPI.postRecrod(this.temp).then((response) => {
            if (response.code === 200) {
              this.temp.id = response.extra.id;
              this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.resetCombinationSearch();
              this.$notify({
                title: "Success",
                message: "添加成功",
                type: "success",
                duration: 1500,
              });
            } else if (response.code === 202) {
              this.$message({
                type: "warning",
                message: "已存在该记录",
                duration: 2000,
              });
            } else {
              this.$notify({
                title: "Fail",
                message: "添加失败",
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },

    //更新记录
    handleUpdate(row, index) {
      this.ModifyIndex = index; //当前修改的row
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //更新记录
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          RecordAPI.updateRecord(tempData).then((response) => {
            if (response.code === 200) {
              this.dialogFormVisible = false;
              this.list[this.ModifyIndex] = Object.assign({}, this.temp);
              console.log(this.list[this.ModifyIndex]);
              //this.tableKey = Math.random();
              this.tableKey = Math.random();
              this.resetCombinationSearch();
              this.$notify({
                title: "Success",
                message: "修改成功",
                type: "success",
                duration: 2000,
              });
            } else {
              this.$notify({
                title: "Fail",
                message: "修改失败",
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },

    //删除某条记录
    handleDelete(row, index) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          RecordAPI.deleteRecord(row.id).then((response) => {
            if (response.code === 200) {
              this.$notify({
                title: "Success",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
              this.list.splice(index, 1);
              //列表所有均被删除
              if (this.list.length === 0) {
                this.resetCombinationSearch();
              }
            } else {
              this.$notify({
                title: "Fail",
                message: "删除失败",
                type: "error",
                duration: 2000,
              });
            }
          });
        })
        .catch(() => {});
    },

    //导出excel
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "总序号",
          "学校名称",
          "学科专业名称",
          "学科专业代码",
          "教师姓名",
          "课题名称",
          "项目名称",
        ];
        const filterVal = [
          "id",
          "schoolName",
          "subjectName",
          "subjectCode",
          "teacherName",
          "taskName",
          "projectName",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "导出名单",
        });
        this.downloadLoading = false;
      });
    },

    //json转化未object
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
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
    //导入excel前的验证
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        return true;
      }
      this.$message({
        message: "文件大小不能超过2M！",
        type: "warning",
      });
      return false;
    },

    // excel上传成功
    uploadSuccess({ results, header }) {
      this.resetCombinationSearch();
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
