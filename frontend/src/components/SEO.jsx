import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description = "TiffinFlex — Premium tiffin subscription service delivering gourmet meals to your doorstep.", 
  image = "/og-image.png", 
  url 
}) => {
  const { pathname } = useLocation();
  const baseUrl = "https://tiffinflex.vercel.app";
  const fullUrl = url || `${baseUrl}${pathname}`;
  const fullTitle = title ? `${title} | TiffinFlex` : "TiffinFlex — Gourmet Tiffin Subscriptions";

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;

