<template>
    <div>
      <h1>DetailView</h1>
      <div v-if="article">
        <p>{{ article.id }}</p>
        <p>{{ article.title }}</p>
        <p>{{ article.content }}</p>
        <p>{{ article.created_at }}</p>
        <p>{{ article.updated_at }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { onMounted, ref } from 'vue'
  import { useArticleStore } from '@/stores/articles'
  import { useRoute } from 'vue-router'
  
  const store = useArticleStore()
  const route = useRoute()
  const article = ref(null)
  
  onMounted(() => {
    axios({
      method: 'get',
      url: `${store.API_URL}/community/articles/${route.params.id}/`
    })
      .then((response) => {
        // console.log(response.data)
        article.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  })
  
  </script>
  
  <style>
  
  </style>
  