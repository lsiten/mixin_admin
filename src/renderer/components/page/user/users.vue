<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" v-show="role_type === 1">
                <el-button  type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="adduser">添加用户</el-button>
            </div>
            <el-table :data="userData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="用户名" sortable width="150">
                </el-table-column>
                <el-table-column prop="last_login_ip" label="最后登录IP" width="120" :formatter="formatterIp">
                </el-table-column>
                <el-table-column prop="last_login_time" label="最后登录时间" :formatter="formatterDate">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80" :formatter="formatterStatus">
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="warning" v-show="role_type === 1 && scope.row.status === 1" size="small" @click="handleStatus(scope.$index, scope.row)">禁用</el-button>
                        <el-button type="primary" v-show="role_type === 1 && scope.row.status === 0" size="small" @click="handleStatus(scope.$index, scope.row)">启用</el-button>
                        <el-button v-show="role_type === 1" size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size = 'pageSize' :total="total">
                </el-pagination>
            </div>
        </div>

      <!-- 添加弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="addForm.name" placeholder="请输入用户名，用户名必须唯一"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑用户" :visible.sync="editVisible" width="30%">
            <el-form ref="form2" :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import toolbar from '../../../utils/toolbar'
export default {
  data () {
    return {
      role_type: parseInt(localStorage.getItem('xuelv_role')),
      select_word: '',
      del_list: [],
      multipleSelection: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      form: {
        name: '',
        password: ''
      },
      addForm: {
        name: ''
      },
      idx: -1
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapGetters({
      token: 'user_get_token',
      uid: 'user_get_uid',
      userData: 'user_get_users',
      pageSize: 'user_get_pageSize',
      total: 'user_get_total',
      currentPage: 'user_get_currentPage'
    })
  },
  methods: {
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('user_set_current_page', val)
      this.getData()
    },
    //  获取 easy-mock 的模拟数据
    getData () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          page_size: this.pageSize,
          current_page: this.currentPage,
          refresh: 0
        },
        success: () => {},
        error: (msg) => {
          this.$message.error(msg)
        }
      }
      this.is_search && (params.data.keyword = this.select_word)
      this.$store.dispatch('user_get_users', params)
    },
    search () {
      this.is_search = true
      this.getData()
    },
    formatterDate (row, column) {
      return row.last_login_time ? toolbar.timefomate(row.last_login_time, 'timestamp', 'Y-m-d H:i:s') : '未登陆'
    },
    formatterIp (row, column) {
      return parseInt(row.last_login_ip) === 0 ? '未登陆' : row.last_login_ip
    },
    formatterStatus (row, column) {
      switch (parseInt(row.status)) {
        case 1:
          return '启用'
        case 0:
          return '未启用'
      }
    },
    adduser () {
      this.addVisible = true
    },
    handleStatus (index, row) {
      this.idx = index
      const item = this.userData[index]
      let status = item.status === 1 ? 0 : 1
      let successTitle = status === 1 ? '启用' : '禁用'
      let params = {
        data: {
          user_id: item.id,
          status: status,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: successTitle + data.name + '成功',
            type: 'success'
          })
          let itemTemp = JSON.parse(JSON.stringify(item))
          itemTemp.status = status
          this.$store.dispatch('user_set_user_edit_item', {item: itemTemp, index: index})
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('user_set_user_status', params)
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.userData[index]
      this.form = {
        name: item.name,
        password: ''
      }
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    delAll () {
      this.$confirm('确定要删除这些用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const length = this.multipleSelection.length
        let ids = []
        for (let i = 0; i < length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        let params = {
          data: {
            uid: this.uid,
            token: this.token,
            delete_uid: ids.join('|')
          },
          success: () => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getData()
          },
          error: (msg) => {
            this.$message.error(msg)
          }
        }
        this.$store.dispatch('user_delete_user', params)
      }).catch(() => {
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 用户添加
    saveAdd () {
      let params = {
        data: {
          user_name: this.addForm.name,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '添加' + data.name + '成功',
            type: 'success'
          })
          this.getData()
          this.addVisible = false
          this.addForm.name = ''
        },
        error: msg => {
          this.$message.error(msg)
          this.addVisible = false
        }
      }
      this.$store.dispatch('user_add_user', params)
    },
    // 保存编辑
    saveEdit () {
      const item = this.userData[this.idx]
      let params = {
        data: {
          password: this.form.password,
          uid: this.uid,
          user_id: item.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + item.name + '成功',
            type: 'success'
          })
          this.editVisible = false
        },
        error: msg => {
          this.$message.error(msg)
          this.editVisible = false
        }
      }
      this.$store.dispatch('user_edit_user', params)
    },
    // 确定删除
    deleteRow () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          delete_uid: this.userData[this.idx].id
        },
        success: () => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getData()
          this.delVisible = false
        },
        error: (msg) => {
          this.$message.error(msg)
          this.delVisible = false
        }
      }
      this.$store.dispatch('user_delete_user', params)
    }
  }
}
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .pull-right {
      float: right;
    }
</style>
