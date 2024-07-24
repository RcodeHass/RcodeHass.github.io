$(document).ready(function () {

    // =====================================================================
    // ==============       Initialisation de la carte     =================
    // =====================================================================
    // const x = $('.close-button');
    // closeAllWidows(x,dialogs);

    let listLoc = document.querySelector('ul#list-equipement');
    const frag = document.createDocumentFragment();
    $('#play-date').get(0).style.display = 'block';


    // Les fond de carte 

    const centreloc = [45.43798463466298, 4.385923767089852];
    const map = L.map('map', {
        zoomControl: false,
        center: centreloc,
        zoom: 12,
        scrollWheelZoom: true // Définir la zone restreinte
    });


    var cartho = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.carto.com">CARTO</a> OpenStreetMap, contributors',
        opacity: 1
    });
    cartho.addTo(map);


    var OpenStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap',
        ext: 'jpg'
    });
    OpenStreetMap.addTo(map); 


    // Créez des groupes pour les marqueurs
    const markerGroup = L.layerGroup().addTo(map);
    const shapeGroup = L.layerGroup().addTo(map);
    const quartierGroup = L.layerGroup();

    // // Ajouter la couche quartier 
     fetch('docs/fond_carte/Quartier.geojson')
     .then(response => response.json())
     .then(data => {
         const Quartier = L.geoJSON(data, {
             onEachFeature: function(feature, layer) {
                 layer.bindPopup(feature.properties.code_2018.toString());
             },
             style: {
                 fillOpacity: 0.09,
                 opacity: 0.8,
                 weight: 1,
                 dashArray: '4, 10',
                 color: '#FFD133'
             }
         });
         quartierGroup.addLayer(Quartier);
     })
     .catch(error => {
         console.error('Erreur lors du chargement du fichier GeoJSON:', error);
     });
    
    // ======= Ajout de la couche de Point =========
    const addMarkerToMap = ({ latitude, longitude, pratique, domaine, id}, map) => {
        
        const iconUrl = getIconUrl(domaine); // Personaliser les marqueur 
        const icone = L.icon ({
            iconUrl: iconUrl,
            iconSize: [20, 35],
            iconAnchor: [10, 35],
            popupAnchor: [0, -35]
            
        });

        const marker = L.marker([latitude, longitude], { icon: icone }).bindPopup(pratique);
        markerGroup.addLayer(marker);

        marker.on('click', function () {
            const ensemble = DataComplexe.find(ens => ens.id === id);
            const cotes_ecrit = DataCotes.find(cot => cot.id_cote === id && cot.types === 'D');
            const cotes_icono = DataCotes.find(cot => cot.id_cote === id && cot.types === 'I');
            const cotes_plan = DataCotes.find(cot => cot.id_cote === id && cot.types === 'P');
            const descriptionText = ensemble ? ensemble.description : 'Non disponible';

            const image_0 = DataImages.find(img => img.id_image === id && img.num === 1)
            const image_1 = DataImages.find(img => img.id_image === id && img.num === 1)
            const image_2 = DataImages.find(img => img.id_image === id && img.num === 2)
            const image_3 = DataImages.find(img => img.id_image === id && img.num === 3)
            const image_4 = DataImages.find(img => img.id_image === id && img.num === 4)
            const image_5 = DataImages.find(img => img.id_image === id && img.num === 5)

            document.getElementById('titre-description').innerHTML = ensemble ? ensemble.name : 'Non disponible';
            document.getElementById('texte-description').innerHTML = descriptionText? truncateText(descriptionText, 150):'Données indisponibles';
            document.getElementById('description').innerHTML = ensemble ? (ensemble.description): 'Non disponible';
            document.getElementById('titre').innerHTML = ensemble ? ensemble.name :  'Non disponible';
            document.getElementById('addresse').innerHTML = ensemble ? ensemble.adresse :  'Non disponible';
            document.getElementById('docs_event').innerHTML = ensemble ? (ensemble.event) :  'Non disponible';
            document.getElementById('docs_ecrit').innerHTML = cotes_ecrit ? (cotes_ecrit.description_c): 'Non disponible';
            document.getElementById('docs_icono').innerHTML = cotes_icono ? (cotes_icono.description_c): 'Non disponible';
            document.getElementById('docs_plan').innerHTML = cotes_plan ? (cotes_plan.description_c): 'Non disponible';

            updateImageAppercu('id_img0', 'lien_img0', image_0);
            updateImage('id_img1', 'lien_img1', image_1);
            updateImage('id_img2', 'lien_img2', image_2);
            updateImage('id_img3', 'lien_img3', image_3);
            updateImage('id_img4', 'lien_img4', image_4);
            updateImage('id_img5', 'lien_img5', image_5);
            
            // Vérifiez si fulldesc-switch est déjà ouvert
            const fullDescSwitch = document.getElementById('full-description');
            if (!fullDescSwitch || !fullDescSwitch.hasAttribute('open')) {
                document.getElementById('view_description').setAttribute('open', true);
            }
        });
        // marker.description = pratique; 
        return marker;
    };

    function updateImage(imgElementId, lienImgId, image) {
        /*console.log('image');
        console.log(image);*/
        const imgElement = document.getElementById(imgElementId);
        const lienImg = document.getElementById(lienImgId);
        if (imgElement && lienImg) {
            const imgUrl = image ? image.url : '';
            imgElement.src = imgUrl;
            lienImg.href = imgUrl;
            }
    }

    function updateImageAppercu(imgElementId, lienImgId, image) {
        const imgElement = document.getElementById(imgElementId);
        const lienImg = document.getElementById(lienImgId);
        const img_modal = document.getElementById('id_img0_modal');
        if (imgElement && lienImg) {
            const imgUrl = image ? image.url : 'assets/images/no-image-found.svg';
            imgElement.src = imgUrl;
            lienImg.href = imgUrl;

        }
    }

    // Ajoute de la couche de Forme 
    const addShapeToMap = ({ latlngs, pratique, domaine, id_forme }, map) => {
        const shape = L.polygon(latlngs, {
            cfillOpacity: 0.1,
            color: '#3333ff',
            lineOpacity: 0.1,
            opacity: 0.1
        });
        shapeGroup.addLayer(shape);
        return shape;
    };

    // Controle des fond de carte 
     var baseLayers = {
        "OpenSteetMap": OpenStreetMap,
        "Cartho":cartho
        
    };
    // Ajouter les couche dans l'overview
    var overlays = {
        "Marker": markerGroup,
        "Forme": shapeGroup,
        "Quartier": quartierGroup,
    };
    L.control.layers(baseLayers, overlays, { position: 'bottomleft' }).addTo(map);

    // L.control.layers(null, overlays, {
    //     position: 'topleft' // Déplacer l'overview en haut à gauche
    // }).addTo(map);

    // Ajouter les contrôles de zoom par défaut
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);


    // =====================================================================
    // =================         Création des list        ==================
    // =====================================================================

    // Liste Filtrage 1 par domaine
    let listEl2 = document.querySelector('ul#list-filtre');
    const frag2 = document.createDocumentFragment();

    const equipment = new Set();
    DataEquipements.forEach((equip1) => {
        if (!equipment.has(equip1.domaine)){
            const liEl2 = document.createElement('li');
            // Créer l'élément d'image
            const imgEl = document.createElement('img');
            imgEl.src = getIconUrl(equip1.domaine);
            imgEl.alt = equip1.domaine;
            imgEl.style.width = '20px';  
            imgEl.style.height = '20px'; 
            // Créer l'élément de texte
            const textEl = document.createElement('span');
            textEl.innerText = equip1.domaine;
            // Ajouter l'image et le texte au li
            liEl2.appendChild(imgEl);
            liEl2.appendChild(textEl);
            liEl2.dataset.lat = equip1.lat; 
            liEl2.dataset.lon = equip1.lon; 
            frag2.appendChild(liEl2);
            equipment.add(equip1.domaine);
        }
    });
    listEl2.appendChild(frag2);

    // Ajouter une deuxieme filtrage 2  par type 
    let ListFiltre2 = document.querySelector('ul#second-filtre')
    const frag3 = document.createDocumentFragment();
    const equipement = new Set();
    DataEquipements.forEach((equip) => {
        if (!equipement.has(equip.type)){
            const liequip = document.createElement('li')
            const textEl = document.createElement('span');
            // Création de  l'élément switch
            const switchInput = document.createElement('input');
            switchInput.type = 'checkbox';
            switchInput.id = `switch-${equip.type}`;
            switchInput.dataset.type = equip.type;
            textEl.innerText = equip.type;

            const switchLabel = document.createElement('label');
            switchLabel.htmlFor = switchInput.id;
            switchLabel.appendChild(switchInput);
            switchLabel.appendChild(textEl);
            
            // Ajouter le switch et le texte à l'élément <li>
            liequip.appendChild(switchInput);
            liequip.appendChild(switchLabel);
            liequip.dataset.lat = equip.lat
            liequip.dataset.lon = equip.lon
            frag3.appendChild(liequip);
            equipement.add(equip.type);

        }
    });
    ListFiltre2.appendChild(frag3);


    // =====================================================================
    // =============          Fonctions de filtrage            ==============
    // =====================================================================

    const masqueSwitch = document.getElementById('masque-switch');
    let isMasqueSwitchChecked = false; // État initial du switch
    let isShapeMasqueSwitchChecked = false; 

    let currentEquipment = null;
    let currentShape = null;
    let checkedTypes = [];
    let checkedShapeTypes = [];
    let curseurValeur = document.getElementById('date-slider').value;

    // Fonction de filtrage globale avec ajout de marqueurs à la carte
    function applyFilters() {
        const curseurValeur = document.getElementById('date-slider').value;
        const dateCurseur = new Date(curseurValeur);

        let filteredEquipments = DataEquipements.filter((equip) => {
            const passesEquipmentFilter = !currentEquipment || equip.domaine === currentEquipment;
            const passesTypeFilter = checkedTypes.length === 0 || checkedTypes.includes(equip.type);
            const passesDateFilter = new Date(equip.dateD) <= dateCurseur && new Date(equip.dateF) >= dateCurseur;
            const passesMasqueFilter = !isMasqueSwitchChecked || equip.p_cotes;
            return passesEquipmentFilter && passesTypeFilter && passesDateFilter && passesMasqueFilter;
        });

        let filteredShapes = DataFormes.filter((shape) => {
            const passesShapeMasqueFilter = !isShapeMasqueSwitchChecked || shape.p_cotes;
            const passesShapeFilter = !currentShape || shape.domaine === currentShape;
            const passesDomainFilter = !currentShape || shape.domaine === currentShape;
            const passesShapeTypeFilter = checkedShapeTypes.length === 0 || checkedShapeTypes.includes(shape.type);
            const passesShapeDateFilter = new Date(shape.dateD_shape) <= dateCurseur && new Date(shape.dateF_shape) >= dateCurseur;
            return passesShapeMasqueFilter && passesShapeFilter && passesDomainFilter && passesShapeTypeFilter && passesShapeDateFilter ;
        });

        filteredEquipments = filteredEquipments;
        filteredShapes = filteredShapes;
        updateMap(filteredEquipments, filteredShapes);
        updateEquipmentList(filteredEquipments, filteredShapes); // Mettre à jour la liste d'équipements

        // Collecter les domaines des équipements filtrés
        let filteredDomains = filteredEquipments.map(equip => equip.domaine);
        // Supprimer les doublons
        filteredDomains = [...new Set(filteredDomains)];

        // Déterminer si le filtre de domaine est actif
        const isEquipmentFilterActive = currentEquipment !== null;

        displayCurrentFilter(isEquipmentFilterActive ? filteredDomains : []);
    }

    // Fonction pour mettre à jour la carte avec les équipements filtrés
    function updateMap(filteredEquipments,filteredShapes) {
        markerGroup.clearLayers();
        shapeGroup.clearLayers();
        let Nb_equip = 0;

        filteredEquipments.forEach((equip) => {
            if (equip.latitude && equip.longitude) {
                addMarkerToMap({
                    latitude: equip.latitude,
                    longitude: equip.longitude,
                    pratique: equip.pratique,
                    domaine: equip.domaine,
                    id: equip.id_equip
                }, map);
                Nb_equip++;
            }
        });

        filteredShapes.forEach((shape) => {
            if (shape.latlngs && shape.latlngs.length > 0) { // Vérifiez si les coordonnées sont définies et non vides
                addShapeToMap({
                    latlngs: shape.latlngs,
                    pratique: shape.pratique,
                    domaine: shape.domaine,
                    id_forme: shape.id_forme,
                    p_cotes : shape.p_cotes
                }, map); // Ajouter les formes filtrées à la carte
            }
        });

        if (!map.hasLayer(markerGroup)) {
            markerGroup.addTo(map);
        }

        if (!map.hasLayer(shapeGroup)) {
            shapeGroup.addTo(map);
        }
        updateMarkerCount(Nb_equip); 
    }

    // Mettre à jour l'affichage du nombre de marqueurs
    function updateMarkerCount(count) {
        const markerCountDisplay = document.getElementById('Nb_equip');
        markerCountDisplay.innerText = `Nombre d'équipements: ${count}`;
    }

    // Fonction pour afficher le filtre actuel
    function displayCurrentFilter(filteredDomains) {
        const filterDisplay = document.getElementById('Filtre-actu');
        if (filteredDomains) {
            filterDisplay.innerHTML = filteredDomains;
        } else {
            filterDisplay.innerHTML = 'Aucun';
        }
    }

    // =====================================================================
    // ==============   Création et mise à jour de la liste  ===============
    // =====================================================================

    function updateEquipmentList(filteredEquipments) {
        listLoc.innerHTML = ''; // Vider la liste actuelle
    
        const frag = document.createDocumentFragment();
    
        DataComplexe.forEach((loca) => {
            const relevantEquipments = ensembleEquipements[loca.id]?.filter(equip => filteredEquipments.includes(equip)) || [];
            
            if (relevantEquipments.length > 0) {
                const liEl = document.createElement('li');
                liEl.innerHTML = loca.name;
                liEl.dataset.lat = loca.lat;
                liEl.dataset.lon = loca.lon;
    
                // Créer une sous-liste pour les équipements
                const ulEquip = document.createElement('ul');
                ulEquip.classList.add('sub-list', 'hidden');
    
                // Ajouter les équipements à la sous-liste
                relevantEquipments.forEach((equip) => {
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
    
                liEl.appendChild(ulEquip);
                frag.appendChild(liEl);
            }
        });
    
        listLoc.appendChild(frag);
    }

    // Filter 1: par la présence ou non des cotes
    masqueSwitch.addEventListener('change', (event) => {
        isMasqueSwitchChecked = event.target.checked;
        applyFilters();
    });

    // Filtre 2: par l'attribut domaine
    listEl2.addEventListener('click', ({ target }) => {
        const li = target.closest('li');
        if (!li) {
            return;
        }
        const equipment = li.querySelector('span').innerText.trim();
        if (equipment === currentEquipment) {
            currentEquipment = null; // Réinitialiser currentEquipment à null
            displayCurrentFilter(null);
        } else {
            currentEquipment = equipment;
        }
        applyFilters();
    });

    // Filtre 3 par l'attribut type d'equipement
    ListFiltre2.addEventListener('click', ({ target }) => {
        if (target.tagName !== 'INPUT' || target.type !== 'checkbox') {
            return;
        }
        checkedTypes = Array.from(ListFiltre2.querySelectorAll('input[type="checkbox"]:checked'))
            .map((input) => input.dataset.type);

        applyFilters();
    });

    // =====================================================================
    // ================         Filtrage des formes        =================
    // =====================================================================

    // Filter 1 par présence ou non des cotes pour les formes
    masqueSwitch.addEventListener('change', (event) => {
        isShapeMasqueSwitchChecked = event.target.checked;
        applyFilters();
    });
    
    // Filtre 2 par domaine des formes
    listEl2.addEventListener('click', ({ target }) => {
        const li = target.closest('li');
        if (!li) {
            return;
        }
        const shape = li.querySelector('span').innerText.trim();
        if (shape === currentShape) {
            currentShape = null; // Réinitialiser currentShape à null
            displayCurrentFilter(null);
        } else {
            currentShape = shape; // Mettre à jour currentShape avec la nouvelle forme sélectionnée
        }
        applyFilters();
    });

    // Filtre 3 par type d'equipement des formes
    ListFiltre2.addEventListener('click', ({ target }) => {
        if (target.tagName !== 'INPUT' || target.type !== 'checkbox') {
            return;
        }
        checkedShapeTypes = Array.from(ListFiltre2.querySelectorAll('input[type="checkbox"]:checked'))
            .map((input) => input.dataset.type);

        applyFilters();
    });

    // =====================================================================
    // ==============      Filtre par date et affichage     ================
    // =====================================================================

    
    // Initialisation du filtre par date
    document.getElementById('date-slider').addEventListener('input', () => {
        applyFilters();
    });
    const dateDisplay = document.querySelectorAll('#dateDisplay, #dateDisplay2');

    function updateDateDisplay(date) {
        dateDisplay.forEach(display => display.innerText = `Date: ${date}`);
    }
    updateDateDisplay(curseurValeur);

    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    let intervalId;

    function updateFilterAndDisplay() {
        const curseurValeur = document.getElementById('date-slider').value;
        updateDateDisplay(curseurValeur);
        applyFilters();
    }

    // Boutton de lecture des dates
    startButton.addEventListener('click', () => {
        if (intervalId) {
            // Si l'intervalle est déjà en cours, arrêtez-le en cliquant à nouveau sur le bouton
            clearInterval(intervalId);
            startButton.textContent = '☐'; // Changez le texte du bouton pour "Start"
            intervalId = null; // Réinitialisez l'identifiant de l'intervalle
        } else {
            intervalId = setInterval(() => {
                // Incrémentez la valeur du curseur (ou modifiez-la selon votre logique)
                const currentValue = parseInt(document.getElementById('date-slider').value);
                let newValue = currentValue + 1; // Par exemple, incrémente de 2 à chaque fois
                if (newValue > 2023) {
                    newValue = 1900; // Réinitialisez à 1900 si on dépasse 2023
                }
                document.getElementById('date-slider').value = newValue;
                updateFilterAndDisplay();
            }, 200);
            startButton.textContent = 'Stop'; // Changez le texte du bouton pour "Stop"
        }
    });

    // Boutton date debut
    resetButton.addEventListener('click', () => {
        document.getElementById('date-slider').value = 1900; // Réinitialisez la valeur du curseur à 1900
        updateDateDisplay(1900); // Mettez à jour l'affichage de la date
        updateFilterAndDisplay(); // Mettre à jour le filtre
    });

    // Boutton date actuelle
    fin.addEventListener('click', () => {
        document.getElementById('date-slider').value = 2023;
        updateDateDisplay(2023);
        updateFilterAndDisplay();
    });

    // Applique les filtres initialement
    // let currentFilteredEquipments = Data.Equipements;
    applyFilters();

    // Sélectionner le bouton de réinitialisation
    const resetFiltersButton = document.getElementById('resetAll-Filtre');

    resetFiltersButton.addEventListener('click', () => {
        // Réinitialiser les filtres
        isMasqueSwitchChecked = false;
        isShapeMasqueSwitchChecked = false;
        currentEquipment = null;
        currentShape = null;
        checkedTypes = [];
        checkedShapeTypes = [];
        curseurValeur = 2023; // ou toute autre valeur par défaut
        document.getElementById('date-slider').value = curseurValeur; // Mettre à jour le curseur

        // Réinitialiser l'affichage de l'interface utilisateur
        document.getElementById('masque-switch').checked = false;
        updateDateDisplay(curseurValeur);
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });

        // Réappliquer les filtres avec les valeurs réinitialisées
        applyFilters();
    });

    // =====================================================================
    // ======    Gestion des événements sur la liste d'équipement    =======
    // =====================================================================

    // Gestion de l'affichage des sous-listes et zoom sur la carte
    listLoc.addEventListener('click', (event) => {
        const target = event.target.closest('li');

        if (!target) return;

        // Vérifiez si l'élément cliqué est un élément de la liste principale
        if (target.parentElement === listLoc) {
            // Bascule l'affichage de la sous-liste
            const ulEquip = target.querySelector('ul.sub-list');
            if (ulEquip) {
                ulEquip.classList.toggle('hidden');
            }
            // Récupérez les coordonnées pour le zoom sur la carte
            const lat = Number(target.dataset.lat);
            const lon = Number(target.dataset.lon);
            if (!isNaN(lat) && !isNaN(lon)) {
                map.flyTo([lat, lon], 17);
            }
        }
    });

    // Ecouteur d'événement pour afficher le popup des éléments de la sous-liste
    listLoc.addEventListener('click', (event) => {
        const target = event.target.closest('.equip-item');

        if (target) {
            const lat = target.dataset.lat;
            const lon = target.dataset.lon;
            const pratique = target.dataset.pratique;

            if (!isNaN(lat) && !isNaN(lon)) {
                L.popup()
                    .setLatLng([lat, lon])
                    .setContent(`<strong>Pratique:</strong> ${pratique}`)
                    .openOn(map);
            }
        }
    });

});
