'use client'
import { useEffect, useRef, useState } from "react";

import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { GetNameKey, GetValueKey, GetPropertyUmurByFilter, FormatThousandDelimiter } from "../../utility/utility";

export const MapDashboard = ({
    umurType,
    setRegionData,
    regionState,
    setRegionState
}) => {
    
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geoJsonLayer = useRef(null);
    const [zoom, setZoom] = useState(8); // Updated zoom state
    const [history, setHistory] = useState(["35"]);
    const updatingLayer = useRef(false);
    const [loading, setLoading] = useState(false); // Loading state

    const getColor = (value, min, max) => {
        const red = Math.floor((1 - (value - min) / (max - min)) * 255);
        const green = Math.floor(((value - min) / (max - min)) * 255);
        return `rgb(${red},${green},0)`;
    };

    const goBackToPreviousRegion = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            setRegionState(newHistory[newHistory.length - 1]);
            setHistory(newHistory);
        }
    };

    useEffect(() => {
        if (map.current) return;

        // Initialize the map
        map.current = new L.Map(mapContainer.current, { zoom, center: [0, 0] });

        // Add the TileServer-GL XYZ layer
        L.tileLayer('https://tile.digitalisasi-pi.com/data/planting_phase_esri/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://tile.digitalisasi-pi.com/data/planting_phase_esri/{z}/{x}/{y}.png">Raster Umur Tanaman</a>',
            maxZoom: 14,
            tileSize: 256,
            zoomOffset: 0,
        }).addTo(map.current);

        // Optional: Add another base map layer using Maptiler
        new MaptilerLayer({
            style: "https://api.maptiler.com/maps/landscape/style.json?key=7f87DPhFubxv6U7zUuCN",
            apiKey: "7f87DPhFubxv6U7zUuCN",
        }).addTo(map.current);

        // Listen for zoom changes and update state
        map.current.on('zoomend', () => {
            setZoom(map.current.getZoom());
        });
    }, []);

    useEffect(() => {
        if (!map.current || updatingLayer.current) return;

        updatingLayer.current = true;
        setLoading(true); // Show loading screen

        if (geoJsonLayer.current) {
            map.current.removeLayer(geoJsonLayer.current);
            geoJsonLayer.current = null;
        }

        let fetchURL = "";
        if (regionState.length === 2) {
            fetchURL = '/api/read-umur-kab?KDPPUM=' + regionState;
        } else if (regionState.length === 4) {
            fetchURL = '/api/read-umur-kec?KDPKAB=' + regionState;
        } else if (regionState.length === 6) {
            fetchURL = '/api/read-umur-all?KDCPUM=' + regionState;
        }

        fetch(fetchURL)
            .then((response) => response.json())
            .then((apiData) => {
                setRegionData(apiData);
                const values = apiData.map(d => parseFloat(d[GetPropertyUmurByFilter(umurType)]));

                const min = Math.min(...values);
                const max = Math.max(...values);

                fetch(`/geojson/${regionState}.geojson`)
                    .then((response) => response.json())
                    .then((geoJsonData) => {
                        const updatedGeoJson = {
                            ...geoJsonData,
                            features: geoJsonData.features.map((feature) => {
                                const matchedData = apiData.find(
                                    (data) => data[GetValueKey(regionState)] === feature.properties[GetValueKey(regionState)]
                                );
                                
                                return {
                                    ...feature,
                                    properties: {
                                        ...feature.properties,
                                        [GetPropertyUmurByFilter(umurType)]: matchedData
                                            ? parseFloat(matchedData[GetPropertyUmurByFilter(umurType)])
                                            : 0,
                                    },
                                };
                            }),
                        };

                        console.log(updatedGeoJson)

                        geoJsonLayer.current = L.geoJSON(updatedGeoJson, {
                            style: (feature) => {
                                const value = feature.properties[GetPropertyUmurByFilter(umurType)];
                                return {
                                    color: value !== null ? getColor(value, min, max) : '#ccc',
                                    weight: 3,
                                    opacity: 0.7,
                                };
                            },
                            onEachFeature: (feature, layer) => {
                                const valueKey = GetValueKey(regionState);
                            
                                if (feature.properties && feature.properties[GetNameKey(regionState)]) {
                                    let value1 = feature.properties[GetPropertyUmurByFilter("1")] ||= 0;
                                    let value2 = feature.properties[GetPropertyUmurByFilter("2")] ||= 0;
                                    let value3 = feature.properties[GetPropertyUmurByFilter("3")] ||= 0;
                                    let value4 = feature.properties[GetPropertyUmurByFilter("4")] ||= 0;
                                    let value5 = feature.properties[GetPropertyUmurByFilter("5")] ||= 0;
                                    let value6 = feature.properties[GetPropertyUmurByFilter("6")] ||= 0;
                                    let value7 = feature.properties[GetPropertyUmurByFilter("7")] ||= 0;
                                    let value8 = feature.properties[GetPropertyUmurByFilter("8")] ||= 0;
                                    let value9 = feature.properties[GetPropertyUmurByFilter("9")] ||= 0;
                                    
                                    layer.bindPopup(
                                        `
                                            <b>${feature.properties[GetNameKey(regionState)]}</b>
                                            <br>Bera : ${value1} Ha\
                                            <br>Penggenangan : ${value2} Ha\
                                            <br>Tanam (1 - 15 HST) : ${value3} Ha\
                                            <br>Vegetatif 1 (1 - 15 HST) : ${value4} Ha\
                                            <br>Vegetatif 2 (1 - 15 HST) : ${value5} Ha\
                                            <br>Maksimum Vegetatif (1 - 15 HST) : ${value6} Ha\
                                            <br>Generatif 1 (1 - 15 HST) : ${value7} Ha\
                                            <br>Generatif 2 (1 - 15 HST) : ${value8} Ha\
                                            <br>Panen (1 - 15 HST) : ${value9} Ha\
                                        `
                                    );
                                }
                            
                                layer.on('click', () => {
                                    if (regionState.length < 6) { // Disable click when regionState length is 6
                                        const nextRegionState = feature.properties[valueKey];
                                        if (nextRegionState) {
                                            setHistory([...history, nextRegionState]);
                                            setRegionState(nextRegionState);
                                        }
                                    } else {
                                        console.warn("Click event disabled: Maximum region depth reached.");
                                    }
                                });
                            },
                        }).addTo(map.current);

                        const bounds = geoJsonLayer.current.getBounds();
                        map.current.fitBounds(bounds);

                        updatingLayer.current = false;
                        setLoading(false); // Hide loading screen
                    })
                    .catch((error) => {
                        console.error("Error loading GeoJSON:", error);
                        updatingLayer.current = false;
                        setLoading(false); // Hide loading screen
                    });
            })
            .catch((error) => {
                console.error("Error fetching API data:", error);
                updatingLayer.current = false;
                setLoading(false); // Hide loading screen
            });
    }, [regionState, umurType]);

    return (
        <div className="map-wrap" style={{ height: "100vh", width: "100%" }}>
            {loading && (
                <div
                    className="loading-screen"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div>Loading...</div>
                </div>
            )}
            <button
                onClick={goBackToPreviousRegion}
                hidden={history.length <= 1}
                style={{
                    zIndex: 1000,
                    padding: "10px",
                    cursor: history.length > 1 ? "pointer" : "not-allowed",
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 bordered bg-gray-50 rounded font-semibold text-xs mobile-xs"
            >
                Kembali ke Wilayah Sebelumnya
            </button>
            
            {/* Display the current zoom level */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 1000,
                }}
                className="font-semibold text-xs rounded px-3 py-2 bg-gray-50"
            >
                Zoom : {zoom}
            </div>

            <div ref={mapContainer} className="map" style={{ height: "100%", width: "100%" }} />

            <div
                style={{ position:'absolute', right:'10px', top:'50px', zIndex:999, backgroundColor:'#f9fafb' }}
                className="rounded p-2"
            >
                <div>
                    <div className="inline-block" style={{backgroundColor:'#ffca91', width:'10px', height:'10px'}}></div>
                    <div className="inline-block ml-2 text-xs">Bera</div>
                </div>
                <div>
                    <div className="inline-block" style={{backgroundColor:'#a8d6e6', width:'10px', height:'10px'}}></div>
                    <div className="inline-block ml-2 text-xs">Pengairan</div>
                </div>
            </div>
        </div>
    );
};
