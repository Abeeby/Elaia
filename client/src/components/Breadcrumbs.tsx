import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs() {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    
    if (path.startsWith('/admin')) {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Accueil', href: '/' },
        { label: 'Administration', href: '/admin' }
      ];
      
      if (path === '/admin/users') {
        breadcrumbs.push({ label: 'Gestion des utilisateurs' });
      } else if (path === '/admin/classes') {
        breadcrumbs.push({ label: 'Gestion du planning' });
      } else if (path === '/admin/reports') {
        breadcrumbs.push({ label: 'Rapports détaillés' });
      }
      
      return breadcrumbs;
    }
    
    return [{ label: 'Accueil', href: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-elaia-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-elaia-gray font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
} 