import { Layout } from "antd";
const { Content } = Layout;

export const LayoutDashboard = ({ children }) => {
    return (
        <Layout className='h-screen'>
            <Content className='w-full h-full flex overflow-hidden'>
                {children}
            </Content>
        </Layout>
    )
}