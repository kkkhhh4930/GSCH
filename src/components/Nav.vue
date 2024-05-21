<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useArticleStore } from "@/stores/articles";

const store = useArticleStore()
const isLogin = computed(() => store.isLogin)
</script>

<template>
    <nav class="navbar">
        <div class="nav-links">
            <RouterLink class="nav-link" :to="{ name: 'compare' }">금리 비교</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'exchange' }">환율 계산</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'bank' }">주변 은행</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'community' }">커뮤니티</RouterLink>
        </div>
        <div class="auth-links">
            <RouterLink class="nav-link" :to="{ name: 'signup' }">회원가입</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'login' }">로그인</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'logout' }">로그아웃</RouterLink>
            <RouterLink v-if="isLogin" class="nav-link" :to="{ name: 'profile' }">프로필</RouterLink>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
}

.nav-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    flex: 1;
}

.auth-links {
    display: flex;
    align-items: center;
    gap: 15px;
}

.nav-link {
    color: #333;
    text-decoration: none;
    padding: 8px 16px;
    font-weight: bold;
    transition: color 0.3s, background-color 0.3s;
}

.nav-link:hover {
    color: #0056b3;
    background-color: #e9ecef;
    border-radius: 4px;
}

.nav-link:active {
    color: #00376d;
}
</style>
