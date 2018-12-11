<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAllVisible = true">批量删除</el-button>
                <el-select v-model="select_status" filterable placeholder="筛选订单状态" class="handle-select mr10">
                    <el-option
                        v-for="item in orderStatusData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="ordersData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="expand" fixed>
                  <template slot-scope="scope">
                    <div class="food-item" v-for="(item, index) in JSON.parse(scope.row.foods)" v-bind:key="index">
                      <div class="food-title">
                        {{item.name}}
                      </div>
                      <div class="food-thumb">
                        <img :src="item.thumb" style="width: 100px;height: 50px;"/>
                      </div>
                      <div class="food-price">
                        ¥{{item.price}}元
                      </div>
                      <div class="food-num">
                        {{item.num}}份
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type="selection" width="55" fixed></el-table-column>
                <el-table-column prop="order_num" label="订单号" width="150" fixed sortable>
                </el-table-column>
                <el-table-column prop="desk_num" label="桌号" width="150" :formatter="formatteDesknum">
                </el-table-column>
                <el-table-column prop="total_price" label="总价" width="150" :formatter="formattePrice">
                </el-table-column>
                <el-table-column prop="update_time" label="添加时间" width="140" :formatter="formatterDate">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    <el-button v-if="parseInt(scope.row.status) === 0" type="info" size="small">待支付</el-button>
                    <el-button v-if="parseInt(scope.row.status) === 1" type="success" size="small">支付成功</el-button>
                    <el-button v-if="parseInt(scope.row.status) === 2" type="danger" size="small">已取消</el-button>
                    <el-button v-if="parseInt(scope.row.status) === -1" type="warning" size="small">已删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                      <el-button type="success" v-show="parseInt(scope.row.status) === 0" size="small" @click="paysuccess(scope.$index, scope.row)">已支付</el-button>
                      <el-button type="primary" v-show="parseInt(scope.row.status) === 1" size="small" @click="payunpaid(scope.$index, scope.row)">未支付</el-button>
                      <el-button type="warning" v-show="parseInt(scope.row.status) === 0" size="small" @click="cancelorder(scope.$index, scope.row)">取消订单</el-button>
                      <el-button size="small" v-show="parseInt(scope.row.status) > -1" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                      <el-button size="small" v-show="parseInt(scope.row.status) === -1" type="danger" @click="recoverRow(scope.$index, scope.row)">恢复</el-button>  
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size = 'pageSize' :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 设置支付提示框 -->
        <el-dialog title="提示" :visible.sync="payVisible" width="300px" center>
            <div class="del-dialog-cnt">请确认该订单已支付</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="payVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleStatus(1)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 设置取消订单提示框 -->
        <el-dialog title="提示" :visible.sync="cancelVisible" width="300px" center>
            <div class="del-dialog-cnt">请确认取消该订单</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleStatus(2)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复,是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleStatus(-1)">确 定</el-button>
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
      select_status: '',
      multipleSelection: [],
      is_search: false,
      delVisible: false,
      delAllVisible: false,
      detailVisible: false,
      payVisible: false,
      cancelVisible: false,
      idx: -1,
      orderStatusData: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '未支付'
        },
        {
          id: 1,
          name: '已支付'
        },
        {
          id: 2,
          name: '已取消'
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapGetters({
      token: 'user_get_token',
      uid: 'user_get_uid',
      ordersData: 'order_get_order',
      pageSize: 'order_get_pageSize',
      total: 'order_get_total',
      currentPage: 'order_get_currentPage'
    })
  },
  methods: {
    handleNumberChange () {},
    //  分页导航
    handleCurrentChange (val) {
      this.$store.dispatch('order_set_current_page', val)
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
      if (parseInt(this.select_status) > -2 && parseInt(this.select_status) < 3) {
        params.data.status = this.select_status
      }
      this.is_search && (params.data.keyword = this.select_word)
      this.select_service && (params.data.service_id = this.select_service)
      this.$store.dispatch('order_get_orders', params)
    },
    search () {
      this.is_search = true
      this.getData()
    },
    formatterDate (row, column) {
      return row.update_time ? toolbar.timefomate(row.update_time, 'timestamp', 'Y-m-d H:i:s') : '无'
    },
    formatteDesknum (row, column) {
      return row.desk_num + '桌'
    },
    formattePrice (row, column) {
      return '¥' + row.total_price + '元'
    },
    recoverRow (index, row) {
      const item = this.ordersData[index]
      let params = {
        data: {
          oid: item.id,
          status: 1,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: '恢复[' + item.order_num + ']成功',
            type: 'success'
          })
          if (status > 0) {
            let itemTemp = JSON.parse(JSON.stringify(item))
            this.$store.dispatch('order_set_order_edit_item', {item: itemTemp, index: this.idx})
          }
          this.getData()
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('order_set_order_status', params)
    },
    handleStatus (status) {
      const item = this.ordersData[this.idx]
      let successTitle = ''
      switch (status) {
        case -1:
          successTitle = '已删除'
          break
        case 0:
          successTitle = '待支付'
          break
        case 1:
          successTitle = '支付成功'
          break
        case 2:
          successTitle = '取消订单成功'
          break
      }
      let params = {
        data: {
          oid: item.id,
          status: status,
          uid: this.uid,
          token: this.token
        },
        success: data => {
          this.$message({
            message: successTitle + '[' + item.order_num + ']成功',
            type: 'success'
          })
          if (status > 0) {
            let itemTemp = JSON.parse(JSON.stringify(item))
            this.$store.dispatch('order_set_order_edit_item', {item: itemTemp, index: this.idx})
          }
          this.delVisible = false
          this.cancelVisible = false
          this.payVisible = false
          this.getData()
        },
        error: msg => {
          this.$message.error(msg)
        }
      }
      this.$store.dispatch('order_set_order_status', params)
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
        }
      }
      this.$store.dispatch('order_delete_order', params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
        this.delAllVisible = false
      }).catch(msg => {
        this.$message.error(msg)
        this.delAllVisible = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 确定删除
    deleteRow (index, row) {
      this.idx = index
      this.delVisible = true
    },
    cancelorder (index, row) {
      this.idx = index
      this.cancelVisible = true
    },
    paysuccess (index, row) {
      this.idx = index
      this.payVisible = true
    },
    payunpaid (index, row) {
      this.idx = index
      this.handleStatus(0)
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
    .el-form-item {
      text-align: left;
    }
    .pull-right {
      float: right;
    }
    .line {
      text-align: center;
    }
    .food-item {
      display: flex;
      width: 100%;
      margin: 5px 0;
      border-bottom: 1px solid #f9f9f9;
    }
    .food-item .food-title{
      width: 100px;
      text-align: center;
      align-items:center;
      line-height: 50px;      
    }
    .food-item .food-thumb{
      width: 100px;
      text-align: center;
      align-items:center;
      line-height: 50px;
    }
    .food-item .food-price{
      width: 100px;
      text-align: center;
      align-items:center;
      line-height: 50px;      
    }
    .food-item .food-num{
      width: 100px;
      text-align: center;
      line-height: 50px;      
      align-items:center;
    }
</style>
