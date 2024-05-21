import axios from "axios";
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useArticleStore = defineStore("article", () => {
  const API_URL = 'http://127.0.0.1:8000';
  const articles = ref([]);
  const token = ref(null);
  const router = useRouter();
  const userInfo = ref();
  const error = ref(null);

  const isLogin = computed(() => token.value !== null);

  const signup = (info) => {
    const { username, name, email, password1, password2 } = info;
    axios({
      method: "post",
      url: `${API_URL}/accounts/signup/`,
      data: { username, name, email, password1, password2 }
    }).then((res) => {
      const password = password1;
      login({ username, password });
    }).catch((err) => {
      error.value = err.response.data;
    });
  };

  const login = (info) => {
    const { username, password } = info;
    axios({
      method: "post",
      url: `${API_URL}/accounts/login/`,
      data: { username, password }
    }).then((res) => {
      token.value = res.data.key;
      getUserInfo(username);
      router.push({ name: "home" });
    }).catch((err) => {
      error.value = err.response.data;
    });
  };

  const logout = () => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem('article');
    router.push({ name: "login" });
  };

  const getArticles = () => {
    axios({
      method: 'get',
      url: `${API_URL}/community/articles/`,
      headers: { Authorization: `Token ${token.value}` },
    }).then(response => {
      articles.value = response.data;
    }).catch((err) => {
      error.value = err.response.data;
    });
  };

  const getUserInfo = (username) => {
    axios({
      method: 'get',
      url: `${API_URL}/accounts/${username}/profile/`,
      headers: { Authorization: `Token ${token.value}` },
    }).then((res) => {
      userInfo.value = res.data;
    }).catch((err) => {
      error.value = err.response.data;
    });
  };

  const changePassword = (data) => {
    axios({
      method: 'post',
      url: `${API_URL}/accounts/change-password/`,
      data,
      headers: { Authorization: `Token ${token.value}` },
    }).then(res => {
      console.log('비밀번호 변경 성공');
    }).catch((err) => {
      error.value = err.response.data;
    });
  };

  const updateUserInfo = (data) => {
    axios({
      method: 'put',
      url: `${API_URL}/accounts/${data.username}/profile/`,
      data,
      headers: { Authorization: `Token ${token.value}` },
    }).then(res => {
      userInfo.value = res.data;
      console.log('회원 정보 수정 성공');
    }).catch((err) => {
      error.value = err.response.data;
    });
  };

  return { API_URL, token, articles, userInfo, error, signup, login, logout, isLogin, getArticles, getUserInfo, changePassword, updateUserInfo };
});
