<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 桌号列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAllVisible = true">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="addBanner">添加桌号</el-button>
            </div>
            <el-table :data="deskData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="num" label="桌号" :formatter="formatterNum"  sortable width="150">
                </el-table-column>
                <el-table-column prop="uuid" label="桌id" width="120">
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" :formatter="formatterDate">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80" :formatter="formatterStatus">
                </el-table-column>
                <el-table-column prop="uuid" label="二维码" width="140">
                    <template slot-scope="scope">
                      <img class="qrcode-img" width="100" height="100" :src="generateQrcode(scope.row.uuid)" :alt="scope.row.title">
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="warning" v-show="parseInt(scope.row.status) === 1" size="small" @click="handleStatus(scope.$index, scope.row)">禁用</el-button>
                        <el-button type="primary" v-show="parseInt(scope.row.status) === 0" size="small" @click="handleStatus(scope.$index, scope.row)">启用</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size = 'pageSize' :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加桌号" :visible.sync="addVisible" width="50%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="桌号">
                    <el-input type="number" v-model="addForm.num" placeholder="请输入桌号">
                      <template slot="append">号桌</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="桌id">
                    <el-input disabled placeholder="id自动生成"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑桌号" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="桌号">
                    <el-input type="number" v-model="editForm.num" placeholder="请输入桌号">
                      <template slot="append">号桌</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="桌id">
                    <el-input disabled :value ="editForm.uuid" placeholder="id不可更改"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复,是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除所以提示框 -->
        <el-dialog title="提示" :visible.sync="delAllVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复,是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delAllVisible = false">取 消</el-button>
                <el-button type="primary" @click="delAll">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import toolbar from '../../../utils/toolbar'
import jrQrcode from 'jr-qrcode'
export default {
  data () {
    return {
      select_word: '',
      multipleSelection: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      delAllVisible: false,
      editForm: {
        num: '',
        uuid: ''
      },
      addForm: {
        num: ''
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
      deskData: 'desk_get_desk',
      pageSize: 'desk_get_pageSize',
      total: 'desk_get_total',
      currentPage: 'desk_get_currentPage'
    })
  },
  methods: {
    handleNumberChange () {},
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('desk_set_current_page', val)
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
      this.$store.dispatch('desk_get_desk', params)
    },
    search () {
      this.is_search = true
      this.getData()
    },
    formatterNum (row, column) {
      return row.num + '号桌'
    },
    formatterDate (row, column) {
      return row.create_time ? toolbar.timefomate(row.create_time, 'timestamp', 'Y-m-d H:i:s') : '无'
    },
    formatterStatus (row, column) {
      switch (parseInt(row.status)) {
        case 1:
          return '启用'
        case 0:
          return '未启用'
      }
    },
    addBanner () {
      this.addVisible = true
    },
    handleStatus (index, row) {
      this.idx = index
      const item = this.deskData[index]
      let status = parseInt(item.status) === 1 ? 0 : 1
      let successTitle = status === 1 ? '启用' : '禁用'
      let params = {
        data: {
          id: item.id,
          status: status,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: successTitle + data.num + '号桌成功',
            type: 'success'
          })
          let itemTemp = JSON.parse(JSON.stringify(item))
          itemTemp.status = status
          this.$store.dispatch('desk_set_desk_edit_item', {item: itemTemp, index: index})
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('desk_set_desk_status', params)
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.deskData[index]
      this.editForm = {
        num: item.num,
        uuid: item.uuid
      }
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    delAll () {
      const length = this.multipleSelection.length
      let ids = []
      for (let i = 0; i < length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          ids: ids.join('|')
        },
        success: () => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getData()
          this.delAllVisible = false
        },
        error: (msg) => {
          this.$message.error(msg)
          this.delAllVisible = false
        }
      }
      this.$store.dispatch('desk_delete_desk', params)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 用户添加
    saveAdd () {
      let params = {
        data: {
          num: this.addForm.num,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '添加' + data.num + '成功',
            type: 'success'
          })
          this.getData()
          this.addVisible = false
          this.addForm.num = ''
        },
        error: msg => {
          this.$message.error(msg)
          this.addVisible = false
        }
      }
      this.$store.dispatch('desk_add_desk', params)
    },
    // 保存编辑
    saveEdit () {
      let item = this.deskData[this.idx]
      let params = {
        data: {
          num: this.editForm.num,
          uid: this.uid,
          id: item.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + item.num + '成功',
            type: 'success'
          })
          this.$store.dispatch('desk_set_desk_edit_item', {item: data, index: this.idx})
          this.editVisible = false
        },
        error: msg => {
          this.$message.error(msg)
          this.editVisible = false
        }
      }
      this.$store.dispatch('desk_edit_desk', params)
    },
    // 确定删除
    deleteRow () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          ids: this.deskData[this.idx].id
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
      this.$store.dispatch('desk_delete_desk', params)
    },
    generateQrcode (uuid) {
      let host = 'http://xxnwab.lsiten.cn'
      let url = host + '?id=' + uuid
      let imgBase64 = jrQrcode.getQrBase64(url)
      return imgBase64
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
    .line {
      text-align: center;
    }
    .qrcode-img {
      margin-left: 10px;
    }
</style>
