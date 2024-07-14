// =====================================================================
// ============        Initialisation de la données     ===============
// =====================================================================

//Chargement des donnees : complexe
var jsonComplexe = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'docs/data/complexes.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

//Chargement des donnees : equipement
var jsonEquipements = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'docs/data/equipements.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

//Chargement des donnees : cotes
var jsonCotes = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'docs/data/cotes.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();
//Chargement des donnees : images
var jsonImages = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'docs/data/images.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

//Chargement des donnees : formes
var jsonFormes = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'docs/fond_carte/formes.geojson',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

// =====================================================================
// ===============        Preparation des donnees     ==================
// =====================================================================

//Mise en forme des donnees : complexe
const DataComplexe = jsonComplexe.map((element) => {
    return {
        id: element.ID,
        name: element.NOM,
        lon: element.lon_X,
        lat: element.lat_Y,
        event: element.EVENEMENT,
        description: element.DESCRIPTION,
        adresse: element.ADRESSE,
    };
});

//Mise en forme des donnees : equipement
const DataEquipements = jsonEquipements.map((element) => {
return {
    id_equip: element.ID_EQUIP,
    latitude: element.lat_Y,
    longitude: element.lon_X,
    domaine: element.DOMAINE,
    type: element.TYPE_EQUIP,
    pratique: element.PRATIQUE,
    dateD: new Date(element.DATE_INNAU),
    dateF: new Date(element.DATE_DEM),
    num_equip: element.NUM_EQUIP,
    p_cotes: element.P_COTES
};
});
//console.log(equipements);

//Mise en forme des donnees : cotes
const DataCotes =  jsonCotes.map((element) => {
return {
    id_cote: element.ID_EQUIP,
    types: element.TYPE_COTES,
    description_c: element.DESCRIPTION,
};
});
//console.log(cotes);

//Mise en forme des donnees : images
const DataImages = jsonImages.map((element) =>{
return {
    id_image: element.ID_IMG,
    num: element.NUM,
    url: element.LIEN,
};
});

//console.log(images);

//Mise en forme des donnees : formes
const DataFormes = jsonFormes.features.map((feature) => {
    return {
        id_forme: feature.id,
        latlngs: feature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]), // [lat, lon]
        domaine: feature.properties.DOMAINE,
        dateD_shape: new Date(feature.properties.DATE_INAU),
        dateF_shape: new Date(feature.properties.DATE_DEM),
        p_cotes: feature.properties.P_COTE,
        type: feature.properties.TYPE_EQUIP
    };
});
//console.log(formes);

//  ============== jointure entre complexe et equipement ==============

// Créez un objet de correspondance entre les Complexe et leurs équipements
const ensembleEquipements = DataEquipements.reduce((acc, equip) => {
    if (!acc[equip.id_equip]) {
        acc[equip.id_equip] = [];
    }
    acc[equip.id_equip].push(equip);
    return acc;
}, {});

// =====================================================================
// =====       Appelle des boutton et fonctionnalité de la cart   ======
// =====================================================================

// Définir un objet de correspondance pour les icônes
const iconMapping = {
    "Sport en plein air": "assets/images/Exterieur.svg",
    "Jeux de boule": "assets/images/Boule.svg",
    "Sport aquatique": "assets/images/Piscine.svg",
    "Equipement couvert": "assets/images/Gymnase.svg",
    "Divers": "assets/images/Divers.svg"
};

function toggleDialog(dialogs, targetDialog, exceptions = []) {
    dialogs.forEach(dialog => {
        if (dialog === targetDialog) {
            if (dialog && dialog.getAttribute('open')) {
                dialog.removeAttribute('open');
            } else {
                dialog && dialog.setAttribute('open', true);
            }
        } else if (!exceptions.includes(dialog)) {
            dialog && dialog.removeAttribute('open');
        }
    });
}


