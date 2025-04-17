// components/StoreForm.js
import { useState } from 'react';
import axios from 'axios';

export function StoreForm() {
  const [nameStore, setNameStore] = useState('');
  const [eirCodeStore, setEirCodeStore] = useState('');
  const [message, setMessage] = useState('');
  
  const API_URL = '/api/stores';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(API_URL, {
        nameStore,
        eirCodeStore
      });
      setMessage('Loja cadastrada com sucesso!');
      setNameStore('');
      setEirCodeStore('');
    } catch (error) {
      setMessage('Erro ao cadastrar loja');
      console.error('Erro:', error);
    }
  };

  const formatEirCode = (value) => {
    let formatted = value.toUpperCase();
    if (formatted.length > 3 && !formatted.includes('-')) {
      formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
    }
    if (formatted.length > 8) {
      formatted = formatted.slice(0, 8);
    }
    return formatted;
  };

  return (
    <div>
      <h2>Cadastro de Lojas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome da Loja:</label>
          <input
            type="text"
            value={nameStore}
            onChange={(e) => setNameStore(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Eircode (Formato H54 -TH98):</label>
          <input
            type="text"
            value={eirCodeStore}
            onChange={(e) => setEirCodeStore(formatEirCode(e.target.value))}
            pattern="[A-Z0-9]{3}\s?-\s?[A-Z0-9]{4}"
            placeholder="H54 -TH98"
            required
          />
        </div>
        <button type="submit">Cadastrar Loja</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}