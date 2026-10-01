import axios from 'axios';

// Same-origin now: everything goes through this app's own Route Handlers
// under /api/*, which read the httpOnly session cookie server-side and
// proxy to FastAPI with the Bearer header attached. The browser never
// talks to FastAPI (:8000) directly anymore.
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all product ledgers from MongoDB Atlas
 */
export const getProducts = async () => {
  try {
    const res = await api.get('/api/products');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch products from backend:', err);
    return { status: 'error', products: [] };
  }
};

/**
 * Ingest CSV review file
 */
export const uploadCsvFile = async (file, productName, category) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('product_name', productName);
  formData.append('category', category);

  try {
    // Let axios/the browser set Content-Type (with boundary) for FormData —
    // do not set it manually, it will be missing the boundary.
    const res = await api.post('/api/upload', formData);
    return res.data;
  } catch (err) {
    console.error('Failed to upload CSV file:', err);
    throw err;
  }
};

/**
 * Update PM decision status ('Under Review', 'Approved', 'Flagged for R&D', 'Decision Finished')
 */
export const updateProductStatus = async (productId, status) => {
  try {
    const res = await api.post('/api/status', {
      product_id: productId,
      status: status,
    });
    return res.data;
  } catch (err) {
    console.error('Failed to update product status:', err);
    throw err;
  }
};

/**
 * Send QA question to RAG Chat Assistant
 */
export const sendChatQuestion = async (productId, question) => {
  try {
    const res = await api.post('/api/chat', {
      product_id: productId,
      question: question,
    });
    return res.data;
  } catch (err) {
    console.error('Failed to send chat question:', err);
    throw err;
  }
};

export default api;
