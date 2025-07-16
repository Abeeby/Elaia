'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ServiceCard from '@/components/service-card'
import TestimonialCard from '@/components/testimonial-card'
import Newsletter from '@/components/newsletter'

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true })

  const features = [
    {
      title: 'GESTION DES RÉSERVATIONS',
      subtitle: 'Système en temps réel',
      description: 'Gérez facilement les réservations de vos cours avec notre système intuitif et en temps réel.',
      options: ['Calendrier interactif', 'Notifications automatiques', 'Liste d\'attente', 'Rappels SMS/Email'],
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    },
    {
      title: 'SUIVI DES ABONNEMENTS',
      subtitle: 'Gestion simplifiée',
      description: 'Suivez les abonnements mensuels et à la séance de vos clients en un coup d\'œil.',
      options: ['Abonnements illimités', 'Cartes de séances', 'Renouvellements auto', 'Historique complet'],
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    },
    {
      title: 'TABLEAU DE BORD ADMIN',
      subtitle: 'Vue d\'ensemble complète',
      description: 'Interface administrateur puissante pour gérer tous les aspects de votre studio.',
      options: ['Statistiques détaillées', 'Rapports financiers', 'Gestion instructeurs', 'Analytics avancés'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    }
  ]

  const testimonials = [
    {
      title: 'Gain de temps incroyable',
      text: 'Eleia a transformé la gestion de mon studio. Je passe moins de temps sur l\'administratif et plus avec mes clients. L\'interface est intuitive et mes clients adorent pouvoir réserver en ligne.',
      author: 'Sophie Martin',
      role: 'Studio Pilates Genève',
      rating: 5
    },
    {
      title: 'Solution complète et fiable',
      text: 'Tout ce dont j\'avais besoin en une seule application. La gestion des abonnements est un jeu d\'enfant et le support client est exceptionnel. Je recommande à 100%.',
      author: 'Marie Dubois',
      role: 'Reformer Studio Lausanne',
      rating: 5
    },
    {
      title: 'Interface moderne et efficace',
      text: 'Mes clients apprécient la facilité de réservation et moi j\'adore le tableau de bord. Les statistiques m\'aident à prendre de meilleures décisions pour mon studio.',
      author: 'Laura Schneider',
      role: 'Pilates & Co Zurich',
      rating: 5
    }
  ]

  const stats = [
    { number: '500+', label: 'Studios actifs' },
    { number: '50K+', label: 'Réservations/mois' },
    { number: '98%', label: 'Satisfaction client' },
    { number: '24/7', label: 'Support disponible' },
  ]

  return (
    <div className="min-h-screen bg-studio-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600"
            alt="Eleia Studio Management"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-studio-black/40 to-studio-black/60" />
        </div>
        
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-studio-white container-narrow"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-6">
            ELEIA
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 opacity-90">
            La solution moderne pour gérer votre studio de Pilates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" className="btn-primary bg-studio-white text-studio-black hover:bg-studio-gray-100">
              Demander une démo
            </Link>
            <Link href="/login" className="btn-outline border-studio-white text-studio-white hover:bg-studio-white hover:text-studio-black">
              Se connecter
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-studio-white">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-light mb-2">{stat.number}</div>
                <div className="text-sm uppercase tracking-wider text-studio-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={servicesRef} className="py-32">
        <div className="container-narrow text-center mb-16">
          <h2 className="text-display mb-8">
            TOUT CE DONT VOUS<br />
            AVEZ BESOIN
          </h2>
          <p className="text-xl text-studio-gray-600">
            Une plateforme complète pour digitaliser votre studio
          </p>
        </div>
        <div className="services-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <ServiceCard {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features List */}
      <section ref={featuresRef} className="space-section bg-studio-white">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-title mb-8">Fonctionnalités essentielles</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-studio-black rounded-full mt-2 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Réservations en ligne</h3>
                    <p className="text-studio-gray-600">Permettez à vos clients de réserver leurs cours 24h/24 depuis n'importe où.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-studio-black rounded-full mt-2 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Paiements sécurisés</h3>
                    <p className="text-studio-gray-600">Acceptez les paiements en ligne et gérez votre comptabilité simplement.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-studio-black rounded-full mt-2 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Application mobile</h3>
                    <p className="text-studio-gray-600">Vos clients peuvent gérer leurs réservations depuis leur smartphone.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-studio-black rounded-full mt-2 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Rapports détaillés</h3>
                    <p className="text-studio-gray-600">Analysez les performances de votre studio avec des rapports complets.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-4/5">
              <Image
                src="https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800"
                alt="Eleia Dashboard"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-section">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-studio-gray-600 mb-4">Témoignages</p>
            <h2 className="text-title mb-4">Nos studios parlent</h2>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-studio-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm">4.9 sur 500+ avis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-section bg-studio-black text-studio-white">
        <div className="container-narrow text-center">
          <h2 className="text-title mb-8">Prêt à digitaliser votre studio ?</h2>
          <p className="text-xl mb-12 opacity-90">
            Rejoignez les centaines de studios qui ont choisi Eleia pour simplifier leur gestion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" className="btn-primary bg-studio-white text-studio-black hover:bg-studio-gray-100">
              Planifier une démo gratuite
            </Link>
            <Link href="/pricing" className="btn-outline border-studio-white text-studio-white hover:bg-studio-white hover:text-studio-black">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      <Footer />
    </div>
  )
}