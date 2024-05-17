<template>
    <div>
      <h1>게시글 작성</h1>
      <form @submit.prevent="createArticle">
        <div>
          <label for="title">제목 : </label>
          <input type="text" v-model.trim="title" id="title">
        </div>
        <div>
          <label for="content">내용 : </label>
          <textarea v-model.trim="content" id="content"></textarea>
        </div>
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
  
  console.group(store.API_URL)
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
        router.push({ name: 'community' })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  </script>
  
  <style>
  
  </style>
  