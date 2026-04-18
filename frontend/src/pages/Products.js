import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
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
      <div className="container">
        <div className="products-header">
          <h1>Products</h1>
          <p>{total} items found</p>
        </div>

        <div className="products-content">
          <aside className="sidebar">
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
