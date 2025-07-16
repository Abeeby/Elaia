import React from 'react'

interface TestimonialCardProps {
  title: string
  text: string
  author: string
  role?: string
  rating: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ title, text, author, role, rating }) => {
  return (
    <article className="p-8 bg-studio-white h-full flex flex-col">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <p className="text-sm leading-relaxed mb-6 flex-grow opacity-80">
        {text}
      </p>
      <div className="pt-4 border-t border-studio-gray-200">
        <p className="font-medium text-sm">{author}</p>
        {role && <p className="text-xs text-studio-gray-600 mt-1">{role}</p>}
      </div>
    </article>
  )
}

export default TestimonialCard