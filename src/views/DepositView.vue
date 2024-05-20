<template>
    <div>
        <h1>예금</h1>
        <ul>
            <li v-for="deposit in deposits" :key="deposit.id">
                <p> 공시 제출일 : {{ deposit.dcls_month }} </p>
                <p> 금융 회사명 : {{ deposit.kor_co_nm }} </p>
                <p> 상품명 : {{ deposit.fin_prdt_nm }} </p>
                <p> 6개월 금리 : {{ deposit.interest_6m }}% </p>
                <p> 12개월 금리 : {{ deposit.interest_12m }}% </p>
                <p> 24개월 금리 : {{ deposit.interest_24m }}% </p>
                <p> 36개월 금리 : {{ deposit.interest_36m }}% </p>

            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from "@/stores/articles";
import axios from 'axios'

const store = useArticleStore();
const deposits = ref([])

onMounted(() => {
    axios({
    method: 'get',
    url: `${store.API_URL}/financial/deposit_list/`
    })
    .then(res => {
        deposits.value = res.data
        console.log(res)
        console.log(res.data)
        console.log(deposits.value)
    })
    .catch(err => console.log(err))
})

</script>

<style lang="scss" scoped>

</style>