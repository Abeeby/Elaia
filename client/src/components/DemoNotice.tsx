import { AlertCircle } from 'lucide-react';

export default function DemoNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Mode Démonstration</p>
          <p>
            Cette application est en mode démonstration. Le backend n'est pas encore déployé.
            Pour une démonstration complète avec toutes les fonctionnalités, veuillez exécuter 
            l'application en local ou contacter l'équipe de développement.
          </p>
        </div>
      </div>
    </div>
  );
} 