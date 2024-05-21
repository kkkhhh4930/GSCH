<script setup>
import { ref, onMounted, computed } from 'vue';
import { useArticleStore } from '@/stores/articles';

const articleStore = useArticleStore();
const activeTab = ref('profile');
const showPasswordChange = ref(false);

const userInfo = computed(() => articleStore.userInfo);
const oldPassword = ref('');
const newPassword = ref('');

onMounted(() => {
  const username = articleStore.userInfzo?.username;
  if (username) {
    articleStore.getUserInfo(username);
  }
});

const changePassword = () => {
  if (!oldPassword.value || !newPassword.value) {
    alert('기존 비밀번호와 새 비밀번호를 입력해주세요.');
    return;
  }
  articleStore.changePassword({ old_password: oldPassword.value, new_password: newPassword.value });
  showPasswordChange.value = false;
};

const updateUserInfo = () => {
  if (!userInfo.value) {
    alert('회원 정보가 로딩되지 않았습니다.');
    return;
  }

  const updatedInfo = {
    username: userInfo.value.username,
    email: userInfo.value.email,
    name: userInfo.value.name,
  };

  articleStore.updateUserInfo(updatedInfo);
};

</script>

<template>
  <div>
    <div>
      <button @click="activeTab = 'profile'">회원 정보 수정</button>
      <button @click="activeTab = 'products'">가입 상품 관리</button>
      <button @click="activeTab = 'recommendations'">상품 추천 받기</button>
    </div>

    <div v-if="activeTab === 'profile'" class="tab-content">
      <div class="profile">
        <img :src="userInfo?.profile_img || 'default_profile_img.jpg'" alt="Profile Picture" />
        <p>이름: {{ userInfo?.name || '' }}</p>
        <p>username: {{ userInfo?.username || '' }}</p>
        <p>회원번호: {{ userInfo?.id || '' }}</p>
        <p>Email: {{ userInfo?.email || '' }}</p>
        <button @click="showPasswordChange = !showPasswordChange">비밀 번호 변경</button>
        <button @click="activeTab = 'editProfile'">회원 정보 수정</button>

        <div v-if="showPasswordChange" class="password-change">
          <input v-model="oldPassword" type="password" placeholder="기존 비밀번호" />
          <input v-model="newPassword" type="password" placeholder="새 비밀번호" />
          <button @click="changePassword">변경 완료</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'products'" class="tab-content">
      <h2>가입 상품 관리</h2>
    </div>

    <div v-if="activeTab === 'recommendations'" class="tab-content">
      <h2>상품 추천 받기</h2>
    </div>

    <div v-if="activeTab === 'editProfile'" class="tab-content">
      <h2>회원 정보 수정</h2>
      <input v-model="userInfo.value.name" type="text" placeholder="이름" v-if="userInfo" />
      <input v-model="userInfo.value.username" type="text" placeholder="username" v-if="userInfo" />
      <input v-model="userInfo.value.email" type="email" placeholder="Email" v-if="userInfo" />
      <button @click="updateUserInfo">수정 완료</button>
    </div>
  </div>
</template>