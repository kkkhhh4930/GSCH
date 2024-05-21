import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import SignupView from "@/views/SignupView.vue";
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import CompareView from '@/views/CompareView.vue'
import DepositView from '@/views/DepositView.vue'
import SavingView from '@/views/SavingView.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import BankView from '@/views/BankView.vue'
import CommunityView from '@/views/CommunityView.vue'
import ArticleDetailView from '@/views/ArticleDetailView.vue'
import ArticleCreateView from '@/views/ArticleCreateView.vue'
import ProfileView from '@/views/ProfileView.vue' // 프로필 뷰를 가져옵니다.


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 홈 라우터
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // 회원가입 라우터
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    // 로그인 라우터
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    // 로그아웃 라우터
    {
      path: "/logout",
      name: "logout",
      component: LogoutView,
    },
    // 금리비교 라우터
    {
      path : '/compare',
      name : 'compare',
      component : CompareView,
      children : [
        {
          path : 'deposit',
          name : 'deposit',
          component : DepositView,
        },
        {
          path : 'saving',
          name : 'saving',
          component : SavingView,
        }
      ]
    },
    // 환율계산 라우터
    {
      path : '/exchange',
      name : 'exchange',
      component : ExchangeView,
    },
    // 주변 은행 검색 라우터
    {
      path : '/bank',
      name : 'bank',
      component : BankView,
    },
    // 커뮤니티 라우터
    {
      path : '/community',
      name : 'community',
      component : CommunityView,
    },
    // 커뮤니티 게시판 라우터
    {
      path: '/community/articles/:id',
      name: 'articleDetail',
      component: ArticleDetailView
    },
    {
      path: '/community/create',
      name: 'articleCreate',
      component: ArticleCreateView
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
  ]
})

import { useArticleStore } from "@/stores/articles";
router.beforeEach((to, from) => {
  const store = useArticleStore();
  if (store.token && (to.name === "login" || to.name === "signup")) {
    return { name: "home" };
  }
  if (store.token === null && to.name === "home" && from.name !== "logout") {
    return { name: "signup" };
  }
});


export default router
