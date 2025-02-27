"use client"

import { Button, Col, Form, Input, message, Row, Spin } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PageHandler() {
    const router = useRouter()
    const [FormLogin] = Form.useForm()
    const [loading, setLoading] = useState(false)


    const handleLogin = async () => {
        try {
            setLoading(true);
            const values = FormLogin.getFieldsValue();

            const response = await axios.post("/api/auth", {
                username: values.username,
                password: values.password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.data
            if (response.status == 200) {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem("dev-token", 'just-a-dev-token')
                    router.push("/dashboard")
                }
                message.success("Login successful!");
                setLoading(false);
            } else {
                message.error(data.error || "Login failed!");
            }
        } catch (error) {
            console.error("Login error:", error);
            message.error("Invalid username and password");
            setLoading(false);
        }
    };

    return (
        <Spin
            spinning={loading}
        >
            <main>
                <Row>
                    <Col lg={12} span={24} className="bg-white h-screen">

                        <svg viewBox="0 0 720 528" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                            position: 'absolute',
                        }}>
                            <mask id="mask0_544_3979" maskUnits="userSpaceOnUse" x="0" y="-192" width="720" height="720">
                                <g clip-path="url(#clip0_544_3979)">
                                    <path d="M0 -192V528" stroke="#EBEBEB" />
                                    <path d="M80 -192V528" stroke="#EBEBEB" />
                                    <path d="M160 -192V528" stroke="#EBEBEB" />
                                    <path d="M240 -192V528" stroke="#EBEBEB" />
                                    <path d="M320 -192V528" stroke="#EBEBEB" />
                                    <path d="M400 -192V528" stroke="#EBEBEB" />
                                    <path d="M480 -192V528" stroke="#EBEBEB" />
                                    <path d="M560 -192V528" stroke="#EBEBEB" />
                                    <path d="M640 -192V528" stroke="#EBEBEB" />
                                    <path d="M720 -192V528" stroke="#EBEBEB" />
                                    <path d="M0 48H720" stroke="#EBEBEB" />
                                    <path d="M0 128H720" stroke="#EBEBEB" />
                                    <path d="M0 208H720" stroke="#EBEBEB" />
                                    <path d="M0 288H720" stroke="#EBEBEB" />
                                    <path d="M0 368H720" stroke="#EBEBEB" />
                                    <path d="M0 448H720" stroke="#EBEBEB" />
                                    <path d="M0 528H720" stroke="#EBEBEB" />
                                </g>
                            </mask>
                            <g mask="url(#mask0_544_3979)">
                                <circle cx="360" cy="168" r="360" fill="url(#paint0_radial_544_3979)" fill-opacity="0.2" />
                            </g>
                            <defs>
                                <radialGradient id="paint0_radial_544_3979" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(360 168) rotate(90) scale(360)">
                                    <stop stop-color="#005BA2" />
                                    <stop offset="1" stop-color="#005BA2" stop-opacity="0" />
                                </radialGradient>
                                <clipPath id="clip0_544_3979">
                                    <rect width="720" height="720" fill="white" transform="translate(0 -192)" />
                                </clipPath>
                            </defs>
                        </svg>


                        <div className="w-5/6 ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="text-center">
                                <h1 className="text-3xl font-semibold text-black">Selamat Datang</h1>
                                <h2 className="px-8 text-sm text-gray-500 mt-3">Monitor kebutuhan pupuk sesuai umur tanam dan komoditas untuk memudahkan penentuan target yang lebih akurat dan efisien</h2>
                            </div>

                            <div className="w-4/6 ml-auto mr-auto mt-5">
                                <Form
                                    form={FormLogin}
                                    onFinish={handleLogin}
                                    layout="vertical"
                                >
                                    <div className="text-xs mb-2">Username<span className="text-red-500">*</span></div>
                                    <Form.Item
                                        name="username"
                                        rules={[{ 'required': true, }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                    <div className="text-xs mb-2">Password<span className="text-red-500">*</span></div>
                                    <Form.Item
                                        name="password"
                                        rules={[{ 'required': true, }]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>

                                    <button
                                        className="bg-blue-600 w-full py-2 rounded text-white font-semibold mt-5"
                                        style={{ backgroundColor: '#0080FB' }}
                                    >
                                        Masuk
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                    <Col lg={12} span={24} className="disnone">
                        <img className="h-screen w-full" src="sawah.png"></img>

                    </Col>
                </Row>
            </main>
        </Spin>
    )
}