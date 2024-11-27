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
    console.log(data);
    let gasolineras = data.ListaEESSPrecio;

    gasolineras.forEach(gasolinera => {
        let price = gasolinera["Precio Gasolina 95 E5"];
        let direction = gasolinera["Dirección"];
        let priceDiesel = gasolinera["Precio Gasoleo A"];
        let logo = gasolinera["Rótulo"];
        if (price == "") {
            return;
        }

        let priceParsed = parseFloat(price.replace(/,/g, "."));
        let priceDieselParsed = parseFloat(priceDiesel.replace(/,/g, "."));
        let obj = { "price": priceParsed, "direction": direction, "priceDiesel": priceDieselParsed, "logo": logo };
        gasofas.push(obj);

        let latitude = gasolinera["Latitud"];
        let latitudeParsed = parseFloat(latitude.replace(/,/g, "."));
        let longitude = gasolinera["Longitud (WGS84)"];
        let longitudeParsed = parseFloat(longitude.replace(/,/g, "."));
        
        let latitud = decimalToDMS(latitudeParsed);
        let longitud = decimalToDMS(longitudeParsed);

        // console.log(latitud, longitud);
        // const watchID = navigator.geolocation.watchPosition((position) => {
        //     doSomething(latitud, longitud);
        //   });
          
    });

    function decimalToDMS(decimal) {
        const degrees = Math.trunc(decimal); // Parte entera como grados
        const minutesDecimal = Math.abs((decimal - degrees) * 60); // Minutos como valor decimal
        const minutes = Math.trunc(minutesDecimal); // Parte entera como minutos
        const seconds = ((minutesDecimal - minutes) * 60).toFixed(2); // Segundos con dos decimales
    
        return `${degrees}° ${minutes}' ${seconds}"`;
    }
    

    gasofas.sort((a, b) => a.price - b.price);

    gasofas.forEach(gasolinera => {
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        let newPrice = gasolinera.price;
        let newPriceDiesel = gasolinera.priceDiesel;
        let gasColor = "";
        let gasColorDiesel = "";
        

        div.classList.add("flex", "flex-col", "items-center", "p-2", "border-2", "border-gray-50", "text-gray-50", "bg-gray-800", "m-2", "w-50", "h-50", "rounded-lg");

        switch (true) {
            case (newPrice < 1.50):
                gasColor = "text-green-400";
                break;
            case (newPrice >= 1.50 && newPrice < 1.60):
                gasColor = "text-orange-400";
                break;
            case (newPrice >= 1.60):
                gasColor = "text-red-500";
                break;
        }
        switch (true) {
            case (newPriceDiesel < 1.30):
                gasColorDiesel = "text-green-400";
                break;
            case (newPriceDiesel >= 1.30 && newPriceDiesel < 1.40):
                gasColorDiesel = "text-orange-400";
                break;
            case (newPriceDiesel >= 1.40):
                gasColorDiesel = "text-red-500";
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
            div.innerHTML = ` <h1>${gasolinera.direction}:</h1>
                                <li class="font-bold ${gasColor}"> Gasolina: ${gasolinera.price}€/l</li> 
                                <li class="font-bold ${gasColorDiesel}"> Diesel: ${gasolinera.priceDiesel}€/l</li>
                                <li>${gasolinera.logo}</li>`;
            container.appendChild(div);
        }
    });
}
