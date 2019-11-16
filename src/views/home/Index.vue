<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex">
      <!-- 频道 -->
      <van-tab
        :key="channels.id"
        v-for="channels in myChannels"
        :title="channels.name"
      >
        <div class="scroll-wrapper">
          <!-- 下拉刷新 -->
          <van-pull-refresh
            v-model="activeChannle.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <!-- 上拉加载 -->
            <van-list
              v-model="activeChannle.upLoading"
              :finished="activeChannle.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell-group>
                <van-cell v-for="item in activeChannle.articles" :key="item.art_id.toString()">
                  <!-- 三张图 -->
                  <div class="article_item">
                    <h3 class="van-ellipsis">
                      {{item.title}}
                    </h3>
                    <div class="img_box" v-if="item.cover.type === 3">
                      <van-image
                        class="w33"
                        fit="cover"
                        :src="item.cover.images[0]"
                      />
                      <van-image
                        class="w33"
                        fit="cover"
                        :src="item.cover.images[1]"
                      />
                      <van-image
                        class="w33"
                        fit="cover"
                        :src="item.cover.images[2]"
                      />
                    </div>
                    <div class="img_box" v-if="item.cover.type === 1">
                      <van-image
                        class="w100"
                        fit="cover"
                       :src="item.cover.images[0]"
                      />
                    </div>
                    <div class="info_box">
                      <span>{{item.aut_name}}</span>
                      <span>{{item.comm_count}}评论</span>
                      <span>{{item.pubdate}}</span>
                      <span class="close"
                        ><van-icon name="cross"></van-icon
                      ></span>
                    </div>
                  </div>

                </van-cell>
              </van-cell-group>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 右侧汉堡按钮 -->
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import { getArticle } from '@/api/article'
export default {
  name: 'home-index',
  // 数据
  data () {
    return {
      // // 上拉加载
      // upLoading: false,
      // // 是否全部加载完成
      // finished: false,
      // // 下拉刷新
      // downLoading: false,
      // // 文章列表数据
      // articles: [],
      // 频道数据
      myChannels: [],
      // 刷新完的文字提示
      refreshSuccessText: '',
      // 当前激活数据频道索引
      activeIndex: 0
    }
  },
  computed: {
    activeChannle () {
      return this.myChannels[this.activeIndex]
    }
  },
  created () {
    // 获取频道数据
    this.getMyChannels()
  },
  methods: {
    // 上拉加载函数
    async onLoad () {
      /**
       * @load特点：默认在组件初始化会加载一次
       * @load特点：当加载的内容渲染后不足一屏，继续触发一次。
       * @load特点：触发条件，往上滑动到底部触发
       * 主要业务：获取数据进行渲染，模拟
       */
      // window.setTimeout(() => {
      //   // 数据加载成功
      //   // 显示加载中的效果
      //   this.upLoading = false
      //   // 模拟数据
      //   const data = []
      //   // 每次加载，往后生十条数据
      //   for (let i = this.articles.length; i < this.articles.length + 10; i++) {
      //     data.push(i + 1)
      //   }
      //   // 追加
      //   this.articles.push(...data)
      //   // 加载50条后停止
      //   if (this.articles.length >= 50) {
      //     this.finished = true
      //   }
      // }, 1000)
      // 请求接口获取数据
      const data = await getArticle(this.activeChannle.id, this.activeChannle.timestamp)
      console.log(data)

      // 追加
      this.activeChannle.articles.push(...data.results)
      // 显示加载中的效果
      this.activeChannle.upLoading = false
      // 停止
      if (!data.pre_timestamp) {
        // 判断是否为空
        this.activeChannle.finished = true
      } else {
        // 下次请求使用
        this.activeChannle.timestamp = data.pre_timestamp
      }
    },
    // 下拉刷新
    async onRefresh () {
      /**
       * @refresh  在下拉的时候松手触发
       */
      // window.setTimeout(() => {
      //   // 数据加载成功
      //   // 显示加载中的效果
      //   this.downLoading = false
      //   // 模拟数据
      //   const data = [1, 2, 3, 4]
      //   // 判断是否有数据
      //   if (data.length) {
      //     // 更新数据
      //     this.articles = data
      //     // 刷新后提示
      //     this.refreshSuccessText = '更新成功'
      //     // 加载不满足一屏，主动再加载一次
      //     this.onLoad()
      //     // 数据全部加载完毕后更改状态
      //     this.finished = false
      //   } else {
      //     // 刷新后没有数据，文字提示
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)
      // 请求接口获取数据
      this.activeChannle.timestamp = Date.now()
      const data = await getArticle(this.activeChannle.id, this.activeChannle.timestamp)
      // 显示加载中的效果
      this.activeChannle.downLoading = false
      // 判断是否有数据
      if (data.results.length) {
        // 更新数据
        this.activeChannle.articles = data.results
        // 刷新后提示
        this.refreshSuccessText = '更新成功'
        // 数据全部加载完毕后更改状态
        this.activeChannle.finished = false
        // 加上时间戳 加载下一页数据
        this.activeChannle.timestamp = data.pre_timestamp
        // 加载不满足一屏，主动再加载一次
        this.onLoad()
      } else {
        // 刷新后没有数据，文字提示
        this.refreshSuccessText = '暂无更新'
      }
    },
    // 获取频道数据
    async getMyChannels () {
      const data = await getMyChannels()
      console.log(data)
      this.myChannels = data.channels.map(item => {
        return {
          id: item.id,
          name: item.name,
          articles: [],
          // 上拉加载
          upLoading: false,
          // 是否全部加载完成
          finished: false,
          // 下拉刷新
          downLoading: false,
          // 时间戳 分页页面
          timestamp: Date.now()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 文章列表
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
