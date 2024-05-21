<template>
  <!-- 커뮤니티 페이지 -->
  <div class="container mt-5">
    <h3 class="mb-4 text-center">금융 상품 후기</h3>
    <!-- 글 작성하기 링크 -->
    <div class="button-container mb-2">
      <RouterLink :to="{ name: 'articleCreate' }" class="custom-button">
        작성하기
      </RouterLink>
    </div>
    <!-- ArticleList 컴포넌트 -->
    <ArticleList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useArticleStore } from '@/stores/articles'
import { RouterLink } from 'vue-router'
import ArticleList from '@/components/ArticleList.vue'

const store = useArticleStore()

// 컴포넌트가 마운트될 때 게시글 목록을 가져오는 함수 호출
onMounted(() => {
  store.getArticles()
})

// 게시글 상세 페이지로 이동하는 함수
const goDetail = (pk) => {
  router.push({name:'articleDetail', params:{pk: pk}})
}

</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

h3 {
  font-size: 1.5rem;
  color: #3629B7;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px; /* 마진을 줄여 버튼을 위로 이동 */
}

.custom-button {
 
  background-color: #3629B7;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  text-decoration: none; /* 링크 텍스트 밑줄 제거 */
}

.custom-button:hover {
  background-color: #f0f0ff; /* 호버 시 배경색 변경 */
}

</style>