import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  sku: string;
  stockQty: number;
  attributes: Record<string, string | number | boolean>;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
}

const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks for products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (filters?: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, String(filters[key]));
      });
    }
    const response = await axios.get(`/api/products?${params}`);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id: string) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async () => {
    const response = await axios.get('/api/categories');
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { setFilters, clearFilters, clearError } = productSlice.actions;
export default productSlice.reducer;
