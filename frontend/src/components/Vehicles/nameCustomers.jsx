import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './nameCustomers.css'; 

const NameCustomers = ({onSelect}) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/customers')
      .then((response) => {
        setCustomers(response.data.data.customers);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="customer-container">
      <h2>Select a Customer</h2>
        <label htmlFor="select-customer">Select a Customer</label>
      <select
      id = "select-customer"
      className="customer-select"
        defaultValue=""
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">All Customers</option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer._id}>
            {customer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NameCustomers;
