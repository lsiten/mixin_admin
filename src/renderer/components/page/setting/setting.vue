<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 系统设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane label="基本信息设置" name="first">
                  <div class="handle-box">
                    <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                    <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="addsetting">添加设置</el-button>
                  </div>
                  <el-table :data="settingData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="name" label="设置名" sortable width="100">
                        </el-table-column>
                        <el-table-column prop="key" label="key值"  width="100">
                        </el-table-column>
                        <el-table-column prop="value" label="设置值" width="150">
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" width="150" :formatter="formatterDate">
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="80" :formatter="formatterStatus">
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="warning" v-show="scope.row.status === 1" size="small" @click="handleStatus(scope.$index, scope.row)">禁用</el-button>
                                <el-button type="primary" v-show="scope.row.status === 0" size="small" @click="handleStatus(scope.$index, scope.row)">启用</el-button>
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size = 'pageSize' :total="total">
                        </el-pagination>
                    </div>
                    <!-- 添加弹出框 -->
                    <el-dialog title="添加设置" :visible.sync="addVisible" width="30%">
                        <el-form ref="form" :model="addForm" label-width="80px">
                            <el-form-item label="设置名">
                                <el-input v-model="addForm.name" placeholder="请输入设置名"></el-input>
                            </el-form-item>
                            <el-form-item label="key值">
                                <el-input v-model="addForm.key" placeholder="请输入key值，key值必须唯一"></el-input>
                            </el-form-item>
                            <el-form-item label="设置值">
                                <el-input v-model="addForm.value" placeholder="请输入设置值，用于显示"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="addVisible = false">取 消</el-button>
                            <el-button type="primary" @click="saveAdd">确 定</el-button>
                        </span>
                    </el-dialog>

                    <!-- 编辑弹出框 -->
                    <el-dialog title="编辑设置" :visible.sync="editVisible" width="30%">
                        <el-form ref="form" :model="editForm" label-width="80px">
                            <el-form-item label="设置名">
                                <el-input v-model="editForm.name" placeholder="请输入设置名"></el-input>
                            </el-form-item>
                            <el-form-item label="key值">
                                <el-input v-model="editForm.key" placeholder="请输入key值，key值必须唯一"></el-input>
                            </el-form-item>
                            <el-form-item label="设置值">
                                <el-input v-model="editForm.value" placeholder="请输入设置值，用于显示"></el-input>
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
                </el-tab-pane>
                <el-tab-pane label="微信设置" name="second">
                  <el-form ref="form" :model="form" label-width="150px">
                      <el-form-item label="公众号名">
                          <el-input v-model="form.name" placeholder="请输入公众号名"></el-input>
                      </el-form-item>
                      <el-form-item label="公众号appid">
                          <el-input v-model="form.appid" placeholder="请输入公众号appid"></el-input>
                      </el-form-item>
                      <el-form-item label="公众号appsecrect">
                          <el-input v-model="form.appsecrect" placeholder="请输入公众号appsecrect"></el-input>
                      </el-form-item>
                      <el-form-item label="公众号token">
                          <el-input v-model="form.token" placeholder="请输入公众号token"></el-input>
                      </el-form-item>
                      <el-form-item label="微信支付id">
                          <el-input v-model="form.payid" placeholder="请输入微信支付id"></el-input>
                      </el-form-item>
                      <el-form-item label="微信支付key">
                          <el-input v-model="form.paykey" placeholder="请输入微信支付key"></el-input>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="onSubmit">确定</el-button>
                      </el-form-item>
                  </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import toolbar from '../../../utils/toolbar'
export default {
  data () {
    return {
      message: 'first',
      showHeader: false,
      select_word: '',
      is_search: false,
      multipleSelection: [],
      addForm: {
        name: '',
        key: '',
        value: ''
      },
      addVisible: false,
      editVisible: false,
      editForm: {
        name: '',
        key: '',
        value: ''
      },
      delVisible: false
    }
  },
  created () {
    this.getData()
    this.getWxData()
  },
  methods: {
    onSubmit () {
      let params = {
        data: {
          name: this.form.name,
          appid: this.form.appid,
          appsecrect: this.form.appsecrect,
          weixin_token: this.form.token,
          payid: this.form.payid,
          paykey: this.form.paykey,
          uid: this.uid,
          id: this.wxSettingData.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + this.wxSettingData.name + '成功',
            type: 'success'
          })
          this.getWxData()
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('setting_wx_edit_setting', params)
    },
    delAll () {
      this.$confirm('删除不可恢复，是否确定删除？', '提示', {
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
            delete_id: ids.join('|')
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
        this.$store.dispatch('setting_delete_setting', params)
      }).catch(() => {
      })
    },
    addsetting () {
      this.addVisible = true
    },
    search () {
      this.is_search = true
      this.getData()
    },
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
      this.$store.dispatch('setting_get_settings', params)
    },
    getWxData () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          page_size: 1,
          current_page: 1,
          refresh: 0
        },
        success: () => {},
        error: (msg) => {
          this.$message.error(msg)
        }
      }
      this.is_search && (params.data.keyword = this.select_word)
      this.$store.dispatch('setting_get_wx_settings', params)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    formatterDate (row, column) {
      return row.create_time ? toolbar.timefomate(row.create_time, 'timestamp', 'Y-m-d H:i:s') : ''
    },
    formatterStatus (row, column) {
      switch (parseInt(row.status)) {
        case 1:
          return '启用'
        case 0:
          return '未启用'
      }
    },
    saveAdd () {
      let params = {
        data: {
          name: this.addForm.name,
          key: this.addForm.key,
          value: this.addForm.value,
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
          this.addForm.key = ''
          this.addForm.value = ''
        },
        error: msg => {
          this.$message.error(msg)
          this.addVisible = false
        }
      }
      this.$store.dispatch('setting_add_setting', params)
    },
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('setting_set_current_page', val)
      this.getData()
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.settingData[index]
      this.editForm = {
        name: item.name,
        key: item.key,
        value: item.value
      }
      this.editVisible = true
    },
    saveEdit () {
      const item = this.settingData[this.idx]
      let params = {
        data: {
          name: this.editForm.name,
          key: this.editForm.key,
          value: this.editForm.value,
          uid: this.uid,
          system_id: item.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + item.name + '成功',
            type: 'success'
          })
          this.$store.dispatch('setting_set_setting_edit_item', {item: data, index: this.idx})
          this.editVisible = false
        },
        error: msg => {
          this.$message.error(msg)
          this.editVisible = false
        }
      }
      this.$store.dispatch('setting_edit_setting', params)
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    // 确定删除
    deleteRow () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          delete_id: this.settingData[this.idx].id
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
      this.$store.dispatch('setting_delete_setting', params)
    }
  },
  computed: {
    unreadNum () {
      return this.unread.length
    },
    ...mapGetters({
      token: 'user_get_token',
      uid: 'user_get_uid',
      settingData: 'setting_get_settings',
      wxSettingData: 'setting_get_wx_settings',
      pageSize: 'setting_get_pageSize',
      total: 'setting_get_total',
      currentPage: 'setting_get_currentPage'
    }),
    form () {
      let item = {
        name: this.wxSettingData.name,
        appid: this.wxSettingData.appid,
        appsecrect: this.wxSettingData.appsecrect,
        token: this.wxSettingData.token,
        payid: this.wxSettingData.payid,
        paykey: this.wxSettingData.paykey
      }
      return item
    }
  }
}
</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
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