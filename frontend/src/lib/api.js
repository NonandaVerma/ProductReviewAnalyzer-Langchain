import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
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
    const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
