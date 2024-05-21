<template>
  <div class="container">
    <div class="calculator-container">
      <h1 class="title">환율 계산기</h1>
      <div class="controls">
        <select v-model="fromCurrency" @change="onSelectChange" class="select">
          <option value="" disabled selected>바꿀 화폐를 선택하세요</option>
          <option v-for="exchange in store.exchanges" :key="exchange.cur_unit" :value="exchange.cur_unit">
            {{ exchange.cur_nm }} ({{ exchange.cur_unit }})
          </option>
        </select>
        <button class="swap-button" @click="swapCurrencies">&#8645;</button>
        <select v-model="toCurrency" @change="onSelectChange" class="select">
          <option value="" disabled selected>목표 화폐를 선택하세요</option>
          <option v-for="exchange in store.exchanges" :key="exchange.cur_unit" :value="exchange.cur_unit">
            {{ exchange.cur_nm }} ({{ exchange.cur_unit }})
          </option>
        </select>
        <!-- <button class="button" @click="fetchExchanges">환율 조회</button> -->
      </div>
      <div v-if="store.exchanges.length > 0" class="exchange-info">
        <!-- 환율 계산기 컴포넌트 -->
        <ExchangeCalculator 
          v-if="selectedExchangeRate !== null" 
          :fromCurrency="fromCurrency" 
          :toCurrency="toCurrency" 
          :exchangeRate="selectedExchangeRate" 
          @close="resetSelection"
        />
      </div>
      <div v-else class="no-data">
        <p>환율 데이터를 사용할 수 없습니다</p>
      </div>
    </div>
    <div class="image-container">
      <img src="@/assets/exchange.png" alt="Exchange Image" class="main-image">
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from "@/stores/articles";
import ExchangeCalculator from "@/components/ExchangeCalculator.vue"; // Exchange Calculator component

const store = useArticleStore();
const fromCurrency = ref('');
const toCurrency = ref('');
const selectedExchangeRate = ref(null);

const fetchExchanges = () => {
  store.getExchanges();
};

onMounted(() => {
  fetchExchanges();
});

// 화폐 선택 및 환율 초기화
const resetSelection = () => {
  fromCurrency.value = '';
  toCurrency.value = '';
  selectedExchangeRate.value = null;
};

// 선택 변경 및 환율 계산 처리
const onSelectChange = () => {
  // 양쪽 화폐가 선택되지 않은 경우
  if (!fromCurrency.value || !toCurrency.value) {
    selectedExchangeRate.value = null;
    return;
  }

  // 선택된 환율 정보 가져오기
  const fromExchange = store.exchanges.find(e => e.cur_unit === fromCurrency.value);
  const toExchange = store.exchanges.find(e => e.cur_unit === toCurrency.value);

  // 선택된 환율 정보가 없는 경우
  if (!fromExchange || !toExchange) {
    selectedExchangeRate.value = null;
    return;
  }

  // 선택된 환율 정보로부터 환율 계산
  let rateFromToKrw = parseFloat(fromExchange.ttb.replace(/,/g, ''));
  let rateKrwToTo = parseFloat(toExchange.tts.replace(/,/g, ''));

  // KRW 특수 케이스 처리
  if (fromCurrency.value === 'KRW') {
    rateFromToKrw = 1;
  }
  if (toCurrency.value === 'KRW') {
    rateKrwToTo = 1;
  }

  // NaN 값 처리 및 환율 계산
  if (!isNaN(rateFromToKrw) && !isNaN(rateKrwToTo) && rateFromToKrw !== 0) {
    selectedExchangeRate.value = rateKrwToTo / rateFromToKrw;
  } else {
    selectedExchangeRate.value = null;
  }
};

// 화폐 선택 전환
const swapCurrencies = () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  onSelectChange();
};

</script>
  
<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center; /* 컨테이너들을 중앙에 맞춤 */
  height: 100vh;
  padding: 20px;
}

.calculator-container {
  width: 30%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.image-container {
  width: 45%;
  display: flex;
  justify-content: center;
  align-items: center; /* 이미지를 컨테이너 중앙으로 정렬 */
}

.main-image {
  max-width: 90%;
  height: auto;
  border-radius: 10px;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.select, .button, .swap-button {
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
}

.button {
  background-color: #3629B7;
  color: white;
  /* border: 2px solid #3629B7; */
  cursor: pointer;
  font-size: 18px;
  /* font-weight: bold; */
  /* padding: 5px 10px;
  border-radius: 4px; */
}

.button:hover {
  background-color: #e8e8ff; /* 연한 보라색으로 호버 색상 변경 */
}

.swap-button {
  background-color: transparent;
  color: #cc0000;
  font-size: 25px;
  cursor: pointer;
  border: none; /* 버튼 테두리 제거 */
}

.no-data p {
  color: #cc0000;
  text-align: center;
}
</style>