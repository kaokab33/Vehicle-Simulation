import './App.css';
import { Link } from 'react-router-dom';

function App() {
 return (
      <div className="button-container">
        <Link to="/vehicles" className="btn red">
          Show Vehicles
        </Link>
      </div>
  );
}

export default App;
