import './nameCustomers.css'; 

const StatusSelect = ({onSelect}) => {

  return (
    <div className="customer-container">
      <h2>Select a Status</h2>
        <label htmlFor="status-select">Select a Status</label>
      <select 
      id ="status-select"
      className="customer-select"
      defaultValue=""
      onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">All Status</option>
          <option key='Connected' value="Connected">
            Connected
          </option>
          <option key='Disconnected' value="Disconnected">
            Disconnected
          </option>
      </select>
    </div>
  );
};

export default StatusSelect;
