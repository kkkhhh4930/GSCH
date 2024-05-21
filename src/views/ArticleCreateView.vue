<template>
  <!-- 게시글 작성 폼 -->
  <div class="article-create-page">
    <h1>게시글 작성</h1>
    <form @submit.prevent="createArticle" class="article-form">
      <!-- 제목 입력 -->
      <div class="form-group">
        <label for="title">제목:</label>
        <input type="text" v-model.trim="title" id="title" class="form-control">
      </div>
      <!-- 내용 입력 -->
      <div class="form-group">
        <label for="content">내용:</label>
        <textarea v-model.trim="content" id="content" class="form-control"></textarea>
      </div>
      <!-- 제출 버튼 -->
      <input type="submit" value="작성하기" class="submit-button">
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

<style scoped>
.article-create-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.article-create-page h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #3629B7;
}

.article-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

textarea.form-control {
  height: 150px;
}

.submit-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #3629B7;
  color: white;
  font-size: 16px;
  cursor: pointer;
  align-self: flex-end;
}

.submit-button:hover {
  background-color: #2a237a;
}
</style>