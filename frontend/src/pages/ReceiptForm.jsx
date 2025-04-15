import { useState, useEffect } from 'react';
import axios from 'axios';

export function ReceiptForm() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
  
    //const API_URL = 'http://localhost:5000/api/items';
    const API_URL = '/api/items'; // Remove the "http://localhost:5000" part
  
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
          await axios.put(`${API_URL}/${editingId}`, { name, description });
          fetchItems();
          resetForm();
        } catch (error) {
          console.error('Erro ao atualizar item:', error);
        }
      } else {
        // Criar novo item
        try {
          await axios.post(API_URL, { name, description });
          fetchItems();
          resetForm();
        } catch (error) {
          console.error('Erro ao criar item:', error);
        }
      }
    };
  
    const handleEdit = (item) => {
      setName(item.name);
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
      setName('');
      setDescription('');
      setEditingId(null);
    };
  
    return (
      <div className="App">
        <h1>CRUD com React + MongoDB</h1>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              <strong>{item.name}</strong> - {item.description}
              <button onClick={() => handleEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item._id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>
    );
}