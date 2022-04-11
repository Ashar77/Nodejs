const express = require('express');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

app.use('/products',productRoutes); //sets up a middleware
app.use('/orders',orderRoutes);

module.exports=app;