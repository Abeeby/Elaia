import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'auto':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Mode clair';
      case 'dark':
        return 'Mode sombre';
      case 'auto':
        return 'Automatique';
      default:
        return 'Mode clair';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
        ${isDark 
          ? 'bg-gray-800 text-white hover:bg-gray-700' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }
        border ${isDark ? 'border-gray-700' : 'border-gray-300'}
        shadow-sm hover:shadow-md
        group
      `}
      title={getLabel()}
    >
      <div className="transition-transform group-hover:scale-110">
        {getIcon()}
      </div>
      <span className="text-sm font-medium hidden sm:block">
        {getLabel()}
      </span>
    </button>
  );
} 