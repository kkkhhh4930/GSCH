<template>
    <div>
      <h3>Article List</h3>
      <div v-if="store.articles">
        <ArticleListItem
          v-for="article in store.articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useArticleStore } from "@/stores/articles";
  import ArticleListItem from "@/components/ArticleListItem.vue";
  
  const store = useArticleStore();
  </script>
  