import { useState, useEffect } from 'react';
import axios from 'axios';

export function ReceiptForm() {
    const [items, setItems] = useState([]);
    const [ItemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    //ItemName
    //ItemPrice
   // Currency
   // StoreName
   // StoreAddress
   // ShoppingDate
   // ShoppingId
   // ShoppingTotal







    const [editingId, setEditingId] = useState(null);
    const API_URL = '/api/items';
  
    useEffect(() => {
      fetchItems();
    }, []);
  
    const fetchItems = async () => {
      try {
        const response = await axios.get(API_URL);
        setItems(response.data);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (editingId) {
        // Atualizar item existente
        try {
          await axios.put(`${API_URL}/${editingId}`, { ItemName, description });
          fetchItems();
          resetForm();
        } catch (error) {
          console.error('Erro ao atualizar item:', error);
        }
      } else {
        // Criar novo item
        try {
          await axios.post(API_URL, { ItemName, description });
          fetchItems();
          resetForm();
        } catch (error) {
          console.error('Erro ao criar item:', error);
        }
      }
    };
  
    const handleEdit = (item) => {
      setItemName(item.ItemName);
      setDescription(item.description);
      setEditingId(item._id);
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    };
  
    const resetForm = () => {
      setItemName('');
      setDescription('');
      setEditingId(null);
    };
  
    return (
      <div className="App">
        <h1>Receipt Tracker</h1>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              value={ItemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </form>
  
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <strong>{item.ItemName}</strong> - {item.description}
              <button onClick={() => handleEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item._id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>
    );
}