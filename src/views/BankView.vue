<template>
  <div>
    <div id="map" style="width: 500px; height: 400px"></div>
    <div>
      <!-- 도시 선택 -->
      <select v-model="selectedCity">
        <option value="">도시 선택</option>
        <option>서울특별시</option>
        <!-- <option value="부산광역시">부산광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="인천광역시">인천광역시</option>
          <option value="광주광역시">광주광역시</option>
          <option value="대전광역시">대전광역시</option>
          <option value="울산광역시">울산광역시</option>
          <option value="세종특별자치시">세종특별자치시</option>
          <option value="경기도">경기도</option>
          <option value="강원도">강원도</option>
          <option value="충청북도">충청북도</option>
          <option value="충청남도">충청남도</option>
          <option value="전라북도">전라북도</option>
          <option value="전라남도">전라남도</option>
          <option value="경상북도">경상북도</option>
          <option value="경상남도">경상남도</option>
          <option value="제주특별자치도">제주특별자치도</option> -->
        <option>현후특별시</option>
        <!-- 다른 도시 옵션 추가 가능 -->
      </select>

      <!-- 구 선택 1 -->
      <select v-model="selectedDistrict">
        <option value="">구 선택</option>
        <option
          v-for="district in currentDistrictOptions"
          :key="district"
          :value="district"
          >
          {{ district }}
        </option>
      </select>

      <select v-model="selectedBank">
        <!-- disabled 옵션 -->
        <option disabled value="">은행 선택</option>
        <option
          v-for="bank in banks"
          :key="bank"
          >
          {{ bank }}
        </option>
      </select>
      <button @click="searchBank">찾기</button>
    </div>

    <!-- 결과 출력 -->
    <div>
      <ul>
        <li
          v-for="(place, index) in places"
          :key="index"
          @click="moveToPlace(place)"
        >
          {{ place.place_name }} - {{ place.address_name }}
        </li>
      </ul>
    </div>
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

// 도시와 관련된 구 데이터 예시
const districts = ref({
  서울특별시: ["강남구", "서초구", "종로구", "중구", "용산구"],
  // 다른 도시의 구 데이터 추가 가능...
});

const banks = ref([
  "전체보기",
  "우리은행",
  "한국스탠다드차타드은행",
  "대구은행",
  "부산은행",
  "광주은행",
  "제주은행",
  "전북은행",
  "경남은행",
  "중소기업은행",
  "한국산업은행",
  "국민은행",
  "신한은행",
  "농협은행",
  "하나은행",
  "수협은행",
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

        console.log(data);
        console.log(data[0]);
        console.log(markers);
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

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
  var iwContent = `<div style="padding:10px; min-width:200px; max-width:300px; white-space:pre-wrap;">${place.place_name}</div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  // 마커에 클릭 이벤트를 추가
  kakao.maps.event.addListener(marker, "click", function () {
    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
    infowindow.open(map, marker);
  });
}

// 지도에 표시된 모든 마커를 제거하는 함수
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = []; // 마커 배열 초기화
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

<!-- 마커 크기 조정하는 거 수정해야 함 -->
