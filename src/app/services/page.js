'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Brain, Code, Smartphone, ShoppingBag,
  Cloud, Database, Bot, LineChart, Star, Zap, Shield, Users
} from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

// Divider Component
const Divider = () => (
  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent " />
)

const services = [
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Agent Development',
    description: 'Leverage the power of AI to revolutionize your business through intelligent products and seamless AI integrations.',
    features: [
      'Custom AI Model Development',
      'Natural Language Processing',
      'Machine Learning Integration',
      'AI-Powered Automation',
    ],
    image: '/Agent-Development.png',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
  {
    id: 'web',
    icon: Code,
    title: 'Web Development',
    description: 'Elevate your online presence with stunning websites that captivate visitors and drive conversions.',
    features: [
      'Custom Web Applications',
      'Progressive Web Apps',
      'Responsive Design',
      'Performance Optimization',
    ],
    image: '/web-development.jpg',
    gradient: 'from-brand-accent1/20 to-brand-accent2/20',
    iconBg: 'bg-gradient-to-br from-brand-accent1 to-brand-accent2',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Reach your audience on the go with engaging and user-friendly mobile apps that deliver exceptional experiences.',
    features: [
      'iOS App Development',
      'Android App Development',
      'Cross-Platform Solutions',
      'Mobile UI/UX Design',
    ],
    image: '/Mobile-App.png',
    gradient: 'from-brand-accent2/20 to-brand-secondary/20',
    iconBg: 'bg-gradient-to-br from-brand-accent2 to-brand-secondary',
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    description: 'Maximize your online sales potential with comprehensive e-commerce solutions that drive conversions.',
    features: [
      'Custom E-commerce Platforms',
      'Payment Gateway Integration',
      'Inventory Management',
      'Analytics & Reporting',
    ],
    image: '/shopping.jpg',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Deploy and scale your applications efficiently with our cloud infrastructure and migration services.',
    features: [
      'Cloud Migration',
      'Infrastructure Setup',
      'DevOps Implementation',
      'Continuous Integration',
    ],
    image: '/marketplace.jpg',
    gradient: 'from-brand-accent1/20 to-brand-accent2/20',
    iconBg: 'bg-gradient-to-br from-brand-accent1 to-brand-accent2',
  },
  {
    id: 'data',
    icon: Database,
    title: 'Data Services',
    description: 'Transform raw data into actionable insights with our comprehensive data services.',
    features: [
      'Data Analytics',
      'Business Intelligence',
      'Data Visualization',
      'ETL Processing',
    ],
    image: '/32438.jpg',
    gradient: 'from-brand-accent2/20 to-brand-secondary/20',
    iconBg: 'bg-gradient-to-br from-brand-accent2 to-brand-secondary',
  },
  {
    id: 'automation',
    icon: Bot,
    title: 'Process Automation',
    description: 'Streamline your business operations with intelligent automation solutions.',
    features: [
      'Workflow Automation',
      'RPA Implementation',
      'Business Process Optimization',
      'Integration Services',
    ],
    image: '/process-automation.png',
    gradient: 'from-brand-secondary/20 to-brand-accent1/20',
    iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
  },
  {
    id: 'consulting',
    icon: LineChart,
    title: 'Tech Consulting',
    description: 'Get expert guidance on your digital transformation journey.',
    features: [
      'Technology Assessment',
      'Digital Strategy',
      'Architecture Planning',
      'Security Consulting',
    ],
    image: '/IT-Consulting.jpg',
    gradient: 'from-brand-accent1/20 to-brand-accent2/20',
    iconBg: 'bg-gradient-to-br from-brand-accent1 to-brand-accent2',
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
    icon: Star,
    title: 'Award-Winning',
    description: 'Recognized for excellence in digital innovation',
    color: 'text-brand-secondary'
  },
]

export default function Services() {
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
            <span className="text-sm font-medium text-brand-secondary">Comprehensive Digital Solutions</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Our <span className="bg-gradient-to-r from-brand-secondary via-brand-accent1 to-brand-accent2 bg-clip-text text-transparent">Services</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            We offer a comprehensive suite of digital solutions to help your business
            thrive in the modern world. From AI development to cloud solutions,
            we've got you covered.
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
              <Link href="/contact">Get Started</Link>
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

      <Divider/>

      {/* Enhanced Services Grid */}
      <Section className="bg-gradient-to-b from-white via-brand-accent1/5 to-brand-secondary/10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
            What We Offer
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
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
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature List */}
                  <motion.ul
                    initial="hidden"
                    whileInView="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.2,
                        },
                      },
                    }}
                    className="space-y-2 mb-6"
                  >
                    {service.features.map((feature) => (
                      <motion.li
                        key={feature}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          show: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mr-3" />
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-auto"
                  >
                    <Link href={`/services/${service.id}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full rounded-2xl group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </motion.div>
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
            Why Choose Our Services?
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

      {/* Enhanced CTA Section */}
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Let's discuss how our services can help you achieve your business goals.
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
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
