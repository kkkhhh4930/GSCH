import axios from "axios";
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useArticleStore = defineStore("article", () => {
  const API_URL = 'http://127.0.0.1:8000';
  const articles = ref([]);
  const exchanges = ref([]);
  const token = ref(localStorage.getItem('token')); // 애플리케이션 시작 시 토큰 복원
  const router = useRouter();
  const userInfo = ref(null);
  const error = ref(null);

  const isLogin = computed(() => token.value !== null);

  const signup = (info) => {
    const { username, name, email, password1, password2 } = info;
    axios.post(`${API_URL}/accounts/signup/`, { username, name, email, password1, password2 })
      .then((res) => {
        const password = password1;
        login({ username, password });
      })
      .catch((err) => {
        error.value = err.response.data;
      });
  };

  const login = (info) => {
    const { username, password } = info;
    axios.post(`${API_URL}/accounts/login/`, { username, password })
      .then((res) => {
        token.value = res.data.key;
        localStorage.setItem('token', res.data.key); // 로그인 성공 시 토큰 저장
        getUserInfo(username);
        router.push({ name: "home" });
      })
      .catch((err) => {
        error.value = err.response.data;
      });
  };

  const logout = () => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem('token'); // 로그아웃 시 토큰 제거
    router.push({ name: "login" });
  };

  const getArticles = () => {
    axios.get(`${API_URL}/community/articles/`, {
      headers: { Authorization: `Token ${token.value}` },
    })
      .then(response => {
        articles.value = response.data;
      })
      .catch((err) => {
        error.value = err.response.data;
      });
  };

  const getUserInfo = (username) => {
    axios.get(`${API_URL}/accounts/${username}/profile/`, {
      headers: { Authorization: `Token ${token.value}` },
    })
      .then((res) => {
      userInfo.value = res.data;
    })
      .catch((err) => {
        error.value = err.response.data;
      });
  };

  const changePassword = (data) => {
    axios.post(`${API_URL}/accounts/change-password/`, data, {
      headers: { Authorization: `Token ${token.value}` },
    })
      .then(res => {
        console.log('비밀번호 변경 성공');
      })
      .catch((err) => {
        error.value = err.response.data;
      });
  };

  const updateUserInfo = (data) => {
    axios.put(`${API_URL}/accounts/${data.username}/profile/`, data, {
      headers: { Authorization: `Token ${token.value}` },
    })
      .then(res => {
        userInfo.value = res.data;
        console.log('회원 정보 수정 성공');
      })
      .catch((err) => {
        error.value = err.response.data;
      });
  };

  const getExchanges = () => {
    axios.get(`${API_URL}/exchange/`)
      .then((res) => {
        exchanges.value = res.data;
      })
      .catch((err) => {
        error.value = err.response.data;
        console.error('Failed to fetch exchanges:', err.response.data);
      });
  };

  return { 
    API_URL, 
    token, 
    articles, 
    exchanges, 
    userInfo, 
    error, 
    signup, 
    login, 
    logout, 
    isLogin, 
    getArticles, 
    getUserInfo, 
    changePassword, 
    updateUserInfo, 
    getExchanges 
  };
}, { persist: true });
