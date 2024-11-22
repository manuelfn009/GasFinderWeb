let API = "";
const container = document.querySelector(".container");
let selectCCAA = document.querySelector(".CCAA");
let selectProvincia = document.querySelector(".Provincia");
let selectMunicipio = document.querySelector(".Municipio");

const APIGOB = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/";

const APICA = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/";
const listaCCAA = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/";
const APIMU = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/";

let id = "";

//select.addEventListener("change", getPetrolStations);

selectCCAA.addEventListener("change", getProvincia);
selectProvincia.addEventListener("change", getMunicipio);
selectMunicipio.addEventListener("change", getPetrolStations);

let APIP = "";
async function getCCAA() {
    let res = await fetch(listaCCAA);
    let data = await res.json();
    let CCAA = [];

    let comunidades = data.length > 0 ? data : [];

    comunidades.forEach(comunidad => {
        let id = comunidad["IDCCAA"];
        let nombre = comunidad["CCAA"];

        let obj = { "id": id, "nombre": nombre };
        CCAA.push(obj);
    })

    CCAA.sort((a, b) => a.id - b.id);

    CCAA.forEach(comunidad => {
        let option = document.createElement("option");
        option.value = comunidad.id;
        option.innerText = comunidad.nombre;
        selectCCAA.appendChild(option);
    })
}

getCCAA();

async function getProvincia() {
    selectProvincia.innerHTML = `<option value="" disabled selected>Provincia</option>`;
    let idCCAA = selectCCAA.value;
    let res = await fetch(APICA + idCCAA);
    let data = await res.json();
    let PP = [];


    let provincias = data.length > 0 ? data : [];
    console.log(data);
    provincias.forEach(provincia => {
        let id = provincia["IDPovincia"];
        let nombre = provincia["Provincia"];

        let obj = { "id": id, "nombre": nombre };
        PP.push(obj);
    })

    PP.sort((a, b) => a.id - b.id);

    PP.forEach(provincia => {
        let option = document.createElement("option");
        option.value = provincia.id;
        option.innerText = provincia.nombre;
        selectProvincia.appendChild(option);
    })
}

async function getMunicipio() {
    selectMunicipio.innerHTML = `<option value="" disabled selected>Municipio</option>`;
    let idProvincia = selectProvincia.value;
    let res = await fetch(APIMU + idProvincia);
    let data = await res.json();
    let MM = [];

    let municipos = data.length > 0 ? data : [];

    municipos.forEach(municipio => {
        let id = municipio["IDMunicipio"];
        let nombre = municipio["Municipio"];

        let obj = { "id": id, "nombre": nombre };
        MM.push(obj);
    })

    MM.sort((a, b) => a.id - b.id);

    MM.forEach(municipio => {
        let option = document.createElement("option");
        option.value = municipio.id;
        option.innerText = municipio.nombre;
        selectMunicipio.appendChild(option);
    })
}

async function getPetrolStations() {
    container.innerHTML = "";

    let API = APIGOB + selectMunicipio.value;

    let res = await fetch(API);
    let data = await res.json();
    let gasofas = [];

    let gasolineras = data.ListaEESSPrecio;

    gasolineras.forEach(gasolinera => {
        let price = gasolinera["Precio Gasolina 95 E5"];
        let direction = gasolinera["Dirección"];
        let priceDiesel = gasolinera["Precio Gasoleo A"];
        if (price == "") {
            return;
        }

        let priceParsed = parseFloat(price.replace(/,/g, "."));
        let priceDieselParsed = parseFloat(priceDiesel.replace(/,/g, "."));
        let obj = { "price": priceParsed, "direction": direction, "priceDiesel": priceDieselParsed };
        gasofas.push(obj);
    });

    gasofas.sort((a, b) => a.price - b.price);

    gasofas.forEach(gasolinera => {
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        let newPrice = gasolinera.price;
        let newPriceDiesel = gasolinera.priceDiesel;

        div.classList.add("flex", "flex-col", "items-center", "p-2", "text-gray-50", "bg-gray-800", "m-2", "w-50", "h-50", "rounded-lg");

        switch (true) {
            case (newPrice < 1.50):
                div.classList.add("bg-green-400");
                break;
            case (newPrice >= 1.50 && newPrice < 1.60):
                div.classList.add("bg-orange-400");
                break;
            case (newPrice >= 1.60):
                div.classList.add("bg-red-500");
                break;
        }

        // switch (true) {
        //     case (newPriceDiesel < 1.50):
        //         li.classList.add("text-green-300");
        //         break;
        //     case (newPriceDiesel >= 1.50 && newPriceDiesel < 1.60):
        //         li.classList.add("text-orange-300");
        //         break;
        //     case (newPriceDiesel >= 1.60):
        //         li.classList.add("text-red-400");
        //         break;
        // }
        if (gasolinera.direction == "" || gasolinera.price == "" && gasolinera.priceDiesel == "") {
            h2.innerText = "No hay datos disponibles";
            container.appendChild(h2);
        } else {
            div.innerHTML = ` <h1>${gasolinera.direction}: Gasolina: ${gasolinera.price}€/l ; Diesel: ${gasolinera.priceDiesel}€/l</h1>`;
            container.appendChild(div);
        }
        

    });
}
