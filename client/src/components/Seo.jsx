import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, image, url, children }) => {
  const siteName = 'Sellaids';
  const computedTitle = title || siteName;
  const computedDesc = description || 'Sell Your Preowned Collection With Us Today - Simple, Secure And Rewarding.';
  const computedImage = image || `${process.env.PUBLIC_URL}/site.png`;
  const computedUrl = url || (typeof window !== 'undefined' ? window.location.href : process.env.PUBLIC_URL || '/');

  return (
    <Helmet>
      <title>{computedTitle}</title>
      <meta name="description" content={computedDesc} />
      <link rel="canonical" href={computedUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={computedTitle} />
      <meta property="og:description" content={computedDesc} />
      <meta property="og:url" content={computedUrl} />
      <meta property="og:image" content={computedImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={computedTitle} />
      <meta name="twitter:description" content={computedDesc} />
      <meta name="twitter:image" content={computedImage} />

      {children}
    </Helmet>
  );
};

export default Seo;