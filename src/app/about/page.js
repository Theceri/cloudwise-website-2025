'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Users, Target, Award, Lightbulb, Star, Zap, Shield, Globe } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import Link from 'next/link'

// Divider Component
const Divider = () => (
  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent " />
)

const values = [
  {
    icon: Target,
    title: 'Innovation First',
    description: 'We stay ahead of technological trends to deliver cutting-edge solutions that give our clients a competitive advantage.',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
  {
    icon: Users,
    title: 'Client Partnership',
    description: 'We build lasting relationships with our clients, understanding their needs and growing together.',
    gradient: 'from-brand-accent1/20 to-brand-accent2/20',
    iconBg: 'bg-gradient-to-br from-brand-accent1 to-brand-accent2',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in code quality, design, and project delivery.',
    gradient: 'from-brand-accent2/20 to-brand-secondary/20',
    iconBg: 'bg-gradient-to-br from-brand-accent2 to-brand-secondary',
  },
  {
    icon: Lightbulb,
    title: 'Creative Solutions',
    description: 'We think outside the box to solve complex problems with innovative approaches.',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
]

const teamMembers = [
  { 
    name: 'Paul Theceri', 
    role: 'CEO & Founder', 
    image: '/placeholder1.jpg',
    gradient: 'from-brand-secondary to-brand-accent1'
  },
  { 
    name: 'Edwin Kailikia', 
    role: 'Technical Lead', 
    image: '/placeholder2.jpg',
    gradient: 'from-brand-accent1 to-brand-accent2'
  },
  { 
    name: 'Brian Kivuti', 
    role: 'Design Lead', 
    image: '/placeholder3.jpg',
    gradient: 'from-brand-accent2 to-brand-secondary'
  },
  { 
    name: 'Joseph Mutua', 
    role: 'Project Manager', 
    image: '/placeholder4.jpg',
    gradient: 'from-brand-secondary to-brand-accent1'
  },
]

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
    icon: Globe,
    title: '3 Countries',
    description: 'Global reach',
    color: 'text-brand-accent2'
  },
  {
    icon: Award,
    title: '100% Success',
    description: 'Project completion rate',
    color: 'text-brand-secondary'
  },
]

export default function About() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

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
            <span className="text-sm font-medium text-brand-secondary">Trusted by 33+ Companies</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-brand-secondary via-brand-accent1 to-brand-accent2 bg-clip-text text-transparent">
              About
            </span>{' '}
            <span className="text-brand-primary">Cloudwise</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            We are a team of passionate technologists dedicated to transforming businesses 
            through innovative digital solutions. Our expertise spans across AI, 
            web development, mobile apps, and more.
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
              <Link href="/contact">Get in Touch</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-3xl px-8 py-6 text-lg border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Section>

      <Divider />

      {/* Enhanced Mission Section */}
      <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-brand-primary to-brand-accent2 text-white relative overflow-hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.4 }}
            className="space-y-6"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-brand-secondary to-brand-accent1 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.h2>
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              At Cloudwise, we're on a mission to empower businesses through digital transformation. We believe that every company deserves access to cutting-edge technology solutions that can drive growth and innovation.
            </motion.p>
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our commitment to excellence, innovation, and client success has made us a trusted partner for businesses across multiple industries.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <Image
                src="/main2.jpg"
                alt="Our Mission"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [-15, 15, -15],
                x: [-10, 10, -10]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-brand-secondary to-brand-accent1 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [15, -15, 15],
                x: [10, -10, 10]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-brand-accent1 to-brand-accent2 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Enhanced Values Section */}
      <Section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-brand-accent1/5 to-brand-secondary/10">
        <motion.div 
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-secondary">
            Our Values
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            These core values guide everything we do and help us deliver exceptional results for our clients.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className={`bg-gradient-to-br ${value.gradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden relative`}>
                <div className="relative z-10">
                  <motion.div 
                    className={`w-16 h-16 ${value.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-brand-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
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
            Our Achievements
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

      {/* Enhanced Team Section */}
      <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-brand-accent1/10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-secondary">
            Meet Our Team
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our diverse team of experts brings together years of experience in technology, design, and business strategy.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, amount: 0.4 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -10 }}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm opacity-90">{member.role}</p>
                  </div>
                </div>
              </div>
              
              {/* Gradient Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Call to Action Section */}
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
              Ready to Work With Us?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Let's discuss how we can help transform your business with innovative digital solutions.
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
                <Link href="/contact">Start Your Project</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
