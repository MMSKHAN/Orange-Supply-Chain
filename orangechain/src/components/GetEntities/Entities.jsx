import React, { useEffect, useState } from 'react';
import './Entities.css';
import { PersonCircle } from 'react-bootstrap-icons';

function Entities({ state }) {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('No account Connected yet');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function getAccount() {
      const { web3 } = state;
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    }

    if (state.web3) {
      getAccount();
    }
  }, [state]);

  const entityTypeNames = {
    0: 'Farmer',
    1: 'Wholesaler',
    2: 'Logistics',
    3: 'Retailer',
    4: 'Customer',
  };

  useEffect(() => {
    const fetchEntities = async () => {
      const { contract } = state;

      if (contract) {
        try {
          const fetchedEntities = await contract.methods.getEntity().call();
          setEntities(fetchedEntities);
        } catch (err) {
          console.error('Error fetching entities:', err);
          setError('Failed to fetch entities');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEntities();
  }, [state]);

  const handleAllow = async (Firmadd) => {
    const { contract } = state;
    try {
      await contract.methods.allowEntity(Firmadd).send({ from: address });
      // Refresh entities after allowing
      // fetchEntities();
    } catch (err) {
      console.error('Error allowing entity:', err);
    }
  };

  const handleDisallow = async (Firmadd) => {
    const { contract } = state;
    try {
      await contract.methods.disallowEntity(Firmadd).send({ from: address });
      // Refresh entities after disallowing
      // fetchEntities();
    } catch (err) {
      console.error('Error disallowing entity:', err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEntities = entities.filter(entity =>
    entity.Firmname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.Firmadd.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading entities...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (    
  <>
 <div className='entitiesCon' >
 <h1> Members List </h1>
    <div className='inputdev' ><input
      type="text"
      placeholder="Search Member..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="search-bar"
    />
</div>
        {filteredEntities.length === 0 ? (
      <p>No entities found.</p>
    ) : (
      <div className="cards-container">
        {filteredEntities.map((entity, index) => (
          <div key={index} className="cards">
            <div className="container-card bg-yellow-box">
             <div>
  <PersonCircle style={{color:"white",fontSize:"4rem"}} />
             </div>
           <div>   <p className="card-title">{entity.Firmname}</p>
              <p className="card-description">Wallet Address:  <p> {entity.Firmadd}</p>  </p>
              <p className="card-description">Location: <span>{entity.Firmlocation}</span>  </p>
              <p className="card-description">Owner Name: <span>{entity.ownerName}</span> </p>
              <p className="card-description">Contact: <span>{entity.ownerContact}</span>  </p>
              <p className="card-description">City:  <span>{entity.city}</span> </p>
              <p className="card-description">Type: <span>{entityTypeNames[entity.entityType]}</span> </p>
              <p className="card-description">Status: <span>{entity.isAllowed ? 'Allowed' : 'Disallowed'}</span> </p>
        </div>
                 <button className='allowbtn' onClick={() => entity.isAllowed ? handleDisallow(entity.Firmadd) : handleAllow(entity.Firmadd)}>
                {entity.isAllowed ? 'Disallow' : 'Allow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>


  
  
  </>
  );
}

export default Entities;
