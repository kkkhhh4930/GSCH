<template>
    <div>
      <h1>환율계산 페이지</h1>
      <button @click="fetchExchanges">환율 조회</button>
      <!-- 환율 데이터가 있는 경우 -->
      <div v-if="store.exchanges.length > 0">
        <!-- 바꿀 화폐 선택 -->
        <select v-model="fromCurrency" @change="onSelectChange">
          <option value="" disabled>바꿀 화폐를 선택하세요</option>
          <!-- 사용 가능한 화폐 목록 -->
          <option v-for="exchange in store.exchanges" :key="exchange.cur_unit" :value="exchange.cur_unit">
            {{ exchange.cur_nm }} ({{ exchange.cur_unit }})
          </option>
        </select>
        <!-- 환전 방향 전환 버튼 -->
        <button @click="swapCurrencies">⇄</button>
        <!-- 목표 화폐 선택 -->
        <select v-model="toCurrency" @change="onSelectChange">
          <option value="" disabled>목표 화폐를 선택하세요</option>
          <!-- 사용 가능한 화폐 목록 -->
          <option v-for="exchange in store.exchanges" :key="exchange.cur_unit" :value="exchange.cur_unit">
            {{ exchange.cur_nm }} ({{ exchange.cur_unit }})
          </option>
        </select>
      </div>
      <!-- 환율 데이터가 없는 경우 -->
      <div v-else>
        <p>환율 데이터를 사용할 수 없습니다</p>
      </div>
      <!-- 환율 계산기 컴포넌트 -->
      <ExchangeCalculator 
        v-if="selectedExchangeRate !== null" 
        :fromCurrency="fromCurrency" 
        :toCurrency="toCurrency" 
        :exchangeRate="selectedExchangeRate" 
        @close="resetSelection"
      />
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from "@/stores/articles";
import axios from 'axios'
import ExchangeCalculator from "@/components/ExchangeCalculator.vue"; // Exchange Calculator component

const store = useArticleStore();
const exchanges = ref([])
const fromCurrency = ref('');
const toCurrency = ref('');
const selectedExchangeRate = ref(null);

onMounted(() => {
  axios({
    method: 'get',
    url: `${store.API_URL}/exchange/`
  })
    .then(res => {
      exchanges.value = res.data
    })
    .catch(err => console.log(err))
})


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
/* 스타일 지정 */
</style>
  