import axios from "axios";
import { 
  AuthResponse,
  AuthUser,
  LoginData,
  RegisterData
} from "@/types";

const BASE_URL = "http://localhost:5000/api";

// Public API calls
export const publicApi = {
  getAllProducts: async (params?: { page?: number; limit?: number }) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(params?.page || 1),
        limit: String(params?.limit || 10)
      });
      const res = await axios.get(`${BASE_URL}/products?${queryParams}`);
      return {
        products: res.data.products,
        total: res.data.total,
        currentPage: res.data.currentPage
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  searchProducts: async (keyword: string, page = 1, limit = 10) => {
    const res = await axios.get(`${BASE_URL}/products/findByName?keyword=${keyword}&page=${page}&limit=${limit}`);
    return res.data;
  },

  getCategoryProducts: async (category: string, params?: { 
    page?: number; 
    limit?: number;
    priceRange?: string;
  }) => {
    try {
      if (!category) {
        throw new Error('Category is required');
      }
      
      const decodedCategory = decodeURIComponent(category);
      const encodedCategory = encodeURIComponent(decodedCategory);
      const queryParams = new URLSearchParams({
        category: encodedCategory,
        page: String(params?.page || 1),
        limit: String(params?.limit || 5),
        ...(params?.priceRange ? { priceRange: params.priceRange } : {})
      });
      
      const res = await axios.get(`${BASE_URL}/products/category?${queryParams}`);
      
      return {
        products: res.data.products || [],
        total: res.data.total || 0,
        currentPage: res.data.currentPage || 1
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch category products');
      }
      throw new Error('Network error occurred');
    }
  },

  getProduct: async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`);
      return res.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getCustomerById: async (id: string) => {
    const res = await axios.get(`${BASE_URL}/customers/${id}`);
    return res.data;
  },

  getAllCustomers: async () => {
    const res = await axios.get(`${BASE_URL}/customers`);
    return res.data;
  }
};

export const customerApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${BASE_URL}/customers/login`, data);
      const userData: AuthUser = {
        ...res.data.user,
        role: 'customer',
        token: res.data.token
      };
      return {
        user: userData,
        token: res.data.token
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${BASE_URL}/customers/register`, data);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export const adminApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${BASE_URL}/admins/login`, data);
      const userData: AuthUser = {
        ...res.data.user,
        role: 'admin',
        token: res.data.token
      };
      return {
        user: userData,
        token: res.data.token
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Protected API factory
export const createProtectedApi = (token: string) => {
  // Create axios instance with default config
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Add response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear local storage and trigger logout
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return {
    // Cart operations (for customers only)
    cart: {
      get: async () => {
        const res = await api.get('/cart');
        return res.data;
      },
      
      add: async (productId: string) => {
        try {
          const res = await api.post('/cart/add', { productId, quantity: 1 });
          return res.data;
        } catch (error) {
          console.error('Cart add error:', error);
          throw error;
        }
      },
      
      update: async (productId: string, quantity: number) => {
        const res = await api.put('/cart/updateCartItemQuantity', { productId, quantity });
        return res.data.cart;
      },
      
      remove: async (productId: string) => {
        const res = await api.delete('/cart/removeFromCart', { data: { productId } });
        return res.data.cart;
      }
    },

    // Order operations (for customers only)
    orders: {
      create: async (orderData: any) => {
        const res = await api.post('/orders/createOrder', orderData);
        return res.data;
      },
      
      getUserOrders: async () => {
        const res = await api.get('/orders/userOrders');
        return res.data;
      },
      
      getDetails: async (orderId: string) => {
        const res = await api.get(`/orders/userOrderDetails/${orderId}`);
        return res.data;
      },
      
      cancel: async (orderId: string) => {
        const res = await api.put('/orders/cancelOrder', { orderId });
        return res.data;
      }
    },

    // Customer profile operations
    customerProfile: {
      get: async (id: string) => {
        const res = await api.get(`/customers/${id}`);
        return res.data;
      },
      
      update: async (data: any) => {
        const res = await api.put('/customers/update', data);
        return res.data;
      }
    },

    // Admin profile operations
    adminProfile: {
      get: async (id: string) => {
        const res = await api.get(`/admins/${id}`);
        return res.data;
      },
      
      update: async (data: any) => {
        const res = await api.put('/admins/update', data);
        return res.data;
      },

      getAllAdmins: async () => {
        const res = await api.get('/admins');
        return res.data;
      }
    },

    // Admin specific operations
    admin: {
      getAllOrders: async () => {
        const res = await api.get('/orders');
        return res.data;
      },

      updateOrderStatus: async (orderId: string, status: string) => {
        const res = await api.put('/orderProcessing/status', { orderId, status });
        return res.data;
      },

      createProduct: async (productData: any) => {
        const res = await api.post('/products/create', productData);
        return res.data;
      },

      updateProduct: async (id: string, productData: any) => {
        const res = await api.put(`/products/update/${id}`, productData);
        return res.data;
      },

      deleteProduct: async (id: string) => {
        const res = await api.delete(`/products/delete/${id}`);
        return res.data;
      },

      registerAdmin: async (adminData: RegisterData) => {
        const res = await api.post('/admins/register', adminData);
        return res.data;
      },
      
      getAllAdmins: async () => {
        const res = await api.get('/admins');
        return res.data;
      },

      updateAdmin: async (data: any) => {
        const res = await api.put('/admins/update', data);
        return res.data;
      },

      getAdminById: async (id: string) => {
        const res = await api.get(`/admins/${id}`);
        return res.data;
      }
    }
  };
};

// Error handler helper
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access');
    }
    throw new Error(error.response?.data?.message || 'Request failed');
  }
  throw new Error('Network error occurred');
};
