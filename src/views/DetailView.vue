<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <h2>{{ item.fin_prdt_nm }}</h2>
        <p> 금융 회사명 : {{ item.kor_co_nm }} </p>
        <p> 공시 제출일 : {{ item.dcls_month }} </p>
        <p> 기타 정보 : {{ item.etc_note }} </p>
        <div v-if="item.options">
          <h3>예금 옵션</h3>
          <div v-for="option in item.options" :key="option.id">
            <p> {{ option.save_trm }}개월 금리 : {{ option.intr_rate }}% (최대 {{ option.intr_rate2 }}%)</p>
          </div>
        </div>
        <div v-else-if="item.savingoption_set">
          <h3>적금 옵션</h3>
          <div v-for="option in item.savingoption_set" :key="option.id">
            <p> {{ option.save_trm }}개월 금리 : {{ option.intr_rate }}% (최대 {{ option.intr_rate2 }}%)</p>
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
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>
  