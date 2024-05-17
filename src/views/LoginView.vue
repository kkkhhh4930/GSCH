<template>
  <h1>로그인 페이지</h1>
  <div>
    <form @submit.prevent="login">
      <label for="username">username : </label>
      <input type="text" id="username" v-model="username" /><br />
      <label for="password">password : </label>
      <input type="password" id="password" v-model="password" /><br />
      <input type="submit" value="login" />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useArticleStore } from "@/stores/articles";
const store = useArticleStore();
const username = ref("");
const password = ref("");

const login = function () {
  const info = {
    username: username.value,
    password: password.value,
  };
  store.login(info);
};
</script>

<style scoped></style>
