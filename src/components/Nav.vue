<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useArticleStore } from "@/stores/articles";
const store = useArticleStore()
const isLogin = computed(() => store.isLogin)

</script>

<template>
    <div>
        <RouterLink :to="{ name: 'compare' }">금리 비교</RouterLink> |
        <RouterLink :to="{ name: 'exchange' }">환율 계산</RouterLink> |
        <RouterLink :to="{ name: 'bank' }">주변 은행</RouterLink> |
        <RouterLink :to="{ name: 'community' }">커뮤니티</RouterLink> |



        <RouterLink :to="{ name: 'home' }">홈</RouterLink> |
        <RouterLink :to="{ name: 'signup' }">회원가입</RouterLink> |
        <RouterLink :to="{ name: 'login' }">로그인</RouterLink> |
        <RouterLink :to="{ name: 'logout' }">로그아웃</RouterLink> |
        <RouterLink v-if="isLogin" :to="{ name: 'profile' }">프로필</RouterLink>

    </div>
</template>


<style lang="scss" scoped>

</style>