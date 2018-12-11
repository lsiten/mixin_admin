<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 分类列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="addservices">添加分类</el-button>
            </div>
            <el-table :data="categorysData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="分类名" sortable width="150">
                </el-table-column>
                <el-table-column prop="desc" label="描述" width="200" :formatter="strCut">
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" width="140" :formatter="formatterDate">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80" :formatter="formatterStatus">
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="warning" v-show="parseInt(scope.row.status) === 1" size="small" @click="handleStatus(scope.$index, scope.row)">禁用</el-button>
                        <el-button type="primary" v-show="parseInt(scope.row.status) === 0" size="small" @click="handleStatus(scope.$index, scope.row)">启用</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="small" type="success" @click="gotoFood(scope.$index, scope.row)">查看商品</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size = 'pageSize' :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加分类" :visible.sync="addVisible" width="50%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="分类名">
                    <el-input v-model="addForm.name" placeholder="请输入分类名"></el-input>
                </el-form-item>

                <el-form-item label="分类描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.desc" placeholder="请输入分类描述"></el-input>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input v-model="addForm.sort" placeholder="排序序号，越大后面"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑用户" :visible.sync="editVisible" width="50%">
            <el-form ref="form2" :model="editForm" label-width="80px">
                <el-form-item label="分类名">
                    <el-input v-model="editForm.name" placeholder="请输入分类名"></el-input>
                </el-form-item>
                <el-form-item label="分类描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.desc" placeholder="请输入分类描述"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="editForm.sort" placeholder="排序序号，越大后面"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复,且该分类下资源皆删除，是否确定删除？</div>
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
import VueCropper from '../../common/vue-cropper'
import FormData from 'form-data'
import 'cropperjs/dist/cropper.css'
export default {
  data () {
    return {
      select_word: '',
      del_list: [],
      multipleSelection: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      cropVisible: false,
      editForm: {
        name: '',
        desc: '',
        sort: 0
      },
      addForm: {
        name: '',
        desc: '',
        sort: 0
      },
      idx: -1,
      imgSrc: '',
      cropImg: '',
      defaultSrc: 'static/img/img.jpg'
    }
  },
  components: {
    VueCropper
  },
  created () {
    this.getData()
    this.cropImg = this.defaultSrc
  },
  computed: {
    ...mapGetters({
      token: 'user_get_token',
      uid: 'user_get_uid',
      categorysData: 'category_get_category',
      pageSize: 'category_get_pageSize',
      total: 'category_get_total',
      currentPage: 'category_get_currentPage'
    })
  },
  methods: {
    handleNumberChange () {},
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('category_set_current_page', val)
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
      this.$store.dispatch('category_get_categorys', params)
    },
    search () {
      this.is_search = true
      this.getData()
    },
    formatterDate (row, column) {
      return row.create_time ? toolbar.timefomate(row.create_time, 'timestamp', 'Y-m-d H:i:s') : '无'
    },
    strCut (row, column) {
      let length = row.desc.length
      if (length > 30) {
        return row.desc.substring(0, 30) + '...'
      } else {
        return row.desc
      }
    },
    formatterStatus (row, column) {
      switch (parseInt(row.status)) {
        case 1:
          return '启用'
        case 0:
          return '未启用'
      }
    },
    addservices () {
      this.addVisible = true
    },
    handleStatus (index, row) {
      this.idx = index
      const item = this.categorysData[index]
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
            message: successTitle + data.name + '成功',
            type: 'success'
          })
          let itemTemp = JSON.parse(JSON.stringify(item))
          itemTemp.status = status
          this.$store.dispatch('category_set_category_edit_item', {item: itemTemp, index: index})
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('category_set_category_status', params)
    },
    handleEdit (index, row) {
      this.idx = index
      const item = this.categorysData[index]
      this.editForm = {
        name: item.name,
        desc: item.desc,
        sort: item.sort
      }
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    delAll () {
      this.$confirm('删除不可恢复,且该分类下商品皆删除，是否确定删除？', '提示', {
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
            ids: ids.join('|')
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
        this.$store.dispatch('category_delete_category', params)
      }).catch(() => {
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    gotoFood (index, row) {
      this.idx = index
      const item = this.categorysData[index]
      this.$router.push({path: 'foods', query: {id: item.id}})
    },
    // dataURLtoFile (dataurl, filename) {
    //   let arr = dataurl.split(',')
    //   let mime = arr[0].match(/:(.*?);/)[1]
    //   let bstr = atob(arr[1])
    //   let n = bstr.length
    //   let u8arr = new Uint8Array(n)
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n)
    //   }
    //   let file = new File([u8arr], filename, {type: mime})
    //   console.log(file)
    //   return file
    // },
    // @TODO 上传待做
    _uploadThumb () {
      // 1、获取token
      this.$store.dispatch('com_get_img_token', {inType: 11})
        .then(data => {
          let formData = new FormData()
          formData.append('key', data.dir + data.filename.substring(0, data.filename.lastIndexOf('/')))
          formData.append('policy', data.policy)
          formData.append('OSSAccessKeyId', data.accessid)
          formData.append('callback', data.callback)
          formData.append('signature', data.signature)
          formData.append('file', this.cropImg)
          this.$store.dispatch('category_upload_file', {host: data.host, data: formData})
            .then(res => {
            })
            .catch(uerr => {
            })
        })
        .catch(err => {
          console.log(err)
        })
      // 2、上传到阿里云
    },
    // 用户添加
    saveAdd () {
      let params = {
        data: {
          name: this.addForm.name,
          desc: this.addForm.desc,
          sort: this.addForm.sort,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '添加' + data.service_name + '成功',
            type: 'success'
          })
          this.getData()
          this.addVisible = false
          this.addForm.name = ''
          this.addForm.sort = 0
          this.addForm.desc = ''
        },
        error: msg => {
          this.$message.error(msg)
          this.addVisible = false
        }
      }
      this.$store.dispatch('category_add_category', params)
    },
    // 保存编辑
    saveEdit () {
      let item = this.categorysData[this.idx]
      let params = {
        data: {
          name: this.editForm.name,
          desc: this.editForm.desc,
          sort: this.editForm.sort,
          uid: this.uid,
          id: item.id,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '修改' + item.name + '成功',
            type: 'success'
          })
          this.$store.dispatch('category_set_category_edit_item', {item: data, index: this.idx})
          this.editVisible = false
        },
        error: msg => {
          this.$message.error(msg)
          this.editVisible = false
        }
      }
      this.$store.dispatch('category_edit_category', params)
    },
    // 确定删除
    deleteRow () {
      let params = {
        data: {
          uid: this.uid,
          token: this.token,
          ids: this.categorysData[this.idx].id
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
      this.$store.dispatch('category_delete_category', params)
    }
    // 裁剪图片
    // cropImage () {
    //   this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
    // },
    // cancelCrop () {
    //   this.cropVisible = false
    //   this.cropImg = this.defaultSrc
    // },
    // setImage (e) {
    //   const file = e.target.files[0]
    //   if (!file.type.includes('image/')) {
    //     return ''
    //   }
    //   const reader = new FileReader()
    //   reader.onload = (event) => {
    //     this.cropVisible = true
    //     this.imgSrc = event.target.result
    //     this.$refs.cropper && this.$refs.cropper.replace(event.target.result)
    //   }
    //   reader.readAsDataURL(file)
    // }
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
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .line {
      text-align: center;
    }
</style>
