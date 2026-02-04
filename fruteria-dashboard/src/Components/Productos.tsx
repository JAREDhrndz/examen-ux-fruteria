// src/Components/Productos.tsx
import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Space } from 'antd'
import dayjs from 'dayjs'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  fechaCaducidad?: string
}

const API_URL = 'http://localhost:3001/productos'

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [form] = Form.useForm()

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setProductos(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const openModal = (producto?: Producto) => {
    setEditingProducto(producto || null)
    form.setFieldsValue({
      ...producto,
      fechaCaducidad: producto?.fechaCaducidad ? dayjs(producto.fechaCaducidad) : null
    })
    setModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        fechaCaducidad: values.fechaCaducidad
          ? values.fechaCaducidad.format('YYYY-MM-DD')
          : dayjs().add(30, 'day').format('YYYY-MM-DD')
      }

      if (editingProducto) {
        await fetch(`${API_URL}/${editingProducto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        message.success('Producto actualizado')
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        message.success('Producto agregado')
      }
      setModalVisible(false)
      fetchProductos()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error('Error al guardar producto')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      message.success('Producto eliminado')
      fetchProductos()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error('Error al eliminar producto')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Caducidad', dataIndex: 'fechaCaducidad', key: 'fechaCaducidad' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: unknown, record: Producto) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>Editar</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Eliminar</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Nuevo Producto
      </Button>
      <Table dataSource={productos} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingresa un nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="precio" label="Precio" rules={[{ required: true, message: 'Ingresa un precio' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Ingresa el stock' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="fechaCaducidad" label="Fecha de Caducidad">
            <DatePicker
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
