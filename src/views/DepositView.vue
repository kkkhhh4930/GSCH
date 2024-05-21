<template>
  <div>
    <h1>예금</h1>
    <!-- 은행 선택 드롭다운 -->
    <div>
      <label for="bank">은행 선택:</label>
      <select id="bank" v-model="selectedBank">
        <option value="">모든 은행</option>
        <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
      </select>
    </div>
    <!-- 예치 기간 선택 -->
    <div>
      <label for="term">예치 기간 선택:</label>
      <select id="term" v-model="selectedTerm">
        <option value="">모든 기간</option>
        <option v-for="term in availableTerms" :key="term" :value="term">{{ term }}개월</option>
      </select>
    </div>
    <!-- 확인 버튼 -->
    <div>
      <button @click="applyFilters">확인</button>
    </div>
    <!-- 금리 정렬 버튼들 -->
    <div>
      <button @click="sortDeposits(6)">6개월 금리순</button>
      <button @click="sortDeposits(12)">12개월 금리순</button>
      <button @click="sortDeposits(24)">24개월 금리순</button>
      <button @click="sortDeposits(36)">36개월 금리순</button>
    </div>
    <!-- 금융 상품 목록 -->
    <ul>
      <li v-for="deposit in sortedDeposits" :key="deposit.id">
        <p> 공시 제출일 : {{ deposit.dcls_month }} </p>
        <p> 금융 회사명 : {{ deposit.kor_co_nm }} </p>
        <p> 상품명 : {{ deposit.fin_prdt_nm }} </p>
        <template v-for="option in deposit.options" :key="option.id">
          <div>
            <p> {{ option.save_trm }}개월 금리 : {{ option.intr_rate }}% </p>
          </div>
        </template>
        <!-- 상세정보 보기 버튼 추가 -->
        <button @click="selectDeposit(deposit)">상세정보 보기</button>
      </li>
    </ul>
    <!-- 선택된 금융 상품의 상세 정보 모달 -->
    <DetailView :item="selectedDeposit" v-if="selectedDeposit" @close="selectedDeposit = null" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useArticleStore } from "@/stores/articles";
import DetailView from './DetailView.vue';

const store = useArticleStore();
const deposits = ref([]);
const filteredDeposits = ref([]);
const banks = ref([]);
const selectedBank = ref("");
const selectedTerm = ref("");
const sortTerm = ref(null);
const selectedDeposit = ref(null);
const availableTerms = ref([6, 12, 24, 36]);

function filterOptionsByHighestInterestRate(options) {
  if (!options) {
    return [];
  }
  return options.reduce((acc, current) => {
    const found = acc.find(option => option.save_trm === current.save_trm);
    if (found) {
      if (found.intr_rate < current.intr_rate) {
        acc[acc.indexOf(found)] = current;
      }
    } else {
      acc.push(current);
    }
    return acc;
  }, []);
}

onMounted(function() {
  saveDepositProducts();
});

function saveDepositProducts() {
  axios({
    method: 'post',
    url: `${store.API_URL}/financial/save_deposit_products/`
  })
  .then(function(response) {
    console.log('Deposit products saved successfully:', response.data);
    fetchDeposits();
  })
  .catch(function(error) {
    console.error('Error saving deposit products:', error);
  });
}

function fetchDeposits() {
  axios({
    method: 'get',
    url: `${store.API_URL}/financial/deposit_list/`
  })
  .then(function(res) {
    var depositsData = res.data;
    var data = [];
    
    for (var i = 0; i < depositsData.length; i++) {
      var deposit = depositsData[i];
      var processedDeposit = {
        ...deposit,
        options: filterOptionsByHighestInterestRate(deposit.depositoption_set)
      };
      data.push(processedDeposit);
    }
    
    deposits.value = data;
    filteredDeposits.value = data;

    var bankSet = new Set();
    for (var j = 0; j < data.length; j++) {
      bankSet.add(data[j].kor_co_nm);
    }
    banks.value = Array.from(bankSet);

    updateAvailableTerms();

    console.log('Fetched deposits:', deposits.value);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function updateAvailableTerms() {
  var termSet = new Set();
  for (var i = 0; i < deposits.value.length; i++) {
    var options = deposits.value[i].options;
    for (var j = 0; j < options.length; j++) {
      termSet.add(parseInt(options[j].save_trm));
    }
  }
  availableTerms.value = Array.from(termSet).sort((a, b) => a - b);
}

function filterDeposits() {
  var result = [];
  var selectedTermValue = selectedTerm.value !== "" ? parseInt(selectedTerm.value) : null;

  for (var i = 0; i < deposits.value.length; i++) {
    var deposit = deposits.value[i];
    var matchesBank = selectedBank.value === "" || deposit.kor_co_nm === selectedBank.value;
    var matchesTerm = selectedTermValue === null || deposit.options.some(function(option) { return parseInt(option.save_trm) === selectedTermValue; });
    
    if (matchesBank && matchesTerm) {
      result.push(deposit);
    }
  }
  return result;
}

function applyFilters() {
  var filteredResults = filterDeposits();
  filteredDeposits.value = filteredResults;
  sortTerm.value = null; // 기존의 정렬 기준 초기화
  console.log('Filtered deposits:', filteredDeposits.value); // 필터링 결과 콘솔 출력
}

function sortDeposits(term) {
  sortTerm.value = term;
}

function selectDeposit(deposit) {
  selectedDeposit.value = deposit;
}

const sortedDeposits = computed(function() {
  var depositsToSort = filteredDeposits.value.slice();
  if (sortTerm.value === null) {
    return depositsToSort;
  } else {
    return depositsToSort.sort(function(a, b) {
      var aOption = a.options.find(function(option) { return parseInt(option.save_trm) === sortTerm.value; });
      var bOption = b.options.find(function(option) { return parseInt(option.save_trm) === sortTerm.value; });
      if (aOption && bOption) {
        return bOption.intr_rate - aOption.intr_rate;
      } else if (aOption) {
        return -1;
      } else if (bOption) {
        return 1;
      } else {
        return 0;
      }
    });
  }
});
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
</style>
