// Category types from OLX categories API
export interface Category {
    id: number;
    name: string;
    name_l1?: string; // Arabic name
    nameShort?: string;
    externalID: string;
    slug: string;
    level: number;
    parentID: number | null; // Note: API uses parentID (capital ID)
    displayPriority: number;
    purpose: string;
    roles?: string[];
    locationDepthLimits?: {
        min: number;
        max: number;
    };
    configurations?: Record<string, unknown>;
    statistics?: {
        activeCount: number;
    };
    paaSections?: unknown;
    templateConfigs?: unknown;
    templateHashes?: unknown;
    children?: Category[];
}

// Category field types from categoryFields API
export interface CategoryFieldChoice {
    id: number;
    value: string | number;
    label: string;
    label_l1?: string; // Arabic label
    slug?: string;
    seoSlug?: {
        en: string;
        ar: string;
    };
    extraFields?: Record<string, unknown>;
    displayPriority?: number | null;
    popularityRank?: number;
    roles?: string[];
    parentID?: number; // For nested choices
}

export interface CategoryField {
    id: number;
    name: string;
    attribute: string;
    categoryID: number;
    valueType: 'enum' | 'float' | 'string' | 'integer' | 'boolean' | 'date';
    filterType: 'single_choice' | 'multiple_choice' | 'range' | 'text' | 'boolean';
    isMandatory: boolean;
    state: string;
    displayPriority: number;
    titlePriority?: number;
    pathPriority?: number;
    groupIndex: number | null;
    roles?: string[];
    choices?: CategoryFieldChoice[];
    minValue?: number | null;
    maxValue?: number | null;
    minLength?: number | null;
    maxLength?: number | null;
    maxFieldFacetSize?: number | null;
    seoTitle?: {
        en: string;
        ar: string;
    };
    paaSection?: unknown;
}

export interface CategoryFieldsResponse {
    [categoryID: string]: {
        flatFields: CategoryField[];
        parentFieldLookup?: Record<string, string>;
    };
}

// Ad types for home page
export interface Ad {
    id: string | number;
    title: string;
    description?: string;
    price: number;
    currency?: string;
    location?: string;
    category: string;
    categorySlug?: string;
    images: string[];
    datePosted?: string;
    url?: string;
    featured?: boolean;
    metadata?: {
        km?: string;
        year?: string;
        size?: string;
        bedrooms?: string;
        bathrooms?: string;
        negotiable?: boolean;
        [key: string]: string | number | boolean | undefined;
    };
}

// Form field types for dynamic form rendering
export interface FormFieldValue {
    [key: string]: string | number | boolean | string[] | Record<string, boolean> | null;
}

export interface FormFieldError {
    field: string;
    message: string;
}

// API Response types
export interface CategoriesResponse {
    data: Category[];
    success: boolean;
}

// CategoryFieldsResponse is now defined above

export interface AdsResponse {
    data: Ad[];
    success: boolean;
    total?: number;
}

