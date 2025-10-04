(function(){
  const PROD_API_HOST = 'skillful-nature-production.up.railway.app';
  const BASE_URL = (typeof location !== 'undefined' && location.hostname === 'dripyardwebsite.vercel.app')
    ? `https://${PROD_API_HOST}`
    : 'http://localhost:8080';

  function getToken(){
    try { return localStorage.getItem('auth_token') || null; } catch { return null; }
  }
  function setToken(token){
    try { localStorage.setItem('auth_token', token); } catch {}
  }

  async function request(path, { method = 'GET', headers = {}, query = {}, body, auth = true, signal } = {}){
    const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
    if (query && typeof query === 'object') {
      Object.entries(query).forEach(([k,v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
      });
    }
    const finalHeaders = new Headers(headers);
    if (auth) {
      const token = getToken();
      if (token) finalHeaders.set('Authorization', `Bearer ${token}`);
    }
    let bodyToSend = undefined;
    if (body !== undefined && body !== null && !(body instanceof FormData)){
      finalHeaders.set('Content-Type', 'application/json');
      bodyToSend = JSON.stringify(body);
    } else if (body instanceof FormData) {
      // let browser set multipart boundary
    }
    const res = await fetch(url.toString(), { method, headers: finalHeaders, body: bodyToSend ?? body, signal, credentials: 'omit' });
    if (!res.ok) {
      let errText = await res.text().catch(()=>'');
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${errText.slice(0,500)}`);
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return res.text();
  }

  const apiClient = {
    BASE_URL,
    getToken,
    setToken,
    // Auth
    auth: {
      signin: (payload) => request('/auth/signin', { method:'POST', body: payload, auth: false }),
      signup: (payload) => request('/auth/signup', { method:'POST', body: payload, auth: false }),
      sendOtp: (payload) => request('/auth/sent/login-signup-otp', { method:'POST', body: payload, auth: false }),
    },
    // Products
    products: {
      list: (params) => request('/api/products', { query: params, auth: false }),
      get: (productId) => request(`/api/products/${productId}`, { auth: false }),
      reviews: {
        listByProduct: (productId) => request(`/api/products/${productId}/reviews`, { auth: false }),
        create: (productId, payload) => request(`/api/products/${productId}/reviews`, { method:'POST', body: payload }),
      }
    },
    // Cart
    cart: {
      get: () => request('/api/cart'),
      add: (payload) => request('/api/cart/add', { method:'PUT', body: payload }),
      updateItem: (cartItemId, payload) => request(`/api/cart/item/${cartItemId}`, { method:'PUT', body: payload }),
      deleteItem: (cartItemId) => request(`/api/cart/item/${cartItemId}`, { method:'DELETE' }),
    },
    // Wishlist
    wishlist: {
      get: () => request('/api/wishlist'),
      addProduct: (productId) => request(`/api/wishlist/add-product/${productId}`, { method:'POST' }),
      removeProduct: (productId) => request(`/api/wishlist/${productId}`, { method:'DELETE' }),
    },
    // User
    user: {
      getProfile: () => request('/api/users/profile'),
      updateProfile: (payload) => request('/api/users/profile', { method:'PUT', body: payload })
    },
    // Orders
    orders: {
      create: (address) => request('/api/orders/', { method:'POST', body: address }),
      getById: (id) => request(`/api/orders/${id}`),
      cancel: (orderId) => request(`/api/orders/${orderId}/cancel`, { method:'PUT' }),
    },
    // Helpdesk
    helpdesk: {
      submitTicket: (payload) => request('/helpdesk/submit', { method:'POST', body: payload })
    },
    // Admin
    admin: {
      products: {
        list: () => request('/api/admin/products'),
        create: (payload) => request('/api/admin/products', { method:'POST', body: payload }),
        delete: (productId) => request(`/api/admin/products/${productId}`, { method:'DELETE' }),
      },
      orders: {
        list: () => request('/api/admin/orders'),
        updateStatus: (orderId, status) => request(`/api/admin/orders/${orderId}/status`, { method:'PATCH', query: { status } }),
      },
      transactions: {
        list: () => request('/api/admin/transactions')
      },

      coupons: {
        all: () => request('/api/coupons/admin/all'),
        create: (payload) => request('/api/coupons/admin/create', { method:'POST', body: payload }),
        delete: (id) => request(`/api/coupons/admin/delete/${id}`, { method:'DELETE' }),
        apply: ({ apply, code, orderValue }) => request('/api/coupons/apply', { method:'POST', query: { apply, code, orderValue } }),
      }
    }
  };

  // Expose globally for script.js pages
  window.apiClient = apiClient;
})();
