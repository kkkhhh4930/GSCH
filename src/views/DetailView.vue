<template>
    <div class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ item.fin_prdt_nm }}</h5>
            <button type="button" class="btn btn-secondary" @click="$emit('close')" aria-label="Close">닫기</button>
          </div>
          <div class="modal-body">
            <p><strong>금융 회사명:</strong> {{ item.kor_co_nm }}</p>
            <p><strong>공시 제출일:</strong> {{ item.dcls_month }}</p>
            <h6>기타 정보:</h6>
            <ul class="list-group mb-3">
              <li class="list-group-item"><strong>가입 제한:</strong> {{ item.join_deny }}</li>
              <li class="list-group-item"><strong>가입 대상:</strong> {{ item.join_member }}</li>
              <li class="list-group-item"><strong>가입 방법:</strong> {{ item.join_way }}</li>
              <li class="list-group-item">
                <strong>우대 조건:</strong>
                <ul>
                  <li v-for="condition in item.spcl_cnd.split('\n')" :key="condition">{{ condition }}</li>
                </ul>
              </li>
              <li class="list-group-item">
                <strong>기타:</strong> 
                <ul>
                  <li v-for="note in item.etc_note.split('\n')" :key="note">{{ note }}</li>
                </ul>
              </li>
            </ul>
            <div v-if="item.options">
              <h6>예금 옵션</h6>
              <div v-for="option in item.options" :key="option.id" class="card mb-2">
                <div class="card-body">
                  <p><strong>{{ option.save_trm }}개월 금리:</strong> {{ option.intr_rate }}% (최대 {{ option.intr_rate2 }}%)</p>
                </div>
              </div>
            </div>
            <div v-else-if="item.savingoption_set">
              <h6>적금 옵션</h6>
              <div v-for="option in item.savingoption_set" :key="option.id" class="card mb-2">
                <div class="card-body">
                  <p><strong>{{ option.save_trm }}개월 금리:</strong> {{ option.intr_rate }}% (최대 {{ option.intr_rate2 }}%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    item: Object
  });
  </script>
  
  <style scoped>
  .modal {
    display: block;
    background-color: rgba(0,0,0,0.4);
  }
  .modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
  }
  .modal-content {
    max-height: 80vh; /* 뷰포트 높이의 80%로 최대 높이 설정 */
    overflow-y: auto; /* 세로 스크롤 추가 */
  }
  </style>
  