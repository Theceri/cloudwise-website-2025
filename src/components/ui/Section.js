'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export function Section({ 
  children, 
  className,
  animate = true,
  delay = 0,
  id
}) {
  const Wrapper = animate ? motion.section : 'section'
  const props = animate ? {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true },
    variants: fadeInUp,
    transition: { delay }
  } : {}

  return (
    <Wrapper
      className={cn(
        'py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden',
        className
      )}
      id={id}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </Wrapper>
  )
} 