import React, { useState } from 'react';
import axios from 'axios';

const Portfolio = () => {
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
        <div>
            <h1>My Portfolio</h1>
            <button onClick={handleDownloadExcel} disabled={loading}>
                {loading ? 'Downloading...' : 'Download Excel'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleDownloadGraph}>Download Investment Graph</button>

        </div>
    );
};

export default Portfolio;
