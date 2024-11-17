<template>
  <div class="container">
    <div class="login-banner-warp">
      <img :src="loginImgSvg" alt="访问路径失效">
    </div>
    <div class="loginContent">
      <p></p>
      <div class="loginForm">
          <p class="login-title">欢迎回来</p>
          <a-form :ref="setloginRef" :model="loginForm" :rules="loginRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item name="email" :span="24">
              <a-input v-model:value="loginForm.email" placeholder="帐号" :prefix="userSvg" />
            </a-form-item>
            <a-form-item name="password">
              <a-input-password v-model:value="loginForm.password" @keyup.enter="loginAction" placeholder="登陆密码" :prefix="passwordSvg" />
            </a-form-item>
            <a-form-item :span="24">
              <a-button class="login-btn" type="primary" :loading="loginLoading"  @click="loginAction">登陆</a-button>
            </a-form-item>
          </a-form>
        </div>
        <p class="copyright">@2024 广东华晟智能科技有限公司</p>
    </div>
  </div>
</template>

<script setup>
import loginImgSvg from '@/assets/svg/login-img.svg'
import userSvgPath from '@/assets/svg/user.svg'
import passwordSvgPath from '@/assets/svg/password.svg'
import { ref, reactive, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NotEmpty } from '@/utils/validate'
import { useStore } from 'vuex'
const store = useStore()
const labelCol = { span: 0 }
const wrapperCol = { span: 24 }

const userSvg = createVNode('img', { src: userSvgPath })
const passwordSvg = createVNode('img', { src: passwordSvgPath })

const loginRules = {
  email: [NotEmpty('帐号')],
  password: [NotEmpty('登陆密码')],
}
// 登录表单逻辑
const loginFormRef = ref(null)
const loginLoading = ref(false)
const loginForm = reactive({
  email: null,
  password: null,
})
const setloginRef = el => {
  loginFormRef.value = el
}
const Router = useRouter()
const { query } = useRoute()
const loginAction = () => {
  loginFormRef.value.validate().then(() => {
    submitLogin(loginForm)
  })
}


const submitLogin = async data => {
  loginLoading.value = true
  store.dispatch('userInfo/Login', data).then(() => {
      loginLoading.value = false
      Router.push({
        path: query.redirectUrl || '/',
      })
  }).catch(err => {
    console.error(err)
    loginLoading.value = false
  })
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  .login-banner-warp {
    width: 30%;
    max-width: 622px;
    flex-shrink: 0;
    height: 100%;
    background: linear-gradient(180deg, #02308A -2%, rgba(3, 50, 140, 0.9) 72%, #448BF4 100%);

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loginContent {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .copyright {
      width: 286px;
      font-family: PingFang SC;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
.loginForm{
  width: 286px;
  .login-title {
    font-family: PingFang SC;
    font-size: 36px;
    color: #000000;
  }
  .login-btn {
    width: 100%;
    background-color: #165DFF;
    border-color: #165DFF;
  }
  
}
.action {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
