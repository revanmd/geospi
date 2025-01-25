"use client"

import { LayoutDashboard } from "@/components/layout/layout-dashboard"
import dynamic from "next/dynamic"
import { useState } from "react"

// Components
import { ListItem } from "@/components/dashboard/list-item"
export const LazyMap = dynamic(() =>
  import('../../components/dashboard/map').then((mod) => mod.MapDashboard), { ssr: false }
)

export default function PageDashboard() {
    const [isSideActive, setIsSideActive] = useState(true, )
    const [currentRegion, setCurrentRegion] = useState({
        name: 'Jawa Timur',
        code: '35'
    })
    const [commodityType, setCommodityType] = useState()
    const [fertilizerType, setFertilizerType] = useState()

    const [regionState, setRegionState] = useState("35")
    const [regionData, setRegionData] = useState()

    return (
        <LayoutDashboard>
            {
            isSideActive ? 
                (
                    <ListItem
                        regionCode={currentRegion?.code}
                        regionName={currentRegion?.name}
                        regionData={regionData}
                        setCommodityType={setCommodityType}
                        setFertilizerType={setFertilizerType}
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
                setCurrentRegion={setCurrentRegion}
            />
        </LayoutDashboard>
    )
}