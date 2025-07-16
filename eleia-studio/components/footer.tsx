import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-studio-black text-studio-white">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-2xl mb-4">ELEIA</h3>
            <div className="space-y-2 text-sm opacity-80">
              <p>Solution de gestion pour studios de Pilates</p>
              <p>contact@eleia.app</p>
              <p>+41 22 555 0123</p>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="https://linkedin.com" target="_blank" className="opacity-60 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" className="opacity-60 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Produit</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/features" className="hover:opacity-100 transition-opacity">Fonctionnalités</Link></li>
              <li><Link href="/pricing" className="hover:opacity-100 transition-opacity">Tarifs</Link></li>
              <li><Link href="/demo" className="hover:opacity-100 transition-opacity">Démo gratuite</Link></li>
              <li><Link href="/updates" className="hover:opacity-100 transition-opacity">Mises à jour</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/help" className="hover:opacity-100 transition-opacity">Centre d'aide</Link></li>
              <li><Link href="/documentation" className="hover:opacity-100 transition-opacity">Documentation</Link></li>
              <li><Link href="/api" className="hover:opacity-100 transition-opacity">API</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-studio-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-8 mb-4 md:mb-0">
            <Link href="/legal" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              Mentions légales
            </Link>
            <Link href="/privacy" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              Confidentialité
            </Link>
            <Link href="/terms" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              Conditions d'utilisation
            </Link>
          </div>
          
          <p className="text-sm opacity-60">
            © {currentYear} Eleia. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer