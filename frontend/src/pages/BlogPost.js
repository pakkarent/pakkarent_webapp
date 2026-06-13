import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getBlogPost, getRelatedPosts, BLOG_TOPICS } from '../content/blogPosts';
import { BlogContent, formatBlogDate, topicEmoji, topicLabel } from '../components/blog/BlogContent';
import useSEO from '../hooks/useSEO';
import JsonLd from '../components/common/JsonLd';
import './Blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  const related = useMemo(() => (post ? getRelatedPosts(post.slug, 3) : []), [post, slug]);

  useSEO({
    title: post?.title || 'Article not found',
    description: post?.seoDescription || post?.excerpt,
    keywords: post?.keywords,
    canonical: post ? `/blog/${post.slug}` : '/blog',
    type: 'article',
  });

  const articleLd = useMemo(() => {
    if (!post) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      datePublished: post.publishedAt,
      author: { '@type': 'Organization', name: 'PakkaRent' },
      publisher: { '@type': 'Organization', name: 'PakkaRent' },
      mainEntityOfPage: `${origin}/blog/${post.slug}`,
      url: `${origin}/blog/${post.slug}`,
    };
  }, [post]);

  const breadcrumbLd = useMemo(() => {
    if (!post) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${origin}/blog/${post.slug}` },
      ],
    };
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="blog-page blog-post-page">
      {articleLd && <JsonLd data={articleLd} id="ld-article" />}
      {breadcrumbLd && <JsonLd data={breadcrumbLd} id="ld-breadcrumb" />}

      <div className="blog-hero blog-post-hero">
        <div className="container blog-post-hero-inner">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/blog">Blog</Link>
            <span aria-hidden="true">›</span>
            <span>{topicLabel(post.topic, BLOG_TOPICS)}</span>
          </nav>
          <span className="blog-card-topic blog-post-topic">
            {topicEmoji(post.topic, BLOG_TOPICS)} {topicLabel(post.topic, BLOG_TOPICS)}
          </span>
          <h1>{post.title}</h1>
          <p className="blog-post-excerpt">{post.excerpt}</p>
          <p className="blog-card-meta blog-post-meta">
            {formatBlogDate(post.publishedAt)} · {post.readMinutes} min read
          </p>
        </div>
      </div>

      <div className="container blog-post-layout">
        <article className="blog-article">
          <BlogContent blocks={post.blocks} />

          {post.catalogLinks?.length > 0 && (
            <aside className="blog-catalog-box" aria-label="Related products">
              <h2>Explore related rentals</h2>
              <div className="blog-catalog-links">
                {post.catalogLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="blog-catalog-link">
                    {link.label} →
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </article>

        {related.length > 0 && (
          <section className="blog-related" aria-label="Related articles">
            <h2>Related articles</h2>
            <div className="blog-related-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-related-card">
                  <span className="blog-card-topic">{topicEmoji(r.topic, BLOG_TOPICS)} {topicLabel(r.topic, BLOG_TOPICS)}</span>
                  <h3>{r.title}</h3>
                  <span className="blog-card-meta">{r.readMinutes} min read</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="blog-bottom-cta">
          <h2>Book your rental today</h2>
          <p>Add items to cart and send your order on WhatsApp — our team confirms availability within hours.</p>
          <div className="blog-cta-btns">
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
