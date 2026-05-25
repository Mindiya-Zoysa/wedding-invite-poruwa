import React, { useState, useEffect } from 'react';
import { Users, Download, Heart, UserCheck, UserX, Lock, FileText, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');

  const CORRECT_PIN = '20221218'; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinCode === CORRECT_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPinCode('');
    }
  };

  // --- DASHBOARD DATA STATE ---
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the data ONLY if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRsvps = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/rsvps');
        const data = await response.json();
        setRsvps(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchRsvps();
  }, [isAuthenticated]);

  // Calculate Statistics 
  const totalAttending = rsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + parseInt(r.guest_count || 1), 0);
  const totalDeclined = rsvps.filter(r => r.attending === 'no').length;
  const yasaraSide = rsvps.filter(r => r.attending === 'yes' && r.side === 'yasara').reduce((sum, r) => sum + parseInt(r.guest_count || 1), 0);
  const anuruddhaSide = rsvps.filter(r => r.attending === 'yes' && r.side === 'anuruddha').reduce((sum, r) => sum + parseInt(r.guest_count || 1), 0);

  // --- NEW: FILTER STATE & LOGIC ---
  const [filter, setFilter] = useState('all'); // Options: 'all', 'yes', 'no'

  // --- NEW: DELETE RSVP FUNCTION ---
  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete RSVP?',
      text: `Are you sure you want to permanently delete the RSVP for ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/rsvp/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            // Instantly remove it from the React state without refreshing the page!
            setRsvps(rsvps.filter(rsvp => rsvp.id !== id));
            Swal.fire({ title: 'Deleted!', text: 'The RSVP has been removed.', icon: 'success', confirmButtonColor: '#B59461' });
          } else {
            Swal.fire('Error!', 'Failed to delete the RSVP.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Could not connect to the server.', 'error');
        }
      }
    });
  };

  // This creates a new array of guests based on which button you clicked
  const filteredRsvps = rsvps.filter(rsvp => {
    if (filter === 'all') return true;
    return rsvp.attending === filter;
  });

  // --- 1. RENDER LOGIN SCREEN (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <Lock size={40} color="#B59461" style={{ margin: '0 auto 20px auto' }} />
          <h2 style={{ fontFamily: 'serif', color: '#333', marginBottom: '10px' }}>Admin Access</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Please enter the PIN to view the guest dashboard.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter PIN"
              style={{ width: '100%', padding: '15px', border: '1px solid #DDD', borderRadius: '6px', fontSize: '20px', textAlign: 'center', letterSpacing: '8px', boxSizing: 'border-box', marginBottom: '15px' }}
            />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '-5px', marginBottom: '15px' }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#B59461', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}>
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. RENDER DASHBOARD (If authenticated) ---
  return (
    <div style={{ backgroundColor: '#F4F4F9', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header & Export Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#333', margin: '0 0 5px 0', fontFamily: 'serif' }}>Guest Dashboard</h1>
            <p style={{ color: '#777', margin: 0 }}>Manage your RSVPs for Yashara & Anuruddha's Wedding</p>
          </div>
          
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={`http://127.0.0.1:8000/api/rsvp/export?filter=${filter}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(40, 167, 69, 0.2)' }}
              >
                <Download size={18} /> Excel
              </a>

              <a 
                href={`http://127.0.0.1:8000/api/rsvp/export-pdf?filter=${filter}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(220, 53, 69, 0.2)' }}
              >
                <FileText size={18} /> PDF
              </a>
            </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { title: 'Total Attending', count: totalAttending, icon: <UserCheck size={24} color="#28a745" /> },
            { title: "Yashara's Side", count: yasaraSide, icon: <Heart size={24} color="#e83e8c" /> },
            { title: "Anuruddha's Side", count: anuruddhaSide, icon: <Users size={24} color="#007bff" /> },
            { title: 'Not Attending', count: totalDeclined, icon: <UserX size={24} color="#dc3545" /> }
          ].map((stat, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#F8F9FA', borderRadius: '50%' }}>
                {stat.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{stat.count}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- NEW: FILTER BUTTONS --- */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['all', 'yes', 'no'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1px solid #B59461',
                backgroundColor: filter === f ? '#B59461' : 'transparent',
                color: filter === f ? 'white' : '#B59461',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {f === 'all' ? 'All Guests' : f === 'yes' ? 'Attending Only' : 'Declined Only'}
            </button>
          ))}
        </div>

        {/* Guest Data Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading guests...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#F8F9FA', borderBottom: '2px solid #EAEAEA' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Primary Name</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Phone</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Side</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px', textAlign: 'center' }}>Party Size</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Extra Guests</th>
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px' }}>Message</th>
                    {/* NEW: Action Header */}
                    <th style={{ padding: '15px 20px', color: '#555', fontSize: '14px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} style={{ borderBottom: '1px solid #EAEAEA', backgroundColor: rsvp.attending === 'no' ? '#fcfcfc' : 'white' }}>
                      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: rsvp.attending === 'no' ? '#aaa' : '#333' }}>
                        {rsvp.name} {rsvp.attending === 'no' && <span style={{ color: '#d93025', fontSize: '12px', fontWeight: 'normal', marginLeft: '5px' }}>(Declined)</span>}
                      </td>
                      <td style={{ padding: '15px 20px', color: '#666' }}>{rsvp.phone}</td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ backgroundColor: rsvp.side === 'yasara' ? '#ffe8f0' : '#e8f4ff', color: rsvp.side === 'yasara' ? '#e83e8c' : '#007bff', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {rsvp.side}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: '#B59461' }}>
                        {rsvp.guest_count}
                      </td>
                      <td style={{ padding: '15px 20px', color: '#666', fontSize: '13px' }}>
                        {rsvp.additional_guests && rsvp.additional_guests.length > 0 
                          ? rsvp.additional_guests.join(', ') 
                          : '-'}
                      </td>
                      <td style={{ padding: '15px 20px', color: '#666', fontSize: '13px', maxWidth: '200px' }}>
                        {rsvp.message || '-'}
                      </td>
                      {/* NEW: Action Cell with Delete Button */}
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDelete(rsvp.id, rsvp.name)}
                          style={{ backgroundColor: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', padding: '8px', borderRadius: '5px', transition: 'background-color 0.2s' }}
                          title="Delete RSVP"
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRsvps.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        No guests found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
