const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi'); // Adicionando validação com Joi
require('dotenv').config();

const app = express();

// Configuração CORS melhorada
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/receipt_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error('Connection Error MongoDB:', err));

// Schemas e Models
const { Decimal128 } = mongoose.Types;

// Schema para Endereço da Loja
const storeAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  number: { type: String },
  city: { type: String, required: true },
  state: { type: String, maxlength: 2 },
  postalCode: { 
    type: String, 
    match: /^[A-Z0-9]{3}\s?-\s?[A-Z0-9]{4}$/, // Formato irlandês H54 -TH98
    required: true
  }
}, { _id: false });

// Schema para Compra (Shopping)
const shoppingSchema = new mongoose.Schema({
  shoppingId: { 
    type: String, 
    unique: true, 
    default: () => uuidv4() 
  },
  storeName: { type: String, required: true },
  storeAddress: { type: storeAddressSchema, required: true },
  shoppingDate: { 
    type: Date, 
    default: Date.now 
  },
  currency: { 
    type: String, 
    enum: ["BRL", "USD", "EUR"], 
    default: "EUR" 
  },
  shoppingTotal: { 
    type: Decimal128, 
    required: true,
    validate: {
      validator: (value) => parseFloat(value.toString()) > 0,
      message: "Total must be greater than 0"
    }
  }
}, { timestamps: true });

const Shopping = mongoose.model('Shopping', shoppingSchema);

// Schema para Item
const itemSchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true, 
    maxlength: 100,
    trim: true
  },
  itemPrice: { 
    type: Decimal128, 
    required: true,
    validate: {
      validator: (value) => parseFloat(value.toString()) > 0,
      message: "Price must be greater than 0"
    }
  },
  shoppingId: { 
    type: String, 
    required: true,
    index: true 
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// Validação com Joi
const shoppingValidationSchema = Joi.object({
  storeName: Joi.string().required(),
  storeAddress: Joi.object({
    street: Joi.string().required(),
    number: Joi.string().allow(''),
    city: Joi.string().required(),
    state: Joi.string().max(2),
    postalCode: Joi.string().pattern(/^[A-Z0-9]{3}\s?-\s?[A-Z0-9]{4}$/).required()
  }).required(),
  shoppingTotal: Joi.number().positive().required(),
  currency: Joi.string().valid("BRL", "USD", "EUR").default("EUR")
});

const itemValidationSchema = Joi.object({
  itemName: Joi.string().required().max(100),
  itemPrice: Joi.number().positive().required(),
  shoppingId: Joi.string().required()
});

// Middleware de validação
const validateShopping = (req, res, next) => {
  const { error } = shoppingValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateItem = (req, res, next) => {
  const { error } = itemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

// Rotas para Compras (Shopping)
app.post('/api/shopping', validateShopping, async (req, res) => {
  try {
    const newShopping = new Shopping({
      storeName: req.body.storeName,
      storeAddress: {
        ...req.body.storeAddress,
        postalCode: req.body.storeAddress.postalCode.toUpperCase() // Garante maiúsculas
      },
      shoppingTotal: new Decimal128(req.body.shoppingTotal.toString()),
      currency: req.body.currency || "EUR"
    });

    const savedShopping = await newShopping.save();
    res.status(201).json(savedShopping);
  } catch (err) {
    console.error('Error saving shopping:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rotas para Itens
app.post('/api/items', validateItem, async (req, res) => {
  try {
    const shoppingExists = await Shopping.exists({ shoppingId: req.body.shoppingId });
    if (!shoppingExists) {
      return res.status(404).json({ message: "Shopping not found" });
    }

    const newItem = new Item({
      itemName: req.body.itemName.trim(),
      itemPrice: new Decimal128(req.body.itemPrice.toString()),
      shoppingId: req.body.shoppingId
    });

    const savedItem = await newItem.save();
    
    // Atualiza o total da compra
    await updateShoppingTotal(req.body.shoppingId);
    
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error saving item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Função para atualizar o total da compa
async function updateShoppingTotal(shoppingId) {
  const items = await Item.find({ shoppingId });
  const total = items.reduce((sum, item) => sum + parseFloat(item.itemPrice.toString()), 0);
  
  await Shopping.findOneAndUpdate(
    { shoppingId },
    { shoppingTotal: new Decimal128(total.toString()) }
  );
}

// Buscar todos os itens de uma compra
app.get('/api/items/:shoppingId', async (req, res) => {
  try {
    const items = await Item.find({ shoppingId: req.params.shoppingId });
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para buscar uma compa específica
app.get('/api/shopping/:shoppingId', async (req, res) => {
  try {
    const shopping = await Shopping.findOne({ shoppingId: req.params.shoppingId });
    if (!shopping) {
      return res.status(404).json({ message: "Shopping not found" });
    }
    res.json(shopping);
  } catch (err) {
    console.error('Error fetching shopping:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});