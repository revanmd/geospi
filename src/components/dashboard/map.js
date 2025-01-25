'use client'
import { useEffect, useRef, useState } from "react";

import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

export const MapDashboard = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geoJsonLayer = useRef(null);
    const [zoom] = useState(8);

    const [regionState, setRegionState] = useState("35");
    const [history, setHistory] = useState(["35"]);
    const updatingLayer = useRef(false);
    const [commodityType, setCommodityType] = useState("1");
    const [fertilizerType, setFertilizerType] = useState("3");

    const [loading, setLoading] = useState(false); // Loading state

    const getColor = (value, min, max) => {
        const red = Math.floor((1 - (value - min) / (max - min)) * 255);
        const green = Math.floor(((value - min) / (max - min)) * 255);
        return `rgb(${red},${green},0)`;
    };

    const getNameKey = (value) => {
        if (value.length === 2) return 'WADMKK';
        if (value.length === 4) return 'WADMKC';
        if (value.length === 6) return 'WADMKD';
        return '';
    };

    const getValueKey = (value) => {
        if (value.length === 2) return 'KDPKAB';
        if (value.length === 4) return 'KDCPUM';
        if (value.length === 6) return 'KDEPUM';
        return '';
    };

    const getPropertyByFilter = (commodity, fertilizer) => {
        if (commodity === "1" && fertilizer === "1") return "padi_urea";
        if (commodity === "1" && fertilizer === "2") return "padi_npk";
        if (commodity === "1" && fertilizer === "3") return "padi_organik";
        if (commodity === "2" && fertilizer === "1") return "jagung_urea";
        if (commodity === "2" && fertilizer === "2") return "jagung_npk";
        if (commodity === "2" && fertilizer === "3") return "jagung_organik";
        if (commodity === "3" && fertilizer === "1") return "tebu_urea";
        if (commodity === "3" && fertilizer === "2") return "tebu_npk";
        if (commodity === "3" && fertilizer === "3") return "tebu_organik";
        return "";
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
                const values = apiData.map(d => parseFloat(d[getPropertyByFilter(commodityType, fertilizerType)]));
                const min = Math.min(...values);
                const max = Math.max(...values);

                fetch(`/geojson/${regionState}.geojson`)
                    .then((response) => response.json())
                    .then((geoJsonData) => {
                        const updatedGeoJson = {
                            ...geoJsonData,
                            features: geoJsonData.features.map((feature) => {
                                const matchedData = apiData.find(
                                    (data) => data[getValueKey(regionState)] === feature.properties[getValueKey(regionState)]
                                );
                                return {
                                    ...feature,
                                    properties: {
                                        ...feature.properties,
                                        [getPropertyByFilter(commodityType, fertilizerType)]: matchedData
                                            ? parseFloat(matchedData[getPropertyByFilter(commodityType, fertilizerType)])
                                            : null,
                                    },
                                };
                            }),
                        };

                        geoJsonLayer.current = L.geoJSON(updatedGeoJson, {
                            style: (feature) => {
                                const value = feature.properties[getPropertyByFilter(commodityType, fertilizerType)];
                                return {
                                    color: value !== null ? getColor(value, min, max) : '#ccc',
                                    weight: 2,
                                    opacity: 0.65,
                                };
                            },
                            onEachFeature: (feature, layer) => {
                                const valueKey = getValueKey(regionState);
                                if (feature.properties && feature.properties[getNameKey(regionState)]) {
                                    const value = feature.properties[getPropertyByFilter(commodityType, fertilizerType)] || 'No data';
                                    layer.bindPopup(
                                        `<b>${feature.properties[getNameKey(regionState)]}</b><br>Value: ${value}`
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
