<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">用户名:{{ name }}</div> -->
    <!-- <div class="dashboard-text">roles:<span>{{ roles }}</span></div> -->
    <!-- <div class="dashboard-text">roles:<span>{{ info }}</span></div> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户信息</span>
      </div>
      <div class="text item">
        用户名：{{ name }}
      </div>
      <div class="text item">
        资金余额：{{info.money/100 | formatCurrency}} 元
      </div>
      <div class="text item">
        积分：{{info.score}} <span class="red">兑换说明：5000积分/1.1元</span>
      </div>
      <div v-if="info.score >= 5000">
        <el-row>
          <el-col :span="8">
            <div class="">
              <el-input size="small" v-model="score" placeholder="请输入兑换积分"></el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class=""></div>
          </el-col>
          <el-col :span="8">
            <div class="">
              <el-button @click="triggerTurn" type="text">兑换余额</el-button>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-card>

  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    turnMoney
  } from '@/api/task'
  export default {
    name: 'Dashboard',
    data() {
      return {
        score: ''
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'info'
      ])
    },
    methods: {

      formatCurrency(num) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) +
          ',' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
      },
      triggerTurn() {

        if (isNaN(this.score)) {
          this.$message({
            type: 'error',
            message: '请输入兑换积分'
          });
          return false;
        }

        if (this.score < 5000) {
          this.$message({
            type: 'error',
            message: '兑换积分不满足5000'
          });
          return false;
        }
        var size = Math.floor(this.score / 5000);
        var total_score = size * 5000;
        var total_money = size * 1.1;
        this.$confirm('您确定兑换' + total_score + '积分为' + this.formatCurrency(total_money) + '元?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.turnMoney();
        }).catch(() => {

        });
      },

      turnMoney() {
        var i = {
          score: this.score
        };
        i = JSON.stringify(i);
        turnMoney(i).then(response => {
          if (response.error > -1) {
            this.$message({
              message: '兑换成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.info.score = response.data.score;
            this.info.money = response.data.money;
            this.score = '';
          } else {
            this.$message({
              message: response.msg || '兑换失败',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }


  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }

  .red {
    color: #f56c6c;
    ;
  }

</style>
