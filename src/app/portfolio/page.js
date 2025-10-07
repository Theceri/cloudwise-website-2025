'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ExternalLink, Star, Zap, Shield, Users } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { projects } from '@/lib/projects'

// Divider Component
const Divider = () => (
  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent " />
)

const categories = ['All', 'AI Development', 'Web Development', 'Mobile Apps', 'E-commerce']

const achievements = [
  {
    icon: Star,
    title: '33+ Projects',
    description: 'Successfully delivered',
    color: 'text-brand-secondary'
  },
  {
    icon: Users,
    title: '33+ Clients',
    description: 'Happy customers',
    color: 'text-brand-accent1'
  },
  {
    icon: Zap,
    title: '100% Success',
    description: 'Project completion rate',
    color: 'text-brand-accent2'
  },
  {
    icon: Shield,
    title: 'Award-Winning',
    description: 'Recognized excellence',
    color: 'text-brand-secondary'
  },
]

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter(p => p.category === selectedCategory)

  return (
    <main className="overflow-hidden">
      {/* Enhanced Hero Section */}
      <Section className="relative min-h-screen flex items-center pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Enhanced Background with Multiple Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-brand-accent1/20" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-accent2/5 to-transparent" />
          <motion.div 
            className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-brand-secondary/30 to-brand-accent1/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-accent1/20 to-brand-accent2/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-secondary/10 to-brand-accent1/10 rounded-full border border-brand-secondary/20 mb-6"
          >
            <Star className="w-4 h-4 text-brand-secondary" />
            <span className="text-sm font-medium text-brand-secondary">33+ Successful Projects</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Our <span className="bg-gradient-to-r from-brand-secondary via-brand-accent1 to-brand-accent2 bg-clip-text text-transparent">Portfolio</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Explore our successful projects and case studies that showcase our expertise in delivering innovative digital solutions.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-3xl px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-brand-secondary to-brand-accent1"
            >
              <Link href="/contact">Start Your Project</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-3xl px-8 py-6 text-lg border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Link href="/services">Our Services</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Section>

      <Divider/>

      {/* Enhanced Category Filters */}
      <Section className="py-8 bg-gradient-to-r from-brand-accent1/5 via-white to-brand-accent2/5">
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {categories.map(category => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-2xl px-6 py-3 transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-brand-secondary to-brand-accent1 shadow-lg' 
                    : 'hover:bg-brand-secondary/10'
                }`}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Enhanced Project Cards */}
      <Section className="bg-gradient-to-b from-white via-brand-accent1/5 to-brand-secondary/10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover how we've helped businesses transform their digital presence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="h-full overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                {/* Image with overlay content */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Overlayed Title + Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <motion.span 
                      className="inline-block text-xs font-medium text-white bg-gradient-to-r from-brand-secondary to-brand-accent1 px-3 py-1 rounded-full shadow mb-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      {project.category}
                    </motion.span>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Description + CTA */}
                <div className="p-8 flex flex-col justify-between h-full">
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-brand-secondary to-brand-accent1 text-white rounded-2xl py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link href={`/portfolio/${project.slug}`} className="flex items-center gap-2 no-underline">
                        <span>View Case Study</span>
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* New Achievements Section */}
      <Section className="bg-gradient-to-r from-brand-accent1/10 via-white to-brand-accent2/10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-secondary">
            Our Track Record
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Numbers that speak to our commitment to excellence and client success
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <motion.div 
                className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-1 text-brand-primary">{achievement.title}</h3>
              <p className="text-gray-600 text-sm">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Enhanced Call to Action */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-brand-primary via-brand-accent2 to-brand-primary text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-secondary/10 to-brand-accent1/10" />
          <motion.div 
            className="absolute -top-20 -right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-secondary to-brand-accent1 bg-clip-text text-transparent">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Let's work together to create innovative solutions that drive your business forward.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild
                size="lg" 
                className="border-2 border-brand-secondary bg-gradient-to-r from-brand-secondary to-brand-accent1 px-10 py-4 rounded-3xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="/contact">
                  Start Your Project
                  <ExternalLink className="ml-2" size={20} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
