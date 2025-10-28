// This is the Vercel serverless function entry point
import express from 'express';
import { registerRoutes } from '../server/routes';
import { serveStatic } from '../server/vite';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

// In production, serve static files
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export the Express app as a serverless function
export default async function handler(req, res) {
  // Convert Vercel's request to Express request
  const request = {
    ...req,
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body
  };

  // Convert Express response to Vercel response
  const response = {
    ...res,
    status: (code) => {
      res.statusCode = code;
      return response;
    },
    json: (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    },
    send: (data) => {
      res.end(data);
    }
  };

  // Handle the request
  return new Promise((resolve, reject) => {
    try {
      app(request, response, (err) => {
        if (err) {
          console.error('Request error:', err);
          response.status(500).json({ error: 'Internal Server Error' });
        }
        resolve();
      });
    } catch (error) {
      console.error('Unhandled error:', error);
      response.status(500).json({ error: 'Internal Server Error' });
      resolve();
    }
  });
}
