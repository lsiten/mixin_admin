<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="static/img/img.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">上次登录时间：<span>{{last_login_time}}</span></div>
                            <div class="user-info-list">上次登录IP：<span>{{last_login_ip}}</span></div>
                        </el-card>
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>工作详情</span>
                            </div>
                            已支付订单
                            <el-progress :percentage="pay_percent" color="#42b983"></el-progress>
                            未支付订单
                            <el-progress :percentage="wait_pay_percent" color="#f56c6c"></el-progress>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-xuelv-user grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{home_detail.members || 0}}</div>
                                    <div>用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{home_detail.has_pay || 0}}</div>
                                    <div>已支付订单</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{home_detail.wait_pay || 0}}</div>
                                    <div>待支付订单</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="todoAdd">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox @change="handleCheck(scope.$index, scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></i>
                                <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>

            </el-col>
        </el-row>

        <!-- 添加弹出框 -->
        <el-dialog title="添加待办事项" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="待办事项">
                    <el-input v-model="addForm.title" placeholder="请输入待办事项"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑待办事项" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="待办事项">
                    <el-input v-model="editForm.title" placeholder="请输入待办事项"></el-input>
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
import toolbar from '../../utils/toolbar'
export default {
  data () {
    return {
      name: localStorage.getItem('xuelv_uname'),
      last_login_time: toolbar.timefomate(localStorage.getItem('xuelv_last_time'), 'timestamp', 'Y-m-d H:i:s') || 0,
      last_login_ip: localStorage.getItem('xuelv_last_ip'),
      role_type: localStorage.getItem('xuelv_role'),
      addVisible: false,
      editVisible: false,
      delVisible: false,
      addForm: {
        title: ''
      },
      editForm: {
        title: '',
        status: false
      },
      idx: -1
    }
  },
  created () {
    let params = {
      data: {
        uid: this.uid,
        token: this.token
      },
      success: data => {},
      error: err => {
        console.log(err)
      }
    }
    this.$store.dispatch('home_get_data_detail', params)
  },
  computed: {
    role () {
      return parseInt(this.role_type) === 1 ? '超级管理员' : '普通用户'
    },
    orderTotal () {
      return (parseInt(this.home_detail.has_pay) + parseInt(this.home_detail.wait_pay)) || 0
    },
    pay_percent () {
      if (this.orderTotal === 0) {
        return 100
      }
      return parseInt((this.home_detail.has_pay / this.orderTotal) * 100)
    },
    wait_pay_percent () {
      if (this.orderTotal === 0) {
        return 100
      }
      return parseInt((this.home_detail.wait_pay / this.orderTotal) * 100)
    },
    ...mapGetters({
      home_detail: 'home_get_detail',
      token: 'user_get_token',
      uid: 'user_get_uid',
      todoList: 'home_get_todoList'
    })
  },
  methods: {
    todoAdd (index, row) {
      this.addVisible = true
    },
    handleCheck (index, row) {
      this.idx = index
      this.$store.dispatch('home_check_todoList_item', index)
    },
    saveAdd () {
      let data = {
        title: this.addForm.title
      }
      this.$store.dispatch('home_add_todoList', data)
        .then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.addForm.title = ''
          this.addVisible = false
        })
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.todoList[index]
      this.editForm.title = item.title
      this.editForm.status = item.status
      this.editVisible = true
    },
    saveEdit () {
      let params = {
        data: {
          title: this.editForm.title,
          status: this.editForm.status
        },
        index: this.idx
      }
      this.$store.dispatch('home_edit_todoList', params)
        .then(() => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.editVisible = false
        })
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    deleteRow () {
      this.$store.dispatch('home_delete_todoList', this.idx)
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.delVisible = false
        })
    }
  }
}
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 20px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>
