<template>
  <aside :class="$style['aside']">
    <div :class="$style['menu']">
      <div :class="$style['logo']">
        <img :src="logo" alt="logo" />
      </div>
      <ul :class="$style['menu-list']">
        <div :key="item._key" @click="changeMenu(item, index)" v-for="(item, index) of menu">
          <router-link
            :class="$style[menuItemIndex === index ? 'menu-item-active' : '']"
            :to="item.link"
            tag="li"
          >
            <a-icon :class="$style['item-icon']" :type="item.icon" />
            <span :class="$style['menu-list-item-text']">{{ item.name }}</span>
          </router-link>
        </div>
      </ul>
    </div>
    <div
      :class="$style['secondary-menu']"
      v-if="menuItem && menuItem.pages && menuItem.pages.length > 0"
    >
      <p :class="$style['title']">{{ menuItem.name }}</p>
      <div v-if="menuItem.pages[0].name">
        <a-menu
          :class="$style['menu-body']"
          :openKeys="defaultOpenKeys(menuItem.pages)"
          mode="inline"
        >
          <a-sub-menu :key="item._key" v-for="item of menuItem.pages">
            <span :class="$style['subtitle']" slot="title">
              <span :class="$style['subtitle-text']">{{ item.name }}</span>
            </span>
            <a-menu-item
              :class="[$style[option.link === activeRoutePath ? 'active-link' : '']]"
              :key="option._key"
              v-for="option of item.children"
            >
              <router-link :to="option.link">
                <span>{{ option.name }}</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <div v-if="menuItem && !menuItem.pages[0].name">
        <a-menu
          :class="$style['menu-body']"
          :defaultOpenKeys="defaultOpenKeys(menuItem.pages)"
          mode="inline"
        >
          <a-menu-item
            :class="[$style[option.link === activeRoutePath ? 'active-link' : '']]"
            :key="option._key"
            v-for="option of menuItem.pages[0].children"
          >
            <router-link :to="option.link">
              <span>{{ option.name }}</span>
            </router-link>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <!-- <a-modal centered :footer="null" v-model="$store.state.is_stop" :closable=false :keyboard=false :maskClosable=false :class="$style['modal-box']" width=460px>
      <p :class="$style['stop-title']">当前账号被停用</p>
      <a-button :class="$style['stop-btn']" type="primary" @click="stopClick">确定</a-button>
    </a-modal>-->
  </aside>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { Mutation, Action } from 'vuex-class';
import { MUTATION_LOGIN } from '@/store/type';

const uuidv4 = require('uuid/v4');

interface Category {
  _key: string;
  icon: string;
  name: string;
  link?: string; // 页面 link
  pathname?: string; // 如果有二级菜单，用来计算当前选择的菜单 index
  pages?: Page[];
}
interface Page {
  _key: string;
  name: string;
  children?: Children[];
}
interface Children {
  _key: string;
  name: string;
  link?: string;
}

@Component
export default class AppAside extends Vue {
  @Action('FETCH_PERMISSION') fetchPermission: any;
  @Mutation(MUTATION_LOGIN) login: any;
  activeRoutePath: string = '';
  menuItem: object = {};
  menuItemIndex: number | string = '';
  menu = [
    {
      _key: uuidv4(),
      icon: 'home',
      name: '商品',
      link: '/ware/management',
      pathname: 'ware',
      pages: [
        {
          _key: uuidv4(),
          name: '',
          children: [
            {
              _key: uuidv4(),
              name: '商品管理',
              link: '/ware/management',
            },
            {
              _key: uuidv4(),
              name: '商品分类',
              link: '/ware/category',
            },
            {
              _key: uuidv4(),
              name: '商品参数',
              link: '/ware/parameter',
            },
          ],
        },
      ],
    },
    {
      _key: uuidv4(),
      icon: 'user',
      name: '订单',
      link: '/order/after-sale',
      pathname: 'order',
      pages: [
        {
          _key: uuidv4(),
          name: '',
          children: [
            {
              _key: uuidv4(),
              name: '售后管理',
              link: '/order/after-sale',
            },
            {
              _key: uuidv4(),
              name: '发票管理',
              link: '/order/invoice',
            },
          ],
        },
      ],
    },
    {
      _key: uuidv4(),
      icon: 'setting',
      name: '设置',
      link: '/setting/account',
      pathname: 'setting',
      pages: [
        {
          _key: uuidv4(),
          name: '',
          children: [
            {
              _key: uuidv4(),
              name: '账户管理',
              link: '/setting/account',
            },
            {
              _key: uuidv4(),
              name: '交易设置',
              link: '/setting/transaction',
            },
          ],
        },
      ],
    },
  ];

  get logo() {
    return require('@/asset/img/logo-default.png');
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.path === '/login') {
      this.changeMenu(null, -1);
    }
    this.menu.forEach((item: any, index: any) => {
      if (item.pathname) {
        const pathArr = this.$route.path.split('/');
        if (item.pathname === pathArr[1]) {
          this.changeMenu(this.menu[index], index);
        }
      } else {
        if (to.path === item.link) {
          this.changeMenu(this.menu[index], index);
        }
      }
    });
    this.setActiveRoutePath(to);
  }

  setActiveRoutePath(route: any) {
    this.activeRoutePath = route.path;
  }

  changeMenu(item: any, index: number) {
    this.menuItem = item;
    this.menuItemIndex = index;
  }

  defaultOpenKeys(pages: any) {
    const keys: any = [];
    pages.forEach((item: any) => {
      keys.push(item._key);
    });
    return keys;
  }

  // async fetchMenu() {
  //   const list = store.state.menu_list;
  //   const menu: Category[] = list.map((item: any) => getCategory(item));
  //   await Promise.resolve();
  //   return menu;
  // }

  async created() {
    // await this.fetchPermission();
    // this.menu = await this.fetchMenu();
    this.setActiveRoutePath(this.$route);
    this.menu.forEach((item: any, index: any) => {
      const pathArr = this.$route.path.split('/');
      if (item.pathname) {
        if (item.pathname === pathArr[1]) {
          this.menuItemIndex = index;
          this.menuItem = item;
        }
      } else {
        const linkArr = item.link.split('/');
        if (linkArr[1] === pathArr[1]) {
          this.menuItemIndex = index;
          this.menuItem = item;
        }
      }
    });
  }
  // stopClick() {
  //   store.commit(MUTATION_USER_STOP, false);
  //   Cookies.remove('token');
  //   Cookies.remove('user_id');
  //   location.reload();
  // }
}
</script>

<style module lang="stylus">
.aside
  min-width 94px

  .menu, .secondary-menu
    height 100%
    overflow hidden
    background #fff
    float left
    color #444

  .menu
    width 94px
    background #1F1E30

    .logo
      width 42px
      height 42px
      background #fff
      border-radius 50%
      margin 25px auto 20px

      img
        width 42px
        height 42px
        display block
        border-radius 50%

    .menu-list
      overflow hidden

      li
        flex($v: center, $h: center)
        width 94px
        height 54px
        color #fff
        font-size 14px
        margin-bottom 0
        cursor pointer

        &:hover
          color #ccc

      .menu-list-item-text
        font-weight bold

      .item-icon
        margin-right 6px

      .menu-item-active
        background #fff
        color #444

      .menu-item-active:hover
        color #444

  .secondary-menu
    width 119px

    .title
      font-weight bold
      height 50px
      line-height 50px
      text-align center
      border-bottom 2px solid #F6F6F6
      margin-bottom 0

    .menu-body
      border-right 0

      .subtitle
        margin 0

      .subtitle-text
        margin-left 13px
        font-size 13px

      .active-link
        background #F6F6F6 !important

        span
          color #444 !important

.stop-title
  color #190101
  text-align center
  padding 60px 0
  margin 0

.stop-btn
  display block
  margin 0 auto
  margin-bottom 20px
  width 80px
  height 30px
</style>

<style lang="stylus">
.ant-menu-submenu-title
  padding-right 0 !important

.ant-menu-submenu-arrow
  left 16px

.ant-menu
  color #444

.ant-menu-item
  padding-left 38px !important
  margin-top 0 !important
  margin-bottom 0 !important

.ant-menu-submenu-title
  margin-top 0 !important
  margin-bottom 0 !important

.ant-menu-item
  margin 0

  a
    color #444
    font-size 12px

.ant-menu-item:after
  border-right 0 !important

.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected
  background-color #fff
</style>
