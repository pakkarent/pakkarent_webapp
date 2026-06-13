import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BLOG_POSTS,
  BLOG_TOPICS,
  getFeaturedPosts,
  getPostsByTopic,
} from '../content/blogPosts';
import { formatBlogDate, topicEmoji, topicLabel } from '../components/blog/BlogContent';
import useSEO from '../hooks/useSEO';
import JsonLd from '../components/common/JsonLd';
import './Blog.css';

export default function Blog() {
  const [activeTopic, setActiveTopic] = useState('');
  const featured = getFeaturedPosts(2);
  const posts = getPostsByTopic(activeTopic);

  useSEO({
    title: 'Rental Tips & Guides — Events, Camping, Appliances & More',
    description:
      'PakkaRent blog — expert guides on cradle rental, backdrop décor, camping gear, appliance rental and birthday party ideas in Chennai, Bangalore and Hyderabad.',
    keywords:
      'rental tips Chennai, naming ceremony guide, camping rental blog, appliance rent vs buy, event backdrop ideas, PakkaRent blog',
    canonical: '/blog',
  });

  const blogListLd = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'PakkaRent Blog',
      description: 'Rental guides and tips for events, camping, appliances and more.',
      url: `${origin}/blog`,
      blogPost: BLOG_POSTS.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        datePublished: p.publishedAt,
        url: `${origin}/blog/${p.slug}`,
      })),
    };
  }, []);

  return (
    <div className="blog-page">
      <JsonLd data={blogListLd} id="ld-blog" />
      <div className="blog-hero">
        <div className="container">
          <h1>PakkaRent Blog</h1>
          <p className="blog-hero-sub">
            Rental guides, event planning tips and product inspiration for Chennai, Bangalore &amp; Hyderabad
          </p>
        </div>
      </div>

      <div className="container blog-layout">
        {featured.length > 0 && !activeTopic && (
          <section className="blog-featured" aria-label="Featured articles">
            <h2>Featured guides</h2>
            <div className="blog-featured-grid">
              {featured.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-featured-card">
                  <span className="blog-card-topic">{topicEmoji(post.topic, BLOG_TOPICS)} {topicLabel(post.topic, BLOG_TOPICS)}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-card-meta">{formatBlogDate(post.publishedAt)} · {post.readMinutes} min read</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="blog-topic-bar" role="tablist" aria-label="Filter by topic">
          <button
            type="button"
            role="tab"
            aria-selected={!activeTopic}
            className={`blog-topic-chip${!activeTopic ? ' active' : ''}`}
            onClick={() => setActiveTopic('')}
          >
            All topics
          </button>
          {BLOG_TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTopic === t.id}
              className={`blog-topic-chip${activeTopic === t.id ? ' active' : ''}`}
              onClick={() => setActiveTopic(t.id)}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <section className="blog-grid-section">
          <h2 className="blog-section-title">
            {activeTopic ? `${topicLabel(activeTopic, BLOG_TOPICS)} articles` : 'All articles'}
            <span className="blog-count">({posts.length})</span>
          </h2>
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  <span className="blog-card-topic">{topicEmoji(post.topic, BLOG_TOPICS)} {topicLabel(post.topic, BLOG_TOPICS)}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-card-meta">{formatBlogDate(post.publishedAt)} · {post.readMinutes} min read</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="blog-bottom-cta">
          <h2>Ready to rent?</h2>
          <p>Browse our full catalogue — cradles, backdrops, camping gear, appliances and more.</p>
          <div className="blog-cta-btns">
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
            <Link to="/how-it-works" className="btn btn-outline">How It Works</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
