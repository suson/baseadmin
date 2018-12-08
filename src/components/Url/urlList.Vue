<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-button @click="addTask()" size="small" type="primary" plain>创建新任务</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-table ref="multipleTable" empty-text="暂无数据" v-loading="listLoading" border :data="listData"
            tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="id" width="120">
              <template slot-scope="scope">{{ scope.row.urlid }}</template>
            </el-table-column>
            <el-table-column label="标题" width="220">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="网址" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.turl | filterUrl('url')}}</template>
            </el-table-column>
            <el-table-column label="关键字" width="220">
              <template slot-scope="scope">{{ scope.row.turl | filterUrl('keyword')}}</template>
            </el-table-column>
            <el-table-column label="今日分享" width="80">
              <template slot-scope="scope">{{ scope.row.tdclick }}</template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope="scope">{{scope.row.online | urlStatusName}}-{{scope.row.free | shareStatusName}}</template>
            </el-table-column>
            <el-table-column label="网址代挂服务" width="220">
              <template slot-scope="scope">
                <el-button size="mini" v-if="!getTrusteeServiceInfo(scope.row.odrs)" @click="openTrustee(scope.row)">立即开通</el-button>

                <el-button size="mini" type="text" v-if="getTrusteeServiceInfo(scope.row.odrs)" @click="showTrustee(scope.row,1)">{{getTrusteeServiceInfo(scope.row.odrs).showTitle}}</el-button>
                <el-button size="mini" v-if="getTrusteeServiceInfo(scope.row.odrs)" @click="openTrustee(scope.row,1)">续费</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>

              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 20px">

            <el-col :span="6">
              <el-button-group>
                <el-button size="small" type="primary" icon="el-icon-remove-outline" @click="operate(0)">停止</el-button>
                <el-button size="small" type="primary" icon="el-icon-caret-right" @click="operate(1)">开始</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="delTip()">删除</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="18">
              <div style="float:right;">
                <el-pagination @current-change="handleCurrentChange" background layout="total,prev, pager, next"
                  :page-size="listPageSize" :total="listTotal">
                </el-pagination>

              </div>
            </el-col>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 网址代挂弹窗start -->
    <el-dialog title="龙卷风软件-网址代挂服务" :visible.sync="centerDialogVisible" width="60%">
      <el-col :span="24">
        <p>开通步骤：</p>
      </el-col>

      <el-form :model="substituteForm" :label-position="labelPosition">

        <el-form-item label="1、请选择代挂流量：" :label-width="formLabelWidth">
          <el-select v-model="substituteForm.svcid" placeholder="请选择代挂流量" :disabled="disabled">
            <el-option v-for="(item, index) in trusteeServerIP" :key="index" :label="item" :value="index"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="2、请输入服务时间：" :label-width="formLabelWidth">
          <el-col :span="5">
            <el-input v-model.number="substituteForm.day"></el-input>
          </el-col>
          <el-col :span="19">
            <span>天(范围:1-365天)</span>
          </el-col>
        </el-form-item>
        <el-form-item label="到期时间：" :label-width="formLabelWidth">
          <el-col :span="24">
            <span class="red">{{substituteRet.etime}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="3、请选择付费方式：" prop="resource" :label-width="formLabelWidth">
          <el-radio-group v-model="substituteForm.nowpay" :disabled="disabled">
            <el-radio label="1">一次性付费</el-radio>
            <el-radio label="0">按天付费</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-col :span="24">
        <p class="">支付预算(<span class="red">当日不足1天按剩余时间计费</span>)：</p>
        <p>当前支付：<span class="red">{{substituteRet.allmoney | formatCurrency}}</span> 元，共需支付：<span class="red">{{substituteRet.paymoney
            | formatCurrency}}</span> 元，赠送天数：<span class="red">{{substituteRet.pday}}</span> 天</p>
        <p><span class="red">注意：</span></p>
        <p class="red">1、只有“按天付费”才可以在中途取消网址代挂服务； 2、取消网址代挂服务在当天凌晨才正式生效； </p>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTrustee">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 网址代挂弹窗end -->

    <!-- 网址代挂详情弹窗start -->
    <el-dialog title="网址代挂服务" :visible.sync="TrusteeDialogVisible" width="30%">
      <p>交易订单号：<span>{{odrInfo.odrid}}</span></p>
      <p>费用支付方式：<span>{{odrInfo.status|showOdrStatus}}</span></p>
      <p>网址代挂价格：<span>{{odrInfo.dayprice/ 100 | formatCurrency}} 元/天</span></p>
      <p>网址代挂流量：<span>{{odrInfo.svcid | showSvcid}}</span></p>
      <p>代挂开始时间：<span>{{odrInfo.btime}}</span></p>
      <p>代挂结束时间：<span>{{odrInfo.etime}}</span></p>

      <span v-if="odrInfo.status==1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeTrusteeTip">退订代挂服务</el-button>
      </span>
    </el-dialog>
    <!-- 网址代挂详情弹窗start -->


  </div>
</template>
<style scoped>
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  /* .bg-purple {
    background: #d3dce6;
  } */
  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .red {
    color: #f56c6c;
    ;
  }

</style>
<script>
  import {
    getList,
    del,
    operate,
    getService,
    openService,
    closeService
  } from '@/api/task'

  export default {
    props: {
      menuType: {
        type: String,
        default: 'baidu_task'
      },
      subMenuType: {
        type: String,
        default: 'baidu_speed'
      }
    },
    data() {
      return {
        trusteeServerIP: {
          "101": "1000IP,1.60元/天",
          "103": "3000IP,2.60元/天",
          "106": "6000IP,5.20元/天",
          "110": "10000IP,9.80元/天"
        },
        listLoading: true,
        labelPosition: 'right',
        centerDialogVisible: false,
        TrusteeDialogVisible: false,
        listData: [],
        listTotal: 0,
        listPage: 1,
        listPageSize: 10,
        multipleSelection: [],
        //网址代挂表单
        substituteForm: {
          urlid: 0,
          day: '30',
          svcid: '103',
          nowpay: '1',
          odrid: 0,
          etime: ''
        },
        disabled: false,
        //网址代挂返回值
        substituteRet: {
          etime: '',
          allmoney: 0,
          paymoney: 0,
          pday: 0
        },
        odrInfo: {

        },
        formLabelWidth: '150px'
      }
    },
    created() {
      this.fetchData()
    },
    updated() {
      //   console.log('updated:', this.substituteForm);
    },
    computed: {
      // 计算属性的 getter
      reversedMessage: function () {
        // `this` 指向 vm 实例
        return this.formLabelWidth.split('').reverse().join('')
      }

    },
    watch: {
      'substituteForm.day': function (new_data, old) {
        // console.log('new:', new_data);
        if (new_data > 365 || new_data < 1) {
          this.$message({
            message: '请输入有效的服务时间（1-365）',
            type: 'error',
            duration: 3 * 1000
          });
          this.substituteForm.day = 30;
          return false;
        }
        // console.log('old:', old);
        this.getService();
      },
      'substituteForm.svcid': function (new_data, old) {
        // console.log('new:', new_data);
        // console.log('old:', old);
        this.getService();
      },
      'substituteForm.nowpay': function (new_data, old) {
        // console.log('new:', new_data);
        // console.log('old:', old);
        this.getService();
      }
    },
    filters: {
      urlStatusName: function (value) {
        var name = '';
        switch (value.toString()) {
          case '0':
            name = '离线';
            break;
          case '1':
            name = '在线';
            break;

        }
        return name;
      },
      shareStatusName: function (value) {
        var name = '';
        switch (value.toString()) {
          case '0':
            name = '未分享';
            break;
          case '1':
            name = '分享中';
            break;

        }
        return name;
      },
      filterUrl: function (data, type) {
        data = data.split("|");
        switch (type) {
          case 'url':
            return data[0] || '';
            break;
          case 'keyword':
            return data[1] || '';
            break;
        }
      },
      getTrusteeServiceInfo(odrs) {
        return this.getTrusteeServiceInfo(odrs);
      },
      showTrusteeService(odrs) {
        var info = this.getTrusteeServiceInfo(odrs);
        return info.showTitle || '无';
      },
      showOdrStatus(value) {
        var name = '';
        switch (parseInt(value)) {
          case 1:
            name = '按天付费';
            break;
          case 2:
            name = '一次性付费';
            break;
        }
        return name;
      },
      showSvcid(value) {
        var name = '';
        switch (parseInt(value)) {
          case 101:
            name = "1000IP";
            break;
          case 102:
            name = "2000IP";
            break;
          case 103:
            name = "3000IP";
            break;
          case 106:
            name = "6000IP";
            break;
          case 110:
            name = "10000IP";
            break;
          case 115:
            name = "15000IP";
            break;
          case 120:
            name = "20000IP";
            break;
          default:
            name = "3000IP";
            break;
        }
        return name;
      }
    },
    methods: {
      getTrusteeServiceInfo(odrs) {
        var info = {};
        for (var i in odrs) {
          if (odrs[i].svcid == 10) {
            // 流量
            continue;
          }
          info = odrs[i];
        }
        if (info.odrid) {
          var lsTime = parseInt(info.sday);
          var strTime = "剩";
          var nDay = Math.floor(lsTime / 1440);
          var nHour = Math.floor((lsTime - nDay * 1440) / 60);
          var nMinute = lsTime - (nDay * 1440 + nHour * 60);
          strTime += nDay + "天" + nHour + "时" + nMinute + "分";
          info.showTitle = strTime;
          return info;
        }
        return false;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 拉取列表数据
      fetchData() {
        this.listLoading = false;
        var i = {
          "type": this.subMenuType,
          "page": this.listPage,
          "page_size": this.listPageSize
        };
        i = JSON.stringify(i);
        getList(i).then(response => {
          // console.log(response);
          this.listData = response.urls;
          this.listLoading = false
          this.listTotal = response.total;
        })
      },
      delTip: function () {
        // console.log(this.multipleSelection);
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].urlid);
        }
        if (ids.length < 1) {
          this.$message({
            message: '请选择任务',
            type: 'error',
            duration: 3 * 1000
          })
          return false;
        }
        this.$confirm(
          '删除则不可恢复，确定删除？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.del(ids);

        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // });
        });
        // console.log(1);

        return;
      },
      del: function (ids) {
        // console.log(ids);
        var i = {
          "ids": ids
        }
        i = JSON.stringify(i);
        del(i).then(response => {
          if (response.error > -1) {
            for (var i in ids) {
              // console.log(ids[i])
              for (var j in this.listData) {
                if (ids[i] == this.listData[j].urlid) {
                  this.listData.splice(j, 1);
                  break;
                }
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      addTask: function () {
        this.$router.push('/'+this.menuType+'/add')
      },
      operate: function (type) {
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].urlid);
        }
        if (ids.length < 1) {
          this.$message({
            message: '请选择任务',
            type: 'error',
            duration: 3 * 1000
          })
          return false;
        }
        var i = {
          "free": type,
          "ids": ids
        }
        i = JSON.stringify(i);
        operate(i).then(response => {
          if (response.error > -1) {
            for (var i in ids) {
              // console.log(ids[i])
              for (var j in this.listData) {
                if (ids[i] == this.listData[j].urlid) {
                  this.listData[j].free = type;
                  break;
                }
              }
            }
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      edit(item) {
        this.$router.push({
          path: '/'+this.menuType+'/edit/' + item.urlid
        })
      },
      showTrustee(item) {
        var info = this.getTrusteeServiceInfo(item.odrs);
        this.odrInfo = info;
        this.TrusteeDialogVisible = true
      },
      openTrustee(item, type) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(item, true);
        this.substituteForm.urlid = item.urlid;
        if (type == 1) { // 续费
          var info = this.getTrusteeServiceInfo(item.odrs);
          //   console.log(info);
          this.disabled = true;
          this.substituteForm.odrid = info.odrid;
          this.substituteForm.etime = info.etime;
        } else {
          this.disabled = false;
        }
        this.getService();
        this.centerDialogVisible = true
      },
      closeTrusteeTip() {
        this.$confirm(
          '您确认要退订网址代挂服务吗？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.closeTrustee();

        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // });
        });
      },
      closeTrustee() {

        var i = this.odrInfo;
        i = JSON.stringify(i);
        // {"urlid":"19589","odrid":"10843","svcid":"103"}
        closeService(i).then(response => {
          if (response.error > -1) {
            this.$message({
              message: '退订成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.TrusteeDialogVisible = false;
            this.fetchData();
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })

      },
      getService() {
        var i = this.substituteForm;
        i = JSON.stringify(i);
        getService(i).then(response => {
          if (response.error > -1) {
            this.substituteRet.etime = response.etime;
            // allmoney 单位，分
            this.substituteRet.allmoney = response.allmoney / 100;
            // paymoney 单位，分
            this.substituteRet.paymoney = response.paymoney / 100;
            // pday
            this.substituteRet.pday = response.pday;
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      submitTrustee() {
        // console.log(this.substituteForm);
        var i = this.substituteForm;
        i = JSON.stringify(i);
        openService(i).then(response => {
          if (response.error > -1) {
            this.$message({
              message: '开通成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData();
          } else {
            this.$message({
              message: response.msg || '开通失败',
              type: 'error',
              duration: 3 * 1000
            })
          }
          this.centerDialogVisible = false;
        })
      },
      handleCurrentChange(val) {
        this.listPage = val;
        this.fetchData();
      }
    }
  }

</script>
