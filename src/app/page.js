"use client"

import { LayoutDashboard } from "@/components/layout/layout-dashboard"
import dynamic from "next/dynamic"
import { useState } from "react"

// Components
import { ListItem } from "@/components/dashboard/list-item"
export const LazyMap = dynamic(() =>
    import('../components/dashboard/map').then((mod) => mod.MapDashboard), { ssr: false }
)

export default function PageDashboard() {
    const [isSideActive, setIsSideActive] = useState(true)
    const [commodityType, setCommodityType] = useState("1")
    const [fertilizerType, setFertilizerType] = useState("1")

    const [regionState, setRegionState] = useState("35")
    const [regionData, setRegionData] = useState([])

    return (
        <LayoutDashboard>
            {
                isSideActive ?
                    (
                        <ListItem
                            regionState={regionState}
                            regionData={regionData}
                            setCommodityType={setCommodityType}
                            setFertilizerType={setFertilizerType}
                            commodityType={commodityType}
                            fertilizerType={fertilizerType}
                        />
                    ) :
                    (
                        null
                    )
            }

            <LazyMap
                regionState={regionState}
                setRegionState={setRegionState}
                commodityType={commodityType}
                fertilizerType={fertilizerType}
                setRegionData={setRegionData}
            />
        </LayoutDashboard>
    )
}