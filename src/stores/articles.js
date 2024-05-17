import axios from "axios";
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useArticleStore = defineStore( "article", () => {
  // 초기 토큰 값
  const token = ref(null);
  const router = useRouter();

  const isLogin = computed(() => {
    if (token.value === null) {
      return false;
    } else {
      return true;
    }
  })

  const signup = function (info) {
      const { username, password1, password2 } = info;
      axios({
        method: "post",
        url: "http://127.0.0.1:8000/accounts/signup/",
        data: {
          username,
          password1,
          password2,
        },
      })
        .then((res) => {
          console.log("회원가입 성공")
          const password = password1;
          login({ username, password })
        })
        .catch((error) => {
          console.log(error)
        });
    }

  const login = function (info) {
    const { username, password } = info
    axios({
      method: "post",
      url: "http://127.0.0.1:8000/accounts/login/",
      data: {
        username,
        password,
      },
    })
      .then((res) => {
        console.log("로그인 성공")
        console.log(res)
        console.log(res.data)
        token.value = res.data.key
        router.push({ name: "home" })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const logout = function () {
    // 로그아웃 로직
    this.token = null;
    localStorage.removeItem('article'); // 'article'는 로컬스토리지에 저장된 키 이름 입니다.
    router.push({ name: "login" }) // 로그인 페이지로 리디렉션
    console.log('로그아웃 성공')
  }

  return { signup, login, logout, isLogin, token }
},

{persist : true})