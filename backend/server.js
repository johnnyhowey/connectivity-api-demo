const express = require('express');
const cors = require('cors');
const axios = require('axios'); // For making HTTP requests

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!' });
});

// TODO: Move this to an environment variable (e.g., process.env.ALLOY_SERVER_API_KEY)
const ALLOY_SERVER_API_KEY = '4rPcWl3CzsZzufO_hOzcx'; // Replace with your actual server-side Alloy API key

// Proxy endpoint for fetching all Alloy connectors
app.get('/api/alloy/connectors', async (req, res) => {
    const alloyApiUrl = 'https://production.runalloy.com/connectors';
    console.log(`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);
    try {
        const response = await axios.get(alloyApiUrl, {
            headers: {
                'Authorization': `Bearer ${ALLOY_SERVER_API_KEY}`,
                'x-api-version': '2025-06',
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('[Backend Proxy] Error calling Alloy API:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Failed to fetch connectors from Alloy API due to an internal server error.' });
        }
    }
});

// Proxy endpoint for fetching Alloy connector resources
app.get('/api/alloy/connectors/:connectorId/resources', async (req, res) => {
    const { connectorId } = req.params;
    const alloyApiUrl = `https://production.runalloy.com/connectors/${connectorId}/resources`;
    console.log(`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);
    try {
        const response = await axios.get(alloyApiUrl, {
            headers: {
                'Authorization': `Bearer ${ALLOY_SERVER_API_KEY}`,
                'x-api-version': '2025-06',
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('[Backend Proxy] Error calling Alloy API:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Failed to fetch resources from Alloy API due to an internal server error.' });
        }
    }
});

// Proxy endpoint for fetching Alloy connector action schema
app.get('/api/alloy/connectors/:connectorId/actions/:actionId', async (req, res) => {
    const { connectorId, actionId } = req.params;
    const alloyApiUrl = `https://production.runalloy.com/connectors/${connectorId}/actions/${actionId}`;

    console.log(`[Backend Proxy] Received request for: ${req.url}`);
    console.log(`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);

    try {
        const response = await axios.get(alloyApiUrl, {
            headers: {
                'Authorization': `Bearer ${ALLOY_SERVER_API_KEY}`,
                'x-api-version': '2025-06',
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('[Backend Proxy] Error calling Alloy API:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Failed to fetch action schema from Alloy API due to an internal server error.' });
        }
    }
});

app.listen(port, () => {
  
  console.log(`Server is running on http://localhost:${port}`);
});
