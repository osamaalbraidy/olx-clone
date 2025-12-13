import { Ad, AdsResponse } from '@/types';

const OLX_API_BASE = 'https://www.olx.com.lb/api';

export interface FetchAdsParams {
  category?: string;
  limit?: number;
  offset?: number;
}

/**
 * Attempts to fetch ads from OLX API
 * Falls back to mock data if API is unavailable
 */
export async function fetchAds(params: FetchAdsParams = {}): Promise<Ad[]> {
  try {
    // Try to fetch from OLX API
    // Note: The actual endpoint may vary, this is a placeholder
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(
      `${OLX_API_BASE}/ads?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data: AdsResponse | Ad[] = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      }
      
      if ('data' in data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch ads from API, using mock data:', error);
  }

  // Fallback to mock data
  return getMockAds(params);
}

/**
 * Returns mock ads data for development/testing
 */
function getMockAds(params: FetchAdsParams = {}): Ad[] {
  const mockAds: Ad[] = [
    // Cars for Sale
    {
      id: '1',
      title: 'Nissan Pathfinder 2006 Company Source and One Owner',
      description: 'Nissan Pathfinder 2006 Company Source and One Owner',
      price: 6000,
      currency: 'USD',
      location: 'Adlieh, Beirut',
      category: 'Cars for Sale',
      categorySlug: 'cars-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15333787-400x300.jpeg'],
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { km: '120000 km', year: '2006' },
    },
    {
      id: '2',
      title: 'Audi A8 L 50 TFSI Kettaneh 1 Owner',
      description: 'Audi A8 L 50 TFSI Kettaneh 1 Owner',
      price: 22500,
      currency: 'USD',
      location: 'Sabtieh, Metn',
      category: 'Cars for Sale',
      categorySlug: 'cars-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15698117-400x300.jpeg'],
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { km: '84000 km', year: '2015' },
    },
    {
      id: '3',
      title: 'Mercedes-Benz E-Class 400 2018 Amg package 4matic',
      description: 'Mercedes-Benz E-Class 400 2018 Amg package 4matic',
      price: 48000,
      currency: 'USD',
      location: 'Downtown, Beirut',
      category: 'Cars for Sale',
      categorySlug: 'cars-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15684603-400x300.jpeg'],
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { km: '31000 km', year: '2018' },
    },
    {
      id: '4',
      title: 'Mercedes-Benz A250 4matic - 2019 MY - CLEAN CARFAX',
      description: 'Mercedes-Benz A250 4matic - 2019 MY - CLEAN CARFAX',
      price: 31500,
      currency: 'USD',
      location: 'Dbaye, Metn',
      category: 'Cars for Sale',
      categorySlug: 'cars-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/14312588-400x300.jpeg'],
      datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { km: '70000 km', year: '2019' },
    },
    // Apartments & Villas For Rent
    {
      id: '5',
      title: '2-Bedroom Apartment in Mar Mikheal',
      description: '2-Bedroom Apartment in Mar Mikheal',
      price: 1500,
      currency: 'USD',
      location: 'Mar Mkhayel, Beirut',
      category: 'Apartments & Villas For Rent',
      categorySlug: 'apartments-villas-for-rent',
      images: ['https://images.olx.com.lb/thumbnails/15297510-400x300.jpeg'],
      datePosted: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '2', bathrooms: '1', size: '140 SQM' },
    },
    {
      id: '6',
      title: 'Apartment for rent in Rabweh',
      description: 'Apartment for rent in Rabweh',
      price: 500,
      currency: 'USD',
      location: 'Rabweh, Metn',
      category: 'Apartments & Villas For Rent',
      categorySlug: 'apartments-villas-for-rent',
      images: ['https://images.olx.com.lb/thumbnails/15672045-400x300.jpeg'],
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '2', bathrooms: '2', size: '120 SQM' },
    },
    {
      id: '7',
      title: 'RA25-4483 Super Deluxe Apartment 280m² for Rent – Ras Beirut',
      description: 'RA25-4483 Super Deluxe Apartment 280m² for Rent – Ras Beirut',
      price: 4500,
      currency: 'USD',
      location: 'Ras Beirut, Beirut',
      category: 'Apartments & Villas For Rent',
      categorySlug: 'apartments-villas-for-rent',
      images: ['https://images.olx.com.lb/thumbnails/15400888-400x300.jpeg'],
      datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '2', bathrooms: '3', size: '280 SQM' },
    },
    {
      id: '8',
      title: 'Penthouse for Rent in Achrafieh | Gated Community | Garden | Terrace',
      description: 'Penthouse for Rent in Achrafieh | Gated Community | Garden | Terrace',
      price: 5600,
      currency: 'USD',
      location: 'Achrafieh, Beirut',
      category: 'Apartments & Villas For Rent',
      categorySlug: 'apartments-villas-for-rent',
      images: ['https://images.olx.com.lb/thumbnails/15537713-400x300.jpeg'],
      datePosted: new Date(Date.now() - 0.04 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '3', bathrooms: '4', size: '400 SQM', negotiable: true },
    },
    // Mobile Phones
    {
      id: '9',
      title: 'iPhone 14 Pro Max 512Gb used like new battery 88%',
      description: 'iPhone 14 Pro Max 512Gb used like new battery 88%',
      price: 720,
      currency: 'USD',
      location: 'Furn El Chebbak, Baabda',
      category: 'Mobile Phones',
      categorySlug: 'mobile-phones',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      datePosted: '2024-01-06',
    },
    {
      id: '10',
      title: '16pro 256GB used',
      description: '16pro 256GB used',
      price: 999,
      currency: 'USD',
      location: 'Sanayeh, Beirut',
      category: 'Mobile Phones',
      categorySlug: 'mobile-phones',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      datePosted: '2024-01-06',
    },
    {
      id: '11',
      title: 'IPHONE 17 PRO MAX (256gb)',
      description: 'IPHONE 17 PRO MAX (256gb)',
      price: 1519,
      currency: 'USD',
      location: 'Jal El Dib, Metn',
      category: 'Mobile Phones',
      categorySlug: 'mobile-phones',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      datePosted: '2024-01-14',
      metadata: { negotiable: true },
    },
    {
      id: '12',
      title: 'Apple iPhone 17 Air 256GB eSIM',
      description: 'Apple iPhone 17 Air 256GB eSIM',
      price: 1025,
      currency: 'USD',
      location: 'Mar Elias, Beirut',
      category: 'Mobile Phones',
      categorySlug: 'mobile-phones',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      datePosted: '2024-01-13',
    },
    // Apartments & Villas For Sale
    {
      id: '13',
      title: 'private compound, great deal, batroun town/البترون REF#FD130066',
      description: 'private compound, great deal, batroun town/البترون REF#FD130066',
      price: 300000,
      currency: 'USD',
      location: 'Batroun Town, Batroun',
      category: 'Apartments & Villas For Sale',
      categorySlug: 'apartments-villas-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15730681-400x300.jpeg'],
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '3', bathrooms: '4', size: '200 SQM' },
    },
    {
      id: '14',
      title: 'Great deal, prime area, keserwan, zouk mosbeh REF#CI129935',
      description: 'Great deal, prime area, keserwan, zouk mosbeh REF#CI129935',
      price: 110000,
      currency: 'USD',
      location: 'Zouk Mosbeh, Keserouan',
      category: 'Apartments & Villas For Sale',
      categorySlug: 'apartments-villas-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15716783-400x300.jpeg'],
      datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '2', bathrooms: '2', size: '120 SQM' },
    },
    {
      id: '15',
      title: 'Jeita 280m2 | 150m2 Terrace | Prime Location | Brand New | EL',
      description: 'Jeita 280m2 | 150m2 Terrace | Prime Location | Brand New | EL',
      price: 225000,
      currency: 'USD',
      location: 'Jeita, Keserouan',
      category: 'Apartments & Villas For Sale',
      categorySlug: 'apartments-villas-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15455040-400x300.jpeg'],
      datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '3', bathrooms: '3', size: '280 SQM' },
    },
    {
      id: '16',
      title: 'Waterfront City / 1 Bedroom / Terrace REF#AC129769',
      description: 'Waterfront City / 1 Bedroom / Terrace REF#AC129769',
      price: 360000,
      currency: 'USD',
      location: 'Dbaye, Metn',
      category: 'Apartments & Villas For Sale',
      categorySlug: 'apartments-villas-for-sale',
      images: ['https://images.olx.com.lb/thumbnails/15691377-400x300.jpeg'],
      datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { bedrooms: '1', bathrooms: '1', size: '90 SQM' },
    },
    // Motorcycles & ATVs
    {
      id: '17',
      title: 'Multiatrada 1200',
      description: 'Multiatrada 1200',
      price: 12000,
      currency: 'USD',
      location: 'Jal El Dib, Metn',
      category: 'Motorcycles & ATVs',
      categorySlug: 'motorcycles-atv',
      images: ['https://images.olx.com.lb/thumbnails/15479501-400x300.jpeg'],
      datePosted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '18',
      title: 'RZR PRO XP 4 ULTIMATE MATTE TITANIUM METALLIC 2021',
      description: 'RZR PRO XP 4 ULTIMATE MATTE TITANIUM METALLIC 2021',
      price: 39000,
      currency: 'USD',
      location: 'Faraya, Keserouan',
      category: 'Motorcycles & ATVs',
      categorySlug: 'motorcycles-atv',
      images: ['https://images.olx.com.lb/thumbnails/11419602-400x300.jpeg'],
      datePosted: new Date(Date.now() - 0.875 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: { negotiable: true },
    },
    {
      id: '19',
      title: 'BMW F800 GS',
      description: 'BMW F800 GS',
      price: 6750,
      currency: 'USD',
      location: 'Ras Beirut, Beirut',
      category: 'Motorcycles & ATVs',
      categorySlug: 'motorcycles-atv',
      images: ['https://images.olx.com.lb/thumbnails/15282001-400x300.jpeg'],
      datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '20',
      title: 'Can -Am Ryker 900 cc 2020',
      description: 'Can -Am Ryker 900 cc 2020',
      price: 11500,
      currency: 'USD',
      location: 'Verdun, Beirut',
      category: 'Motorcycles & ATVs',
      categorySlug: 'motorcycles-atv',
      images: ['https://images.olx.com.lb/thumbnails/12990475-400x300.jpeg'],
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    // AC, Cooling & Heating
    {
      id: '21',
      title: 'gas heater دفاية غاز',
      description: 'gas heater دفاية غاز',
      price: 55,
      currency: 'USD',
      location: 'Bourj Hammoud, Metn',
      category: 'AC, Cooling & Heating',
      categorySlug: 'ac-cooling-heating',
      images: ['https://images.olx.com.lb/thumbnails/15319716-400x300.jpeg'],
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '22',
      title: 'AIRREX VOLA Diesel Infrared Heater 2008F with Fan دفاية اركس مع مروحة',
      description: 'AIRREX VOLA Diesel Infrared Heater 2008F with Fan دفاية اركس مع مروحة',
      price: 1850,
      currency: 'USD',
      location: 'Taanayel, Zahle',
      category: 'AC, Cooling & Heating',
      categorySlug: 'ac-cooling-heating',
      images: ['https://images.olx.com.lb/thumbnails/15107535-400x300.jpeg'],
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '23',
      title: 'Ac 24000 Inverter Generalgold Wifi Gear Ampere Control مكيف انفرتر',
      description: 'Ac 24000 Inverter Generalgold Wifi Gear Ampere Control مكيف انفرتر',
      price: 750,
      currency: 'USD',
      location: 'Sin El Fil, Metn',
      category: 'AC, Cooling & Heating',
      categorySlug: 'ac-cooling-heating',
      images: ['https://images.olx.com.lb/thumbnails/12030944-400x300.jpeg'],
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '24',
      title: 'AIRREX VOLA Diesel Infrared Heater 2006F with Fan دفاية اريكس مع مروحة',
      description: 'AIRREX VOLA Diesel Infrared Heater 2006F with Fan دفاية اريكس مع مروحة',
      price: 1350,
      currency: 'USD',
      location: 'Taanayel, Zahle',
      category: 'AC, Cooling & Heating',
      categorySlug: 'ac-cooling-heating',
      images: ['https://images.olx.com.lb/thumbnails/15107533-400x300.jpeg'],
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    // Laptops, Tablets, Computers
    {
      id: '25',
      title: 'High-End Storage Server – Ryzen 9, 96GB, PM1735 NVMe, 180 TB EnterpHDD',
      description: 'High-End Storage Server – Ryzen 9, 96GB, PM1735 NVMe, 180 TB EnterpHDD',
      price: 3000,
      currency: 'USD',
      location: 'Hamra, Beirut',
      category: 'Laptops, Tablets, Computers',
      categorySlug: 'laptops-tablets-computers',
      images: ['https://images.olx.com.lb/thumbnails/15705430-400x300.jpeg'],
      datePosted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '26',
      title: 'APPLE MACBOOK PRO CORE i7 VGA RADEON 4GB 15-INCH TOUCHBAR LAPTOP',
      description: 'APPLE MACBOOK PRO CORE i7 VGA RADEON 4GB 15-INCH TOUCHBAR LAPTOP',
      price: 255,
      currency: 'USD',
      location: 'Chiyah, Beirut',
      category: 'Laptops, Tablets, Computers',
      categorySlug: 'laptops-tablets-computers',
      images: ['https://images.olx.com.lb/thumbnails/15743088-400x300.jpeg'],
      datePosted: new Date(Date.now() - 0.625 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '27',
      title: 'DELL INSPIRON 15 3535 RYZEN 7 7730U VGA RADEON 15.6" FHD TOUCHSCREEN',
      description: 'DELL INSPIRON 15 3535 RYZEN 7 7730U VGA RADEON 15.6" FHD TOUCHSCREEN',
      price: 555,
      currency: 'USD',
      location: 'Chiyah, Beirut',
      category: 'Laptops, Tablets, Computers',
      categorySlug: 'laptops-tablets-computers',
      images: ['https://images.olx.com.lb/thumbnails/15410450-400x300.jpeg'],
      datePosted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: '28',
      title: 'hot offer new touch laptop 99$ only',
      description: 'hot offer new touch laptop 99$ only',
      price: 99,
      currency: 'USD',
      location: 'Chiyah, Beirut',
      category: 'Laptops, Tablets, Computers',
      categorySlug: 'laptops-tablets-computers',
      images: ['https://images.olx.com.lb/thumbnails/14602014-400x300.jpeg'],
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  ];

  // Filter by category if specified
  if (params.category) {
    return mockAds.filter(
      (ad) =>
        ad.category.toLowerCase() === params.category!.toLowerCase() ||
        ad.categorySlug?.toLowerCase() === params.category!.toLowerCase()
    );
  }

  return mockAds;
}

/**
 * Simulates loading behavior using Promises (as per requirements)
 */
export function fetchAdsWithDelay(
  params: FetchAdsParams = {},
  delay: number = 1000
): Promise<Ad[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetchAds(params));
    }, delay);
  });
}

