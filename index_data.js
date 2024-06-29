
// ============ Programmation des bouttons ============

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
    document.getElementById('reduit-descrition'),
    document.getElementById('view-apropos')
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
document.getElementById('apropos-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[8]));
// Fermer toutes les fenêtres
const closeButtons = document.getElementsByClassName('close-button');

Array.from(closeButtons).forEach(button => {
    button.addEventListener('click', () => {
        dialogs.forEach(dialog => {
            if (dialog) {
                dialog.removeAttribute('open');
            }
        });
    });
});

// ========== Initialisation de la liste Ensemble Sportif ============

const Data = {
    Complexe: Complexe.map((element) => {
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
            type: element.TYPE_EQUIP,
            pratique: element.PRATIQUE,
            dateD: new Date(element.DATE_INNAU),
            dateF: new Date(element.DATE_DEM),
            num_equip: element.NUM_EQUIP,
            p_cotes: element.P_COTES
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
            dateD_shape: new Date(feature.properties.DATE_INNAU),
            dateF_shape: new Date(feature.properties.DATE_DEM),
        };
    })
};

// Pour convertir les saute de ligne de js a html
const ConversionSautLine = (text) => {
    return text ? text.replace(/\\n\\n/g, '<br/><br/>') : 'Non disponible';
};

// Définir un objet de correspondance pour les icônes
const iconMapping = {
    "Sport en plein air": "docs/img/Exterieur.svg",
    "Jeux de boule": "docs/img/Boule.svg",
    "Sport aquatique": "docs/img/Piscine.svg",
    "Equipement couvert": "docs/img/Gymnase.svg",
    "Divers": "docs/img/Divers.svg" 
};

// Fonction pour obtenir l'URL de l'icône en fonction du domaine
 const getIconUrl = (domaine) => {
    return iconMapping[domaine] || iconMapping["Divers"];
};

// Les Dates 
document.getElementById('dev-date').addEventListener('click', function() {
    const playDateDiv = document.getElementById('play-date');
    if (playDateDiv.style.display === 'none' || playDateDiv.style.display === '') {
        playDateDiv.style.display = 'block';
    } else {
        playDateDiv.style.display = 'none';
    }
});

document.getElementById('play-date').style.display = 'block';

// Afficher la nav bar en mode smartphone 
document.getElementById('icon-nav').addEventListener('click', function() {
    const navBar = document.querySelector('.nav-bar');
    if (navBar.style.display === 'none' || navBar.style.display === '') {
        navBar.style.display = 'block';
    } else {
        navBar.style.display = 'none';
    }
});

// // iniatilasation de la fonction qui affiche le nombre d'equipement 
function updateNbEquipDisplay(count) {
    const nbEquipElement = document.getElementById('Nb_equip');
    if (nbEquipElement) {
        nbEquipElement.innerHTML = `Nb d'équipements: ${count}`;
    }
   
}

//  ============== Liste les parc sportif ==============

let listLoc = document.querySelector('ul#list-equipement');
const frag = document.createDocumentFragment();
// Créez un objet de correspondance entre les Complexe et leurs équipements
const ensembleEquipements = Data.Equipements.reduce((acc, equip) => {
    if (!acc[equip.id_equip]) {
        acc[equip.id_equip] = [];
    }
    acc[equip.id_equip].push(equip);
    return acc;
}, {});


Data.Complexe.forEach((loca) => {
    const liEl = document.createElement('li');
    liEl.innerHTML = loca.name;
    liEl.dataset.lat = loca.lat;
    liEl.dataset.lon = loca.lon;

    // Créer une sous-liste pour les équipements
    const ulEquip = document.createElement('ul');
    ulEquip.classList.add('sub-list', 'hidden');

    // Ajouter les équipements à la sous-liste
    if (ensembleEquipements[loca.id]) {
        ensembleEquipements[loca.id].forEach((equip) => {
            const liEquip = document.createElement('li');
            liEquip.classList.add('equip-item');

            // Créer l'élément d'image
            const imgEl = document.createElement('img');
            imgEl.src = getIconUrl(equip.domaine); // Utilisation de la fonction getIconUrl
            imgEl.alt = equip.pratique;
            imgEl.style.width = '20px';
            imgEl.style.height = '20px';

            // Créer l'élément de texte
            const textEl = document.createElement('span');
            textEl.innerText = equip.pratique;

            // Ajouter l'image et le texte au li
            liEquip.appendChild(imgEl);
            liEquip.appendChild(textEl);
            ulEquip.appendChild(liEquip);

            // Ajouter les données pratiques au liEquip pour utilisation ultérieure
            liEquip.dataset.lat = equip.latitude;
            liEquip.dataset.lon = equip.longitude;
            liEquip.dataset.pratique = equip.pratique;
        });
    }

    liEl.appendChild(ulEquip);
    frag.appendChild(liEl);
});

listLoc.appendChild(frag);

// ============== Description ================
const truncateText = (text, limit) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '... lire la suite';
    }
    return text;
};

// JavaScript pour vérifier la largeur de l'écran et afficher ou masquer le contenu des date 
document.addEventListener('DOMContentLoaded', function() {
    const playDateContent = document.getElementById('play-date');
    const viewDateDialog = document.getElementById('view-date');
    function adjustPlayDateVisibility() {
        if (window.innerWidth < 950) {
            // Masquer le contenu si l'écran est inférieur à 950 px
            playDateContent.style.display = 'none';
        } else {
            playDateContent.style.display = 'block';
        }
    }
    adjustPlayDateVisibility();
    window.addEventListener('resize', adjustPlayDateVisibility);
});



