<template>
  <!-- ArticleListItem 컴포넌트 -->
  <div class="article-item" @click="goToDetail">
    <!-- 게시글 정보 표시 -->
    <p class="article-title">{{ article.title }}</p>
    <p class="article-author">{{ article.user.username }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Props 정의: 게시글 객체
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 게시글 상세 페이지로 이동하는 함수
const goToDetail = () => {
  router.push({ name: 'articleDetail', params: { id: props.article.id } })
}
</script>

<style scoped>
.article-item {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-weight: bold;
  font-size: 18px;
}

.article-author {
  font-size: 14px;
  color: rgb(92, 91, 91);
}
</style>