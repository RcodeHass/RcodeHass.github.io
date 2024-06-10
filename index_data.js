


// Programmation des bouttons 

function toggleDialog(dialogs, targetDialog, exceptions = []) {
    dialogs.forEach(dialog => {
        if (dialog === targetDialog) {
            if (dialog.getAttribute('open')) {
                dialog.removeAttribute('open');
            } else {
                dialog.setAttribute('open', true);
            }
        } else if (!exceptions.includes(dialog)) {
            dialog.removeAttribute('open');
        }
    });
}

const dialogs = [
    document.getElementById('view-date'),
    document.getElementById('view_description'),
    document.getElementById('view-list'),
    document.getElementById('view-filtre'),
    document.getElementById('view-couche'),
    document.getElementById('full-description'),
    document.getElementById('dev-descrition'),
    document.getElementById('reduit-descrition')
];

// Gerer les exceptions
const exceptions = [
    // document.getElementById('view-date'),
    // document.getElementById('view-list'),
    // document.getElementById('view-filtre')
];

// Ouvrir
document.getElementById('date-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[0], exceptions));
document.getElementById('desc-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[1]));
document.getElementById('list-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[2], exceptions));
document.getElementById('filtre-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[3], exceptions));
document.getElementById('legende-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[4]));
document.getElementById('fulldesc-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[5]));
document.getElementById('dev-descrition').addEventListener('click', () => toggleDialog(dialogs, dialogs[5]));
document.getElementById('reduit-descrition').addEventListener('click', () => toggleDialog(dialogs, dialogs[1]));
// Fermer
document.getElementById('close-date').addEventListener('click', () => dialogs[0].removeAttribute('open'));
document.getElementById('close-descrition').addEventListener('click', () => dialogs[1].removeAttribute('open'));
document.getElementById('close-list').addEventListener('click', () => dialogs[2].removeAttribute('open'));
document.getElementById('close-filtre').addEventListener('click', () => dialogs[3].removeAttribute('open'));
document.getElementById('close-couche').addEventListener('click', () => dialogs[4].removeAttribute('open'));
document.getElementById('close-desc2').addEventListener('click', () => dialogs[5].removeAttribute('open'));


// ========== Initialisation de la liste Ensemble Sportif ============


const Data = {
    Ensembles: Ensemble.map((element) => {
        return {
            id: element.ID,
            name: element.NOM,
            lon: element.lon_X,
            lat: element.lat_Y,
            event: element.EVENEMENT,
            description: element.DESCRIPTION,
            adresse: element.ADRESSE,
            
        };
    }),
    
    Equipements: Equipements.map((element) => {
        return {
            id_equip: element.ID_EQUIP,
            latitude: element.lat_Y,
            longitude: element.lon_X,
            domaine: element.DOMAINE,
            pratique: element.PRATIQUE,
            dateD: new Date(element.DATE_INNAU),
            dateF: new Date(element.DATE_DEM),
            num_equip: element.NUM_EQUIP,
        };
    }),
    
    Cotes: Cotes.map((element) => {
        return {
            id_cote: element.ID_EQUIP,
            types: element.TYPE_COTES,
            description_c: element.DESCRIPTION,
        };
    }),

    images: image.map((element) =>{
        return {
            id_image: element.ID_IMG,
            num: element.NUM,
            url: element.LIEN,
        };
    }),

    Formes: form.features.map((feature) => {
        return {
            id_forme: feature.id,
            latlngs: feature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]), // [lat, lon]
            domaine: feature.properties.DOMAINE,
            pratique: feature.properties.DOMAINE,
            dateD_shape: new Date(feature.properties.DATE_INNAU),
            dateF_shape: new Date(feature.properties.DATE_DEM),
        };
    })
};


// console.log(Data.Formes)

// ======= Liste Filtre ========
let listEl2 = document.querySelector('ul#list-filtre');


const frag2 = document.createDocumentFragment();
const equipment = new Set();
Data.Equipements.forEach ((location2) => {
    if (!equipment.has(location2.domaine)){
        const liEl2 = document.createElement('li');
        liEl2.innerText = location2.domaine;
        liEl2.dataset.lat = location.lat;
        liEl2.dataset.lon = location.lon;
        frag2.appendChild(liEl2);
        equipment.add(location2.domaine);
    }
    
});

listEl2.appendChild(frag2)


// ============== Les date =============
// Définir une constante pour stocker la valeur du curseur
const curseurValeur = document.getElementById('date-slider').value;

// Affichage et paramétrage du fond de carte
updateDateDisplay (curseurValeur);

// Fonction pour mettre à jour l'affichage de la valeur du curseur
function updateDateDisplay(value) {
    document.getElementById('dateDisplay').innerText = value;
    document.getElementById('dateDisplay2').innerText = value
}

const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
// const dateDisplay = document.getElementById('dateDisplay');
const dateDisplay = document.querySelectorAll('#dateDisplay, #dateDisplay2');
let intervalId;

const truncateText = (text, limit) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '... lire la suite';
    }
    return text;
};

// Pour convertir les saute de ligne de js a html
const ConversionSautLine = (text) => {
    return text ? text.replace(/\\n\\n/g, '<br/><br/>') : 'Non disponible';
};

// ========== Date ==========

resetButton.addEventListener('click', () => {
    document.getElementById('date-slider').value = 1900; // Réinitialisez la valeur du curseur à 0
    updateDateDisplay(1900); // Mettez à jour l'affichage de la date avec la valeur réinitialisée
});

fin.addEventListener('click', () => {
    document.getElementById('date-slider').value = 2023; // Réinitialisez la valeur du curseur à 0
    updateDateDisplay(2023); // Mettez à jour l'affichage de la date avec la valeur réinitialisée
});

document.getElementById('dev-date').addEventListener('click', function() {
    const playDateDiv = document.getElementById('play-date');
    if (playDateDiv.style.display === 'none' || playDateDiv.style.display === '') {
        playDateDiv.style.display = 'block';
    } else {
        playDateDiv.style.display = 'none';
    }
});

// Afficher la nav bar en mode smartphone 
document.getElementById('icon-nav').addEventListener('click', function() {
    const navBar = document.querySelector('.nav-bar');
    if (navBar.style.display === 'none' || navBar.style.display === '') {
        navBar.style.display = 'block';
    } else {
        navBar.style.display = 'none';
    }
});


// Initialisation de la fonction qui vas afficher ou masquer la seconde partie de date 
document.getElementById('play-date').style.display = 'none';

// // iniatilasation de la fonction qui affiche le nombre d'equipement 
function updateNbEquipDisplay(count) {
    const nbEquipElement = document.getElementById('Nb_equip');
    if (nbEquipElement) {
        nbEquipElement.innerHTML = `Nb d'équipements: ${count}`;
    }
}


//  ============== Liste les parc sportif ==============


// let listLoc = document.querySelector ('ul#list-equipement');
//     const frag = document.createDocumentFragment();
//     Data.Ensembles.forEach((loca) => {
//         const liEl = document.createElement('li');
//         liEl.innerHTML = loca.name;
//         liEl.dataset.lat = loca.lat;
//         liEl.dataset.lon = loca.lon;
//         frag.appendChild(liEl);
//     });

//     listLoc.append(frag);
//     listLoc.addEventListener('click', ({ target }) => {
//         if (target.nodeName !== 'LI') {
//             return;
//         }
//         const lat = Number(target.dataset.lat);
//         const lon = Number(target.dataset.lon);
//         map.flyTo([lat, lon], 17);
//     });

let listLoc = document.querySelector('ul#list-equipement');
const frag = document.createDocumentFragment();

// Créez un objet de correspondance entre les ensembles et leurs équipements
const ensembleEquipements = Data.Equipements.reduce((acc, equip) => {
    if (!acc[equip.id_equip]) {
        acc[equip.id_equip] = [];
    }
    acc[equip.id_equip].push(equip);
    return acc;
}, {});

Data.Ensembles.forEach((loca) => {
    const liEl = document.createElement('li');
    liEl.innerHTML = loca.name;
    liEl.dataset.lat = loca.lat;
    liEl.dataset.lon = loca.lon;
    
    // Créer une sous-liste pour les équipements
    const ulEquip = document.createElement('ul');
    ulEquip.classList.add('sub-list','hidden');  // Ajouter une classe pour le style

    // Ajouter les équipements à la sous-liste
    if (ensembleEquipements[loca.id]) {
        ensembleEquipements[loca.id].forEach((equip) => {
            const liEquip = document.createElement('li');
            liEquip.innerHTML = equip.pratique;
            // liEquip.dataset.lat = equip.latitude;
            // liEquip.dataset.lon = equip.longitude;
            liEquip.classList.add('equip-item');  // Ajouter une classe pour le style
            ulEquip.appendChild(liEquip);
        });
    }

    liEl.appendChild(ulEquip);
    frag.appendChild(liEl);
});

listLoc.append(frag);




