'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Phone, Mail, MapPin, Send, Star, Zap, Shield, Users } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/lib/constants'

// Divider Component
const Divider = () => (
  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent " />
)

const features = [
  {
    icon: Zap,
    title: 'Quick Response',
    description: 'We respond to all inquiries within 24 hours',
    color: 'text-brand-secondary'
  },
  {
    icon: Shield,
    title: 'Secure Communication',
    description: 'Your information is always protected',
    color: 'text-brand-accent2'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Work directly with our experienced developers',
    color: 'text-brand-accent1'
  },
  {
    icon: Star,
    title: 'Free Consultation',
    description: 'Get expert advice at no cost',
    color: 'text-brand-secondary'
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const sendWhatsAppMessage = () => {
    const phoneNumber = '254712658775'
    const message = `Hello, my name is ${formData.name} (${formData.email}).\n\n${formData.message}`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

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
            <span className="text-sm font-medium text-brand-secondary">Get Expert Consultation</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Get in <span className="bg-gradient-to-r from-brand-secondary via-brand-accent1 to-brand-accent2 bg-clip-text text-transparent">Touch</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Have a project in mind? Let's discuss how we can help you achieve your goals.
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
              <a href={`tel:${COMPANY_INFO.phone}`}>Call Now</a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-3xl px-8 py-6 text-lg border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105"
            >
              <a href={`mailto:${COMPANY_INFO.email}`}>Send Email</a>
            </Button>
          </motion.div>
        </motion.div>
      </Section>

      <Divider/>

      {/* Enhanced Contact Information Cards */}
      <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-r from-brand-accent1/5 via-white to-brand-accent2/5">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
            Contact Information
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Multiple ways to reach us - choose what works best for you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: <Phone className="w-12 h-12 text-brand-secondary mx-auto mb-4" />,
              title: 'Phone',
              content: <a href={`tel:${COMPANY_INFO.phone}`} className="text-gray-600 hover:text-brand-secondary transition-colors text-lg font-medium">{COMPANY_INFO.phone}</a>,
              gradient: 'from-brand-secondary/20 to-brand-accent1/20',
              iconBg: 'bg-gradient-to-br from-brand-secondary to-brand-accent1',
            },
            {
              icon: <Mail className="w-12 h-12 text-brand-secondary mx-auto mb-4" />,
              title: 'Email',
              content: <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-600 hover:text-brand-secondary transition-colors text-lg font-medium">{COMPANY_INFO.email}</a>,
              gradient: 'from-brand-accent1/20 to-brand-accent2/20',
              iconBg: 'bg-gradient-to-br from-brand-accent1 to-brand-accent2',
            },
            {
              icon: <MapPin className="w-12 h-12 text-brand-secondary mx-auto mb-4" />,
              title: 'Office',
              content: <p className="text-gray-600 text-lg font-medium">Nairobi, Kenya</p>,
              gradient: 'from-brand-accent2/20 to-brand-secondary/20',
              iconBg: 'bg-gradient-to-br from-brand-accent2 to-brand-secondary',
            },
          ].map(({ icon, title, content, gradient, iconBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1), duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-0 text-center h-full`}>
                <motion.div 
                  className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-brand-primary mb-4">{title}</h3>
                {content}
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
            Why Work With Us?
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

      {/* Enhanced Contact Form + Map Section */}
      <Section className="bg-gradient-to-b from-white via-brand-accent1/5 to-brand-secondary/10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
            Send us a Message
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you within 24 hours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Enhanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-brand-primary mb-8">Get in Touch</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-secondary to-brand-accent1 text-white rounded-2xl py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={sendWhatsAppMessage}
                  >
                    Send Message <Send size={16} />
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="rounded-3xl p-0 overflow-hidden shadow-xl">
              <div className="rounded-3xl overflow-hidden w-full h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8149482568783!2d36.821452873727544!3d-1.2849942356221171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11e00adb9341%3A0xd63201e2d4bae3ae!2sCloudwise%20Technologies!5e0!3m2!1sen!2ske!4v1748416706423!5m2!1sen!2ske"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cloudwise Technologies Location"
                  className="rounded-3xl"
                />
              </div>
            </Card>
          </motion.div>
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
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Let's discuss your ideas and turn them into reality. Contact us today for a free consultation.
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
                <a href={`tel:${COMPANY_INFO.phone}`}>Call Us Now</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
