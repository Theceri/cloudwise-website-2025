'use client';

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Code, Smartphone, ShoppingBag, Brain, Star, Zap, Shield, Users, Globe, Award } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { COMPANY_INFO } from '@/lib/constants'
import QuoteForm from "@/components/QuoteForm";
import Marquee from "react-fast-marquee";
import Link from 'next/link'
import Image from 'next/image'

// Divider Component
const Divider = () => (
  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent " />
)

const services = [
  {
    icon: Brain,
    title: 'AI Agent Development',
    description: 'Leverage the power of AI to revolutionize your business through intelligent products and seamless AI integrations.',
    image: '/Agent-Development.png',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
  {
    icon: Code,
    title: 'Web Development',
    description: 'Elevate your online presence with stunning websites that captivate visitors and drive conversions.',
    image: '/web-development.jpg',
    gradient: 'from-brand-accent1/20 to-brand-accent2/20',
    iconBg: 'bg-gradient-to-br from-brand-accent1 to-brand-accent2',
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Reach your audience on the go with engaging and user-friendly mobile apps that deliver exceptional experiences.',
    image: '/Mobile-App.png',
    gradient: 'from-brand-accent2/20 to-brand-secondary/20',
    iconBg: 'bg-gradient-to-br from-brand-accent2 to-brand-secondary',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    description: 'Maximize your online sales potential with comprehensive e-commerce solutions that drive conversions.',
    image: '/shopping.jpg',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance for seamless user experiences',
    color: 'text-brand-secondary'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime guarantee',
    color: 'text-brand-accent2'
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Designed with your customers in mind for maximum engagement',
    color: 'text-brand-accent1'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Scalable solutions that work across all markets',
    color: 'text-brand-secondary'
  },
]

export default function Home() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <Section className="relative min-h-screen flex items-center pt-24 pb-20 md:pt-24 md:pb-28 overflow-hidden">
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
          <motion.div 
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-brand-secondary/10 to-brand-accent2/20 rounded-full blur-2xl"
            animate={{ 
              x: [-50, 50, -50],
              y: [-30, 30, -30]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Enhanced Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-secondary/10 to-brand-accent1/10 rounded-full border border-brand-secondary/20"
            >
              <Star className="w-4 h-4 text-brand-secondary" />
              <span className="text-sm font-medium text-brand-secondary">Trusted by 33+ Companies</span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-brand-secondary via-brand-accent1 to-brand-accent2 bg-clip-text text-transparent">
                Transform Your Business
              </span>{' '}
              <br />
              <span className="text-brand-primary">with Digital Products</span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Unleash the power of digital transformation to elevate your business. 
              We blend creativity with cutting-edge technology to deliver products 
              that excel in design and functionality.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-3xl px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-brand-secondary to-brand-accent1"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight size={20} />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-3xl px-8 py-6 text-lg border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Visual Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex justify-center"
          >
            <div className="relative">
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
                  src="/dt-banner-5.png"
                  alt="Hero visual"
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
                <Award className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Divider/>

      {/* Enhanced Clients Section */}
      <motion.div 
        className='bg-gradient-to-r from-white via-brand-accent1/5 to-white py-16'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We've helped companies across various industries achieve their digital transformation goals
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Marquee speed={40} pauseOnHover={true}>
            {[1,2,3,4,5,6,7,8].map((num) => (
              <motion.div
                key={num}
                className="mx-8"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image 
                  src={`/marquee${num}.png`} 
                  alt={`Client Logo ${num}`} 
                  width={130}
                  height={130}
                  className="h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </motion.div>
            ))}
          </Marquee>
        </motion.div>
      </motion.div>

      {/* Enhanced Services Section */}
      <Section className="bg-gradient-to-b from-white via-brand-accent1/5 to-brand-secondary/10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
            Our Services
          </h2>
          <p className="text-text-body text-lg max-w-2xl mx-auto">
            We offer a comprehensive suite of digital solutions to help your business thrive in the modern world.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className={`bg-gradient-to-br ${service.gradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden relative`}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div 
                    className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-brand-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-body leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* New Features Section */}
      <Section className="bg-gradient-to-br from-brand-primary to-brand-accent2 text-white">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Cloudwise?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We combine technical expertise with creative vision to deliver exceptional results
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <motion.div 
                className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Enhanced Stats Section */}
      <Section className="bg-gradient-to-r from-brand-accent1/10 via-white to-brand-accent2/10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="filled" delay={0.1} className="rounded-3xl p-8 bg-gradient-to-br from-brand-secondary to-brand-accent1 text-white shadow-xl">
              <motion.div 
                className="text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {COMPANY_INFO.stats.projectsDone}+
              </motion.div>
              <div className="text-white/90 font-medium">Projects Completed</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="filled" delay={0.2} className="rounded-3xl p-8 bg-gradient-to-br from-brand-accent1 to-brand-accent2 text-white shadow-xl">
              <motion.div 
                className="text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {COMPANY_INFO.stats.happyCustomers}
              </motion.div>
              <div className="text-white/90 font-medium">Happy Clients</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="filled" delay={0.3} className="rounded-3xl p-8 bg-gradient-to-br from-brand-accent2 to-brand-secondary text-white shadow-xl">
              <motion.div 
                className="text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {COMPANY_INFO.stats.countries}
              </motion.div>
              <div className="text-white/90 font-medium">Countries Served</div>
            </Card>
          </motion.div>
        </motion.div>
      </Section>

      {/* Enhanced Call to Action Section */}
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
              Ready to Start Your Next Project?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Get in touch with us today for a free consultation and quote. Let's bring your digital vision to life together.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <QuoteForm 
                trigger={
                  <button className="border-2 border-brand-secondary bg-gradient-to-r from-brand-secondary to-brand-accent1 px-10 py-4 rounded-3xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                    Get Your Free Quote
                  </button>
                }
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}

