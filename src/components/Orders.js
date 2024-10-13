import React, { useEffect, useState } from 'react';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newClothes, setNewClothes] = useState('');
  const [newSaree, setNewSaree] = useState('');
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://home-backend-0zfs.onrender.com/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setNewStatus(orders[index].status);
  };

  const handleSaveClick = async (index) => {
    try {
      const updatedOrder = { ...orders[index], status: newStatus };
      const response = await fetch(`https://home-backend-0zfs.onrender.com/update-order/${orders[index]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        const updatedOrders = [...orders];
        updatedOrders[index] = updatedOrder;
        setOrders(updatedOrders);
        setEditingIndex(null);
        setNewStatus('');
      } else {
        console.error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleAddEntry = async () => {
    const newOrder = {
      date: newDate,
      clothes: parseInt(newClothes) || 0,
      saree: parseInt(newSaree) || 0,
      status: 'Given',
    };
    try {
      const response = await fetch('https://home-backend-0zfs.onrender.com/add-order', {
        method: 'POST',
        body: JSON.stringify(newOrder),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const savedOrder = await response.json();
        setOrders([...orders, savedOrder]);
        setNewDate('');
        setNewClothes('');
        setNewSaree('');
        setShowAddEntryForm(false);
      } else {
        console.error('Failed to add new order');
      }
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>
                    <div className="items-container">
                      <div className="item-count">Clothes: {order.clothes}</div>
                      <div className="item-count">Saree: {order.saree}</div>
                    </div>
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <select 
                        value={newStatus} 
                        onChange={handleStatusChange}
                        className="status-select"
                      >
                        <option value="Given">Given</option>
                        <option value="Received">Received</option>
                        <option value="Paid">Paid</option>
                      </select>
                    ) : (
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <button onClick={() => handleSaveClick(index)} className="btn btn-save">Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(index)} className="btn btn-edit">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders yet</p>
      )}
      <button 
        onClick={() => setShowAddEntryForm(!showAddEntryForm)}
        className="btn btn-add"
      >
        {showAddEntryForm ? 'Cancel' : 'Add Entry'}
      </button>

      {showAddEntryForm && (
        <div className="add-entry-form">
          <h3>Add New Order</h3>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Clothes"
            value={newClothes}
            onChange={(e) => setNewClothes(e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Saree"
            value={newSaree}
            onChange={(e) => setNewSaree(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAddEntry} className="btn btn-submit">Add Entry</button>
        </div>
      )}
    </div>
  );
}