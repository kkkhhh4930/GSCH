import axios from "axios";
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useArticleStore = defineStore( "article", () => {
  const API_URL = 'http://127.0.0.1:8000'
  const articles = ref([])
  const exchanges = ref([])
  const token = ref(null);
  const router = useRouter();
  const userInfo = ref();

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

  // 게시글 출력 함수
  const getArticles = function () {
    axios({
      method: 'get',
      url: "http://127.0.0.1:8000/community/articles/",
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then(response => {
        articles.value = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
  const getUserInfo = function (username) {
    axios({
      method: 'get',
      url: `${API_URL}/accounts/${username}/profile/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then(res => {
        userInfo.value = res.data;
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const changePassword = function (data) {
    axios({
      method: 'post',
      url: `${API_URL}/accounts/change-password/`,
      headers: {
        Authorization: `Token ${token.value}`
      },
      data: data
    })
      .then(res => {
        console.log('비밀번호 변경 성공');
      })
      .catch(error => {
        console.log('비밀번호 변경 실패');
        console.log(error);
      });
  };
  
  const updateUserInfo = function (data) {
    axios({
      method: 'put',
      url: `${API_URL}/accounts/${data.username}/profile/`,
      headers: {
        Authorization: `Token ${token.value}`
      },
      data: data
    })
      .then(res => {
        console.log('회원 정보 수정 성공');
        userInfo.value = res.data;
      })
      .catch(error => {
        console.log('회원 정보 수정 실패');
        console.log(error);
      });
  };
  

  // 금리 비교 함수
  // const getDeposit = function () {
  //   axios({
  //     method : 'get',
  //     url : `${API_URL}/deposit_list`
  //   })
  //     .then(res => {
  //       console.log(res.data)
  //       Deposit.value = res.data
  //     })
  //     .catch(err => console.log(err))
  // }

  return { API_URL, token, articles, userInfo, signup, login, logout, isLogin, getArticles, getUserInfo, changePassword, updateUserInfo };
});

