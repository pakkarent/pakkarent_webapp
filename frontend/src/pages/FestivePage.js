import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import Breadcrumb from '../components/common/Breadcrumb';
import JsonLd from '../components/common/JsonLd';
import useSEO from '../hooks/useSEO';
import { getFestiveLinks, getFestivePage } from '../content/festivePages';
import { getCategoryPath, getProductPath, getProductUrl } from '../utils/productUrls';
import { displayUnitPrice } from '../utils/pricingDisplay';
import { priceUnitLabel } from '../utils/productPricing';
import { resolveThumbnailUrl, safeJsonArray, imageErrorFallback } from '../utils/media';
import { uniqueProductImages } from '../utils/productSpecs';
import './FestivePage.css';

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function FestiveProductTile({ product }) {
  const images = uniqueProductImages(safeJsonArray(product.images));
  const image = resolveThumbnailUrl(images[0], 'card');
  const price = displayUnitPrice(product, 1);

  return (
    <Link to={getProductPath(product)} className="festive-tile">
      <div className="festive-tile-media">
        {image ? (
          <img
            src={image}
            alt={product.name}
            width="400"
            height="300"
            loading="lazy"
            decoding="async"
            onError={(e) => imageErrorFallback(e, images[0])}
          />
        ) : (
          <div className="festive-tile-placeholder">PakkaRent</div>
        )}
        <span className="festive-tile-city">{product.city}</span>
      </div>
      <div className="festive-tile-body">
        <div className="festive-tile-category">{product.category_name}</div>
        <h3>{product.name}</h3>
        <div className="festive-tile-footer">
          <div className="festive-tile-price">
            <strong>₹{price}</strong>
            <span>{priceUnitLabel(product)}</span>
          </div>
          <span className="festive-tile-cta">View →</span>
        </div>
      </div>
    </Link>
  );
}

export default function FestivePage() {
  const { slug } = useParams();
  const page = getFestivePage(slug);
  const { city, confirmCityForCatalog } = useCity();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    confirmCityForCatalog();
  }, [confirmCityForCatalog]);

  useEffect(() => {
    if (!page) return;
    setLoading(true);
    productAPI
      .getAll({ city, limit: 200 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, city]);

  const sectionProducts = useMemo(() => {
    if (!page) return [];
    return page.sections.map((section) => {
      const matched = uniqueById(
        section.slugs
          .map((sectionSlug) => products.find((p) => p.slug === sectionSlug))
          .filter(Boolean)
      );
      return { ...section, products: matched };
    });
  }, [page, products]);

  const availableProducts = useMemo(
    () => uniqueById(sectionProducts.flatMap((section) => section.products)),
    [sectionProducts]
  );

  const itemListLd = useMemo(() => {
    if (!page || !availableProducts.length) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pakkarent.com';
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${page.shortTitle} Rentals`,
      description: page.seoDescription,
      url: `${origin}/festive/${page.slug}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: availableProducts.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: getProductUrl(product, origin),
          name: product.name,
        })),
      },
    };
  }, [page, availableProducts]);

  useSEO({
    title: page ? `${page.title} in ${city}` : 'Festive Rentals',
    description: page ? `${page.seoDescription} Available in ${city}.` : 'Festive rentals on PakkaRent.',
    keywords: page?.keywords,
    canonical: page ? `/festive/${page.slug}` : '/products',
  });

  if (!page) return <Navigate to="/products" replace />;

  const festiveLinks = getFestiveLinks(city);

  return (
    <div className="festive-page">
      {itemListLd && <JsonLd data={itemListLd} id={`ld-festive-${page.slug}`} />}

      <div className="festive-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Festive Rentals' }, { label: page.shortTitle }]} />
          <span className="festive-kicker">Occasion Planner</span>
          <h1>{page.heroTitle}</h1>
          <p className="festive-sub">{page.heroSub}</p>
          <ul className="festive-highlights">
            {page.highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="festive-cta">
            <Link to="/contact" className="btn btn-primary">Get help on WhatsApp</Link>
            <Link to={getCategoryPath(3, city)} className="btn btn-outline">Browse event catalog</Link>
          </div>
        </div>
      </div>

      <div className="container festive-body">
        <section className="festive-combos">
          <div className="festive-section-head">
            <h2>Popular {page.shortTitle} combinations</h2>
            <span>{city} shortlist</span>
          </div>
          <div className="festive-combo-grid">
            {page.comboIdeas.map((idea) => (
              <div key={idea} className="festive-combo-card">{idea}</div>
            ))}
          </div>
        </section>

        <section className="festive-links">
          <div className="festive-section-head">
            <h2>Explore by occasion</h2>
          </div>
          <div className="festive-links-grid">
            {festiveLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`festive-link-card${link.path.endsWith(page.slug) ? ' active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {sectionProducts.map((section) => (
          <section key={section.title} className="festive-product-section">
            <div className="festive-section-head">
              <div>
                <h2>{section.title}</h2>
                <p>{section.blurb}</p>
              </div>
              {section.products.length > 0 && <span>{section.products.length} items</span>}
            </div>

            {loading ? (
              <div className="loading">Loading products…</div>
            ) : section.products.length > 0 ? (
              <div className="festive-products-grid">
                {section.products.map((product) => (
                  <FestiveProductTile key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="festive-empty">
                No curated items are live for {page.shortTitle.toLowerCase()} in {city} yet. Try another city from the header or contact us for availability.
              </div>
            )}
          </section>
        ))}

        <section className="festive-bottom-cta">
          <h2>Need help choosing the right setup?</h2>
          <p>
            Share your date, city and function type with our team. We will suggest a practical combination for {page.shortTitle.toLowerCase()}.
          </p>
          <div className="festive-bottom-actions">
            <Link to="/contact" className="btn btn-primary">Talk to PakkaRent</Link>
            {page.ctas.map((cta) => (
              <Link key={cta.categoryId} to={getCategoryPath(cta.categoryId, city)} className="btn btn-outline">
                {cta.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
