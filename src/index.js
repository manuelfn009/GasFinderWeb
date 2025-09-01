let API = "";
const container = document.querySelector(".container");
let selectCCAA = document.querySelector(".CCAA");
let selectProvincia = document.querySelector(".Provincia");
let selectMunicipio = document.querySelector(".Municipio");
let selectGasDie = document.querySelector(".gasDie");

const APIGOB =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/";

const APICA =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/";
const listaCCAA =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/";
const APIMU =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/";

selectCCAA.addEventListener("change", getProvincia);
selectProvincia.addEventListener("change", getMunicipio);
selectMunicipio.addEventListener("change", getPetrolStations);

// Ordenar por gasolina o diésel
selectGasDie.addEventListener("change", () => {
  container.innerHTML = ""; // Limpiar el contenido previo
  getPetrolStations(); // Mostrar los datos ordenados
});

async function getCCAA() {
  let res = await fetch(listaCCAA);
  let data = await res.json();
  let CCAA = [];

  let comunidades = data.length > 0 ? data : [];

  comunidades.forEach((comunidad) => {
    let id = comunidad["IDCCAA"];
    let nombre = comunidad["CCAA"];
    let obj = { id: id, nombre: nombre };
    CCAA.push(obj);
  });

  CCAA.sort((a, b) => a.id - b.id);

  CCAA.forEach((comunidad) => {
    let option = document.createElement("option");
    option.value = comunidad.id;
    option.innerText = comunidad.nombre;
    selectCCAA.appendChild(option);
  });
}

getCCAA();

async function getProvincia() {
  selectProvincia.innerHTML = `<option value="" disabled selected>Provincia</option>`;
  let idCCAA = selectCCAA.value;
  let res = await fetch(APICA + idCCAA);
  let data = await res.json();
  let PP = [];

  let provincias = data.length > 0 ? data : [];
  provincias.forEach((provincia) => {
    let id = provincia["IDPovincia"];
    let nombre = provincia["Provincia"];
    let obj = { id: id, nombre: nombre };
    PP.push(obj);
  });

  PP.sort((a, b) => a.id - b.id);

  PP.forEach((provincia) => {
    let option = document.createElement("option");
    option.value = provincia.id;
    option.innerText = provincia.nombre;
    selectProvincia.appendChild(option);
  });
}

async function getMunicipio() {
  selectMunicipio.innerHTML = `<option value="" disabled selected>Municipio</option>`;
  let idProvincia = selectProvincia.value;
  let res = await fetch(APIMU + idProvincia);
  let data = await res.json();
  let MM = [];

  let municipos = data.length > 0 ? data : [];

  municipos.forEach((municipio) => {
    let id = municipio["IDMunicipio"];
    let nombre = municipio["Municipio"];
    let obj = { id: id, nombre: nombre };
    MM.push(obj);
  });

  MM.sort((a, b) => a.id - b.id);

  MM.forEach((municipio) => {
    let option = document.createElement("option");
    option.value = municipio.id;
    option.innerText = municipio.nombre;
    selectMunicipio.appendChild(option);
  });
}

async function getPetrolStations() {
  container.innerHTML = "";

  let API = APIGOB + selectMunicipio.value;

  let res = await fetch(API);
  let data = await res.json();
  let gasofas = [];
  let gasolineras = data.ListaEESSPrecio;

  gasolineras.forEach((gasolinera) => {
    let price = gasolinera["Precio Gasolina 95 E5"];
    let priceGasolinaPlus = gasolinera["Precio Gasolina 98 E5"];
    let direction = gasolinera["Dirección"];
    let priceDiesel = gasolinera["Precio Gasoleo A"];
    let priceDieselPlus = gasolinera["Precio Gasoleo Premium"];
    let logo = gasolinera["Rótulo"];

    if (price == "") {
      return;
    }

    let priceParsed = parseFloat(price.replace(/,/g, "."));
    let priceGasolinaPlusParsed = parseFloat(priceGasolinaPlus.replace(/,/g, "."));
    let priceDieselParsed = parseFloat(priceDiesel.replace(/,/g, "."));
    let priceDieselPlusParsed = parseFloat(priceDieselPlus.replace(/,/g, "."));

    let obj = {
      price: priceParsed,
      priceGasolinaPlus: priceGasolinaPlusParsed,
      direction: direction,
      priceDiesel: priceDieselParsed,
      priceDieselPlus: priceDieselPlusParsed,
      logo: logo,
    };
    gasofas.push(obj);
  });

  switch (selectGasDie.value) {
    case "gasAsc":
      gasofas.sort((a, b) => a.price - b.price);
      break;
    case "gasDesc":
      gasofas.sort((a, b) => b.price - a.price);
      break;
    case "dieAsc":
      gasofas.sort((a, b) => a.priceDiesel - b.priceDiesel);
      break;
    case "dieDesc":
      gasofas.sort((a, b) => b.priceDiesel - a.priceDiesel);
      break;
  }

  gasofas.forEach((gasolinera) => {
    let div = document.createElement("div");
    let gasColor = "";
    let gasColorDiesel = "";

    switch (true) {
      case gasolinera.price < 1.5:
        gasColor = "text-green-400";
        break;
      case gasolinera.price >= 1.5 && gasolinera.price < 1.6:
        gasColor = "text-orange-400";
        break;
      case gasolinera.price >= 1.6:
        gasColor = "text-red-500";
        break;
    }
    switch (true) {
      case gasolinera.priceDiesel < 1.4:
        gasColorDiesel = "text-green-400";
        break;
      case gasolinera.priceDiesel >= 1.4 && gasolinera.priceDiesel < 1.5:
        gasColorDiesel = "text-orange-400";
        break;
      case gasolinera.priceDiesel >= 1.5:
        gasColorDiesel = "text-red-500";
        break;
    }

    div.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "p-2",
      "border-2",
      "border-gray-50",
      "text-gray-50",
      "bg-gray-800",
      "m-2",
      "w-50",
      "h-50",
      "rounded-lg"
    );

    div.innerHTML = `
      <h1>${gasolinera.direction}:</h1>
      <li class="font-bold ${gasColor}">Gasolina: ${gasolinera.price}€/l</li>
      <li class="font-bold ${gasColor}">Gasolina Plus: ${gasolinera.priceGasolinaPlus}€/l</li>
      <li class="font-bold ${gasColorDiesel}">Diesel: ${gasolinera.priceDiesel}€/l</li>
      <li class="font-bold ${gasColorDiesel}">Diesel Plus: ${gasolinera.priceDieselPlus}€/l</li>
      <h2 class="font-bold">${gasolinera.logo}</h2>
    `;
    container.appendChild(div);
  });
}
