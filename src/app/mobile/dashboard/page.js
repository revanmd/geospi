"use client"

import dynamic from "next/dynamic"

export const LazyMap = dynamic(() =>
  import('../../../components/dashboard/map').then((mod) => mod.MapDashboard), { ssr: false }
)

export default function MobileDashboardPage(){
    return (
        <div className="w-full h-screen">
             <LazyMap />
        </div>
    )
}