<template>
  <div class="page-user-chat">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="登录"
    ></van-nav-bar>
    <van-cell-group>
      <van-field
        @blur="valiMobile"
        :error-message="errorMsg.mobile"
        label="手机号码"
        v-model="loginForm.mobile"
        placeholder="请输入手机号"
      />
    </van-cell-group>
    <van-cell-group>
      <van-field
        @blur="valiCode"
        :error-message="errorMsg.code"
        v-model="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button class="p5" slot="button" size="mini" type="primary"
          >发送验证码</van-button
        >
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button @click="toLogin" type="info" block round>登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      // 验证信息
      loginForm: {
        mobile: '',
        code: ''
      },
      // 错误信息
      errorMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 手机号验证
    valiMobile () {
      if (!this.loginForm.mobile) {
        // 非空
        this.errorMsg.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 格式问题
        this.errorMsg.mobile = '请输入正确手机号'
        return false
      }
      // 验证成功
      this.errorMsg.mobile = ''
    },
    // 验证码验证
    valiCode () {
      if (!this.loginForm.code) {
        // 非空
        this.errorMsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        // 格式问题
        this.errorMsg.code = '请输入正确验证码'
        return false
      }
      // 验证成功
      this.errorMsg.code = ''
    },
    // 登录
    async toLogin () {
      // 对表单的整体验证
      this.valiMobile()
      this.valiCode()
      // 验证登录，发送请求
      if (this.errorMsg.code || this.errorMsg.mobile) {
        // 为空，继续验证
        return false
      }
      try {
        const data = await login(this.loginForm)
        // 登录成功
        // 更新用户信息
        this.setUser(data)
        // 跳转页面
        // 获取回跳地址
        const { redirectUrl } = this.$route.query
        // 判断是否存在回跳地址,没有直接去个人中心
        this.$router.push(redirectUrl || '/user')
      } catch (e) {
        this.$toast.fail('手机号或者验证码错误')
      }
    },
    ...mapMutations(['setUser'])
  }
}
</script>

<style scoped lang="less">
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
