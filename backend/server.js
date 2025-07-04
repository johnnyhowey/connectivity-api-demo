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
    // console.log removed (`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);
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

// Proxy endpoint for fetching Alloy connector credentials
app.get('/api/alloy/connectors/:connectorId/credentials', async (req, res) => {
    const { connectorId } = req.params;
    const alloyApiUrl = `https://production.runalloy.com/connectors/${connectorId}/credentials`;
    // console.log removed (`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);
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
        console.error('[Backend Proxy] Error calling Alloy API (credentials):', error.response ? { status: error.response.status, data: error.response.data } : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Failed to fetch credentials from Alloy API due to an internal server error.' });
        }
    }
});

// Proxy endpoint for creating a new Alloy connector credential
app.post('/api/alloy/connectors/:connectorId/credentials', async (req, res) => {
  const { connectorId } = req.params;
  const alloyApiUrl = `https://production.runalloy.com/connectors/${connectorId}/credentials`;

  try {
    // Required body for Alloy credential creation
    const credentialBody = {
      userId: "685caa3667f87db99fe20efb", // TODO: Make dynamic if needed
      authenticationType: "oauth2",
      redirectUri: "http://localhost:3000"
    };

    const response = await axios.post(
      alloyApiUrl,
      credentialBody,
      {
        headers: {
          'Authorization': `Bearer ${ALLOY_SERVER_API_KEY}`,
          'x-api-version': '2025-06',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      '[Backend Proxy] Error creating credential:',
      error.response
        ? { status: error.response.status, data: error.response.data }
        : error.message
    );
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        message: 'Failed to create credential via Alloy API due to an internal server error.'
      });
    }
  }
});

// Proxy endpoint for fetching Alloy connector resources
app.get('/api/alloy/connectors/:connectorId/resources', async (req, res) => {
  const { connectorId } = req.params;
  const alloyApiUrl = `https://production.runalloy.com/connectors/${connectorId}/resources`;
  // console.log removed (`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);

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

    // console.log removed (`[Backend Proxy] Received request for: ${req.url}`);
    // console.log removed (`[Backend Proxy] Calling Alloy API: ${alloyApiUrl}`);

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

// Proxy endpoint for executing an Alloy action
app.post('/api/alloy/connectors/:connectorId/actions/:actionId/execute', async (req, res) => {
    const { connectorId, actionId } = req.params;
    let alloyApiUrl = `https://production.runalloy.com/connectors/${connectorId}/actions/${actionId}/execute`;
    const { credentialId, requestBody, queryParameters, pathParameters } = req.body;
    // console.log removed (`[Backend Proxy] Executing Alloy action: ${alloyApiUrl}`);

    // Replace path parameters in the URL if provided
    if (pathParameters && typeof pathParameters === 'object') {
        Object.entries(pathParameters).forEach(([key, value]) => {
            // Replace :key or {key} in the path
            alloyApiUrl = alloyApiUrl.replace(`:${key}`, encodeURIComponent(value));
            alloyApiUrl = alloyApiUrl.replace(`{${key}}`, encodeURIComponent(value));
        });
    }

    // Append query parameters if provided
    if (queryParameters && typeof queryParameters === 'object' && Object.keys(queryParameters).length > 0) {
        const queryString = Object.entries(queryParameters)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        alloyApiUrl += (alloyApiUrl.includes('?') ? '&' : '?') + queryString;
    }

    try {
        // If frontend sends a 'body' property, use it as the post body
        let postBody;
        if (req.body.body && typeof req.body.body === 'object') {
            postBody = req.body.body;
        } else {
            postBody = { credentialId, requestBody, queryParameters, pathParameters };
        }
        const response = await axios.post(alloyApiUrl, postBody, {
            headers: {
                'Authorization': `Bearer ${ALLOY_SERVER_API_KEY}`,
                'x-api-version': '2025-06',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('[Backend Proxy] Error executing Alloy action:', error.response ? { status: error.response.status, data: error.response.data } : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Failed to execute Alloy action due to an internal server error.' });
        }
    }
});

app.listen(port, () => {
  
  // console.log removed (`Server is running on http://localhost:${port}`);
});
