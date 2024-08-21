import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import Razorpay from 'razorpay';

const { json, urlencoded } = pkg;

const app = express();
const port = 5000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
res.send("Hello World!");
}) 
 
 
app.post('/orders', async (req, res) => {
    const razorpay = new Razorpay({
        key_id: 'rzp_test_cPR1sxqoj8c79x',
        key_secret: 'wCb1CSnx9qEiHGqWSuQDditn'
    });
     
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "receipt#1", 
        payment_capture: 1
    };
     
    try {
        const response = await razorpay.orders.create(options); 
        res.json({
            order_id: response.id,
            currency: response.currency, 
            amount: response.amount
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}); 

app.get("/payment/:paymentId",async(req,res)=>
{
    const {paymentId}=req.params; 
     
    const razorpay = new Razorpay({
        key_id: 'rzp_test_cPR1sxqoj8c79x',
        key_secret: 'wCb1CSnx9qEiHGqWSuQDditn'
    }); 
     
    try{
        const payment=await razorpay.payments.fetch(paymentId); 
        if(!payment) 
        {
            return res.status(500).json("Error at razorpay loading");
        }  
        const user = { name: "User Name" };
        res.json({ 
            name: user.name,
            status:payment.status, 
            method:payment.method, 
            amount:payment.amount,
            currency:payment.currency,
        })
    } 
    catch(error) 
    {
        res.status(500).json("failed to fetch");
    }

})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});