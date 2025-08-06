import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

const defaultSEO = {
  title: 'Elaïa Studio - Pilates Reformer à Gland | Studio Professionnel',
  description: 'Découvrez le Pilates Reformer chez Elaïa Studio à Gland. Cours pour tous niveaux, instructeurs certifiés, équipement premium. Transformez votre corps en douceur.',
  keywords: [
    'pilates reformer',
    'pilates gland',
    'studio pilates suisse',
    'cours pilates',
    'reformer gland',
    'pilates professionnel',
    'wellness gland',
    'fitness gland',
    'yoga mat',
    'bien-être'
  ],
  image: '/images/studio-hero.jpg',
  url: 'https://elaia-studio.ch',
  type: 'business.business' as const,
  author: 'Elaïa Studio'
};

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  structuredData
}: SEOProps) {
  const seoTitle = title ? `${title} | Elaïa Studio` : defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = keywords || defaultSEO.keywords;
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || defaultSEO.url;
  const seoAuthor = author || defaultSEO.author;

  // Structured Data par défaut pour un studio de fitness
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'Elaïa Studio',
    description: seoDescription,
    url: seoUrl,
    logo: `${seoUrl}/images/logo.png`,
    image: seoImage,
    telephone: '+41-22-XXX-XX-XX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue de la Gare 5',
      addressLocality: 'Gland',
      postalCode: '1196',
      addressCountry: 'CH'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '46.4167',
      longitude: '6.2667'
    },
    openingHours: [
      'Mo-Fr 07:00-21:00',
      'Sa 08:00-18:00',
      'Su 09:00-17:00'
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'CHF',
    areaServed: ['Gland', 'Nyon', 'Rolle', 'Morges', 'Lausanne'],
    serviceType: 'Pilates Reformer Classes',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cours de Pilates',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pilates Reformer Débutant',
            description: 'Cours de Pilates Reformer pour débutants'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pilates Reformer Intermédiaire',
            description: 'Cours de Pilates Reformer niveau intermédiaire'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Sophie L.'
        },
        reviewBody: 'Elaïa Studio a transformé ma pratique du Pilates. Les instructeurs sont exceptionnels et l\'ambiance est toujours bienveillante.'
      }
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Titre et meta descriptions */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <meta name="author" content={seoAuthor} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Elaïa Studio" />
      <meta property="og:locale" content="fr_CH" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@elaia_studio" />

      {/* Article spécifique */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Geo tags pour local SEO */}
      <meta name="geo.region" content="CH-VD" />
      <meta name="geo.placename" content="Gland" />
      <meta name="geo.position" content="46.4167;6.2667" />
      <meta name="ICBM" content="46.4167, 6.2667" />

      {/* Robots et indexation */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Langues alternatives */}
      <link rel="alternate" hrefLang="fr" href={seoUrl} />
      <link rel="alternate" hrefLang="en" href={`${seoUrl}/en`} />
      <link rel="alternate" hrefLang="x-default" href={seoUrl} />

      {/* Mobile et responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Rich snippets / Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />

      {/* Favicon et app icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#D4AF37" />

      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="application-name" content="Elaïa Studio" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Elaïa Studio" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Helmet>
  );
} 