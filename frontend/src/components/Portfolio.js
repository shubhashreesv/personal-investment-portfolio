import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Save, Edit2, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Profile = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Shubha Shree',
    email: 'shubha.sv.shree@gamil.com',
    phone: '+91 9876543210',
    address: '123, XXX Street, Z-City',
    occupation: 'Software Engineer',
    dateJoined: '2024-01-01',
    bio: 'Passionate investor focused on long-term growth and sustainable investments.',
    profilePicture: '',
  investments: [],
    
  });

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

  const downloadInvestmentData = () => {
    const worksheet = XLSX.utils.json_to_sheet(profile.investments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Investments');
    XLSX.writeFile(workbook, 'investment-data.xlsx');
  };

  const totalPortfolioValue = profile.investments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownloadExcel = () => {
    setLoading(true);
    setError(null);  // Reset previous errors

    // Make the request to the public download endpoint without sending credentials
    axios.get('http://localhost:8000/api/download_excel/', {
      responseType: 'blob',  // Ensures we get the file as a blob
    })
    .then(response => {
      if (response.status === 200) {
        // Create a Blob from the response
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'portfolio.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setError('Failed to download the file');
      }
    })
    .catch(error => {
      console.error('Error downloading the file:', error);
      setError('Error downloading the file');
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const handleDownloadGraph = () => {
    axios({
      url: 'http://localhost:8000/api/download_investment_graph/', // The correct URL
      method: 'GET',
      responseType: 'blob', // Ensure the response is treated as a blob
    })
    .then((response) => {
      // Create a URL for the downloaded image
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'investment_graph.png'); // The filename
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.error("Error downloading the graph:", error);
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
              <p className="text-gray-600">{profile.occupation}</p>
            </div>
          </div>
          <div className="space-x-4">
            <button
              className="text-white bg-blue-600 px-4 py-2 rounded-md"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="inline-block mr-2" /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">Profile Picture</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                className="mt-2 p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button type="submit" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md">
              <Save className="inline-block mr-2" /> Save
            </button>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p>{profile.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Phone</h3>
              <p>{profile.phone}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p>{profile.address}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Date Joined</h3>
              <p>{profile.dateJoined}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Investments</h2>
        <div className="mt-4">
          

          

          <div className="mt-6 space-x-4">
            <button
              onClick={handleDownloadExcel}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {loading ? 'Downloading...' : 'Download Excel'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
              onClick={handleDownloadGraph}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Download Investment Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
