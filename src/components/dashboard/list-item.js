"use client"

import { FormatThousandDelimiter } from "@/utility/utility";
import { Col, Divider, Radio, Row, Select } from "antd"
import { useEffect, useState } from "react"

export const ListItem = ({
    regionName,
    regionCode,
    regionData,
    setCommodityType,
    setFertilizerType
}) => {

    const [dataSource, setDataSource] = useState([])

    const handleChangeCommomdity = (e) => {
        setCommodityType(e.target.value);
    }

    const handleChangeFertilizer = (e) => {
        setFertilizerType(e.target.value);
    }

    useEffect(() => {
        let data = [
            { kode: 1, nama: "Semarang", jumlah: 1000 },
            { kode: 2, nama: "Pati", jumlah: 891 },
            { kode: 3, nama: "Blora", jumlah: 721 },
            { kode: 4, nama: "Tuban", jumlah: 982 },
            { kode: 1, nama: "Mojokerto", jumlah: 1321 },
            { kode: 2, nama: "Pati", jumlah: 1211 },
            { kode: 3, nama: "Blora", jumlah: 1192 },
            { kode: 4, nama: "Tuban", jumlah: 1283 },
            { kode: 1, nama: "Semarang", jumlah: 920 },
            { kode: 2, nama: "Pati", jumlah: 923 },
        ]

        const sortedData = data.sort((a, b) => b.jumlah - a.jumlah);
        setDataSource(sortedData)


    }, [])

    useEffect(() => {
        console.log(regionCode)
    }, [regionCode])

    return (
        <div
            className="shadow overflow-auto scroll-container bg-gray-50 list-layer"
        >
            {/* Region Title */}
            <div className="text-xl font-semibold mt-5 mb-5">
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
                            defaultValue={1}
                            onChange={handleChangeCommomdity}
                        >
                            <Radio value={1}>Padi</Radio>
                            <Radio value={2}>Jagung</Radio>
                            <Radio value={3}>Tebu</Radio>
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
                            defaultValue={1}
                            onChange={handleChangeFertilizer}
                        >
                            <Radio value={1}>Urea</Radio>
                            <Radio value={2}>NPK</Radio>
                            <Radio value={3}>Organik</Radio>
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
                            4.000 ton
                        </div>
                    </div>
                    <div className="flex justify-between mb-1">
                        <div>
                            NPK
                        </div>
                        <div className="font-semibold">
                            1.200 ton
                        </div>
                    </div>
                    <div className="flex justify-between mb-1">
                        <div>
                            Za
                        </div>
                        <div className="font-semibold">
                            1.321 ton
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

                                    {FormatThousandDelimiter(item.jumlah)}
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