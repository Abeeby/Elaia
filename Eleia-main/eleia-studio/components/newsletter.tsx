'use client'

import React, { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [studioName, setStudioName] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && studioName && consent) {
      setIsSubmitted(true)
      // Ici, vous intégreriez avec votre service d'email
    }
  }

  return (
    <section className="space-section bg-studio-gray-50">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl mb-2">
                Restez informé des <strong>nouveautés</strong>
              </h2>
              <p className="text-lg mb-12 opacity-80">
                Recevez nos dernières fonctionnalités et conseils pour optimiser votre studio.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Nom du studio"
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email professionnel"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="checkbox mt-1 mr-3"
                    required
                  />
                  <label htmlFor="consent" className="text-sm opacity-80">
                    J'accepte de recevoir des communications d'Eleia et je peux me désinscrire à tout moment.
                  </label>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn-primary">
                    S'inscrire
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-12">
              <h3 className="text-2xl mb-4">Merci pour votre inscription!</h3>
              <p className="opacity-80">
                Nous vous avons envoyé un email de confirmation. 
                Vous recevrez bientôt nos dernières actualités et conseils.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter