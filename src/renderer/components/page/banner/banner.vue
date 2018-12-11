<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> banner列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAllVisible = true">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="addBanner">添加banner</el-button>
            </div>
            <el-table :data="bannersData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="title" label="标题" sortable width="150">
                </el-table-column>
                <el-table-column label="缩略图" width="120">
                  <template slot-scope="scope">
                    <img width="100" height="80" :src="scope.row.img" :alt="scope.row.title">
                  </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" :formatter="formatterDate">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80" :formatter="formatterStatus">
                </el-table-column>
                <el-table-column label="操作" >
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
        <el-dialog title="添加banner" :visible.sync="addVisible" width="50%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="addForm.title" placeholder="请输入标题，标题必须唯一"></el-input>
                </el-form-item>
                <el-form-item label="缩率图">
                    <el-input v-model="addForm.img" placeholder="请输入阿里云存储的key值"></el-input>
                </el-form-item>
                <el-form-item label="url">
                    <el-input v-model="addForm.url" placeholder="请输入url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑banner" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="editForm.title" placeholder="请输入标题，标题必须唯一"></el-input>
                </el-form-item>
                <el-form-item label="缩率图">
                    <el-input v-model="editForm.img" placeholder="请输入阿里云存储的key值"></el-input>
                </el-form-item>
                <el-form-item label="url">
                    <el-input v-model="editForm.url" placeholder="请输入url"></el-input>
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
        title: '',
        url: '',
        img: ''
      },
      addForm: {
        title: '',
        url: '',
        img: ''
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
      bannersData: 'banner_get_banner',
      pageSize: 'banner_get_pageSize',
      total: 'banner_get_total',
      currentPage: 'banner_get_currentPage'
    })
  },
  methods: {
    handleNumberChange () {},
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('banner_set_current_page', val)
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
      this.$store.dispatch('banner_get_banner', params)
    },
    search () {
      this.is_search = true
      this.getData()
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
      const item = this.bannersData[index]
      let status = item.status === 1 ? 0 : 1
      let successTitle = status === 1 ? '启用' : '禁用'
      let params = {
        data: {
          banner_id: item.id,
          status: status,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: successTitle + data.title + '成功',
            type: 'success'
          })
          let itemTemp = JSON.parse(JSON.stringify(item))
          itemTemp.status = status
          this.$store.dispatch('banner_set_banner_edit_item', {item: itemTemp, index: index})
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('banner_set_banner_status', params)
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.bannersData[index]
      this.editForm = {
        title: item.title,
        url: item.url,
        img: item.img
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
          banner_id: ids.join('|')
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
      this.$store.dispatch('banner_delete_banner', params)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 用户添加
    saveAdd () {
      let params = {
        data: {
          title: this.addForm.title,
          url: this.addForm.url,
          img: this.addForm.img,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '添加' + data.title + '成功',
            type: 'success'
          })
          this.getData()
          this.addVisible = false
          this.addForm.title = ''
          this.addForm.url = ''
          this.addForm.img = ''
        },
        error: msg => {
          this.$message.error(msg)
          this.addVisible = false
        }
      }
      this.$store.dispatch('banner_add_banner', params)
    },
    // 保存编辑
    saveEdit () {
      let item = this.bannersData[this.idx]
      let params = {
        data: {
          title: this.editForm.title,
          url: this.editForm.url,
          img: this.editForm.img,
          uid: this.uid,
          banner_id: item.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + item.title + '成功',
            type: 'success'
          })
          this.$store.dispatch('banner_set_banner_edit_item', {item: data, index: this.idx})
          this.editVisible = false
        },
        error: msg => {
          this.$message.error(msg)
          this.editVisible = false
        }
      }
      this.$store.dispatch('banner_edit_banner', params)
    },
    // 确定删除
    deleteRow () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          banner_id: this.bannersData[this.idx].id
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
      this.$store.dispatch('banner_delete_banner', params)
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
</style>
