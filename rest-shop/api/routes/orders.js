const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'Orders were feteched',
    });
});

router.post('/',(req,res,next)=>{
    res.status(201).json({
        message:'Orders was created',
    });
});



router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'Orders with specific id is feteched',
        orderId: req.params.orderId,

    });
});


// router.delete(':/orderId',(req,res,next)=>{
//     res.status(200).json({
//         message:'Order deleted',
//        // orderId: req.params.orderId,
//     });
// });


router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'Deleted order!',
        orderId:req.params.orderId,
        
    });
});




module.exports=router;