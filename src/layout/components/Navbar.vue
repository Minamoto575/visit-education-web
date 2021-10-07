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
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <!-- <img src="@/assets/user.gif" > -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="handleChangePassword">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>

          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 修改密码 -->
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="admin"
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="admin.name" :disabled="true" />
          </el-form-item>
          <el-form-item label="原密码：" prop="oldPassword">
            <el-input v-model="admin.oldPassword" />
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword1">
            <el-input v-model="admin.newPassword1" />
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword2">
            <el-input v-model="admin.newPassword2" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="changePassword()"> 确认 </el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import { SUCCESS } from "dropzone";

export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error("密码长度为6-18位"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.admin.newPassword1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      admin: {
        id: this.$store.getters.id,
        name: this.$store.getters.name,
        oldPassword: "",
        newPassword1: "",
        newPassword2: "",
      },
      rules: {
        //数据项的约束
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newPassword1: [
          { required: true, validator: validatePass1, trigger: "blur" },
        ],
        newPassword2: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },

    //退出账号
    async logout() {
      await this.$store.dispatch("user/logout").then((response) => {
        if (response.code == 200) {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          this.$message({
            message: "退出成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "退出失败",
            type: "error",
          });
        }
      });
      
    },

    //修改密码
    async changePassword() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var data = {
            id: this.admin.id,
            oldPassword: this.admin.oldPassword,
            newPassword: this.admin.newPassword1,
          };
          this.$store.dispatch("user/changePassword", data).then((response) => {
            if (response.code == 200) {
              this.dialogFormVisible = false;
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
              this.$message({
                message: "修改成功，请重新登录",
                type: "success",
              });
            } else if (response.code == 408) {
              this.$message({
                message: "原密码错误",
                type: "error",
              });
            } else {
              this.$message({
                message: "修改失败",
                type: "error",
              });
            }
          });
        }
      });
    },

    handleChangePassword() {
      this.resetAdmin();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    resetAdmin() {
      this.oldPassword = "";
      this.newPassword1 = "";
      this.newPassword2 = "";
    },
  },
};
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
