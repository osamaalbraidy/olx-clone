import { CategoryField, CategoryFieldsResponse } from '@/types';

const OLX_API_BASE = 'https://www.olx.com.lb/api';

export interface CategoryFieldsParams {
  categorySlugs: string;
  includeChildCategories?: boolean;
  splitByCategoryIDs?: boolean;
  flatChoices?: boolean;
  groupChoicesBySection?: boolean;
  flat?: boolean;
}

export async function fetchCategoryFields(
  params: CategoryFieldsParams
): Promise<CategoryField[]> {
  try {
    const queryParams = new URLSearchParams({
      categorySlugs: params.categorySlugs,
      ...(params.includeChildCategories !== undefined && {
        includeChildCategories: params.includeChildCategories.toString(),
      }),
      ...(params.splitByCategoryIDs !== undefined && {
        splitByCategoryIDs: params.splitByCategoryIDs.toString(),
      }),
      ...(params.flatChoices !== undefined && {
        flatChoices: params.flatChoices.toString(),
      }),
      ...(params.groupChoicesBySection !== undefined && {
        groupChoicesBySection: params.groupChoicesBySection.toString(),
      }),
      ...(params.flat !== undefined && {
        flat: params.flat.toString(),
      }),
    });

    const response = await fetch(
      `${OLX_API_BASE}/categoryFields?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch category fields: ${response.statusText}`);
    }

    const data: CategoryFieldsResponse = await response.json();

    // The API returns an object with category IDs as keys
    // Each category has flatFields array
    // We need to extract all fields from all categories
    const allFields: CategoryField[] = [];
    
    for (const categoryID in data) {
      if (data[categoryID]?.flatFields) {
        allFields.push(...data[categoryID].flatFields);
      }
    }

    return allFields;
  } catch (error) {
    console.error('Error fetching category fields:', error);
    throw error;
  }
}

export async function fetchCategoryFieldsByCategory(
  params: CategoryFieldsParams,
  categoryId: number
): Promise<{ fields: CategoryField[]; parentFieldLookup?: Record<string, string> }> {
  try {
    const queryParams = new URLSearchParams({
      categorySlugs: params.categorySlugs,
      ...(params.includeChildCategories !== undefined && {
        includeChildCategories: params.includeChildCategories.toString(),
      }),
      ...(params.splitByCategoryIDs !== undefined && {
        splitByCategoryIDs: params.splitByCategoryIDs.toString(),
      }),
      ...(params.flatChoices !== undefined && {
        flatChoices: params.flatChoices.toString(),
      }),
      ...(params.groupChoicesBySection !== undefined && {
        groupChoicesBySection: params.groupChoicesBySection.toString(),
      }),
      ...(params.flat !== undefined && {
        flat: params.flat.toString(),
      }),
    });

    const url = `${OLX_API_BASE}/categoryFields?${queryParams.toString()}`;
    console.log(`🔗 Fetching category fields from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch category fields: ${response.statusText}`);
    }

    const data: CategoryFieldsResponse = await response.json();
    const categoryKey = categoryId.toString();
    
    console.log(`📋 Fetched category fields for category ID: ${categoryId}`);
    console.log(`📦 Response structure:`, Object.keys(data));
    
    // Try to find fields for the specific category
    if (data[categoryKey]) {
      const fields = data[categoryKey].flatFields || [];
      console.log(`✅ Found ${fields.length} fields for category ${categoryId}`);
      return {
        fields,
        parentFieldLookup: data[categoryKey].parentFieldLookup,
      };
    }

    // If splitByCategoryIDs is false or the response structure is different,
    // try to get fields from the first available category
    const categoryKeys = Object.keys(data);
    if (categoryKeys.length > 0) {
      const firstKey = categoryKeys[0];
      const fields = data[firstKey]?.flatFields || [];
      if (fields.length > 0) {
        console.log(`✅ Found ${fields.length} fields from category ${firstKey}`);
        return {
          fields,
          parentFieldLookup: data[firstKey].parentFieldLookup,
        };
      }
    }

    console.warn(`⚠️ No fields found for category ID: ${categoryId}`);
    return { fields: [] };
  } catch (error) {
    console.error('Error fetching category fields:', error);
    throw error;
  }
}

