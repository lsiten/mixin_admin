<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAllVisible = true">批量删除</el-button>
                <el-select v-model="select_category" filterable placeholder="筛选资源" class="handle-select mr10">
                    <el-option
                        v-for="item in categoryData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="addFood">添加资源</el-button>
            </div>
            <el-table :data="foodData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="商品名" sortable width="150">
                </el-table-column>
                <el-table-column label="缩略图" width="120">
                  <template slot-scope="scope">
                    <img width="100" height="80" :src="scope.row.thumb" :alt="scope.row.name">
                  </template>
                </el-table-column>
                <el-table-column prop="desc" label="描述" width="200" :formatter="strCut">
                </el-table-column>
                <el-table-column prop="price" label="价格" width="200" :formatter="formatePrice">
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
        <el-dialog title="添加商品" :visible.sync="addVisible" width="50%">
            <el-form ref="form" :model="addForm" label-width="80px">
               <el-form-item label="所属分类">
                    <el-select v-model="addForm.cate_id" placeholder="请选择">
                      <el-option
                        v-for="item in categoryData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名">
                    <el-input v-model="addForm.name" placeholder="请输入商品名"></el-input>
                </el-form-item>
                <el-form-item label="缩率图">
                    <el-input v-model="addForm.thumb" placeholder="请输入阿里云存储的key值/完整的图片url地址"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="addForm.price" placeholder="请输入商品价格（元）"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.desc" placeholder="请输入服务描述"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑商品" :visible.sync="editVisible" width="50%">
            <el-form ref="form2" :model="editForm" label-width="80px">
               <el-form-item label="所属分类">
                    <el-select v-model="editForm.cate_id" placeholder="请选择">
                      <el-option
                        v-for="item in categoryData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名">
                    <el-input v-model="editForm.name" placeholder="请输入商品名，服务名必须唯一"></el-input>
                </el-form-item>
                <el-form-item label="缩率图">
                    <el-input v-model="editForm.thumb" placeholder="请输入阿里云存储的key值/完整的图片url地址"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="editForm.price" placeholder="请输入商品价格（元）"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.desc" placeholder="请输入商品描述"></el-input>
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
      select_category: '',
      multipleSelection: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      delAllVisible: false,
      editForm: {
        name: '',
        cate_id: '',
        thumb: '',
        price: 0,
        desc: ''
      },
      addForm: {
        name: '',
        cate_id: '',
        thumb: '',
        price: 0,
        desc: ''
      },
      idx: -1
    }
  },
  created () {
    this._initData()
  },
  computed: {
    ...mapGetters({
      token: 'user_get_token',
      uid: 'user_get_uid',
      categoryData: 'category_get_category',
      foodData: 'food_get_food',
      pageSize: 'food_get_pageSize',
      total: 'food_get_total',
      currentPage: 'food_get_currentPage'
    })
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': '_initData'
  },
  methods: {
    _initData () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          page_size: 100,
          current_page: 1,
          refresh: 0
        },
        success: () => {
          if (this.$route.query.id) {
            this.select_category = parseInt(this.$route.query.id)
            this.addForm.cate_id = this.select_category
          }
          this.getData()
        },
        error: (msg) => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('category_get_categorys', params)
    },
    handleNumberChange () {},
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('resources_set_current_page', val)
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
      this.select_category && (params.data.cate_id = this.select_category)
      this.$store.dispatch('food_get_food', params)
    },
    search () {
      this.is_search = true
      this.getData()
    },
    strCut (row, column) {
      let length = row.desc.length
      if (length > 30) {
        return row.desc.substring(0, 30) + '...'
      } else {
        return row.desc
      }
    },
    formatePrice (row, column) {
      return '￥' + row.price + '元'
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
    addFood () {
      this.addVisible = true
    },
    handleStatus (index, row) {
      this.idx = index
      const item = this.foodData[index]
      let status = item.status === 1 ? 0 : 1
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
            message: successTitle + data.name + '成功',
            type: 'success'
          })
          let itemTemp = JSON.parse(JSON.stringify(item))
          itemTemp.status = status
          this.$store.dispatch('food_set_food_edit_item', {item: itemTemp, index: index})
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('food_set_food_status', params)
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.foodData[index]
      this.editForm = {
        name: item.name,
        cate_id: parseInt(item.cate_id),
        thumb: item.thumb,
        price: item.price,
        desc: item.desc
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
      this.$store.dispatch('food_delete_food', params)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 用户添加
    saveAdd () {
      let params = {
        data: {
          name: this.addForm.name,
          thumb: this.addForm.thumb,
          desc: this.addForm.desc,
          price: this.addForm.price,
          cate_id: this.addForm.cate_id,
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
          this.addForm.thumb = ''
          this.addForm.desc = 0
          this.addForm.price = ''
          this.addForm.cate_id = this.select_category
        },
        error: msg => {
          this.$message.error(msg)
          this.addVisible = false
        }
      }
      this.$store.dispatch('food_add_food', params)
    },
    // 保存编辑
    saveEdit () {
      let item = this.foodData[this.idx]
      let params = {
        data: {
          name: this.editForm.name,
          thumb: this.editForm.resource_thumb,
          desc: this.editForm.desc,
          price: this.editForm.price,
          cate_id: this.editForm.cate_id,
          uid: this.uid,
          id: item.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + item.name + '成功',
            type: 'success'
          })
          this.getData()
          this.editVisible = false
        },
        error: msg => {
          this.$message.error(msg)
          this.editVisible = false
        }
      }
      this.$store.dispatch('food_edit_food', params)
    },
    // 确定删除
    deleteRow () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          ids: this.foodData[this.idx].id
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
      this.$store.dispatch('food_delete_food', params)
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
