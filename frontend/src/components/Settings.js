import React, { useState, useRef } from 'react';
import { Download, Edit2, Save, Send } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Settings = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emailToSend, setEmailToSend] = useState('');
  const [profile, setProfile] = useState({
    fullName: 'Shubha Shree',
    email: 'shubha.sv.shree@gmail.com',
    phone: '+91 9876543210',
    address: '123, XXX Street, Z-City',
    occupation: 'Software Engineer',
    dateJoined: '2024-01-01',
    bio: 'Passionate investor focused on long-term growth and sustainable investments.',
    profilePicture: '',
    investments: [],
  });

  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadExcel = () => {
    setLoading(true);
    setError(null);
    axios.get('http://localhost:8000/api/download_excel/', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'portfolio.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        setError('Error downloading the file.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownloadGraph = () => {
  setLoading(true);
  setError(null);
  axios.get('http://localhost:8000/api/download_investment_graph/', { responseType: 'blob' })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'investment_graph.png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch(error => {
      console.error('Error downloading the graph:', error);
      setError('Failed to download graph.');
    })
    .finally(() => {
      setLoading(false);
    });
};


  const handleSendExcelByEmail = () => {
    if (!emailToSend) {
      alert('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setEmailStatus(null);
    axios.post('http://localhost:8000/api/email_excel/', { email: emailToSend })
      .then(response => {
        setEmailStatus('Email sent successfully!');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        setEmailStatus('Failed to send email.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [targetEmail, setTargetEmail] = useState('');

  const handleEmailExcel = () => {
    if (!targetEmail) {
      alert("Please enter a valid email address!");
      return;
    }
    axios.post('http://localhost:8000/api/email_excel/', { email: targetEmail })
      .then(response => {
        alert('Email sent successfully!');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Settings</h2>

        {/* Data Management */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Data Management</h3>

          <div className="space-y-4">
            <button
              onClick={handleDownloadExcel}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg shadow-md transition-all hover:bg-blue-700"
            >
              {loading ? 'Downloading...' : <><Download size={20} /> Download Investment History (Excel)</>}
            </button>

            <button
              onClick={handleDownloadGraph}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg shadow-md transition-all hover:bg-blue-700"
            >
              <Download size={20} /> Download Investment Graph
            </button>

            <div style={{ marginTop: '24px' }}>
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="Enter email to send Excel"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full"
              />
              <button
                onClick={handleEmailExcel}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform"
                style={{ marginLeft: '12px' }}
              >
                Email Excel
              </button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Profile</h3>

          <div className="flex items-center gap-6 mb-8">
            <img
              src={profile.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h4 className="text-xl font-semibold text-gray-800">{profile.fullName}</h4>
              <p className="text-gray-600">{profile.occupation}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 text-sm">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="mt-2 p-3 w-full rounded-lg bg-gray-50 border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-2 p-3 w-full rounded-lg bg-gray-50 border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Profile Picture</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  className="mt-2 p-3 w-full rounded-lg bg-gray-50 border border-gray-300 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 w-full py-3 rounded-lg shadow-lg transition-all"
              >
                <Save className="inline-block mr-2" /> Save
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-gray-600">{profile.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-gray-600">{profile.address}</p>
              </div>
              <div>
                <h4 className="font-semibold">Date Joined</h4>
                <p className="text-gray-600">{profile.dateJoined}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg transition-all hover:bg-blue-700"
          >
            <Edit2 className="inline-block mr-2" /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
