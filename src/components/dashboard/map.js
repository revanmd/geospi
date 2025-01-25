'use client'
import { useEffect, useRef, useState } from "react";

import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { GetNameKey, GetValueKey, GetPropertyByFilter} from "../../utility/utility"

export const MapDashboard = ({
    commodityType,
    fertilizerType,
    setRegionData,
    regionState,
    setRegionState
}) => {
    
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geoJsonLayer = useRef(null);
    const [zoom] = useState(8);

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

        map.current = new L.Map(mapContainer.current, { zoom });

        new MaptilerLayer({
            style: "https://api.maptiler.com/maps/landscape/style.json?key=7f87DPhFubxv6U7zUuCN",
            apiKey: "7f87DPhFubxv6U7zUuCN",
        }).addTo(map.current);
    }, [zoom]);

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
            fetchURL = '/api/read-kab?KDPPUM=' + regionState;
        } else if (regionState.length === 4) {
            fetchURL = '/api/read-kec?KDPKAB=' + regionState;
        } else if (regionState.length === 6) {
            fetchURL = '/api/read-all?KDCPUM=' + regionState;
        }

        fetch(fetchURL)
            .then((response) => response.json())
            .then((apiData) => {
                setRegionData(apiData)
                const values = apiData.map(d => parseFloat(d[GetPropertyByFilter(commodityType, fertilizerType)]));
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
                                        [GetPropertyByFilter(commodityType, fertilizerType)]: matchedData
                                            ? parseFloat(matchedData[GetPropertyByFilter(commodityType, fertilizerType)])
                                            : null,
                                    },
                                };
                            }),
                        };

                        geoJsonLayer.current = L.geoJSON(updatedGeoJson, {
                            style: (feature) => {
                                const value = feature.properties[GetPropertyByFilter(commodityType, fertilizerType)];
                                return {
                                    color: value !== null ? getColor(value, min, max) : '#ccc',
                                    weight: 2,
                                    opacity: 0.65,
                                };
                            },
                            onEachFeature: (feature, layer) => {
                                const valueKey = GetValueKey(regionState);
                                if (feature.properties && feature.properties[GetNameKey(regionState)]) {
                                    const value = feature.properties[GetPropertyByFilter(commodityType, fertilizerType)] || 'No data';
                                    layer.bindPopup(
                                        `<b>${feature.properties[GetNameKey(regionState)]}</b><br>Value: ${value}`
                                    );
                                }

                                layer.on('click', () => {
                                    const nextRegionState = feature.properties[valueKey];
                                    if (nextRegionState) {
                                        setHistory([...history, nextRegionState]);
                                        setRegionState(nextRegionState);
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
    }, [regionState, commodityType, fertilizerType]);

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
            <div ref={mapContainer} className="map" style={{ height: "100%", width: "100%" }} />
        </div>
    );
};
