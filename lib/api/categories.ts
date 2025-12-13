import { Category, CategoriesResponse } from '@/types';

const OLX_API_BASE = 'https://www.olx.com.lb/api';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${OLX_API_BASE}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data: CategoriesResponse | Category[] = await response.json();
    
    // The API returns an array directly
    if (Array.isArray(data)) {
      console.log(`✅ Fetched ${data.length} top-level categories from OLX API`);
      return data;
    }
    
    // Handle wrapped response format (if API changes)
    if ('data' in data && Array.isArray(data.data)) {
      console.log(`✅ Fetched ${data.data.length} top-level categories from OLX API`);
      return data.data;
    }

    throw new Error('Invalid response format from categories API');
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
}

export async function findCategoryBySlug(
  categories: Category[],
  slug: string
): Promise<Category | null> {
  const findRecursive = (cats: Category[]): Category | null => {
    for (const cat of cats) {
      if (cat.slug === slug) {
        return cat;
      }
      if (cat.children) {
        const found = findRecursive(cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findRecursive(categories);
}

export function buildCategoryPath(category: Category, categories: Category[]): string[] {
  const path: string[] = [];
  let current: Category | undefined = category;

  const findCategoryById = (cats: Category[], id: number): Category | undefined => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  while (current) {
    path.unshift(current.slug);
    if (current.parentID) {
      current = findCategoryById(categories, current.parentID);
    } else {
      break;
    }
  }

  return path;
}

