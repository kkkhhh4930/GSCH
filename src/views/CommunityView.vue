<template>
    <div>
      <h1>커뮤니티 페이지</h1>
      <RouterLink :to="{ name: 'articleCreate' }">
        [작성하기]
      </RouterLink>
      <hr>
      <ArticleList />
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useArticleStore } from '@/stores/articles'
  import { RouterLink } from 'vue-router'
  import ArticleList from '@/components/ArticleList.vue'
  
  const store = useArticleStore()
  
  onMounted(() => {
    store.getArticles()
  })
  
  </script>
  
  <style>
  
  </style>
  