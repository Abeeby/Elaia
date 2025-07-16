import React from 'react'
import Image from 'next/image'

interface InstructorCardProps {
  name: string
  image: string
}

const InstructorCard: React.FC<InstructorCardProps> = ({ name, image }) => {
  return (
    <div className="text-center group cursor-pointer">
      <div className="relative aspect-square rounded-full overflow-hidden mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <p className="text-sm tracking-wider">{name}</p>
    </div>
  )
}

export default InstructorCard