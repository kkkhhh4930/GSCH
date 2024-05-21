<template>
  <!-- Article List 컴포넌트 -->
  <div>
    <h3>Article List</h3>
    <!-- 게시글이 존재하는 경우에만 표시 -->
    <div v-if="store.articles">
      <!-- ArticleListItem 컴포넌트 반복하여 표시 -->
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

// Article Store 사용
const store = useArticleStore();
</script>