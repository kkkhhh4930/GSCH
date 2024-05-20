<template>
  <!-- 커뮤니티 페이지 -->
  <div>
    <h1>커뮤니티 페이지</h1>
    <!-- 글 작성하기 링크 -->
    <RouterLink :to="{ name: 'articleCreate' }">
      [작성하기]
    </RouterLink>
    <!-- 게시글 목록 -->
    <ul>
      <div
        v-for="post in store.postList"
        :key="post.pk"
        :post="post"
        @click="goDetail(post.pk)"
      >
        <p>{{ post.category.name }}</p>
        <h3> <span>{{ post.pk }}번 글 |</span>  {{ post.title }}</h3>
        <p>작성자 : {{ post.user.username }}</p>
        <hr>
      </div>
    </ul>
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

<style>
/* 스타일 정의 */
</style>