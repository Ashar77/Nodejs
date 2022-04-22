const express = require('express');

const app = express();



const morgan = require('morgan');

const bodyParser = require('body-parser');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const mongoose = require('mongoose');

const dbUrl = "mongodb+srv://node-shop:node-shop@node-rest-shop.sp7pk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});



mongoose.Promise=global.Promise;

app.use(morgan('dev'))



app.use(bodyParser.urlencoded({extended:true}));



app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.header("Access-control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
    );

if(req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT','POST','PATCH','DELETE','GET');
     return res.status(200).json({});
}

next();     // 

});


//routes which should handle requests
app.use('/products',productRoutes); //sets up a middleware
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error  = new Error('Not found!');
    error.status=404;
    next(error);    // forward the error request
});

app.use((error,req,res,next)=>{
        res.status(error.status||500);   //500 for other kind of errors
        res.json({
            error:{
                message:error.message,
            }
        });       
});

module.exports=app;









