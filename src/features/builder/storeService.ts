import type { ServerStore, TemplateId, Block, Product } from './types';

interface ErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'Произошла непредвиденная ошибка при запросе к магазину';
    try {
      const data = (await res.json()) as ErrorResponse;
      if (data?.error?.message) {
        errorMessage = data.error.message;
      }
    } catch {
      // Игнорируем ошибку парсинга
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

export interface CreateStoreInput {
  name: string;
  slug: string;
  accentColor?: string;
  templateId?: TemplateId;
}

export interface UpdateStoreInput {
  name?: string;
  accentColor?: string;
  templateId?: TemplateId;
  blocks?: Block[];
  isPublished?: boolean;
}

export interface AddProductInput {
  name: string;
  price: number;
  description?: string;
}

export const storeService = {
  async getMyStore(): Promise<ServerStore | null> {
    try {
      const res = await fetch('/api/stores/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 404) {
        return null;
      }

      const data = await handleResponse<{ store: ServerStore }>(res);
      return data.store;
    } catch (err) {
      if (err instanceof Error && err.message.includes('не найден')) {
        return null;
      }
      throw err;
    }
  },

  async createStore(input: CreateStoreInput): Promise<ServerStore> {
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    const data = await handleResponse<{ store: ServerStore }>(res);
    return data.store;
  },

  async updateStore(input: UpdateStoreInput): Promise<ServerStore> {
    const res = await fetch('/api/stores/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    const data = await handleResponse<{ store: ServerStore }>(res);
    return data.store;
  },

  async addProduct(input: AddProductInput): Promise<Product> {
    const res = await fetch('/api/stores/me/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    const data = await handleResponse<{ product: Product }>(res);
    return data.product;
  },

  async deleteProduct(productId: string): Promise<void> {
    const res = await fetch(`/api/stores/me/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      await handleResponse(res);
    }
  },
};
