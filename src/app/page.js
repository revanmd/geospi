"use client"

import { LayoutDashboard } from "@/components/layout/layout-dashboard"

import { PiPlant } from "react-icons/pi";
import { IoSunny } from "react-icons/io5";

import dynamic from "next/dynamic"
import { useState } from "react"

// Components
import { ListItem } from "@/components/dashboard/list-item"
import { ListUmur } from "@/components/dashboard/list-umur"
import Switch from "react-switch"


export const LazyMap = dynamic(() =>
    import('../components/dashboard/map').then((mod) => mod.MapDashboard), { ssr: false }
)
export const LazyMapUmur = dynamic(() =>
    import('../components/dashboard/map-umur').then((mod) => mod.MapDashboard), { ssr: false }
)

export default function PageDashboard() {
    const [activeMenu, setActiveMenu] = useState("fertilizer")

    const [umurType, setUmurType] = useState("1")
    const [commodityType, setCommodityType] = useState("1")
    const [fertilizerType, setFertilizerType] = useState("1")

    const [regionState, setRegionState] = useState("35")
    const [regionName, setRegionName] = useState("Prov Jawa Timur")
    const [regionData, setRegionData] = useState([])

    return (
        <LayoutDashboard>
            <div
                className="shadow overflow-auto scroll-container bg-gray-50 list-layer"
            >
                <div className="sign-top"> </div>

                {/* Region Title */}
                <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold sticky top-0 bg-gray-50 py-5 z-10 border-gray">
                        {regionName}
                    </div>

                    <Switch
                        checked={activeMenu == "fertilizer" ? true : false}
                        onChange={(checked) => {
                            if (checked) {
                                setActiveMenu("fertilizer")
                            } else {
                                setActiveMenu("umur")
                            }
                        }}
                        width={60}
                        offColor="#96cd4f"
                        onColor="#58782e"
                        uncheckedIcon={
                            <div style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: 'white'
                            }}>
                                <IoSunny className="text-xl" />
                            </div>
                        }
                        checkedIcon={
                            <div style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <PiPlant className="text-lg text-white" />
                            </div>
                        }

                    />
                </div>

                {
                    activeMenu == "fertilizer" ?
                        (
                            <ListItem
                                regionState={regionState}
                                regionData={regionData}
                                setRegionName={setRegionName}
                                setCommodityType={setCommodityType}
                                setFertilizerType={setFertilizerType}
                                commodityType={commodityType}
                                fertilizerType={fertilizerType}
                            />
                        ) :
                        (
                            <ListUmur
                                umurType={umurType}
                                setUmurType={setUmurType}
                                regionState={regionState}
                                regionData={regionData}
                                setRegionName={setRegionName}
                            />
                        )
                }
            </div>

            {
                activeMenu == "fertilizer" ?
                    (
                        <LazyMap
                            regionState={regionState}
                            setRegionState={setRegionState}
                            commodityType={commodityType}
                            fertilizerType={fertilizerType}
                            setRegionData={setRegionData}
                        />
                    ) :
                    (
                        <LazyMapUmur

                            regionState={regionState}
                            setRegionState={setRegionState}
                            umurType={umurType}
                            setRegionData={setRegionData}
                        />
                    )
            }
        </LayoutDashboard>
    )
}