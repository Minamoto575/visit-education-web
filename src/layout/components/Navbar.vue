<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="字体大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided @click.native="handleChangePassword">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item
            v-if="this.type === 'super'"
            divided
            @click.native="handleRegister"
          >
            <span style="display: block">注册管理员</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 修改密码 -->
      <el-dialog
        :visible.sync="changePasswordFormVisible"
        append-to-body
        title="修改密码"
      >
        <el-form
          ref="changePasswordForm"
          :model="changePasswordData"
          :rules="changePasswordRules"
          label-position="left"
        >
          <el-form-item prop="name">
            <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
              <el-input v-model="changePasswordData.name" readonly suffix-icon="lock" />
            </el-col>
          </el-form-item>
          <el-form-item prop="oldPassword">
            <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
              <el-input v-model="changePasswordData.oldPassword" placeholder="旧密码" :minlength="4" :maxlength="18" clearable show-password />
            </el-col>
          </el-form-item>
          <el-form-item prop="newPassword1">
            <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
              <el-input v-model="changePasswordData.newPassword1" placeholder="新密码" :minlength="6" :maxlength="18" clearable show-password />
            </el-col>
          </el-form-item>
          <el-form-item prop="newPassword2">
            <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
              <el-input v-model="changePasswordData.newPassword2" placeholder="确认新密码" :minlength="6" :maxlength="18" clearable show-password />
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!--          <el-button @click="changePasswordFormVisible = false">-->
          <!--            取消-->
          <!--          </el-button>-->
          <el-button type="primary" @click="changePassword()"> 修改</el-button>
        </div>
      </el-dialog>

      <!-- 注册管理员 -->
      <el-dialog
        :visible.sync="registerFormVisible"
        append-to-body
        title="注册管理员"
      >
        <el-form
          ref="registerForm"
          :model="registerData"
          :rules="registerRules"
          label-position="left"
        >
          <el-form-item prop="name" style="vertical-align:middle;">
            <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
              <el-input v-model="registerData.name" placeholder="用户名" :minlength="4" :maxlength="18" clearable />
            </el-col>
          </el-form-item>
          <el-form-item prop="password1">
            <el-col :xs="24" :sm="16" :md="14" :lg="12" :xl="9">
              <el-input v-model="registerData.password1" placeholder="密码" :minlength="6" :maxlength="18" clearable show-password />
            </el-col>
          </el-form-item>
          <el-form-item prop="password2">
            <el-col :xs="24" :sm="16" :md="12" :lg="12" :xl="9">
              <el-input v-model="registerData.password2" placeholder="再输入一次密码" :minlength="6" :maxlength="18" clearable show-password />
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!--          <el-button @click="registerFormVisible = false"> 取消</el-button>-->
          <el-button type="primary" @click="register()"> 注册</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import AdminAPI from '@/api/user'
import { getId, getName, getType } from '@/utils/auth' // get type from cookie
import MiddleUtil from '@/utils/MiddleUtil'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect
    // Search
  },
  data() {
    var nameRegex = new RegExp('[a-zA-Z0-9].{3,18}')
    var passwordRegex = new RegExp('[a-zA-Z0-9].{5,18}')
    // 验证管理员名称是否被使用
    var validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入管理员名称'))
      } else if (!nameRegex.test(value)) {
        callback(new Error('用户名:4-18位字母或数字'))
      } else {
        AdminAPI.testName(value).then((response) => {
          if (response.msg === 'used') {
            callback(new Error('该用户名已被使用'))
          } else {
            callback()
          }
        })
      }
    }

    // 验证修改密码or注册  一次密码的合法性
    var validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (!passwordRegex.test(value)) {
        callback(new Error('密码:6-18位字母或数字'))
      } else {
        callback()
      }
    }

    // 验证修改密码 二次密码的一致性
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordData.newPassword1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    // 验证注册 二次密码的一致性
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerData.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      type: getType(),
      changePasswordFormVisible: false,
      registerFormVisible: false,
      changePasswordData: {
        id: getId(),
        name: getName(),
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      registerData: {
        name: '',
        password1: '',
        password2: ''
      },
      changePasswordRules: {
        // 数据项的约束
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword1: [
          { required: true, validator: validatePass1, trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      registerRules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        password1: [
          { required: true, validator: validatePass1, trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePass3, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    // 退出账号
    async logout() {
      await this.$store.dispatch('user/logout').then((response) => {
        if (response.code === 200) {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          this.$message({
            message: '退出成功',
            type: 'success',
            duration: 3000
          })
        } else {
          this.$message({
            message: '退出失败',
            type: 'error',
            duration: 3000
          })
        }
      })
    },

    // 修改本账号的密码
    handleChangePassword() {
      this.resetAdmin()
      this.changePasswordFormVisible = true
      this.$nextTick(() => {
        this.$refs['changePasswordForm'].clearValidate()
      })
    },
    // 修改密码
    async changePassword() {
      this.$refs['changePasswordForm'].validate((valid) => {
        if (valid) {
          var data = {
            id: this.changePasswordData.id,
            oldPassword: this.changePasswordData.oldPassword,
            newPassword: this.changePasswordData.newPassword1
          }
          this.$store.dispatch('user/changePassword', data).then((response) => {
            if (response.code === 200) {
              this.changePasswordFormVisible = false
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              this.$message({
                message: '修改成功，请重新登录',
                type: 'success',
                duration: 3000
              })
            } else if (response.code === 408) {
              this.$message({
                message: '原密码错误',
                type: 'error',
                duration: 3000
              })
            } else {
              this.$message({
                message: '修改失败',
                type: 'error',
                duration: 3000
              })
            }
          })
        }
      })
    },

    // 注册管理员
    handleRegister() {
      this.resetRegister()
      this.registerFormVisible = true
      this.$nextTick(() => {
        this.$refs['registerForm'].clearValidate()
      })
    },

    register() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          var data = {
            name: this.registerData.name,
            password: this.registerData.password1
          }
          AdminAPI.register(data).then((response) => {
            if (response.code === 200) {
              this.$notify({
                title: 'Success',
                message: data.name + '注册成功',
                type: 'success',
                duration: 3000
              })
              MiddleUtil.$emit('register', '调用admin-mannger中的刷新列表方法')
            } else if (response.code === 999) {
              this.$message({
                message: '没有该权限!',
                type: 'error',
                duration: 3000
              })
            } else {
              this.$message({
                message: '注册失败',
                type: 'error',
                duration: 3000
              })
            }
          })
        }
      })
      this.registerFormVisible = false
    },

    resetAdmin() {
      this.oldPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
    },

    resetRegister() {
      this.registerData.name = ''
      this.registerData.password1 = ''
      this.registerData.password2 = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
