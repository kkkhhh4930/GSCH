<template>
  <div class="container mt-4">
    <div id="map" class="mb-4" style="width: 100%; height: 400px"></div>
    
    <div class="form-row mb-4 align-items-end">
      <!-- 도시 선택 -->
      <div class="form-group col-md-3">
        <label for="city"></label>
        <select id="city" v-model="selectedCity" class="form-control">
          <option value="">도시 선택</option>
          <option v-for="city in cities" :key="city.value" :value="city.value">
            {{ city.name }}
          </option>
        </select>
      </div>

      <!-- 구 선택 -->
      <div class="form-group col-md-3">
        <label for="district"></label>
        <select id="district" v-model="selectedDistrict" class="form-control">
          <option value="">구 선택</option>
          <option v-for="district in currentDistrictOptions" :key="district" :value="district">
            {{ district }}
          </option>
        </select>
      </div>

      <!-- 은행 선택 -->
      <div class="form-group col-md-3">
        <label for="bank"></label>
        <select id="bank" v-model="selectedBank" class="form-control">
          <option disabled value="">은행 선택</option>
          <option v-for="bank in banks" :key="bank.value" :value="bank.value">
            {{ bank.name }}
          </option>
        </select>
      </div>

      <div class="form-group col-md-3">
        <button @click="searchBank" class="btn btn-primary w-100">찾기</button>
      </div>
    </div>

    <!-- 결과 출력 -->
    <ul class="list-group">
      <li v-for="(place, index) in places" :key="index" class="list-group-item list-group-item-action" @click="moveToPlace(place)">
        {{ place.place_name }} - {{ place.address_name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const selectedCity = ref("");
const selectedDistrict = ref("");
const selectedBank = ref("");
const places = ref([]);
let map;
let markers = [];
let infowindows = []; // Infowindow array

// 도시 목록
const cities = ref([
  { name: '서울특별시', value: '서울특별시' },
  { name: '부산광역시', value: '부산광역시' },
  { name: '대구광역시', value: '대구광역시' },
  { name: '인천광역시', value: '인천광역시' },
  { name: '광주광역시', value: '광주광역시' },
  { name: '대전광역시', value: '대전광역시' },
  { name: '울산광역시', value: '울산광역시' },
  { name: '경기도', value: '경기도' },
  { name: '강원도', value: '강원도' },
  { name: '충청북도', value: '충청북도' },
  { name: '충청남도', value: '충청남도' },
  { name: '전라북도', value: '전라북도' },
  { name: '전라남도', value: '전라남도' },
  { name: '경상북도', value: '경상북도' },
  { name: '경상남도', value: '경상남도' },
  { name: '세종특별자치시', value: '세종특별자치시' },
  { name: '제주특별자치도', value: '제주특별자치도' },
]);

// 구 목록
const districts = ref({
  서울특별시: ["강남구", "서초구", "종로구", "중구", "용산구"],
  부산광역시: ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"],
  대구광역시: ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"],
  인천광역시: ["계양구","남구","남동구","동구","부평구","서구","연수구","중구","강화군","옹진군"], 
  광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산광역시: ["남구","동구","북구","중구","울주군"],
  경기도: ["고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시","가평군","양평군","여주군","연천군"],
  강원도: ["강릉시","동해시","삼척시","속초시","원주시","춘천시","태백시","고성군","양구군","양양군","영월군","인제군","정선군","철원군","평창군","홍천군","화천군","횡성군"],
  충청북도: ["제천시","청주시","충주시","괴산군","단양군","보은군","영동군","옥천군","음성군","증평군","진천군","청원군"],
  충청남도: ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],
  전라북도: ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"],
  전라남도: ["광양시","나주시","목포시","순천시","여수시","강진군","고흥군","곡성군","구례군","담양군","무안군","보성군","신안군","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"],
  경상북도: ["경산시","경주시","구미시","김천시","문경시","상주시","안동시","영주시","영천시","포항시","고령군","군위군","봉화군","성주군","영덕군","영양군","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군"],
  경상남도: ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"],
  제주특별자치도: ["서귀포시","제주시","남제주군","북제주군"] 
});

// 은행 목록
const banks = ref([
  { name: '농협은행', value: '농협은행' },
  { name: '우리은행', value: '우리은행' },
  { name: '대구은행', value: '대구은행' },
  { name: '부산은행', value: '부산은행' },
  { name: '광주은행', value: '광주은행' },
  { name: '제주은행', value: '제주은행' },
  { name: '전북은행', value: '전북은행' },
  { name: '경남은행', value: '경남은행' },
  { name: '국민은행', value: '국민은행' },
  { name: '신한은행', value: '신한은행' },
  { name: '하나은행', value: '하나은행' },
  { name: '수협은행', value: '수협은행' }
]);
// 현재 선택된 도시에 따른 구 옵션
const currentDistrictOptions = ref([]);

watch(selectedCity, (newCity) => {
  if (districts.value[newCity]) {
    currentDistrictOptions.value = districts.value[newCity];
  } else {
    currentDistrictOptions.value = []; // 선택된 도시에 구 옵션이 없으면 비웁니다.
  }
  selectedDistrict.value = ""; // 도시가 변경될 때마다 선택된 구를 초기화합니다.
});

onMounted(() => {
  const script = document.createElement("script");
  script.src =
    "//dapi.kakao.com/v2/maps/sdk.js?appkey=1764e7be76eb874b8e697452f6821e1d&libraries=services,clusterer,drawing&autoload=false";
  document.head.appendChild(script);

  script.onload = () => {
    kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      map = new kakao.maps.Map(container, options);
    });
  };
});

// 은행 검색 함수
const searchBank = () => {
  // 은행 선택 X
  if (!selectedBank.value) {
    alert("은행을 선택해주세요.");
    return;
  }

  kakao.maps.load(() => {
    const ps = new kakao.maps.services.Places();
    const keyword = `${selectedCity.value} ${selectedDistrict.value} ${selectedBank.value}`;

    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        places.value = data;

        // 기존 마커를 지도에서 제거
        clearMarkers();

        // 검색된 장소들에 대한 마커 생성 및 지도에 추가
        data.forEach((place) => {
          createMarker(place);
        });

        // 검색된 첫 번째 장소로 지도 중심 이동
        if (data.length > 0) {
          const firstPlace = data[0];
          const moveLatLon = new kakao.maps.LatLng(firstPlace.y, firstPlace.x);
          map.setCenter(moveLatLon);
        }


      } else {
        alert("검색 결과가 존재하지 않습니다.");
        places.value = [];
      }
    });
  });
};

// 마커 생성 및 지도 추가 함수
function createMarker(place) {
  let marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x),
  });

  // 마커 배열에 생성된 마커 추가
  markers.push(marker);

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우 생성
  var iwContent = `<div style="padding:10px; min-width:200px; max-width:300px; white-space:pre-wrap;">${place.place_name}</div>`,
      iwRemoveable = true; // 인포윈도우를 닫을 수 있는 X 버튼

  // 인포윈도우 생성
  var infowindow = new kakao.maps.InfoWindow({
      content : iwContent,
      removable : iwRemoveable
  });    
  
  // 마커에 클릭 이벤트를 추가
  kakao.maps.event.addListener(marker, "click", function () {
    // 마커를 클릭하면 기존의 모든 인포윈도우를 닫음
    infowindows.forEach((iw) => iw.close());
    // 현재 인포윈도우가 열려있는지 확인
    if (infowindow.getMap()) {
      infowindow.close();
    } else {
      infowindow.open(map, marker);
    }
  });

  // 인포윈도우 배열에 생성된 인포윈도우 추가
  infowindows.push(infowindow);
}

// 지도에 표시된 모든 마커를 제거하는 함수
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = []; // 마커 배열 초기화
  // 인포윈도우 배열 초기화
  infowindows.forEach((iw) => iw.close());
  infowindows = [];
}

// 선택한 장소로 지도 이동 함수
const moveToPlace = (place) => {
  const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
  map.setCenter(moveLatLon);

   // 선택한 장소에 대한 인포윈도우 열기
const content = `<div style="padding:10px; min-width:200px; max-width:300px; white-space:pre-wrap;">${place.place_name}</div>`;
const infowindow = new kakao.maps.InfoWindow({
  content: content,
  removable: true,
  position: moveLatLon, // 인포윈도우 위치 설정
});
infowindow.open(map);
};

</script>

<style scoped>

</style>
