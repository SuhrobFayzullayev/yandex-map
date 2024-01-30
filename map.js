// BASE_URL
const BASE_URL = "https://semurginsurance.uz/api/contactlist";

// locales
let locates = {
  en: {
    full_name: "Full name",
    address: "Address",
    phone_number: "Phone number",
    working_days: "Working days",
    working_hours: "Working hours",
    lunch_time: "Lunch time",
  },
  ru: {
    full_name: "Имя",
    address: "Адрес",
    phone_number: "Номер телефона",
    working_days: "Рабочие дни",
    working_hours: "Рабочее время",
    lunch_time: "Время обеда",
  },
  uz: {
    full_name: "To'liq ism",
    address: "Manzil",
    phone_number: "telefon raqam",
    working_days: "Ish kunlari",
    working_hours: "Ish vaqtlari",
    lunch_time: "Tushlik vaqti",
  },
};

const localeOptions = [
  { id: "en", name: "English" },
  { id: "ru", name: "Russian" },
  { id: "uz", name: "Uzbek" },
];

// detect active lang
let currentLang = "uz";

export const localeCodes = localeOptions.map((locale) => locale.id);

// helper functions
export const objectFilterOut = (object, filterKeys) => {
  const langFilterKeys = [];
  for (const key of filterKeys) {
    for (const localeCode of localeCodes) {
      langFilterKeys.push(key.concat("_", localeCode));
    }
  }
  const asArray = Object.entries(object);
  const filtered = asArray.filter(
    ([key, _value]) => !langFilterKeys.includes(key)
  );
  return Object.fromEntries(filtered);
};

const handleArrayI18n = (data, langKeys, currentLang) => {
  if (data) {
    const EN = "en";
    const RU = "ru";
    const UZ = "uz";

    switch (currentLang) {
      case RU:
        return data.map((i) => {
          const langData = {};

          for (const key of langKeys) {
            const langKey = key.concat("_", RU);
            if (i[langKey]) {
              langData[key] = i[langKey];
            }
          }

          return {
            ...objectFilterOut(i, langKeys),
            ...langData,
          };
        });

      case EN:
        return data.map((i) => {
          const langData = {};

          for (const key of langKeys) {
            const langKey = key.concat("_", EN);
            if (i[langKey]) {
              langData[key] = i[langKey];
            }
          }

          return {
            ...objectFilterOut(i, langKeys),
            ...langData,
          };
        });

      case UZ:
        return data.map((i) => {
          const langData = {};

          for (const key of langKeys) {
            const langKey = key.concat("_", UZ);
            if (i[langKey]) {
              langData[key] = i[langKey];
            }
          }

          return {
            ...objectFilterOut(i, langKeys),
            ...langData,
          };
        });
      default:
        return [];
    }
  }
  return [];
};

// get dom elements
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const regions = document.querySelectorAll(".map-links");

// uzb regions
let uzbRegions = [
  {
    name: "karakalpakstan",
    zoomLevel: 7,
    coordinates: {
      lat: 42.9970172,
      lng: 57.6995002,
    },
  },
  {
    name: "tashkent-sity",
    zoomLevel: 12,
    coordinates: {
      lat: 41.2841761,
      lng: 69.1834369,
    },
  },
  {
    name: "andijan",
    zoomLevel: 10,
    coordinates: {
      lat: 40.8027584,
      lng: 71.9870256,
    },
  },
  {
    name: "bukhara",
    zoomLevel: 8,
    coordinates: {
      lat: 40.2108774,
      lng: 62.4075087,
    },
  },
  {
    name: "jizzakh",
    zoomLevel: 9,
    coordinates: {
      lat: 40.2461636,
      lng: 67.087208,
    },
  },
  {
    name: "kashkadarya",
    zoomLevel: 9,
    coordinates: {
      lat: 38.7719782,
      lng: 65.3487522,
    },
  },
  {
    name: "navoi",
    zoomLevel: 7,
    coordinates: {
      lat: 41.5730655,
      lng: 61.5600404,
    },
  },
  {
    name: "namangan",
    zoomLevel: 9,
    coordinates: {
      lat: 41.0956697,
      lng: 70.6004155,
    },
  },
  {
    name: "samarkand",
    zoomLevel: 9,
    coordinates: {
      lat: 39.9201362,
      lng: 65.5696101,
    },
  },
  {
    name: "sukhondarya",
    zoomLevel: 9,
    coordinates: {
      lat: 38.1236706,
      lng: 66.793731,
    },
  },
  {
    name: "sirdarya",
    zoomLevel: 9,
    coordinates: {
      lat: 40.5263145,
      lng: 67.9444331,
    },
  },
  {
    name: "tashkent",
    zoomLevel: 9,
    coordinates: {
      lat: 41.2339382,
      lng: 68.6390671,
    },
  },
  {
    name: "fergana",
    zoomLevel: 9,
    coordinates: {
      lat: 40.3415614,
      lng: 70.5826071,
    },
  },
  {
    name: "khorezm",
    zoomLevel: 9,
    coordinates: {
      lat: 41.2768039,
      lng: 60.5430313,
    },
  },
];

// markers
let markers = [];

async function init() {
  var myMap = new ymaps.Map("map", {
    center: [41.2602639, 62.3265579],
    zoom: 5.5,
    controls: [
      "typeSelector",
      "fullscreenControl",

      new ymaps.control.SearchControl({
        options: {
          size: "large",
        },
      }),
    ],
  });

  var clusterer = new ymaps.Clusterer({
    clusterDisableClickZoom: false,
    clusterIconColor: "#0B4848",
  });

  let clustererMarkers = [];

  for (let i = 0; i < markers.length; i++) {
    var myPlacemark = new ymaps.Placemark(
      [markers[i].lat, markers[i].lng],
      {
        balloonContent: `<div style='width: 300px' id='locationInfoModal' class='contact-page__list-col'>
              <h3 class="card-title">${markers[i].title}</h3>

              <p>
                  <span>${locates[currentLang]?.full_name}:</span>
                  ${markers[i].name}
              </p>
              <p>
                  <span>${locates[currentLang]?.address}:</span>
                  ${markers[i].address}
              </p>
              <p>
                  <span>${locates[currentLang]?.phone_number}:</span>
                  ${markers[i].phone}
              </p>
              <p>
                  <span>${locates[currentLang]?.working_days}:</span>
                  ${markers[i].work_days}
              </p>
              <p>
                  <span>${locates[currentLang]?.working_hours}:</span>
                  ${markers[i].opening_hours}
              </p>

              <p>
                  <span>${locates[currentLang]?.lunch_time}:</span>
                  ${markers[i].lunch}
              </p>
          </div>`,
      },
      {
        iconLayout: "default#image",
        iconImageHref: "./location.svg",
        iconImageSize: [40, 55],
      }
    );

    clustererMarkers[i] = myPlacemark;
    myMap.geoObjects.add(myPlacemark);
  }

  clusterer.add(clustererMarkers);
  myMap.geoObjects.add(clusterer);

  // zoom methods
  function zoomIn() {
    myMap.setZoom(myMap.getZoom() + 1, { checkZoomRange: true });
  }

  function zoomOut() {
    myMap.setZoom(myMap.getZoom() - 1, { checkZoomRange: true });
  }

  // zoom events
  zoomInBtn.addEventListener("click", zoomIn);
  zoomOutBtn.addEventListener("click", zoomOut);

  regions.forEach((region, index) => {
    region.addEventListener("click", () => {
      regions.forEach((el) => el.classList.remove("active"));
      regions[index].classList.add("active");

      myMap.setCenter([
        uzbRegions[index].coordinates.lat,
        uzbRegions[index].coordinates.lng,
      ]);

      myMap.setZoom(uzbRegions[index].zoomLevel);
    });
  });
}

// fetch markers
async function fetchMarkers() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  data.data.map((v) => {
    if (Number(v.lat) && Number(v.lng)) {
      markers.push({
        ...v,
        lat: Number(v.lat),
        lng: Number(v.lng),
      });
    }
  });

  markers = handleArrayI18n(
    markers,
    ["title", "address", "work_days", "opening_hours", "name", "lunch"],
    currentLang
  );
}
await fetchMarkers();

// yandex map
await ymaps.ready(init);
