<template>
  <h1>회원가입 페이지</h1>
  <div>
    <form @submit.prevent="signup">
      <label for="username">username : </label>
      <input type="text" id="username" v-model="username" /><br />
      <label for="password1">password : </label>
      <input type="password" id="password1" v-model="password1" /><br />
      <label for="password2">password Confirmation : </label>
      <input type="password" id="password2" v-model="password2" /><br />
      <input type="submit" value="signup" />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useArticleStore } from "@/stores/articles";
const store = useArticleStore();
const username = ref("");
const password1 = ref("");
const password2 = ref("");

const signup = function () {
  const info = {
    username: username.value,
    password1: password1.value,
    password2: password2.value,
  };
  store.signup(info);
};
</script>

<style scoped></style>
