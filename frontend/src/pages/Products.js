import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { getParentCategories } from '../utils/categoryUtils';
import { categoryIdFromSlug, isCategorySlug } from '../utils/categorySlugs';
import { cityFromUrlSegment, isCityUrlSegment } from '../utils/cityUrls';
import useSEO from '../hooks/useSEO';
import { getCategoryPath, getCategoryUrl, getProductUrl } from '../utils/productUrls';
import JsonLd from '../components/common/JsonLd';
import './Products.css';

export default function Products() {
  const { a: categorySlug, b: citySegment } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const { city, showCityPicker, confirmCityForCatalog, syncCityFromRoute } = useCity();

  const routeCategoryId = categorySlug && isCategorySlug(categorySlug)
    ? categoryIdFromSlug(categorySlug)
    : null;
  const routeCity = citySegment && isCityUrlSegment(citySegment)
    ? cityFromUrlSegment(citySegment)
    : null;

  const queryCategoryId = searchParams.get('category_id') || '';
  const category_id = routeCategoryId ? String(routeCategoryId) : queryCategoryId;
  const subcategory_id = searchParams.get('subcategory_id') || '';
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const effectiveCity = routeCity || city;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterSubcategories, setFilterSubcategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setCategoryFilters = (catId, subId) => {
    setPage(1);
    if (!catId) {
      navigate('/products');
      return;
    }
    const path = getCategoryPath(catId, effectiveCity);
    const qs = subId ? `?subcategory_id=${subId}` : '';
    navigate(`${path}${qs}`);
  };

  useEffect(() => {
    if (routeCity) syncCityFromRoute(routeCity);
  }, [routeCity, syncCityFromRoute]);

  // Redirect ?category_id= to slug URL for cleaner canonicals
  useEffect(() => {
    if (routeCategoryId || search || featured) return;
    if (!queryCategoryId) return;
    const slugPath = getCategoryPath(queryCategoryId, effectiveCity);
    const qs = subcategory_id ? `?subcategory_id=${subcategory_id}` : '';
    navigate(`${slugPath}${qs}`, { replace: true });
  }, [queryCategoryId, subcategory_id, search, featured, routeCategoryId, effectiveCity, navigate]);

  const parentCategories = getParentCategories(categories);

  const activeFilterCount =
    (category_id ? 1 : 0) + (subcategory_id ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const activeCategoryName = subcategory_id
    ? (filterSubcategories.find((c) => c.id.toString() === subcategory_id)?.name
      || categories.find((c) => c.id.toString() === subcategory_id)?.name
      || '')
    : category_id
      ? (categories.find((c) => c.id.toString() === category_id)?.name || '')
      : '';

  const seoTitle = (() => {
    if (search) return `Search results for "${search}" in ${effectiveCity}`;
    if (activeCategoryName) return `${activeCategoryName} on Rent in ${effectiveCity}`;
    if (featured) return `Featured Rentals in ${effectiveCity}`;
    return `All Rentals in ${effectiveCity}`;
  })();

  const seoDesc = (() => {
    const base = `${total || 'Hundreds of'} rental products`;
    if (activeCategoryName) {
      return `${base} in ${activeCategoryName} available on rent in ${effectiveCity}. Free delivery, flexible monthly tenures, 24x7 support — only on PakkaRent.`;
    }
    if (search) {
      return `Find rentals matching "${search}" in ${effectiveCity} on PakkaRent. Compare prices, plans and book in minutes.`;
    }
    return `${base} — appliances, furniture, baby gear, camping and event items in ${effectiveCity}. Free delivery, flexible tenures, 24x7 support.`;
  })();

  const canonicalPath = (() => {
    if (routeCategoryId && routeCity && !search && !featured) {
      const base = getCategoryPath(routeCategoryId, routeCity);
      return subcategory_id ? `${base}?subcategory_id=${subcategory_id}` : base;
    }
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/products';
  })();

  useSEO({
    title: seoTitle,
    description: seoDesc,
    keywords: `${activeCategoryName ? activeCategoryName + ' on rent, ' : ''}rentals ${effectiveCity}, monthly rental ${effectiveCity}, appliances on rent, furniture on rent, baby gear rental, event rentals, PakkaRent`,
    canonical: canonicalPath,
  });

  const breadcrumbLd = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const items = [
      { name: 'Home', url: `${origin}/` },
      { name: 'Products', url: `${origin}/products` },
    ];
    if (activeCategoryName && category_id) {
      items.push({
        name: activeCategoryName,
        url: getCategoryUrl(Number(category_id), effectiveCity, origin)
          + (subcategory_id ? `?subcategory_id=${subcategory_id}` : ''),
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
  }, [activeCategoryName, category_id, subcategory_id, effectiveCity]);

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
        url: getProductUrl(p, origin),
        name: p.name,
      })),
    };
  }, [products, seoTitle]);

  // Deep links: confirm city so catalog loads without waiting on the picker modal
  useEffect(() => {
    if (category_id || subcategory_id || search || featured) {
      confirmCityForCatalog();
    }
  }, [category_id, subcategory_id, search, featured, confirmCityForCatalog]);

  // Normalize old/wrong links that use a subcategory id as category_id
  useEffect(() => {
    if (!category_id || subcategory_id) return;
    const isParent = parentCategories.some((c) => c.id.toString() === category_id);
    if (isParent) return;

    const cityFilter = effectiveCity !== 'all' ? effectiveCity : undefined;
    categoryAPI
      .getAll({ city: cityFilter })
      .then((res) => {
        const match = (res.data.categories || []).find(
          (c) => c.id.toString() === category_id && c.parent_id
        );
        if (!match) return;
        const params = new URLSearchParams(searchParams);
        params.set('category_id', String(match.parent_id));
        params.set('subcategory_id', String(match.id));
        setSearchParams(params, { replace: true });
      })
      .catch(() => {});
  }, [category_id, subcategory_id, parentCategories, effectiveCity, searchParams, setSearchParams]);

  // Reset pagination when URL filters change
  useEffect(() => {
    setPage(1);
  }, [category_id, subcategory_id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Load subcategories for the selected parent category
  useEffect(() => {
    if (!category_id) {
      setFilterSubcategories([]);
      return;
    }
    categoryAPI
      .getAll({
        parent_id: category_id,
        city: effectiveCity !== 'all' ? effectiveCity : undefined,
      })
      .then((res) => setFilterSubcategories(res.data.categories || []))
      .catch(() => setFilterSubcategories([]));
  }, [category_id, effectiveCity]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cityFilter = effectiveCity !== 'all' ? effectiveCity : undefined;
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({
            city: cityFilter,
            category_id: subcategory_id ? undefined : (category_id || undefined),
            subcategory_id: subcategory_id || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            search: search || undefined,
            featured: featured || undefined,
            page,
            limit: 12,
          }),
          categoryAPI.getAll({
            parents_only: true,
          }),
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
  }, [effectiveCity, category_id, subcategory_id, minPrice, maxPrice, search, featured, page, showCityPicker]);

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
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          ...(activeCategoryName ? [{ label: activeCategoryName }] : []),
        ]} />
        <div className="products-header">
          <h1>{activeCategoryName ? `${activeCategoryName} on Rent` : 'Products'}</h1>
          <p>{total} items found in {effectiveCity}</p>
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
                    checked={!category_id}
                    onChange={() => setCategoryFilters('', '')}
                  />
                  <span>All Categories</span>
                </label>
                {parentCategories.map((cat) => {
                  const isSelected = category_id === cat.id.toString();
                  const subsForCat = isSelected ? filterSubcategories : [];
                  return (
                    <React.Fragment key={cat.id}>
                      <label className={isSelected ? 'filter-cat-selected' : ''}>
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={isSelected && !subcategory_id}
                          onChange={() => setCategoryFilters(cat.id.toString(), '')}
                        />
                        <span>{cat.icon} {cat.name}</span>
                      </label>
                      {isSelected && subsForCat.length > 0 && (
                        <div className="filter-sub-menu" role="group" aria-label={`${cat.name} subcategories`}>
                          {subsForCat.map((sub) => (
                            <label key={sub.id} className="filter-sub-option">
                              <input
                                type="radio"
                                name="subcategory"
                                value={sub.id}
                                checked={subcategory_id === sub.id.toString()}
                                onChange={() => setCategoryFilters(cat.id.toString(), sub.id.toString())}
                              />
                              <span>{sub.icon} {sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
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
              <p className="current-city">Showing products in: <strong>{effectiveCity}</strong></p>
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
