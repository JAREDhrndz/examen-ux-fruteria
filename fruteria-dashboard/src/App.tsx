import { useState } from 'react'
import { Layout, Menu } from 'antd'
import Productos from './Components/Productos'
import Dashboard from './Components/Dashboard'
import Entradas from './Components/Entradas'
import Salidas from './Components/Salidas'
import Caducidad from './Components/Caducidad'
import './Components/styles.css'

const { Header, Sider, Content } = Layout

function App() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'productos', label: 'Productos' },
  { key: 'entradas', label: 'Entradas' },
  { key: 'salidas', label: 'Salidas' },
  { key: 'caducidad', label: 'Caducidad' },
]
  return (
    <Layout style={{ minHeight: '100vh' }}>
<Sider className="app-sider">
  <div style={{ 
    color: '#475c3f', 
    padding: 16, 
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'}}>
    FRUTEX
  </div>

<Menu
  theme="dark"
  mode="inline"
  items={menuItems}
  selectedKeys={[selectedMenu]}
  onClick={(e) => setSelectedMenu(e.key)}
/>

</Sider>


      <Layout>
        <Header style={{ 
          background: '#ffffff00', 
          fontSize: 24, paddingLeft: 24 }}>
          {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)}
        </Header>

        <Content style={{margin: 16,}}>
          {selectedMenu === 'productos' && <Productos />}
          {selectedMenu === 'dashboard' && <Dashboard />}
          {selectedMenu === 'entradas' && <Entradas />}
          {selectedMenu === 'salidas' && <Salidas />}
          {selectedMenu === 'caducidad' && <Caducidad />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
