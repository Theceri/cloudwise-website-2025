'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
}

export function Card({
  className,
  children,
  variant = 'default',
  animate = true,
  delay = 0,
  ...props
}) {
  const variants = {
    default: 'bg-white',
    filled: 'bg-brand-primary text-white',
    outline: 'border border-gray-200',
  }

  const Wrapper = animate ? motion.div : 'div'
  const motionProps = animate ? {
    variants: cardVariants,
    initial: 'hidden',
    whileInView: 'visible',
    whileHover: 'hover',
    viewport: { once: true },
    transition: { delay }
  } : {}

  return (
    <Wrapper
      className={cn(
        'rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl',
        variants[variant],
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Wrapper>
  )
} 