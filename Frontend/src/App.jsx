import './App.css'
import axios from 'axios' ;
import React from 'react' ;
import productlogo from './assets/productlogo.png'

function App() { 

  const [responseId, setResponseId] = React.useState(""); 
  const [responseState, setResponseState] = React.useState([]); // response state will be in the JSON format 
  const [amount, setAmount] = React.useState(0); // new state for the amount

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src; 

      script.onload = () => {
        resolve(true);
      } 
       
      script.onerror = () => {
        resolve(false);
      } 

      document.body.appendChild(script);
    });
  } 
   
  const createRazorpayOrder = () => {
      let data = JSON.stringify({
        amount: amount * 100, // use the amount from input
        currency: "INR"
      }) 

      let config = {
        method: "post", 
        maxBodyLength: Infinity,
        url: "http://localhost:5000/orders", 
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      } 
       
      axios.request(config) 
      .then((response) => {
        console.log(JSON.stringify(response.data)); 
        handleRazorpayScreen(response.data.amount); 
      }) 
      .catch((error) => {
        console.log("error at", error);
      });
  } 
   
  const handleRazorpayScreen = async (amount) => { 
    const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js"); 

    if(!res) {
      alert("Some error at razorpay screen loading"); 
      return;
    } 
     
    const options = {
      key: 'rzp_test_cPR1sxqoj8c79x',
      amount: amount,
      currency: 'INR', 
      name: 'Rahul Sanjay Kamble',
      description: 'Payment to HopeRise Foundation', 
      image: productlogo, 
      handler: function(response) {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: { 
        name: "Omkar chavan", 
        email: "rohitkamble3018@gmail.com", 
        contact: "9356029604",
      }, 
      theme: {
        color: "#75FDFF"
      } 
    } 

    const paymentObject = new window.Razorpay(options); 
    paymentObject.open();
  } 
   
  const paymentFetch = (e) => {
    e.preventDefault(); 
     
    const paymentId = e.target.paymentId.value; 
     
    axios.get(`http://localhost:5000/payment/${paymentId}`) 
    .then((response) => {
      console.log(response.data); 
      setResponseState(response.data);
    }) 
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
      <h1>Make a Payment</h1>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        placeholder="Enter Amount" 
      />
      <button onClick={() => createRazorpayOrder()}>Pay</button> 
      {responseId && <p>{responseId}</p>} 
      <h1>This is payment verification form</h1> 
      <form onSubmit={paymentFetch}> 
        <input type="text" name="paymentId"></input> 
        <button type="submit">Enter the PaymentId</button>  
         
        {console.log(responseState)}
        {responseState.length !== 0 && ( 
          <ul>  
            <li>Name: {responseState.name}</li>
            <li>Amount: {responseState.amount / 100} Rs.</li> 
            <li>Currency: {responseState.currency}</li> 
            <li>Status: {responseState.status}</li> 
            <li>Method: {responseState.method}</li> 
          </ul>
        )}
      </form>
    </>
  )
}

export default App;
