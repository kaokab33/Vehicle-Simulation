import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NameCustomers from './nameCustomers';
import StatusSelect from './statusSelect';
import './vehicles.css';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); 
  const [address, setAddress] = useState('');


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchVehicles = () =>{
    const params = {};
    if (selectedCustomer) params.customerId = selectedCustomer;
    if (selectedStatus) params.status = selectedStatus;

    // eslint-disable-next-line no-undef
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    axios
      .get(`http://localhost:5000/api/v1/vehicles`, { params })
      .then((response) => {
        if (response.data.data.vehicles) {
          setVehicles(response.data.data.vehicles);
        } else if (response.data.data.customer) {
            setAddress(response.data.data.customer.address);
          setVehicles(response.data.data.customer.vehicles);
        } else {
          setVehicles([]);
        }
      })
      .catch((error) => console.error(error));
  }


  useEffect(() => {
    fetchVehicles();  
    const intervalId = setInterval(fetchVehicles, 60000); 
    return () => clearInterval(intervalId);
  }, [fetchVehicles, selectedCustomer, selectedStatus]); 

  return (
    <div className="vehicles-container">
      <div className="filters-bar">
        <NameCustomers onSelect={setSelectedCustomer} />
        <StatusSelect onSelect={setSelectedStatus} />
      </div>

      <div className="vehicles-content">
        <h2>Vehicles List</h2>
        {address && (<h5>Customer Address: {address}</h5>
        )}

        <ul>
         <li >
            <strong>VIN</strong> ———————<strong>RegNr</strong> ——————— Status
            </li>
            </ul>
        {vehicles.length > 0 ? (
          <ul>
            {vehicles.map((v) => (
              <li key={v._id}>
                <strong>{v.vin}</strong> — <strong>{v.regNr}</strong> — {v.status=='Connected'?'🟢':'🔴'}{v.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
