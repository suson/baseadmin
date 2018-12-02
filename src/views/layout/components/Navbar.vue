<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <div class="right-menu">
      <span class="errLog-container right-menu-item">用户名：{{info.name}}</span>
      <span class="errLog-container right-menu-item">资金余额：{{info.money/100 | formatCurrency}} 元</span>
    <el-dropdown class="avatar-container right-menu-item" trigger="click">
      
      <div class="avatar-wrapper ">
        <img src="data:image/png;base64,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hRUpqbc/G7PZvU0V+WE/td1zYUAabCXSVhwXSgQz52ijTwO8eGu8sljv8s6e+Fz2ZY+y5p8leNFYsqgirOhJRV/W7gvUNQ+eqSmU2vpo0dN1l4flnnFI8EKJ4IF5WDa7t97tO9nhjONUiKwNU8mQX+Gwwibl8s6euuo8fedBjCtpHZ0JbqvMktuyr+gXHw3HPmcmNd543/EkHAQ5xcKKlFR8X+8R0hafM9N0bTRkVXOvaBAffW9C/XbzwU3xn1aN5cqIJ6cqpkhYYZOa9gcu9dyP+/Qme9TWqWoLfy+ZpdXUVy7ftVb/8w+HpVc0yhUN0lu2BC3IKyPioIrLv851jZ343JX45zDB10NLT3Rx/6pLPff5+kcmZmXNbUqKpFwMnXYUCMtm9x50TvHXvr3Pc/z6vSQeI/j10LaqZbvX5/F7srSa2lLTaqOw45Kjsds973GWT43aVpgbZUh0eM3i1zaZukem/vrluNpGciqhzB7r7c/GDm4yyZqTLov1yoj1qwnpFKvLO1t3eXj+pURd8EVmf9htCTudVRQ0RyrMRl2GxSDsXp/n8s5et0+QFpbg9xkpQrHLv+S+t//BmiX8hsMd00fFNru342z/m9vyq4r1R1qjzaIp12v3rs7dW2IMOdG/VJcR9psgthdkTvkDRvbwwUZdxu71eaSFqeTUlCyqOI8VzCrq+CWE14cfDob0izT7n8+TXvWxmE9j2n0B65WR8i5X2COaKGgOFC/+blHO3POuDrfvwhf3Ix00bXavzd4/N8fgwj68Mx5lPtmTQHVhsUcfjdWWhv/XTwYmZa0t5NUt12u/v1IXtqdpf+BT++Qf/+mKZZdzw+O/cdN19KaruiDzR88t2SLmBhdWW2qqLTU53L6/3x5P/BsG8TVGSdAR9UVt70v02zJ+VmqUxvWSm46JTwYm/9L3II53pq2jM62jM4yNVBdkvvaCcbOYI03msRiE1cYkfC0qvsYoCey+wLQ/EDL7ijHW65xKynew/OravapiPV8/36Nc7J9IyjGrdXSmtW2IMdZQYpD2iNEnMixgTy1+q1vpbUi1E2VGxliyeoqkXK8ty8+M8sGUKGi2F2Qyxty+QNiDr/RmUNYbnfiWSronMSxIARVdTAELCcICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgISCAtIICwggbCABMICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgISCAtIICwggbCABMICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgISCAtIICwggbCABMICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgISCAtIICwggbCABMICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgISCAtIICwggbCABMICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgISCAtIICwggbCABMICEggLSCAsIIGwgATCAhIIC0ggLCCBsIAEwgIS/wMiwvg3QskkXwAAAABJRU5ErkJggg==" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { login, logout, getInfo } from '@/api/login'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'info'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          window.location.href = process.env.BASE_API+'/service/login.html';
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
      // logout().then(() => {
      //     window.location.href = process.env.BASE_API+'/service/login.html';
      // }).catch(error => {
      //   console.log(error)
      // })
      // this.$store.dispatch('LogOut').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

