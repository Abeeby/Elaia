import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const InstagramFeed = () => {
  // Mock Instagram posts - en production, utilisez l'API Instagram
  const posts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', caption: 'Morning flow' },
    { id: 2, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', caption: 'Yoga practice' },
    { id: 3, image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400', caption: 'Reformer session' },
    { id: 4, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', caption: 'Group class' },
    { id: 5, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', caption: 'Studio vibes' },
    { id: 6, image: 'https://images.unsplash.com/photo-1540206063137-4a88ca974d1a?w=400', caption: 'Wellness journey' },
  ]

  return (
    <section className="space-section">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Suivez-nous.</h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Link href="https://instagram.com" target="_blank" className="btn-ghost">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
              Suivre
            </Link>
          </div>
          <p className="text-xl font-light">#swisspilates</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href="https://instagram.com" 
              target="_blank"
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-studio-black/0 group-hover:bg-studio-black/20 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InstagramFeed