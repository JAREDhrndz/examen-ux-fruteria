// src/Components/Entradas.tsx
import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Select, InputNumber, message } from 'antd'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
}

interface Entrada {
  id: number
  productoId: number
  cantidad: number
  fecha: string
}

const API_PRODUCTOS = 'http://localhost:3001/productos'
const API_ENTRADAS = 'http://localhost:3001/entradas'

export default function Entradas() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Cargar productos y entradas
  const fetchDatos = async () => {
    setLoading(true)
    try {
      const [resProd, resEnt] = await Promise.all([fetch(API_PRODUCTOS), fetch(API_ENTRADAS)])
      const dataProd = await resProd.json()
      const dataEnt = await resEnt.json()
      setProductos(dataProd)
      setEntradas(dataEnt)
    } catch {
      message.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatos()
  }, [])

  // Agregar nueva entrada
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const producto = productos.find(p => p.id === values.productoId)
      if (!producto) return

      // Actualizar stock
      await fetch(`${API_PRODUCTOS}/${producto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...producto, stock: producto.stock + values.cantidad })
      })

      // Guardar entrada
      await fetch(API_ENTRADAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, fecha: new Date().toISOString() })
      })

      message.success('Entrada registrada')
      setModalVisible(false)
      form.resetFields()
      fetchDatos()
    } catch {
      message.error('Error al registrar entrada')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Producto', dataIndex: 'productoId', key: 'productoId', render: (id: number) => productos.find(p => p.id === id)?.nombre },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' }
  ]

  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
        Nueva Entrada
      </Button>

      <Table dataSource={entradas} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title="Nueva Entrada"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText="Registrar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="productoId" label="Producto" rules={[{ required: true }]}>
            <Select options={productos.map(p => ({ label: p.nombre, value: p.id }))} />
          </Form.Item>
          <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
