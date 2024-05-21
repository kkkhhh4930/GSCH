<template>
  <div class="container">
    <h1 class="my-4">적금</h1>
    <!-- 은행 선택 드롭다운 -->
    <div class="form-group">
      <label for="bank">은행 선택:</label>
      <select id="bank" v-model="selectedBank" class="form-control">
        <option value="">모든 은행</option>
        <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
      </select>
    </div>
    <!-- 예치 기간 선택 -->
    <div class="form-group">
      <label for="term">예치 기간 선택:</label>
      <select id="term" v-model="selectedTerm" class="form-control">
        <option value="">모든 기간</option>
        <option v-for="term in availableTerms" :key="term" :value="term">{{ term }}개월</option>
      </select>
    </div>
    <!-- 확인 버튼 -->
    <div class="mb-4">
      <button @click="applyFilters" class="btn btn-primary">확인</button>
    </div>
    <!-- 금리 정렬 버튼들 -->
    <div class="btn-group mb-4" role="group" aria-label="Sort buttons">
      <button @click="sortSavings(6)" class="btn btn-outline-secondary">6개월 금리순</button>
      <button @click="sortSavings(12)" class="btn btn-outline-secondary">12개월 금리순</button>
      <button @click="sortSavings(24)" class="btn btn-outline-secondary">24개월 금리순</button>
      <button @click="sortSavings(36)" class="btn btn-outline-secondary">36개월 금리순</button>
    </div>
    <!-- 금융 상품 목록 -->
    <ul class="list-group">
      <li v-for="saving in sortedSavings" :key="saving.id" class="list-group-item">
        <p><strong>공시 제출일:</strong> {{ saving.dcls_month }}</p>
        <p><strong>금융 회사명:</strong> {{ saving.kor_co_nm }}</p>
        <p><strong>상품명:</strong> {{ saving.fin_prdt_nm }}</p>
        <template v-for="option in saving.savingoption_set" :key="option.id">
          <div>
            <p><strong>{{ option.save_trm }}개월 금리:</strong> {{ option.intr_rate }}% (최고 우대 금리: {{ option.intr_rate2 }}%)</p>
          </div>
        </template>
        <!-- 상세정보 보기 버튼 추가 -->
        <button @click="selectSaving(saving)" class="btn btn-info mt-2">상세정보 보기</button>
      </li>
    </ul>
    <!-- 선택된 금융 상품의 상세 정보 모달 -->
    <DetailView :item="selectedSaving" v-if="selectedSaving" @close="selectedSaving = null" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useArticleStore } from "@/stores/articles";
import DetailView from './DetailView.vue';

const store = useArticleStore();
const savings = ref([]);
const filteredSavings = ref([]);
const banks = ref([]);
const selectedBank = ref("");
const selectedTerm = ref("");
const sortTerm = ref(null);
const selectedSaving = ref(null);
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
  saveSavingProducts();
});

function saveSavingProducts() {
  axios({
    method: 'post',
    url: `${store.API_URL}/financial/save_saving_products/`
  })
  .then(function(response) {
    console.log('Saving products saved successfully:', response.data);
    fetchSavings();
  })
  .catch(function(error) {
    console.error('Error saving saving products:', error);
  });
}

function fetchSavings() {
  axios({
    method: 'get',
    url: `${store.API_URL}/financial/saving_list/`
  })
  .then(function(res) {
    var savingsData = res.data;
    var data = [];
    
    for (var i = 0; i < savingsData.length; i++) {
      var saving = savingsData[i];
      var processedSaving = {
        ...saving,
        savingoption_set: filterOptionsByHighestInterestRate(saving.savingoption_set)
      };
      data.push(processedSaving);
    }
    
    savings.value = data;
    filteredSavings.value = data;

    var bankSet = new Set();
    for (var j = 0; j < data.length; j++) {
      bankSet.add(data[j].kor_co_nm);
    }
    banks.value = Array.from(bankSet);

    updateAvailableTerms();

    console.log('Fetched savings:', savings.value);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function updateAvailableTerms() {
  var termSet = new Set();
  for (var i = 0; i < savings.value.length; i++) {
    var options = savings.value[i].savingoption_set;
    for (var j = 0; j < options.length; j++) {
      termSet.add(parseInt(options[j].save_trm));
    }
  }
  availableTerms.value = Array.from(termSet).sort((a, b) => a - b);
}

function filterSavings() {
  var result = [];
  var selectedTermValue = selectedTerm.value !== "" ? parseInt(selectedTerm.value) : null;

  for (var i = 0; i < savings.value.length; i++) {
    var saving = savings.value[i];
    var matchesBank = selectedBank.value === "" || saving.kor_co_nm === selectedBank.value;
    var matchesTerm = selectedTermValue === null || saving.savingoption_set.some(function(option) { return parseInt(option.save_trm) === selectedTermValue; });
    
    if (matchesBank && matchesTerm) {
      result.push(saving);
    }
  }
  return result;
}

function applyFilters() {
  var filteredResults = filterSavings();
  filteredSavings.value = filteredResults;
  sortTerm.value = null; // 기존의 정렬 기준 초기화
  console.log('Filtered savings:', filteredSavings.value); // 필터링 결과 콘솔 출력
}

function sortSavings(term) {
  sortTerm.value = term;
}

function selectSaving(saving) {
  selectedSaving.value = saving;
}

const sortedSavings = computed(function() {
  var savingsToSort = filteredSavings.value.slice();
  if (sortTerm.value === null) {
    return savingsToSort;
  } else {
    return savingsToSort.sort(function(a, b) {
      var aOption = a.savingoption_set.find(function(option) { return parseInt(option.save_trm) === sortTerm.value; });
      var bOption = b.savingoption_set.find(function(option) { return parseInt(option.save_trm) === sortTerm.value; });
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
/* 추가적인 스타일링을 여기에 추가하세요 */
</style>
