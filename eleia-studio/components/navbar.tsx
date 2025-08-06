'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/features', label: 'Fonctionnalités' },
    { href: '/pricing', label: 'Tarifs' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-header transition-all duration-500 ${
        isScrolled ? 'bg-studio-cream/95 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <nav className="container-wide h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50">
            <h1 className="text-xl font-medium tracking-wider">ELEIA</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wider uppercase transition-opacity hover:opacity-60 ${
                  pathname === item.href ? 'font-medium' : 'font-light'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login" className="btn-ghost">
              Se connecter
            </Link>
            <Link href="/demo" className="btn-primary">
              Démo gratuite
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center"
          >
            <div className="w-6">
              <span className={`block h-px bg-studio-black transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
              }`} />
              <span className={`block h-px bg-studio-black mt-[4px] transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block h-px bg-studio-black mt-[4px] transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
              }`} />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-studio-cream z-40 lg:hidden"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col justify-center px-8"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="py-4"
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-light"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-col space-y-4"
              >
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-outline inline-block text-center"
                >
                  Se connecter
                </Link>
                <Link
                  href="/demo"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary inline-block text-center"
                >
                  Demander une démo
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar