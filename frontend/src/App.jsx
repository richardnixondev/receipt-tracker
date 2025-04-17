// App.js
import { StoreForm } from './pages/StoreForm'
import { ItemForm } from './pages/ItemForm'
import { TravelStoreForm } from './components/TravelStoreForm';

function App() {
  return (
    <div>
      <h1>Sistema de Gerenciamento de Compras</h1>
      <StoreForm />
      <ItemForm />
      <TravelStoreForm />
    </div>
  );
}

export default App;