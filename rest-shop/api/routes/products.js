const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/products');
const multer = require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');  
    },
    filename:function(req,file,cb){
        cb(null,  new Date().toISOString()+  file.originalfilename,)
    },
});



// const fileFilter=(req,res,cb)=>{
//     //reject file 
//     if(file.mimetype==='image/jpeg' || file.mimetype==='image/png')
//     {cb(null,false);}else{
//         //accept file
//     cb(null,true);
//     }
// };






const upload=multer({  
    
storage:storage,
limits:{
    fileSize:1024*1024*5,
}    // fileFilter:fileFilter

});




router.get('/',(req,res,next)=>{
    Product.find().select('name price _id').exec().then(
        docs=>{
             
            const response={
                count:docs.length,
                products:docs.map(doc=>{
                    return{
                        name:doc.name,
                        price:doc.price,
                        _id:doc._id,
                        requests:{
                            type:'GET',
                            url:'http://localhost:3000/products/'+doc._id        
                        },
                    };
                }),
            };

            console.log(docs);
            res.status(200).json(response);

        }
    ).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});




router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price,
    // };

    const product = new Product({

        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:"created product successfully",
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                requests:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result._id,
                }

                
            },
        });
    }).catch(err=>{console.log(err),
    res.status(500).json({
        error:err
    })});


});




router.get('/:productId',(req,res,next)=>{
        const id  = req.params.productId;
         Product.findById(id).select('name price _id').exec().then(doc=>{

            if(doc){
             console.log("from database",doc);
             res.status(200).json(
                 {product:doc,
                  request:{
                      type:'GET',
                      description:'get all products',
                      url:'http://localhost:3000/products/',
                  },  
                }
             );

            }else{
                res.status(404).json({
                    message:"no valid entry found for the given id"
                })
            }

             
        }).catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err,  
                message:"invalid id"              
            });
        });
});

router.patch('/:productId',(req,res,next)=>{

    const id = req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set:updateOps}).exec().then(
            result=>{
                console.log(result);
                res.status(200).json(result);
            }
    ).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
    

    
}


);

router.delete('/:productId',(req,res,next)=>{
    
    const id = req.params.productId;
    Product.remove({
        _id:id,

    }).exec().then(
        result=>{
            res.status(200).json({
                message:'product deleted',
                requests:{
                    type:'POST',
                    description:'post the products',
                    url:'http://localhost:3000/products',
                },
            });
        })
        .catch(err=>{
        console.log(err);
        res.status(500).json({
            erssror:err,
            check:"checking..."
        });
    });


});





module.exports=router;