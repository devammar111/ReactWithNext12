import React, { useState } from 'react';
import {
    GoogleMap,
    LoadScript,
    Autocomplete
} from '@react-google-maps/api';
import getConfig from 'next/config';
import styles from "./intractiveMap.module.scss";
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { GeocodedLocation } from '@lib/umbraco/types/geocodedLocation.type';
import tribes from '@lib/umbraco/types/tribes.type';
import {
    getGreenColoredCoordinates,
    getOrangeIrelandRegionCoordinates,
    getOrangeRegionCoordinates,
    getPurpleColoredRegionCoordinates,
    getPurpleIrelandCoordinates,
    getPurpleRightSideCoordinates,
    getPurpleRightSideCoordinates1,
    getRedColoredRegionCoordinates,
    getRounderPurpleCoordinates,
    getShortString,
    getYellowColoredIrelandRegionCoordinates,
    getYellowColoredRegionCoordinates
} from '@lib/umbraco/util/mapHelpers';
import locations from '../../../lib/umbraco/types/locations.type';
import { filterLocationsByCategory, filterLocationsByCategoryAndSearchTerm, getAssociateCategoriesFromLocationsWithIcons, searchLocationsByCategory } from '../../../lib/umbraco/util/helpers';
import { FlexibleLinkModel } from '../../../lib/umbraco/types/flexibleLinkModel.type';
import { UmbracoNode } from '../../../lib/umbraco/types/umbracoNode.type';
const containerStyle = {
    width: '100%',
    height: '1057px',
};
export type IntractiveMapModel = {
    googleMapCenter: GeocodedLocation,
    zoomLevel: number,
    isMapDraggable: boolean,
    locationItems: locations[],
    allLabel: string,
    allLabelIcon: string

}
export default function IntractiveMap({ googleMapCenter, zoomLevel, isMapDraggable, locationItems, allLabel, allLabelIcon }: IntractiveMapModel) {
    const [active, setActive] = useState(5);
    const [inputValue, setInputValue] = useState<string>("");
    let [mapType, setMapType] = useState<"satellite" | "roadmap">("satellite");
    const [myMap, setMap] = useState<google.maps.Map | null>(/**@type google.maps.Map */(null));
    const [myMarkerClusters, setMarkerClusters] = useState<MarkerClusterer | null>(/**@type MarkerClusterer */(null));
    const [buttonCategories, setButtonCategories] = useState<tribes[] | null>(getAssociateCategoriesFromLocationsWithIcons(locationItems, allLabel, allLabelIcon));

    const { publicRuntimeConfig } = getConfig();

    const mapOptions = {
        zoom: zoomLevel,
        center: { lat: googleMapCenter.coordinates.latitude, lng: googleMapCenter.coordinates.longitude },
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: true,
        scaleControl: true,
        streetViewControl: false,
        draggable: isMapDraggable,
        scrollwheel: true,
        fullscreenControlOptions: { position: 10.0 },
        mapTypeId: mapType,
        zoomControl: true,
        zoomControlOptions: { position: 5.0 },
        mapId: "intractiveMapID"
    };
    debugger;
    const handleLoad = async (mapObj: google.maps.Map) => {
        const mapDivElement = document.getElementById('intractiveMapID') as HTMLElement;
        const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        async function initializeMap() {

            mapObj = new google.maps.Map(mapDivElement, mapOptions);

            let polygonOrange = new google.maps.Polygon({
                paths: [getOrangeRegionCoordinates(), getOrangeIrelandRegionCoordinates()],
                strokeColor: '#FFF', // Outline color of the region
                strokeWeight: 1,    // Font Weight of the outline
                strokeOpacity: 0.7,  // Opacity of the outline Color
                fillColor: '#E17226',   // Fill color of the region
                fillOpacity: 0.8,     // Opacity of the fill color
            });
            let polygonRed = new google.maps.Polygon({
                paths: getRedColoredRegionCoordinates(),
                strokeColor: '#FFF',
                strokeWeight: 1,
                strokeOpacity: 0.7,
                fillColor: '#9A313C',
                fillOpacity: 0.8,
            });
            let polygonYellow = new google.maps.Polygon({
                paths: [getYellowColoredRegionCoordinates(), getYellowColoredIrelandRegionCoordinates()],
                strokeColor: '#FFF',
                strokeWeight: 1,
                strokeOpacity: 0.7,
                fillColor: '#EAC95A',
                fillOpacity: 0.8,
            });
            let polygonPurple = new google.maps.Polygon({
                paths: [getPurpleColoredRegionCoordinates(), getPurpleIrelandCoordinates(), getPurpleRightSideCoordinates(), getPurpleRightSideCoordinates1()],
                strokeColor: '#FFF',
                strokeWeight: 1,
                strokeOpacity: 0.7,
                fillColor: '#592c5c',
                fillOpacity: 0.8,
            });
            let polygonPurpleRound = new google.maps.Polygon({
                paths: getRounderPurpleCoordinates(),
                strokeColor: '#000000',
                strokeWeight: 1,
                fillColor: '#592c5c',
                fillOpacity: 0.8,
            });
            let polygongreen = new google.maps.Polygon({
                paths: getGreenColoredCoordinates(),
                strokeColor: '#FFF',
                strokeWeight: 1,
                strokeOpacity: 0.7,
                fillColor: '#49532f',
                fillOpacity: 0.8,
            });

            if (zoomLevel < 6) {
                polygonOrange.setMap(mapObj);
                polygonRed.setMap(mapObj);
                polygonYellow.setMap(mapObj);
                polygonPurple.setMap(mapObj);
                polygonPurpleRound.setMap(mapObj);
                polygongreen.setMap(mapObj);
            }

            const customControlDiv = document.createElement('div');
            const customControlDivLeftButtons = document.createElement('div');
            const customControlDivLeftButtonSatellite = document.createElement('div');
            const customControl = CustomControl(customControlDiv, mapObj);
            mapObj.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(customControlDiv);
            CustomControlLeftHomeButtons(customControlDivLeftButtons, mapObj);
            CustomControlLeftSatelliteButtons(customControlDivLeftButtonSatellite, mapObj);
            mapObj.controls[google.maps.ControlPosition.LEFT_TOP].push(customControlDivLeftButtons);
            mapObj.controls[google.maps.ControlPosition.LEFT_TOP].push(customControlDivLeftButtonSatellite);
            mapObj.addListener("zoom_changed", (event: any) => {
                var zoomLevel: any = mapObj.getZoom();
                if (zoomLevel > 6) {
                    polygonOrange.setVisible(false);
                    polygonRed.setVisible(false);
                    polygonYellow.setVisible(false);
                    polygonPurple.setVisible(false);
                    polygonOrange.setVisible(false);
                    polygonOrange.setVisible(false);
                }
                else {
                    polygonOrange.setVisible(true);
                    polygonRed.setVisible(true);
                    polygonYellow.setVisible(true);
                    polygonPurple.setVisible(true);
                    polygonOrange.setVisible(true);
                    polygonOrange.setVisible(true);
                }

            });
            setMap(mapObj);

            if (active === 5 && locationItems && locationItems.length > 0) {
                const infoWindow = new google.maps.InfoWindow({
                    content: "",
                    disableAutoPan: true,
                });
                // Add some markers to the map.
                const markers = locationItems?.map((loc: locations, j: number) => {
                    let position = { lat: 0, lng: 0 }
                    position.lat = loc.properties.address?.coordinates?.latitude;
                    position.lng = loc.properties.address?.coordinates?.longitude;
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position,
                    });

                    // markers can only be keyboard focusable when they have click listeners
                    // open info window when marker is clicked
                    marker.addListener("click", () => {
                        var completeLink = loc.properties?.website?.startsWith("http://") || loc.properties?.website?.startsWith("https://") ? loc.properties?.website : "https://" + loc.properties?.website;
                        const contentString = `<h5 class="text-center noMargin">${loc.name}</h5>
                                    <h6 class="linkText text-center"><a class="linkText text-center" href="tel:${loc.properties?.phoneNumber}">${loc.properties?.phoneNumber}</a></h6>
                                    <h6 class="linkText text-center"><a href="${completeLink}" target="_blank" class="linkText text-center">${loc.properties?.website && loc.properties?.website != "" && loc.properties?.website != undefined ? loc.properties?.website?.replace("https://", "").replace("http://", "") : ""}</a></h6>
                                    <p class="text-center">${loc.properties?.address?.fullAddress}</p>`;

                        infoWindow.setContent(contentString);
                        infoWindow.open(myMap, marker);
                    });
                    return marker;
                });
                // Add a marker clusterer to manage the markers.
                const markerClusters = new MarkerClusterer(
                    {
                        markers,
                        algorithm: new SuperClusterAlgorithm({ radius: 50 }),

                    }
                );
                markerClusters.setMap(mapObj);
                setMarkerClusters(markerClusters);
            }
        }

        initializeMap();

    }
    function CustomControl(controlDiv: any, map: any) {
        controlDiv.style.padding = '10px';
        const controlUI = document.createElement('div');
        const controlUISpan = document.createElement('span');
        controlUI.style.backgroundColor = '#F3F3F3';
        controlUI.style.minWidth = '201px';
        controlUI.style.minHeight = '41px';
        controlUI.style.boxShadow = 'box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;'
        controlUI.style.color = '#6BBDE5';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.style.marginBottom = '1rem';
        controlUI.title = 'Click for Full Screen';
        controlUISpan.textContent = 'Click for Full Screen';
        controlUISpan.style.margin = '12px -58px';
        controlUISpan.style.position = 'absolute';
        controlUISpan.style.textDecoration = 'underline';
        controlUISpan.style.fontSize = 'small';
        controlUISpan.style.fontWeight = '500';


        controlDiv.appendChild(controlUI).appendChild(controlUISpan);

        controlUI.addEventListener('click', () => {
            map.getDiv().requestFullscreen();
        });
    }
    function CustomControlLeftHomeButtons(controlDiv: any, map: google.maps.Map) {
        controlDiv.style.padding = '10px';
        const controlUI = document.createElement('div');
        const controlUISpan = document.createElement('i');
        controlUI.style.backgroundColor = '#F3F3F3';
        controlUI.style.minWidth = '40px';
        controlUI.style.minHeight = '40px';
        controlUI.style.boxShadow = 'box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;'
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Home';
        //controlUISpan.textContent = '&#127968;';
        controlUISpan.className = 'bmg-icon bmg-icon-home';
        controlUISpan.style.marginTop = '0.8rem';
        controlUISpan.style.fontSize = 'large';


        controlDiv.appendChild(controlUI).appendChild(controlUISpan);

        controlUI.addEventListener('click', () => {
            map.setZoom(4);
        });
    }
    function CustomControlLeftSatelliteButtons(controlDiv: any, map: google.maps.Map) {
        controlDiv.style.padding = '10px';
        const controlUI = document.createElement('div');
        const controlUISpan = document.createElement('i');
        controlUI.style.backgroundColor = '#F3F3F3';
        controlUI.style.minWidth = '40px';
        controlUI.style.minHeight = '40px';
        controlUI.style.boxShadow = 'box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;'
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Map View';
        //controlUISpan.textContent = '&#127968;';
        controlUISpan.className = 'bmg-icon bmg-icon-directions';
        controlUISpan.style.marginTop = '0.8rem';
        controlUISpan.style.fontSize = 'large';
        controlUI.style.borderRadius = '50%';


        controlDiv.appendChild(controlUI).appendChild(controlUISpan);

        controlUI.addEventListener('click', () => {
            if (map.getMapTypeId() == "satellite") {
                map.setMapTypeId(google.maps.MapTypeId["ROADMAP"]);
            }
            else {
                map.setMapTypeId(google.maps.MapTypeId["SATELLITE"]);
            }
        });
    }

    const loadTribeMarkers = (e: any, category: string, index: number) => {

        setActive(index);
        // Clear existing markers and clusters
        if (myMarkerClusters) {
            myMarkerClusters.clearMarkers();
        }
        if (category === 'See All') {
            const infoWindow = new google.maps.InfoWindow({
                content: "",
                disableAutoPan: true,
            });
            const markers = locationItems?.map((loc: locations, j: number) => {
                let position = { lat: 0, lng: 0 }
                position.lat = loc.properties.address?.coordinates?.latitude;
                position.lng = loc.properties.address?.coordinates?.longitude;
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position,
                });

                // markers can only be keyboard focusable when they have click listeners
                // open info window when marker is clicked
                marker.addListener("click", () => {
                    var completeLink = loc.properties?.website?.startsWith("http://") || loc.properties?.website?.startsWith("https://") ? loc.properties?.website : "https://" + loc.properties?.website;
                    const contentString = `<h5 class="text-center noMargin">${loc.name}</h5>
                                    <h6 class="linkText text-center"><a class="linkText text-center" href="tel:${loc.properties?.phoneNumber}">${loc.properties?.phoneNumber}</a></h6>
                                    <h6 class="linkText text-center"><a href="${completeLink}" target="_blank" class="linkText text-center">${loc.properties?.website && loc.properties?.website != "" && loc.properties?.website != undefined ? loc.properties?.website?.replace("https://", "").replace("http://", "") : ""}</a></h6>
                                    <p class="text-center">${loc.properties?.address?.fullAddress}</p>`;

                    infoWindow.setContent(contentString);
                    infoWindow.open(myMap, marker);
                });
                return marker;
            });
            const markerClusters = new MarkerClusterer(
                {
                    markers,
                    algorithm: new SuperClusterAlgorithm({ radius: 50 }),

                }
            );
            markerClusters.setMap(myMap);
            setMarkerClusters(markerClusters);
            buttonCategories?.map((categoryObj, index) => {
                if (categoryObj.label != 'See All') {
                    categoryObj.isDisabled = false;
                }

            });
            setInputValue("");

        }
        else {

            var filteredData = inputValue != "" ? filterLocationsByCategoryAndSearchTerm(locationItems, category, inputValue) : filterLocationsByCategory(locationItems, category);
            if (filteredData) {
                const infoWindow = new google.maps.InfoWindow({
                    content: "",
                    disableAutoPan: true,
                });
                const markers = filteredData?.map((loc: locations, j: number) => {
                    let position = { lat: 0, lng: 0 }
                    position.lat = loc.properties.address?.coordinates?.latitude;
                    position.lng = loc.properties.address?.coordinates?.longitude;
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position,
                    });

                    marker.addListener("click", () => {
                        var completeLink = loc.properties?.website?.startsWith("http://") || loc.properties?.website?.startsWith("https://") ? loc.properties?.website : "https://" + loc.properties?.website;
                        const contentString = `<h5 class="text-center noMargin">${loc.name}</h5>
                                    <h6 class="linkText text-center"><a class="linkText text-center" href="tel:${loc.properties?.phoneNumber}">${loc.properties?.phoneNumber}</a></h6>
                                    <h6 class="linkText text-center"><a href="${completeLink}" target="_blank" class="linkText text-center">${loc.properties?.website && loc.properties?.website != "" && loc.properties?.website != undefined ? loc.properties?.website?.replace("https://", "").replace("http://", "") : ""}</a></h6>
                                    <p class="text-center">${loc.properties?.address?.fullAddress}</p>`;

                        infoWindow.setContent(contentString);
                        infoWindow.open(myMap, marker);
                    });
                    return marker;
                })
                const markerClusters = new MarkerClusterer(
                    {
                        markers,
                        algorithm: new SuperClusterAlgorithm({ radius: 50 }),
                    }
                );
                markerClusters.setMap(myMap);
                setMarkerClusters(markerClusters);

            }
        }

    }
    const searchTribeMarkers = (e: any, category: string) => {
        e.preventDefault();
        if (myMarkerClusters) {
            myMarkerClusters.clearMarkers();
        }
        var filteredData = searchLocationsByCategory(locationItems, category);
        if (filteredData) {
            const infoWindow = new google.maps.InfoWindow({
                content: "",
                disableAutoPan: true,
            });
            const markers = filteredData?.map((loc: locations, j: number) => {
                let position = { lat: 0, lng: 0 }
                position.lat = loc.properties.address?.coordinates?.latitude;
                position.lng = loc.properties.address?.coordinates?.longitude;
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position,
                });

                marker.addListener("click", () => {
                    var completeLink = loc.properties?.website?.startsWith("http://") || loc.properties?.website?.startsWith("https://") ? loc.properties?.website : "https://" + loc.properties?.website;
                    const contentString = `<h5 class="text-center noMargin">${loc.name}</h5>
                                    <h6 class="linkText text-center"><a class="linkText text-center" href="tel:${loc.properties?.phoneNumber}">${loc.properties?.phoneNumber}</a></h6>
                                    <h6 class="linkText text-center"><a href="${completeLink}" target="_blank" class="linkText text-center">${loc.properties?.website && loc.properties?.website != "" && loc.properties?.website != undefined ? loc.properties?.website?.replace("https://", "").replace("http://", "") : ""}</a></h6>
                                    <p class="text-center">${loc.properties?.address?.fullAddress}</p>`;

                    infoWindow.setContent(contentString);
                    infoWindow.open(myMap, marker);
                });
                return marker;
            })
            const markerClusters = new MarkerClusterer(
                {
                    markers,
                    algorithm: new SuperClusterAlgorithm({ radius: 50 }),
                }
            );
            markerClusters.setMap(myMap);
            setMarkerClusters(markerClusters);
            //setButtonCategories()
            if (category && category != "") {
                buttonCategories?.map((categoryObj, index) => {
                    if (categoryObj.label != 'See All') {
                        if (filteredData.findIndex(x => x.properties.categories.findIndex(x => x.name === categoryObj.label) >= 0)) {
                            categoryObj.isDisabled = true;
                        }
                        else {
                            categoryObj.isDisabled = false;
                            //setActive(index);
                        }
                    }

                });
            }
            else {
                buttonCategories?.map((categoryObj, index) => {
                    categoryObj.isDisabled = false;
                });
            }

        }
    }

    return (
        <LoadScript googleMapsApiKey={publicRuntimeConfig.googleMapApiKey} libraries={['places']}>
            <div className={styles.mapContainer}>
                <form onSubmit={(e) => { searchTribeMarkers(e, inputValue) }}>
                    {/*<Autocomplete>*/}
                    <input type="text"
                        placeholder="Find activity, cultural group, or location"
                        className={styles.searchInput}
                        onChange={(inputEvent) => setInputValue(inputEvent.target.value)}
                        value={inputValue}
                    />
                    {/*</Autocomplete>*/}
                    <button type="submit"><i className={styles.searchBtn + " bmg-icon bmg-icon-search"}></i></button>
                </form>


                <GoogleMap
                    id="intractiveMapID"
                    mapContainerStyle={containerStyle}
                    onLoad={handleLoad}
                >

                </GoogleMap>

                <div className={styles.bottomCenterButtons}>
                    {buttonCategories &&
                        buttonCategories.map((tribe, index) => {
                            return (
                                <div key={'tribe-' + index}>
                                    <div className={(index === active ? styles.active : undefined) + ' ' + styles.buttonDiv}>
                                        <button disabled={tribe.isDisabled} onClick={(e) => { loadTribeMarkers(e, tribe.label, index) }}><i className={styles.buttonIcon + " bmg-icon " + tribe.icon}></i>
                                            <span className={styles.buttonLabel}>{tribe.label}</span>
                                        </button>
                                    </div>
                                </div>

                            )

                            


                        })
                    }

                </div>
            </div>

        </LoadScript>

    );
}



