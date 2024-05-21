<template>
  <!-- 게시글 상세 정보 -->
  <div class="article-detail">
    <div v-if="article" class="article-content">
      <h4>{{ article.title }}</h4>
      <p>{{ article.user.username }}</p>
      <p class="timestamp">{{ article.created_at.substring(0, 10) }}</p>
      <hr> 
      <p>{{ article.content }}</p>
     

  
      <!-- <p><strong>수정시간:</strong> {{ article.updated_at }}</p> -->
      <!-- 게시글 수정 버튼 -->
      <button class="btn edit-btn" @click="editArticle">수정</button>
      <!-- 게시글 삭제 버튼 -->
      <button class="btn delete-btn" @click="deleteArticle">삭제</button>
      <!-- 수정 폼 -->
      <div v-if="isEditing" class="edit-form">
        <input v-model="editedTitle" placeholder="제목을 입력하세요" class="form-control mb-2" />
        <textarea v-model="editedContent" placeholder="내용을 입력하세요" class="form-control mb-2"></textarea>
        <!-- 저장 버튼 -->
        <button class="btn save-btn" @click="saveArticle">저장</button>
        <!-- 취소 버튼 -->
        <button class="btn cancel-btn" @click="articlecancelEdit">취소</button>
      </div>
    </div>
    <!-- 댓글 섹션 -->
    <div class="comments-section">
      <!-- <h2>댓글</h2> -->
      <div v-if="comments" class="comments-list">
        <!-- 댓글 목록 -->
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-text">
            <p>{{ comment.content }}</p>
          </div>
          <div class="comment-buttons">
            <!-- 댓글 수정 버튼 -->
            <button class="btn edit-btn" @click="editComment(comment)">편집</button>
            <!-- 댓글 삭제 버튼 -->
            <button class="btn delete-btn" @click="deleteComment(comment)">삭제</button>
          </div>
          <!-- 댓글 수정 폼 -->
          <div v-if="comment.isEditing" class="edit-form">
            <input v-model="comment.editedContent" class="form-control mb-2" />
            <!-- 댓글 저장 버튼 -->
            <button class="btn save-btn" @click="updateComment(comment)">저장</button>
            <!-- 댓글 취소 버튼 -->
            <button class="btn cancel-btn" @click="cancelEdit(comment)">취소</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 댓글 작성 폼 -->
    <div class="comment-form">
      <div class="comment-form-container">
        <input v-model="newComment" placeholder="댓글을 입력하세요" class="form-control mb-2" />
        <!-- 댓글 작성 버튼 -->
        <button class="btn create-btn" @click="createComment">작성</button>
      </div>
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
      comments.value = comments.value.filter(elem => comment.id !== elem.id)
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

<style scoped>
.article-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.article-content {
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: right; /* 버튼을 오른쪽으로 배치 */
}

.article-content h4 {
  text-align: left; /* 제목을 가운데 정렬 */
}

.article-content .timestamp {
  text-align: left;
  font-size: 12px;
  color: rgb(92, 91, 91);
}

.article-content p {
  margin: 10px 0;
  text-align: left; /* 글 내용은 왼쪽 정렬 */
}

.comments-section {
  width: 100%;
  margin-top: 30px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.comment-item {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px; /* 구분선 위에 여백 추가 */
  border-bottom: 1px solid #ccc; /* 구분선 추가 */
}

.comment-text {
  flex: 1;
  text-align: left;
  font-size: 14px; /* 댓글 텍스트 크기를 작게 줄이기 */
}

.comment-buttons {
  text-align: right;
}

.comment-form {
  width: 100%;
  margin-top: 30px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.comment-form-container {
  display: flex;
  align-items: center;
}

.comment-form input {
  font-size: 14px; /* 댓글 작성 텍스트 크기를 작게 줄이기 */
  flex: 1;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  display: inline-block;
  padding: 5px 10px; /* 버튼 크기 줄이기 */
  margin-left: 10px; /* 입력 필드와 버튼 사이에 여백 추가 */
  font-size: 16px; /* 글씨 크기 키우기 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.edit-btn {
  background-color: #d7dbdf;
  color: white;
}

.delete-btn {
  border: 2px solid #3629B7; 
  background-color: white;
  color: #3629B7;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
}

.save-btn {
  background-color: #3629B7;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.create-btn {
  background-color: #3629B7;
  color: white;
}

.edit-form {
  margin-top: 10px;
}
</style> 