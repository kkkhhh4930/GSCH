<template>
  <!-- 게시글 상세 정보 -->
  <div>
    <h1>게시글 상세 정보</h1>
    <div v-if="article">
      <p>글 번호 : {{ article.id }}</p>
      <p>제목: {{ article.title }}</p>
      <p>내용: {{ article.content }}</p>
      <p>작성시간: {{ article.created_at }}</p>
      <p>수정시간: {{ article.updated_at }}</p>
      <!-- 게시글 수정 버튼 -->
      <button @click="editArticle">수정</button>
      <!-- 게시글 삭제 버튼 -->
      <button @click="deleteArticle">삭제</button>
      <!-- 수정 폼 -->
      <div v-if="isEditing">
        <input v-model="editedTitle" placeholder="제목을 입력하세요" />
        <textarea v-model="editedContent" placeholder="내용을 입력하세요"></textarea>
        <!-- 저장 버튼 -->
        <button @click="saveArticle">저장</button>
        <!-- 취소 버튼 -->
        <button @click="cancelEdit">취소</button>
      </div>
    </div>
    <!-- 댓글 섹션 -->
    <div>
      <h2>댓글</h2>
      <div v-if="comments">
        <!-- 댓글 목록 -->
        <div v-for="comment in comments" :key="comment.id">
          <p>{{ comment.content }}</p>
          <!-- 댓글 수정 버튼 -->
          <button @click="editComment(comment)">편집</button>
          <!-- 댓글 삭제 버튼 -->
          <button @click="deleteComment(comment)">삭제</button>
          <!-- 댓글 수정 폼 -->
          <div v-if="comment.isEditing">
            <input v-model="comment.editedContent" />
            <!-- 댓글 저장 버튼 -->
            <button @click="updateComment(comment)">저장</button>
            <!-- 댓글 취소 버튼 -->
            <button @click="cancelEdit(comment)">취소</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 댓글 작성 폼 -->
    <div>
      <h2>댓글 작성</h2>
      <input v-model="newComment" placeholder="댓글을 입력하세요" />
      <!-- 댓글 작성 버튼 -->
      <button @click="createComment">작성</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useArticleStore } from '@/stores/articles'
import { useRoute } from 'vue-router'

const route = useRoute()
const article = ref(null)
const comments = ref([])
const newComment = ref('')
const postId = route.params.id
const store = useArticleStore()
const userStore = useArticleStore()
const isEditing = ref(false)
const editedTitle = ref('')
const editedContent = ref('')

// 게시글 정보를 서버에서 가져오는 함수
const fetchArticle = () => {
  axios.get(`${store.API_URL}/community/articles/${postId}/`)
    .then(response => {
      article.value = response.data
    })
    .catch(error => {
      console.log('Error fetching article:', error)
    })
}

// 댓글 정보를 서버에서 가져오는 함수
const fetchComments = () => {
  axios.get(`${store.API_URL}/community/articles/${postId}/comments/`)
    .then(response => {
      comments.value = response.data.map(comment => ({ ...comment, isEditing: false, editedContent: comment.content }))
    })
    .catch(error => {
      console.log('Error fetching comments:', error)
    })
}

// 댓글 작성 함수
const createComment = () => {
  axios.post(`${store.API_URL}/community/articles/${postId}/comments/`, 
    { content: newComment.value },
    {
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
    .then(response => {
      comments.value.push(response.data)
      newComment.value = ''
    })
    .catch(error => {
      console.log('Error creating comment:', error)
    })
}

// 댓글 삭제 함수
const deleteComment = (comment) => {
  axios.delete(`${store.API_URL}/community/articles/${postId}/comments/${comment.id}/`, {
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then(() => {
      comments.value = comments.value.filter(elem => comment.id !== comment.id)
    })
    .catch(error => {
      console.log('Error deleting comment:', error)
    })
}

// 댓글 수정 함수
const editComment = (comment) => {
  comment.isEditing = true
}

// 댓글 수정 취소 함수
const cancelEdit = (comment) => {
  comment.isEditing = false
  comment.editedContent = comment.content
}

// 댓글 업데이트 함수
const updateComment = (comment) => {
  axios.put(`${store.API_URL}/community/articles/${postId}/comments/${comment.id}/`, 
    { content: comment.editedContent },
    {
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
    .then(response => {
      comment.content = response.data.content
      comment.isEditing = false
    })
    .catch(error => {
      console.log('Error updating comment:', error)
    })
}

// 게시글 저장 함수
const saveArticle = () => {
  axios.put(`${store.API_URL}/community/articles/${postId}/`, 
    { title: editedTitle.value, content: editedContent.value },
    {
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
    .then(response => {
      article.value.title = editedTitle.value
      article.value.content = editedContent.value
      isEditing.value = false
    })
    .catch(error => {
      console.log('Error updating article:', error)
    })
}

// 게시글 수정 함수
const editArticle = () => {
  editedTitle.value = article.value.title
  editedContent.value = article.value.content
  isEditing.value = true
}

// 게시글 수정 취소 함수
const articlecancelEdit = () => {
  isEditing.value = false
}

// 게시글 삭제 함수
const deleteArticle = () => {
  axios.delete(`${store.API_URL}/community/articles/${postId}/`, {
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then(() => {
      // 게시글이 삭제되었으므로 리다이렉트 또는 홈으로 이동할 수 있습니다.
    })
    .catch(error => {
      console.log('Error deleting article:', error)
    })
}

// 페이지가 로드될 때 게시글과 댓글을 가져오는 함수 호출
onMounted(() => {
  fetchArticle()
  fetchComments()
})
</script>

<style>
/* 스타일 정의 */
</style>