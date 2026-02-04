// src/Components/Dashboard.tsx
import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Button, Typography } from 'antd'
import frutasImg from '../assets/frutas.png'
import './styles.css'

const API_URL = 'http://localhost:3001'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  fechaCaducidad?: string // se usará la fecha de caducidad
}

interface Movimiento {
  id: number
  productoId: number
  cantidad: number
  fecha: string
}

export default function Dashboard() {

  const [productos, setProductos] = useState<Producto[]>([])
  const [entradas, setEntradas] = useState<Movimiento[]>([])
  const [salidas, setSalidas] = useState<Movimiento[]>([])

  const fetchData = async () => {
    try {
      const [resProductos, resEntradas, resSalidas] = await Promise.all([
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/entradas`),
        fetch(`${API_URL}/salidas`)
      ])
      const [prodData, entData, salData] = await Promise.all([
        resProductos.json(),
        resEntradas.json(),
        resSalidas.json()
      ])

      // Asignar fechaCaducidad por defecto si no existe
      const productosConFechaCaducidad = prodData.map((p: Producto) => {
        if (!p.fechaCaducidad) {
          const fechaDefecto = new Date()
          fechaDefecto.setDate(fechaDefecto.getDate() + 30)
          return { ...p, fechaCaducidad: fechaDefecto.toISOString().split('T')[0] }
        }
        // si tiene fechaCaducidad, solo retornamos el producto
        return p
      })

      setProductos(productosConFechaCaducidad)
      setEntradas(entData)
      setSalidas(salData)
    } catch (err) {
      console.error('Error cargando datos', err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchData()
    }
    loadData()
  }, [])

  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0)

  // Función para obtener tag de fecha de caducidad
  const getStatusTag = (fecha: string) => {
    const hoy = new Date()
    const fechaProd = new Date(fecha)
    const diffDias = Math.ceil((fechaProd.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDias <= 0) return <Tag color="red">Caducado</Tag>
    if (diffDias <= 7) return <Tag color="orange">Por caducar</Tag>
    return <Tag color="green">Vigente</Tag>
  }

  const hoy = new Date()
  const proximo7Dias = new Date()
  proximo7Dias.setDate(hoy.getDate() + 7)

  // Productos por caducar en los próximos 7 días
  const productosPorCaducar = productos.filter(p => {
    const fecha = new Date(p.fechaCaducidad!)
    const diffDias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return diffDias > 0 && diffDias <= 7
  })

  // Productos ya caducados
  const productosCaducados = productos.filter(p => {
    const fecha = new Date(p.fechaCaducidad!)
    return fecha <= hoy
  })

  const columnasMovimientos = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Producto', dataIndex: 'productoId', key: 'productoId', render: (id: number) => {
        const p = productos.find(prod => prod.id === id)
        return p ? p.nombre : id
      }
    },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' }
  ]

  return (
    <div style={{ padding: 24 }}>

<Row align="middle" className="dashboard-hero">
<Col xs={24} md={14} className="dashboard-hero-text">
    <Typography.Title level={2}>
      Bienvenido a FRUTEX
    </Typography.Title>

    <Typography.Paragraph>
      Control rápido de inventario, caducidad y movimientos.
    </Typography.Paragraph>

    <Button className="dashboard-hero-button" type="primary">
      + Ir a productos
    </Button>
  </Col>

  <Col xs={24} md={10}>
    <img
      src={frutasImg}
      alt="Frutas"
      className="dashboard-hero-img"
    />
  </Col>
</Row>


      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card dashboard-card--total-stock">
            <Statistic title="Total Stock" value={totalStock} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card dashboard-card--por-caducar">
            <Statistic
              title="Productos por caducar"
              value={productosPorCaducar.length}
              valueStyle={{ color: productosPorCaducar.length > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card dashboard-card--entradas-recientes">
            <Statistic title="Entradas recientes" value={entradas.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card dashboard-card--salidas-recientes">
            <Statistic title="Salidas recientes" value={salidas.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card className="dashboard-card dashboard-card--ultimas-entradas" title="Últimas Entradas">
            <Table
              dataSource={entradas.slice(-5).reverse()}
              columns={columnasMovimientos}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="dashboard-card dashboard-card--ultimas-salidas" title="Últimas Salidas">
            <Table
              dataSource={salidas.slice(-5).reverse()}
              columns={columnasMovimientos}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card className="dashboard-card dashboard-card--por-caducar-7-dias" title="Productos por caducar en los próximos 7 días">
            <Table
              dataSource={productosPorCaducar}
              columns={[
                { title: 'ID', dataIndex: 'id', key: 'id' },
                { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
                { title: 'Stock', dataIndex: 'stock', key: 'stock' },
                {
                  title: 'Caducidad',
                  dataIndex: 'fechaCaducidad',
                  key: 'fechaCaducidad',
                  render: (fecha: string) => getStatusTag(fecha)
                }
              ]}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="dashboard-card dashboard-card--caducados" title="Productos ya caducados">
            <Table
              dataSource={productosCaducados}
              columns={[
                { title: 'ID', dataIndex: 'id', key: 'id' },
                { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
                { title: 'Stock', dataIndex: 'stock', key: 'stock' },
                {
                  title: 'Caducidad',
                  dataIndex: 'fechaCaducidad',
                  key: 'fechaCaducidad',
                  render: (fecha: string) => getStatusTag(fecha)
                }
              ]}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
