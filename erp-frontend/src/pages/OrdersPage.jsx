import AddOrderModal from './AddOrderModal'
import { useState } from 'react'

const OrdersPage = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleSaveOrder = async (orderData) => {
    const token = localStorage.getItem('token')
    await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })
    // optional: neu laden
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        Neuen Auftrag hinzufügen
      </button>

      <AddOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveOrder}
      />
    </>
  )
}

export default OrdersPage
