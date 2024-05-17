<template>
    <div>
        <h1>로그아웃 페이지</h1>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from "@/stores/articles"

const router = useRouter() // 라우터 훅 사용
const store = useArticleStore() // 상태 저장소 사용

onMounted(() => {
  store.logout() // 스토어의 로그아웃 액션 호출
});
</script>

<style lang="scss" scoped>

</style>