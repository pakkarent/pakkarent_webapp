import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import useSEO from '../hooks/useSEO';
import JsonLd from '../components/common/JsonLd';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const { city } = useCity();

  const category_id = searchParams.get('category_id');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category_id || '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const activeCategoryName = selectedCategory
    ? (categories.find(c => c.id.toString() === selectedCategory)?.name || '')
    : '';

  const seoTitle = (() => {
    if (search) return `Search results for "${search}" in ${city}`;
    if (activeCategoryName) return `${activeCategoryName} on Rent in ${city}`;
    if (featured) return `Featured Rentals in ${city}`;
    return `All Rentals in ${city}`;
  })();

  const seoDesc = (() => {
    const base = `${total || 'Hundreds of'} rental products`;
    if (activeCategoryName) {
      return `${base} in ${activeCategoryName} available on rent in ${city}. Free delivery, flexible monthly tenures, 24x7 support — only on PakkaRent.`;
    }
    if (search) {
      return `Find rentals matching "${search}" in ${city} on PakkaRent. Compare prices, plans and book in minutes.`;
    }
    return `${base} — appliances, furniture, baby gear, camping and event items in ${city}. Free delivery, flexible tenures, 24x7 support.`;
  })();

  useSEO({
    title: seoTitle,
    description: seoDesc,
    keywords: `${activeCategoryName ? activeCategoryName + ' on rent, ' : ''}rentals ${city}, monthly rental ${city}, appliances on rent, furniture on rent, baby gear rental, event rentals, PakkaRent`,
    canonical: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/products',
  });

  const breadcrumbLd = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const items = [
      { name: 'Home', url: `${origin}/` },
      { name: 'Products', url: `${origin}/products` },
    ];
    if (activeCategoryName) {
      items.push({
        name: activeCategoryName,
        url: `${origin}/products?category_id=${selectedCategory}`,
      });
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((it, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: it.name,
        item: it.url,
      })),
    };
  }, [activeCategoryName, selectedCategory]);

  const itemListLd = useMemo(() => {
    if (!products.length) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: seoTitle,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${origin}/products/${p.id}`,
        name: p.name,
      })),
    };
  }, [products, seoTitle]);

  // Keep selectedCategory in sync with URL query (menu clicks)
  useEffect(() => {
    setSelectedCategory(category_id || '');
    setPage(1);
  }, [category_id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({
            city: city !== 'all' ? city : undefined,
            category_id: selectedCategory || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            search: search || undefined,
            featured: featured || undefined,
            page,
            limit: 12
          }),
          categoryAPI.getAll({
            city: city !== 'all' ? city : undefined
          })
        ]);
        setProducts(prodRes.data.products);
        setTotal(prodRes.data.total);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city, selectedCategory, minPrice, maxPrice, search, featured, page]);

  const totalPages = Math.ceil(total / 12);
  const visiblePages = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) pages.push('left-ellipsis');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages - 1) pages.push('right-ellipsis');
    pages.push(totalPages);
    return pages;
  })();

  return (
    <div className="products-page">
      <JsonLd data={breadcrumbLd} id="ld-breadcrumb" />
      {itemListLd && <JsonLd data={itemListLd} id="ld-itemlist" />}
      <div className="container">
        <div className="products-header">
          <h1>Products</h1>
          <p>{total} items found</p>
        </div>

        <button
          type="button"
          className="filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="products-sidebar"
          onClick={() => setFiltersOpen(o => !o)}
        >
          <span className="filters-toggle-icon" aria-hidden="true">⚙</span>
          <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
          <span className={`filters-toggle-chevron${filtersOpen ? ' open' : ''}`} aria-hidden="true">▾</span>
        </button>

        <div className={`products-content${filtersOpen ? ' filters-open' : ''}`}>
          <aside id="products-sidebar" className="sidebar">
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="filter-options">
                <label>
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={() => {
                      setSelectedCategory('');
                      setPage(1);
                    }}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id.toString()}
                      onChange={() => {
                        setSelectedCategory(cat.id.toString());
                        setPage(1);
                      }}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
              </div>
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              <p className="current-city">Showing products in: <strong>{city}</strong></p>
            </div>
          </aside>

          <main className="products-main">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map(prod => <ProductCard key={prod.id} product={prod} />)}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(1)}>First</button>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                    {visiblePages.map((p) => (
                      typeof p === 'number' ? (
                        <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                      ) : (
                        <span key={p} className="pagination-ellipsis">…</span>
                      )
                    ))}
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <p>No products found matching your filters.</p>
                <p>Try adjusting your search criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
