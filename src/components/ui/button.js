'use client';

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Button = forwardRef(({ 
  className, 
  variant = 'primary',
  size = 'md',
  children,
  asChild = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: 'bg-brand-secondary text-white hover:bg-brand-secondary/90',
    secondary: 'bg-brand-primary text-white hover:bg-brand-primary/90',
    outline: 'border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10',
    ghost: 'hover:bg-brand-secondary/10 text-brand-secondary',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-8 text-lg',
  }

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )

  if (asChild) {
    // When asChild is true, we expect children to be a single React element
    // We'll clone it and add our classes and props
    const child = React.Children.only(children)
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
      ref: ref,
      ...props
    })
  }

  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
