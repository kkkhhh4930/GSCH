<template>
    <!-- 환율 계산기 컴포넌트 -->
    <div class="exchange-calculator card p-4 shadow-sm">
      <!-- 계산되는 화폐 정보 표시 -->
      <h2 class="card-title">{{ fromCurrency }} to {{ toCurrency }} 환율 계산기</h2>
      <!-- 입력된 금액 받아오기 -->
      <div class="mb-3">
        <input type="number" v-model.number="amount" class="form-control" placeholder="금액 입력" />
      </div>
      <!-- 환산된 금액 표시 -->
      <p class="card-text">환산된 금액: <span class="fw-bold text-primary">{{ convertedAmount }}</span> {{ toCurrency }}</p>
      <!-- 닫기 버튼 -->
      <button @click="$emit('close')" class="btn btn-danger">닫기</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      // 바꿀 화폐
      fromCurrency: {
        type: String,
        required: true,
      },
      // 목표 화폐
      toCurrency: {
        type: String,
        required: true,
      },
      // 환율
      exchangeRate: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        // 입력된 금액
        amount: 0,
      };
    },
    computed: {
      // 입력된 금액을 목표 화폐로 환산
      convertedAmount() {
        return (this.amount / this.exchangeRate).toFixed(2);
      },
    },
  };
  </script>
  
  <style scoped>
  .exchange-calculator {
    max-width: 400px;
    margin: auto;
    text-align: center;
  }
  </style>
  