<template>
  <!-- 게시글 작성 폼 -->
  <div>
    <h1>게시글 작성</h1>
    <form @submit.prevent="createArticle">
      <!-- 제목 입력 -->
      <div>
        <label for="title">제목 : </label>
        <input type="text" v-model.trim="title" id="title">
      </div>
      <!-- 내용 입력 -->
      <div>
        <label for="content">내용 : </label>
        <textarea v-model.trim="content" id="content"></textarea>
      </div>
      <!-- 제출 버튼 -->
      <input type="submit">
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useArticleStore } from '@/stores/articles'
import { useRouter } from 'vue-router'

const store = useArticleStore()
const title = ref(null)
const content = ref(null)
const router = useRouter()

// 게시글 생성 함수
const createArticle = function () {
  axios({
    method: 'post',
    url: `${store.API_URL}/community/articles/`,
    data: {
      title: title.value,
      content: content.value
    },
    headers: {
      Authorization: `Token ${store.token}`
    }
  })
    .then((response) => {
      console.log(response.data)
      // 게시글 목록 페이지로 이동
      router.push({ name: 'community' })
    })
    .catch((error) => {
      console.log(error)
    })
}

</script>

<style>
/* 스타일 정의 */
</style>