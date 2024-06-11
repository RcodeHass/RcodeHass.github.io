

const init = () => {

    // Les fond de carte 

    const centreloc = [45.43798463466298, 4.385923767089852];
    const map = L.map('map', {
        center: centreloc,
        zoom: 12,
        scrollWheelZoom: true // Définir la zone restreinte
    });

    var cartho = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.carto.com">CARTO</a> OpenStreetMap, contributors RIDJALI',
        opacity: 1
    });
    cartho.addTo(map);


    var OpenStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France',
        ext: 'jpg'
    });
    OpenStreetMap.addTo(map); 

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

    // Créez des groupes pour les marqueurs et les formes
    const markerGroup = L.layerGroup().addTo(map);
    const shapeGroup = L.layerGroup();

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
            const ensemble = Data.Ensembles.find(ens => ens.id === id);
            const cotes_ecrit = Data.Cotes.find(cot => cot.id_cote === id && cot.types === 'D');
            const cotes_icono = Data.Cotes.find(cot => cot.id_cote === id && cot.types === 'I');
            const cotes_plan = Data.Cotes.find(cot => cot.id_cote === id && cot.types === 'P');
            const descriptionText = ensemble ? ensemble.description : 'Non disponible';

            const image_0 = Data.images.find(img => img.id_image === id && img.num === 1)
            const image_1 = Data.images.find(img => img.id_image === id && img.num === 1)
            const image_2 = Data.images.find(img => img.id_image === id && img.num === 2)
            const image_3 = Data.images.find(img => img.id_image === id && img.num === 3)
            const image_4 = Data.images.find(img => img.id_image === id && img.num === 4)

            document.getElementById('titre-description').innerHTML = ensemble ? ensemble.name : 'Non disponible';
            document.getElementById('texte-description').innerHTML = truncateText(descriptionText, 100);
            document.getElementById('description').innerHTML = ensemble ? ConversionSautLine(ensemble.description): 'Non disponible';
            document.getElementById('titre').innerHTML = ensemble ? ensemble.name :  'Non disponible';
            document.getElementById('addresse').innerHTML = ensemble ? ensemble.adresse :  'Non disponible';
            document.getElementById('docs_event').innerHTML = ensemble ? ConversionSautLine (ensemble.event) :  'Non disponible';
            document.getElementById('docs_ecrit').innerHTML = cotes_ecrit ? ConversionSautLine (cotes_ecrit.description_c): 'Non disponible';
            document.getElementById('docs_icono').innerHTML = cotes_icono ? ConversionSautLine (cotes_icono.description_c): 'Non disponible';
            document.getElementById('docs_plan').innerHTML = cotes_plan ? ConversionSautLine (cotes_plan.description_c): 'Non disponible';

            // Mise à jour de l'image 0
            const imgElement0 = document.getElementById('id_img0');
            const lienimg0 = document.getElementById('lien_img0');
            if (imgElement0 && lienimg0) {
                const imgUr0 = image_0 ? image_0.url : 'chemin/vers/image_non_disponible.png';
                imgElement0.src = imgUr0;
                lienimg0.href = imgUr0;
            }

            // Mise à jour de l'image 1
            const imgElement1 = document.getElementById('id_img1');
            const lienimg1 = document.getElementById('lien_img1');
            if (imgElement1 && lienimg1) {
                const imgUr1 = image_1 ? image_1.url : 'chemin/vers/image_non_disponible.png';
                imgElement1.src = imgUr1;
                lienimg1.href = imgUr1;
            }

            // Mise à jour de l'image 2
            const imgElement2 = document.getElementById('id_img2');
            const lienimg2 = document.getElementById('lien_img2');
            if (imgElement2 && lienimg2) {
                const imgUr2 = image_2 ? image_2.url : 'chemin/vers/image_non_disponible.png';
                imgElement2.src = imgUr2;
                lienimg2.href = imgUr2;
            }

            const imgElement3 = document.getElementById('id_img3');
            const lienImg3 = document.getElementById('lien_img3');
            if (imgElement3 && lienImg3) {
                const imgUrl = image_3 ? image_3.url : 'chemin/vers/image_non_disponible.png';
                imgElement3.src = imgUrl;
                lienImg3.href = imgUrl;
            }

            // Mise à jour de l'image 4
            const imgElement4 = document.getElementById('id_img4');
            const lienimg4 = document.getElementById('lien_img4');
            if (imgElement4 && lienimg4) {
                const imgUr4 = image_4 ? image_4.url : 'chemin/vers/image_non_disponible.png';
                imgElement4.src = imgUr4;
                lienimg4.href = imgUr4;
            }

            // Vérifiez si fulldesc-switch est déjà ouvert
            const fullDescSwitch = document.getElementById('full-description');
            if (!fullDescSwitch || !fullDescSwitch.hasAttribute('open')) {
                document.getElementById('view_description').setAttribute('open', true);
            }
        });

        return marker;
    };

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
        "Forme": shapeGroup
    };
    L.control.layers(baseLayers, overlays,).addTo(map);

    // Ajouter l'écouteur d'événement sur l'élément parent
    listLoc.addEventListener('click', (event) => {
        const target = event.target;
        
        // Vérifiez si l'élément cliqué est un élément de la liste principale
        if (target.nodeName === 'LI' && target.parentElement === listLoc) {
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

    // ======= Liste Filtrage par domaine ========
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


    // ======== Fonction de filtrage en fonction du champs domaine ===========
    // Point
    function updateFilterByEquipment(equipment) {
        const filteredEquipments = Data.Equipements.filter((equip) => equip.domaine === equipment);
        currentFilteredEquipments = filteredEquipments; // Met à jour les équipements filtrés actuels
        updateFilterByDate(filteredEquipments, currentFilteredShapes);
        displayCurrentFilter(equipment); //affiche le filtre actuelle
    }

    // Shape
    function updateFilterByShape(shape) {
        const filteredShapes = Data.Formes.filter((form) => form.domaine === shape);
        currentFilteredShapes = filteredShapes;
        updateFilterByDate(currentFilteredEquipments, filteredShapes);
    }

    // Fonction pour afficher le filtre actuel
    function displayCurrentFilter(equipment) {
        const filterDisplay = document.getElementById('Filtre-actu');
        if (equipment) {
            filterDisplay.innerHTML = `Filtre actuel: ${equipment}`;
        } else {
            filterDisplay.innerHTML = 'Filtre actuel: Aucun';
        }
    }
    
    // Crée un liste des domaine et filter les marher et les forme
    let currentEquipment = null;
    let currentShape = null;

    listEl2.addEventListener('click', ({ target }) => {
        if (target.nodeName !== 'LI') {
            return;
        }
        const equipment = target.innerHTML.trim();
        if (equipment === currentEquipment) {
            // Si l'équipement sélectionné est le même que l'équipement actuel, réinitialiser la sélection
            currentFilteredEquipments = Data.Equipements; 
            updateFilterByDate(currentFilteredEquipments, currentFilteredShapes); 
            currentEquipment = null; // Réinitialiser currentEquipment à null
            displayCurrentFilter(null);
        } else {
            updateFilterByEquipment(equipment);
            currentEquipment = equipment;
        }
        currentShape = null;
    });

    // Gestionnaire d'événements pour la liste des formes
    listEl2.addEventListener('click', ({ target }) => {
        if (target.nodeName !== 'LI') {
            return;
        }
        const shape = target.innerHTML.trim();

        if (shape === currentShape) {
            currentFilteredShapes = Data.Formes; // Réinitialiser les équipements filtrés
            updateFilterByDate(currentFilteredShapes, currentFilteredShapes); // Afficher tous les équipements
            currentShape = null; // Réinitialiser currentShape à null
        } else {
            // Sinon, filtrer et afficher les équipements en fonction de la forme sélectionnée
            updateFilterByShape(shape);
            currentShape = shape; // Mettre à jour currentShape avec la nouvelle forme sélectionnée
        } 
    });

    
    // ===== Fonction pour filtrer et afficher les équipements en fonction de la date ====
    function updateFilterAndDisplay() {
        const curseurValeur = document.getElementById('date-slider').value;
        updateDateDisplay(curseurValeur);
        updateFilterByDate(currentFilteredEquipments, currentFilteredShapes);
    }

    // Ajoutez un gestionnaire d'événements pour le bouton de démarrage
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
                const newValue = currentValue + 2; // Par exemple, incrémente de 1 à chaque fois
                document.getElementById('date-slider').value = newValue; updateDateDisplay(newValue);
                updateFilterAndDisplay();
            }, 200); 
            startButton.textContent = 'Stop'; // Changez le texte du bouton pour "Stop"
        }

    });

    // Ajoutez un gestionnaire d'événements pour le bouton de réinitialisation

    function updateFilterByDate(filteredEquipments, filteredShapes) {
        let curseurValeur = document.getElementById('date-slider').value;
        const dateCurseur = new Date(curseurValeur);

        const activeEquipments = filteredEquipments.filter((equip) => {
            const dateD = new Date(equip.dateD);
            const dateF = new Date(equip.dateF);
            return dateCurseur >= dateD && dateCurseur <= dateF;
        });

        const activeShapes = filteredShapes.filter((shape) => {
            const dateD = new Date(shape.dateD_shape);
            const dateF = new Date(shape.dateF_shape);
            return dateCurseur >= dateD && dateCurseur <= dateF;
        });

        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polygon) {
                map.removeLayer(layer);
            }
        });

        activeEquipments.forEach((equip) => {
            addMarkerToMap({
                latitude: equip.latitude,
                longitude: equip.longitude,
                pratique: equip.pratique,
                domaine: equip.domaine,
                id: equip.id_equip
            }, map);
        });

        activeShapes.forEach((shape) => {
            addShapeToMap({
                latlngs: shape.latlngs,
                pratique: shape.pratique,
                domaine: shape.domaine,
                id_forme: shape.id_forme
            }, map);
        });

        updateNbEquipDisplay(activeEquipments.length);
    }

    let currentFilteredEquipments = Data.Equipements;
    let currentFilteredShapes = Data.Formes;
    updateFilterByDate(currentFilteredEquipments, currentFilteredShapes);

    document.getElementById('date-slider').addEventListener('input', () => {
        updateFilterByDate(currentFilteredEquipments, currentFilteredShapes);
    });
    
};



window.onload = init;
