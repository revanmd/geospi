"use client"

import { FormatThousandDelimiter, GetNameKey, GetPropertyByFilter, GetValueKey } from "@/utility/utility";
import { Col, Divider, Radio, Row, Select } from "antd"
import { useEffect, useState } from "react"

export const ListItem = ({
    regionState,
    regionData,
    commodityType,
    fertilizerType,
    setCommodityType,
    setFertilizerType
}) => {

    const [regionName, setRegionName] = useState("Prov. Jawa Timur")
    const [dataSource, setDataSource] = useState([])

    const [summary, setSummary] = useState({
        urea: 0,
        npk: 0,
        organik: 0
    })

    const handleChangeCommodity = (e) => {
        setCommodityType(e.target.value);
    }

    const handleChangeFertilizer = (e) => {
        setFertilizerType(e.target.value);
    }

    useEffect(() => {
        let data = []
        let sumUrea = 0
        let sumNPK = 0
        let sumOrganik = 0

        let regionName = ""
        for (let index = 0; index < regionData.length; index++) {
            // regionstate == 2
            if (regionState.length == 2) {
                regionName = "Prov. Jawa Timur"
                break
            }

            // regionstate == 4
            if (regionState.length == 4) {
                if (regionData[index].KDPKAB == regionState) {
                    regionName = regionData[index].WADMKK
                    break
                }
            }

            // regionstate == 6
            if (regionState.length == 6) {
                if (regionData[index].KDCPUM == regionState) {
                    regionName = regionData[index].WADMKC
                    break
                }
            }
        }
        setRegionName(regionName)

        regionData.forEach(record => {
            sumUrea += parseFloat(record[GetPropertyByFilter(commodityType, "1")])
            sumNPK += parseFloat(record[GetPropertyByFilter(commodityType, "2")])
            sumOrganik += parseFloat(record[GetPropertyByFilter(commodityType, "3")])

            let jumlah = record[GetPropertyByFilter(commodityType, fertilizerType)] / 1000
            let nama = record[GetNameKey(regionState)]
            let kode = record[GetValueKey(regionState)]

            data.push({
                kode: kode,
                nama: nama,
                jumlah: jumlah
            })
        });
        
        sumUrea = FormatThousandDelimiter((sumUrea/1000).toFixed(0))
        sumNPK = FormatThousandDelimiter((sumNPK/1000).toFixed(0))
        sumOrganik = FormatThousandDelimiter((sumOrganik/1000).toFixed(0))

        setSummary({
            urea: sumUrea,
            npk: sumNPK,
            organik: sumOrganik
        })

        const sortedData = data.sort((a, b) => b.jumlah - a.jumlah);
        setDataSource(sortedData)
    }, [regionData])


    return (
        <div
            className="shadow overflow-auto scroll-container bg-gray-50 list-layer"
        >
            <div className="sign-top"> </div>

            {/* Region Title */}
            <div className="text-xl font-semibold sticky top-0 bg-gray-50 py-5 z-10 border-gray">
                {regionName}
            </div>

            <div className="flex space-x-2">
                <div className="flex-1">
                    <Select
                        defaultValue={"Desember"}
                        options={[
                            { value: 'Desember', label: 'Desember' }
                        ]}
                        style={{
                            width: '100%'
                        }}
                        size="large"
                    />
                </div>
                <div className="flex-1/2">
                    <Select
                        defaultValue={"2024"}
                        options={[
                            { value: '2024', label: '2024' }
                        ]}
                        style={{
                            width: '100%'
                        }}
                        size="large"
                    />
                </div>
            </div>


            {/* Card Box */}
            <div
                className="mt-3 bg-white p-4 rounded-lg border"
            >
                {/* Option */}
                <Row>
                    <Col span={24}>
                        <p className="font-semibold text-sm mb-2">
                            Komoditas :
                        </p>
                    </Col>
                    <Col span={24}>
                        <Radio.Group
                            block
                            defaultValue={"1"}
                            onChange={handleChangeCommodity}
                        >
                            <Radio value={"1"}>Padi</Radio>
                            <Radio value={"2"}>Jagung</Radio>
                            <Radio value={"3"}>Tebu</Radio>
                        </Radio.Group>
                    </Col>
                    <Col span={24}>
                        <p className="font-semibold text-sm mt-4 mb-2">
                            Jenis Pupuk :
                        </p>
                    </Col>
                    <Col span={24}>
                        <Radio.Group
                            block
                            defaultValue={"1"}
                            onChange={handleChangeFertilizer}
                        >
                            <Radio value={"1"}>Urea</Radio>
                            <Radio value={"2"}>NPK</Radio>
                            <Radio value={"3"}>Organik</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Divider />


                <div className="mb-3">
                    <span className="text-sm font-semibold">
                        Kebutuhan Pupuk (kg)
                    </span>
                    <br />
                    <span className="text-xs font-normal  text-tertiary">
                        Informasi ini bersifat estimasi dan mungkin mengalami perubahan sesuai dengan kondisi di lapangan.
                    </span>
                </div>



                {/* Fertilizer Need Detail */}
                <div className="p-3 rounded-lg mb-3 font-semibold"
                    style={{
                        backgroundColor: '#EBF9FF'
                    }}
                >
                    <h2 className="text-sm text-blue-500 mb-3">
                        Kebutuhan Total
                    </h2>
                    <hr></hr>
                    <div className="flex justify-between mt-3 mb-1">
                        <div>
                            Urea
                        </div>
                        <div className="font-semibold">
                            {summary?.urea} ton
                        </div>
                    </div>
                    <div className="flex justify-between mb-1">
                        <div>
                            NPK
                        </div>
                        <div className="font-semibold">
                            {summary?.npk} ton
                        </div>
                    </div>
                    <div className="flex justify-between mb-1">
                        <div>
                            Organik
                        </div>
                        <div className="font-semibold">
                            {summary?.organik} ton
                        </div>
                    </div>
                </div>



                {/* Region List  */}
                <div className="m-2">
                    {dataSource.map((item) => {
                        return (
                            <div className="flex justify-between mb-1 text-xs" key={item.key} >
                                <div className="">
                                    {item.nama}
                                </div>
                                <div className="">

                                    {FormatThousandDelimiter(item?.jumlah ? item.jumlah : 0)}
                                    <span className="ml-1">ton</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}