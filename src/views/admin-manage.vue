<template>
  <div class="app-container">
    <!-- 数据展示 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 90%; margin-left: 5%"
    >
      <el-table-column fixed="left" align="center" label="序号" min-width="50" prop="num">
        <template slot-scope="{ $index }">
          <span>{{ (listQuery.page - 1) * listQuery.limit + $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" align="center" label="管理员id" min-width="50" prop="id">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="管理员名称" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="管理员类型" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ row.type === 'super' ? '超级管理员' : '普通管理员' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最新修改时间" min-width="180">
        <template slot-scope="{ row }">
          <span>{{
            new Date(row.gmtModified).toLocaleDateString() +
              ' ' +
              new Date(row.gmtModified).toLocaleTimeString()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="180">
        <template slot-scope="{ row }">
          <span>{{
            new Date(row.gmtCreate).toLocaleDateString() +
              ' ' +
              new Date(row.gmtCreate).toLocaleTimeString()
          }}</span>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column
        v-if="type === 'super'"
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        min-width="180"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.type !== 'super'"
            size="medium"
            type="primary"
            @click="handleChangePassword(row, $index)"
          >
            修改密码
          </el-button>
          <el-button
            v-if="row.type != 'super'"
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

    <!-- 修改密码栏 -->
    <el-dialog :visible.sync="dialogFormVisible" title="修改密码">
      <el-form
        ref="dataForm"
        :model="changePasswordData"
        :rules="rules"
        label-position="left"
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户" prop="name">
          <el-input v-model="changePasswordData.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="新密码" prop="password1">
          <el-input v-model="changePasswordData.password1" />
        </el-form-item>
        <el-form-item label="新密码" prop="password2">
          <el-input v-model="changePasswordData.password2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消</el-button>
        <el-button type="primary" @click="changePassword()"> 确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MiddleUtil from '@/utils/MiddleUtil'
import AdminAPI from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getId, getType } from '@/utils/auth' // get type from cookie

export default {
  name: 'AdminManage',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    const passwordRegex = new RegExp('[a-zA-Z0-9].{5,18}')
    // 验证修改密码or注册  一次密码的合法性
    const validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (!passwordRegex.test(value)) {
        callback(new Error('密码:6-18位字母或数字'))
      } else {
        callback()
      }
    }

    // 验证修改密码 二次密码的一致性
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordData.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      id: getId(),
      type: getType(),
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      changePasswordData: {
        id: undefined,
        name: undefined,
        password1: '',
        password2: ''
      },
      dialogFormVisible: false, // 更改栏是否展示
      // 数据项的约束

      rules: {
        password1: [
          { required: true, validator: validatePass1, trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      ModifyIndex: -1,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      layout1: 'total, sizes, prev, next',
      layout2: 'total, sizes, prev, pager, next, jumper'
    }
  },
  created() {
    this.listAll()
    // console.log(this.id);
  },
  mounted() {
    var that = this
    // 传递更新列表方法  供注册管理后调用
    MiddleUtil.$on('register', function(msg) {
      console.log(msg)
      that.listAll()
    })
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
    // 获取所有管理员
    listAll() {
      AdminAPI.listAll(this.listQuery).then((response) => {
        if (response.code === 200) {
          this.list = response.extra.admins
          this.total = response.extra.total
        } else {
          this.$message({
            message: '网络错误',
            type: 'error',
            duration: 3000
          })
        }
      })
    },

    // 分页操作
    handlePagination(val) {
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
      this.listAll()
    },

    // 重置数据
    resetData() {
      this.changePasswordData = {
        id: undefined,
        password1: '',
        password2: ''
      }
    },

    // 更新记录
    handleChangePassword(row, index) {
      this.ModifyIndex = index // 当前修改的row
      this.changePasswordData = Object.assign({}, row) // copy obj

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 更新记录
    changePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            id: this.changePasswordData.id,
            newPassword: this.changePasswordData.password1
          }
          AdminAPI.changePassword(tempData).then((response) => {
            if (response.code === 200) {
              this.dialogFormVisible = false
              this.list[this.ModifyIndex].gmtModified = new Date().getTime()
              this.tableKey = Math.random()
              this.$notify({
                title: 'Success',
                message: '密码修改成功',
                type: 'success',
                duration: 3000
              })
            } else {
              this.$notify({
                title: 'Fail',
                message: '密码修改失败',
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
          AdminAPI.deleteAdmin(row.id).then((response) => {
            if (response.code === 200) {
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 3000
              })
              this.list.splice(index, 1)
              // 当前列表记录都被删除 当前页码减一
              if (this.list.length === 0) {
                this.listQuery.page = Math.max(this.listQuery.page - 1, 1)
              }
              this.listAll()
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
    }
  }
}
</script>
