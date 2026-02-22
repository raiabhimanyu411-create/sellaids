import React from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '../components/Seo';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// SeoPage reads ?title=&desc=&img=&url= and sets meta tags accordingly.
export default function SeoPage() {
  const query = useQuery();
  const title = query.get('title') || query.get('t');
  const description = query.get('desc') || query.get('description') || '';
  const image = query.get('img') || query.get('image') || '';
  const url = query.get('url') || undefined;

  return (
    <>
      <Seo title={title} description={description} image={image} url={url} />
      <main>
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Preview: {title || 'Sellaids'}</h1>
          <p className="text-gray-600">This page sets dynamic meta tags based on query parameters. Use it as a shareable preview URL.</p>
          {image && <img src={image} alt="preview" className="mx-auto mt-6 max-h-64 object-contain" />}
        </div>
      </main>
    </>
  );
}