"use client"

import { FormatThousandDelimiter, GetNameKey, GetPropertyByFilter, GetPropertyUmurByFilter, GetValueKey } from "@/utility/utility";
import { Col, Divider, Radio, Row, Select } from "antd"
import { useEffect, useState } from "react"

export const ListUmur = ({
    umurType,
    setRegionName,
    setUmurType,
    regionState,
    regionData,
}) => {
    const [dataSource, setDataSource] = useState([])


    useEffect(() => {
        let data = []
        let sum1 = 0
        let sum2 = 0
        let sum3 = 0
        let sum4 = 0
        let sum5 = 0
        let sum6 = 0
        let sum7 = 0
        let sum8 = 0
        let sum9 = 0

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
            sum1 += parseFloat(record[GetPropertyUmurByFilter("1")])
            sum2 += parseFloat(record[GetPropertyUmurByFilter("2")])
            sum3 += parseFloat(record[GetPropertyUmurByFilter("3")])
            sum4 += parseFloat(record[GetPropertyUmurByFilter("4")])
            sum5 += parseFloat(record[GetPropertyUmurByFilter("5")])
            sum6 += parseFloat(record[GetPropertyUmurByFilter("6")])
            sum7 += parseFloat(record[GetPropertyUmurByFilter("7")])
            sum8 += parseFloat(record[GetPropertyUmurByFilter("8")])
            sum9 += parseFloat(record[GetPropertyUmurByFilter("9")])

            let jumlah = record[GetPropertyUmurByFilter(umurType)]
            let nama = record[GetNameKey(regionState)]
            let kode = record[GetValueKey(regionState)]

            data.push({
                kode: kode,
                nama: nama,
                jumlah: jumlah
            })
        });

        sum1 = FormatThousandDelimiter(sum1.toFixed(0))
        sum2 = FormatThousandDelimiter(sum2.toFixed(0))
        sum3 = FormatThousandDelimiter(sum3.toFixed(0))
        sum4 = FormatThousandDelimiter(sum4.toFixed(0))
        sum5 = FormatThousandDelimiter(sum5.toFixed(0))
        sum6 = FormatThousandDelimiter(sum6.toFixed(0))
        sum7 = FormatThousandDelimiter(sum7.toFixed(0))
        sum8 = FormatThousandDelimiter(sum8.toFixed(0))
        sum9 = FormatThousandDelimiter(sum9.toFixed(0))

        // setSummary({
        //     sum1: sum1,
        //     sum2: sum2,
        //     sum3: sum3,
        //     sum4: sum4,
        //     sum5: sum5,
        //     sum6: sum6,
        //     sum7: sum7,
        //     sum8: sum8,
        //     sum9: sum9,
        // })

        const sortedData = data.sort((a, b) => b.jumlah - a.jumlah);
        setDataSource(sortedData)
    }, [regionData])

    return (
        <div>
            <div className="bg-white mt-2 p-4 rounded-lg border">
                <div className="mb-3">
                    <span className="text-sm font-semibold">
                        Umur tanam
                    </span>
                    <br />
                    <span className="text-xs font-normal  text-tertiary">
                        Informasi ini bersifat estimasi dan mungkin mengalami perubahan sesuai dengan kondisi di lapangan.
                    </span>
                </div>


                <p className="font-semibold text-xs mb-2">
                    Waktu Pengambilan :
                </p>
                <div className="flex space-x-2 mb-3">
                    <div className="flex-1">
                        <Select
                            defaultValue={"Desember"}
                            options={[
                                { value: 'Desember', label: 'Desember' }
                            ]}
                            style={{
                                width: '100%'
                            }}
                            size="medium"
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
                            size="medium"
                        />
                    </div>
                </div>

                {/* Option */}
                <Row className="mb-3">
                    <Col span={24}>
                        <p className="font-semibold text-xs mb-2">
                            Fase Tanam :
                        </p>
                    </Col>
                    <Col span={24}>
                        <Select
                            defaultValue={"1"}
                            options={[
                                { value: "1", label: 'Bera' },
                                { value: "2", label: 'Penggenangan' },
                                { value: "3", label: 'Tanam (1- 15 HST)' },
                                { value: "4", label: 'Vegetatif 1 (16 - 30 HST)' },
                                { value: "5", label: 'Vegetatif 2 (31 - 40 HST)' },
                                { value: "6", label: 'Maksimum Vegetatif (41 - 54 HST)' },
                                { value: "7", label: 'Generatif 1 (55 - 71 HST)' },
                                { value: "8", label: 'Generatif 2 (72 - 110 HST)' },
                                { value: "9", label: 'Panen' },
                            ]}
                            style={{
                                width: '100%',
                                zIndex:99999
                            }}
                            size="medium"
                            onChange={(value)=>{
                                setUmurType(value)
                            }}
                        />
                    </Col>
                </Row>
                <Divider />

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
                                    <span className="ml-1">Ha</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}