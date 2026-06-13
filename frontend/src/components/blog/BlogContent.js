import React from 'react';
import { Link } from 'react-router-dom';

export function BlogContent({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <div className="blog-article-body">
      {blocks.map((block, i) => {
        if (block.type === 'h3') {
          return <h3 key={i}>{block.text}</h3>;
        }
        if (block.type === 'ul') {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'p') {
          return (
            <p key={i}>
              {block.parts.map((part, j) => {
                if (part.type === 'link') {
                  return (
                    <Link key={j} to={part.to} className="blog-inline-link">
                      {part.label}
                    </Link>
                  );
                }
                return <React.Fragment key={j}>{part.value}</React.Fragment>;
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

export function formatBlogDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function topicLabel(topicId, topics) {
  return topics.find((t) => t.id === topicId)?.label || topicId;
}

export function topicEmoji(topicId, topics) {
  return topics.find((t) => t.id === topicId)?.emoji || '📝';
}
