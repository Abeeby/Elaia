import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ServiceCardProps {
  title: string
  subtitle: string
  description: string
  options: string[]
  image: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, subtitle, description, options, image }) => {
  return (
    <article className="service-card group cursor-pointer h-full">
      <div className="relative h-[500px] md:h-[600px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="service-card-overlay" />
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl md:text-4xl font-light mb-4">{title}</h3>
            <p className="text-lg mb-8 opacity-90">{subtitle}</p>
            
            <div className="mb-8">
              <ul className="space-y-3">
                {options.map((option, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-sm leading-relaxed mb-8 opacity-80">
              {description}
            </p>
            
            <Link href="/demo" className="inline-flex items-center text-sm uppercase tracking-wider 
                           group-hover:opacity-70 transition-opacity duration-300">
              En savoir plus
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ServiceCard