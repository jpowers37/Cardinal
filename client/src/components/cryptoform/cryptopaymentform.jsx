import React, { useState } from 'react';
//import './cryptopaymentsform.css';

const CryptoPaymentsForm = () => {

	const [amount, setAmount] = useState(0); // new line

	const [destinationAddress, setDestinationAddress] = useState(""); // new line

	const startPayment = async (event) => { // removed type annotation

		console.log({amount, destinationAddress});

	}

	return (

		<div className="m-5 p-5 card shadow text-center">


			<input type="number" placeholder="Amount" value={amount} className="col-12 form-control mb-3" onChange={event => {setAmount(Number.parseFloat(event.target.value))}} />

			<input placeholder="Destination address" value={destinationAddress} className="col-12 form-control mb-3" onChange={event => {setDestinationAddress(event.target.value)}} />

			<button className="col-12 btn btn-primary" onClick={startPayment}>

				Send Payment

			</button>

		</div>

	);

}

export default CryptoPaymentsForm;
