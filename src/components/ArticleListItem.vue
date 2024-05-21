<template>
  <!-- ArticleListItem 컴포넌트 -->
  <div>
    <!-- 게시글 정보 표시 -->
    <h5>{{ article.id }}</h5>
    <p>{{ article.title }}</p>
    <p>{{ article.content }}</p>
    <!-- 게시글 상세 페이지로 이동하는 링크 -->
    <RouterLink 
      :to="{ name: 'articleDetail', params: { id: article.id }}"
    >
      [DETAIL]
    </RouterLink>
    <hr>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// Props 정의: 게시글 객체
defineProps({
  article: Object
})
</script>