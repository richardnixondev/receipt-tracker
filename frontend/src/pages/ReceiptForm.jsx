import { useState, useEffect } from 'react';
import axios from 'axios';

export function ReceiptForm() {
    // Estados para a compra (Shopping)
    const [storeName, setStoreName] = useState('');
    const [shoppingTotal, setShoppingTotal] = useState('');
    const [currency, setCurrency] = useState('BRL');
    const [shoppingId, setShoppingId] = useState('');
    
    // Estados para o endereço
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    
    // Estados para os itens
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [editingId, setEditingId] = useState(null);
    
    // Estados para controle da UI
    const [activeTab, setActiveTab] = useState('shopping');
    const [currentShopping, setCurrentShopping] = useState(null);

    const API_URL = '/api';
  
    useEffect(() => {
      fetchShoppings();
    }, []);

    const fetchShoppings = async () => {
      try {
        const response = await axios.get(`${API_URL}/shopping`);
        if (response.data.length > 0) {
          setCurrentShopping(response.data[0].shoppingId);
          fetchItems(response.data[0].shoppingId);
        }
      } catch (error) {
        console.error('Erro ao buscar compras:', error);
      }
    };
  
    const fetchItems = async (shoppingId) => {
      try {
        const response = await axios.get(`${API_URL}/items/${shoppingId}`);
        setItems(response.data);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };

    const handleCreateShopping = async (e) => {
      e.preventDefault();
      
      try {
        const response = await axios.post(`${API_URL}/shopping`, {
          storeName,
          storeAddress: {
            street,
            number,
            city,
            state,
            postalCode
          },
          shoppingTotal,
          currency
        });
        
        setShoppingId(response.data.shoppingId);
        setCurrentShopping(response.data.shoppingId);
        setActiveTab('items');
      } catch (error) {
        console.error('Erro ao criar compra:', error);
      }
    };

    const handleSubmitItem = async (e) => {
      e.preventDefault();
      
      if (!currentShopping) {
        alert('Por favor, crie uma compra primeiro');
        return;
      }
      
      if (editingId) {
        // Atualizar item existente
        try {
          await axios.put(`${API_URL}/items/${editingId}`, { 
            itemName, 
            itemPrice,
            shoppingId: currentShopping
          });
          fetchItems(currentShopping);
          resetItemForm();
        } catch (error) {
          console.error('Erro ao atualizar item:', error);
        }
      } else {
        // Criar novo item
        try {
          await axios.post(`${API_URL}/items`, { 
            itemName, 
            itemPrice,
            shoppingId: currentShopping
          });
          fetchItems(currentShopping);
          resetItemForm();
        } catch (error) {
          console.error('Erro ao criar item:', error);
        }
      }
    };
  
    const handleEditItem = (item) => {
      setItemName(item.itemName);
      setItemPrice(parseFloat(item.itemPrice.toString()));
      setEditingId(item._id);
    };
  
    const handleDeleteItem = async (id) => {
      try {
        await axios.delete(`${API_URL}/items/${id}`);
        fetchItems(currentShopping);
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    };
  
    const resetItemForm = () => {
      setItemName('');
      setItemPrice('');
      setEditingId(null);
    };

    const calculateTotal = () => {
      return items.reduce((total, item) => {
        return total + parseFloat(item.itemPrice.toString());
      }, 0).toFixed(2);
    };
  
    return (
      <div className="App">
        <h1>Receipt Tracker</h1>
        
        <div className="tabs">
          <button 
            onClick={() => setActiveTab('shopping')} 
            className={activeTab === 'shopping' ? 'active' : ''}
          >
            Nova Compra
          </button>
          <button 
            onClick={() => setActiveTab('items')} 
            className={activeTab === 'items' ? 'active' : ''}
            disabled={!currentShopping}
          >
            Itens da Compra
          </button>
        </div>
        
        {activeTab === 'shopping' && (
          <form onSubmit={handleCreateShopping}>
            <h2>Informações da Loja</h2>
            <div>
              <label>Nome da Loja:</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            
            <h3>Endereço</h3>
            <div>
              <label>Rua:</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Número:</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Cidade:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Estado:</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                maxLength="2"
                required
              />
            </div>
            <div>
              <label>CEP (Formato Irlandês H54 -TH98):</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => {
                  // Formatação automática
                  let value = e.target.value.toUpperCase();
                  if (value.length > 3 && !value.includes('-')) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                  }
                  if (value.length > 8) {
                    value = value.slice(0, 8);
                  }
                  setPostalCode(value);
                }}
                pattern="[A-Z0-9]{3}\s?-\s?[A-Z0-9]{4}"
                placeholder="H54 -TH98"
                required
              />
            </div>
            
            <h3>Total da Compra</h3>
            <div>
              <label>Total:</label>
              <input
                type="number"
                step="0.01"
                value={shoppingTotal}
                onChange={(e) => setShoppingTotal(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Moeda:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="BRL">R$ Real Brasileiro</option>
                <option value="USD">US$ Dólar Americano</option>
                <option value="EUR">€ Euro</option>
              </select>
            </div>
            
            <button type="submit">
              Criar Compra
            </button>
          </form>
        )}
        
        {activeTab === 'items' && (
          <>
            <div className="shopping-info">
              <h2>Compra em: {storeName}</h2>
              <p>Total calculado: {currency} {calculateTotal()}</p>
            </div>
            
            <form onSubmit={handleSubmitItem}>
              <h3>Adicionar Item</h3>
              <div>
                <label>Nome do Item:</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Preço:</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
              {editingId && (
                <button type="button" onClick={resetItemForm}>
                  Cancelar
                </button>
              )}
            </form>
            
            <h3>Itens da Compra</h3>
            <ul>
              {items.map((item) => (
                <li key={item._id}>
                  <strong>{item.itemName}</strong> - {currency} {parseFloat(item.itemPrice.toString()).toFixed(2)}
                  <button onClick={() => handleEditItem(item)}>Editar</button>
                  <button onClick={() => handleDeleteItem(item._id)}>Deletar</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
}