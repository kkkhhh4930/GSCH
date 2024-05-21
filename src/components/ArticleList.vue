<template>
  <!-- Article List 컴포넌트 -->
  <div class="article-list-page">
    <!-- <h3>금융 상품 후기</h3> -->
    <!-- 게시글이 존재하는 경우에만 표시 -->
    <div v-if="store.articles.length" class="articles-container">
      <!-- ArticleListItem 컴포넌트 반복하여 표시 -->
      <ArticleListItem
        v-for="article in store.articles"
        :key="article.id"
        :article="article"
        class="article-list-item"
      />
    </div>
    <div v-else class="no-articles">
      게시글이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { useArticleStore } from "@/stores/articles";
import ArticleListItem from "@/components/ArticleListItem.vue";

// Article Store 사용
const store = useArticleStore();
</script>

<style scoped>
.article-list-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.article-list-page h3 {
  text-align: left;
  margin-bottom: 20px;
  color: #3629B7;
}

.articles-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-list-item {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.article-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.no-articles {
  text-align: center;
  color: #999;
}
</style>