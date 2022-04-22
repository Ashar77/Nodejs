const express = require('express');
const router = express.Router();

const mongoose=require('mongoose');
const Order=require('../models/orders');
const Product = require('../models/products');



router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate('product','name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});





router.post('/',(req,res,next)=>{

  Product.findById(req.body.productId).then(
      product=>{
        if(!product){
          return res.status(404).json({
            "message":"this product do not exist"
          });
        }
        const order = new Order({
          _id:mongoose.Types.ObjectId(),
          quantity:req.body.quantity,
          product:req.body.productId,
      });
      order.save().
      then(result=>{
          console.log(result);
          res.status(201).json({
            message:'order is created',
            createdOrder:{
              id:result._id,
              product:result.product,
              quantity:result.quantity
            },
  
          });
      }).catch(
        err=>{
         console.log(err);
         res.status(500).json({error:err}); 
        }  
      );
      }

  ).catch(err=>{
    res.status(500).json({
      message:"product not found"
    });
  });

    
});





router.get('/:orderId',(req,res,next)=>{
    Order.findById(req.params.orderId).exec().then(


      order=>{if(!order){
        return res.status(404).json({
          message:"this specific order does not exist"
        })
      }
        res.status(200).json(
          {
            message:"this is your specific order",
            order:order,
            requests:{
              "message":"request to get all the orders",
              type:'GET',
              url:'http://localhost/3000/orders'
            }
          }
        )
      }
    ).catch(err=>{
      res.status(500).json({
        error:err
      })
    });
});


// router.delete(':/orderId',(req,res,next)=>{
//     res.status(200).json({
//         message:'Order deleted',
//        // orderId: req.params.orderId,
//     });
// });


router.delete('/:orderId',(req,res,next)=>{
    
  Order.remove({_id:req.params.orderId}).exec().then(
    result=>{
      res.status(200).json({
        message:"order removed!",
        requests:{
          message:"use this link to post the orders",
          type:'POST',
          url:'http://localhost/3000/orders'
        }
      });
    }
  ).catch(err=>{
    res.status(505).json(err)
  })

});




module.exports=router;