// src/Components/Caducidad.tsx
import { useEffect, useState } from 'react'
import { Table, Tag, message } from 'antd'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  fechaCaducidad: string
}

const API_PRODUCTOS = 'http://localhost:3001/productos'

export default function Caducidad() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_PRODUCTOS)
      const data = await res.json()
      setProductos(data)
    } catch {
      message.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const getStatusTag = (fecha: string) => {
    const hoy = new Date()
    const fechaProd = new Date(fecha)
    const diffDias = Math.ceil((fechaProd.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDias <= 0) return <Tag color="red">Caducado</Tag>
    if (diffDias <= 7) return <Tag color="orange">Por caducar</Tag>
    return <Tag color="green">Vigente</Tag>
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Caducidad',
      dataIndex: 'fechaCaducidad',
      key: 'fechaCaducidad',
      render: (fecha: string) => getStatusTag(fecha)
    }
  ]

  return <Table dataSource={productos} columns={columns} rowKey="id" loading={loading} />
}
