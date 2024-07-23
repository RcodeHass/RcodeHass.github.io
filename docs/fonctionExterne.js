
// =====================================================================
// ===============        Autre fonction accessoire      ===============
// =====================================================================

// // Pour convertir les saute de ligne de js a html
// const ConversionSautLine = (text) => {
//     return text ? text.replace(/\\n\\n/g, '<br/><br/>') : 'Non disponible';
// };

// Fonction qui vas gérer l'ouverture et la fermeture des onglets 
const dialogs = [
    document.getElementById('view-date'),
    document.getElementById('view_description'),
    document.getElementById('view-list'),
    document.getElementById('view-filtre'),
    document.getElementById('full-description'),
    document.getElementById('dev-descrition'),
    document.getElementById('reduit-descrition'),
    document.getElementById('view-apropos')
];

// Gerer les exceptions
let exceptions = [
    document.getElementById('view-list'),
];

// Ouvrir
document.getElementById('date-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[0]));
document.getElementById('desc-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[1]));
document.getElementById('list-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[2], exceptions));
document.getElementById('filtre-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[3]));
document.getElementById('fulldesc-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[4]));
document.getElementById('dev-descrition').addEventListener('click', () => toggleDialog(dialogs, dialogs[4]));
document.getElementById('reduit-descrition').addEventListener('click', () => toggleDialog(dialogs, dialogs[1]));
document.getElementById('apropos-switch').addEventListener('click', () => toggleDialog(dialogs, dialogs[7]));
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

// Fonction pour obtenir l'URL de l'icône en fonction du domaine
const getIconUrl = (domaine) => {
    return iconMapping[domaine] || iconMapping["Divers"];
};


// Masquer les commande de la div date 
$('#dev-date').get(0).addEventListener('click', function() {
    const playDateDiv = document.getElementById('play-date');
    if (playDateDiv.style.display === 'none' || playDateDiv.style.display === '') {
        playDateDiv.style.display = 'block';
    } else {
        playDateDiv.style.display = 'none';
    }
});

// Fermer toutes les fenêtres

// function closeAllWidows(collectionButton,tabButton) {
//     Array.from(collectionButton).forEach(button => {
//         button.addEventListener('click', () => {
//             tabButton.forEach(dialog => {
//                 if (dialog) {
//                     dialog.removeAttribute('open');
//                 }
//             });
//         });
//     })
// }


// Afficher la nav bar en mode smartphone 
document.getElementById('icon-nav').addEventListener('click', function() {
    const navBar = document.querySelector('.nav-bar');
    if (navBar.style.display === 'none' || navBar.style.display === '') {
        navBar.style.display = 'block';
    } else {
        navBar.style.display = 'none';
    }
});


// initialisation de la fonction qui affiche le nombre d'equipement 
function updateNbEquipDisplay(count) {
    const nbEquipElement = document.getElementById('Nb_equip');
    if (nbEquipElement) {
        nbEquipElement.innerHTML = `Nb d'équipements: ${count}`;
    }
}

// ============== Controler la longeur des texte des description et ouverture de la description  ================
// const truncateText = (text, limit) => {
//     if (text.length > limit) {
//         return text.substring(0, limit) + '... lire la suite';
//     }
//     return text;
// };

function onpenDevDescription(){
    var dlg = document.getElementById('full-description');
    dlg.setAttribute('open', true);

}

const truncateText = (text, limit) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...'+'<a href="javascript:void(0);" onclick="onpenDevDescription();" >lire la suite....</a>';
    }
    return text;
};

// Vérifier la largeur de l'écran et afficher ou masquer le contenu des date 
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

 // Fonction pour mettre à jour l'affichage de la valeur du curseur
function updateDateDisplay(value) {
    document.getElementById('dateDisplay').innerText = value;
    document.getElementById('dateDisplay2').innerText = value;
}


// Ajoutez une classe CSS pour masquer initialement les sous-listes
const style = document.createElement('style');
style.innerHTML = `
    .hidden {
        display: none;
    }
    .sub-list {
        margin-left: 2px; 
    }
`;
document.head.appendChild(style);


