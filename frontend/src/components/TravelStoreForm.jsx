// components/TravelStoreForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function TravelStoreForm() {
  const [storeName, setStoreName] = useState('');
  const [dateShop, setDateShop] = useState(new Date().toISOString().split('T')[0]);
  const [idShop, setIdShop] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  
  const API_URL = '/api/travelstores';
  const STORES_URL = '/api/stores';
  const ITEMS_URL = '/api/items';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, itemsRes] = await Promise.all([
          axios.get(STORES_URL),
          axios.get(ITEMS_URL)
        ]);
        setStores(storesRes.data);
        setItems(itemsRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleStoreChange = (e) => {
    const selectedStoreId = e.target.value;
    setIdShop(selectedStoreId);
    
    const selectedStore = stores.find(store => store._id === selectedStoreId);
    if (selectedStore) {
      setStoreName(`${selectedStore.nameStore} - ${selectedStore.eirCodeStore}`);
    }
  };

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(API_URL, {
        storeName,
        dateShop,
        idShop,
        items: selectedItems
      });
      setMessage('Compra registrada com sucesso!');
      setStoreName('');
      setDateShop(new Date().toISOString().split('T')[0]);
      setIdShop('');
      setSelectedItems([]);
    } catch (error) {
      setMessage('Erro ao registrar compra');
      console.error('Erro:', error);
    }
  };

  return (
    <div>
      <h2>Registro de Compras</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Loja:</label>
          <select
            value={idShop}
            onChange={handleStoreChange}
            required
          >
            <option value="">Selecione uma loja</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>
                {store.nameStore} - {store.eirCodeStore}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Data da Compra:</label>
          <input
            type="date"
            value={dateShop}
            onChange={(e) => setDateShop(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Itens Disponíveis:</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {items.filter(item => item.idShopItem === idShop).map(item => (
              <div key={item._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleItemToggle(item._id)}
                  />
                  {item.itemName} - €{item.itemValue.toFixed(2)}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Registrar Compra</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}