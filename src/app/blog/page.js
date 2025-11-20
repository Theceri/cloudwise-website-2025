'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/button'
import { Star, Zap, Shield, Users } from 'lucide-react'

// Divider Component
const Divider = () => (
  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent " />
)

const categories = [
  'All',
  'AI & Machine Learning',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'Digital Transformation',
]

const features = [
  {
    icon: Star,
    title: 'Expert Insights',
    description: 'Learn from industry professionals',
    color: 'text-brand-secondary'
  },
  {
    icon: Zap,
    title: 'Latest Trends',
    description: 'Stay updated with cutting-edge technology',
    color: 'text-brand-accent2'
  },
  {
    icon: Shield,
    title: 'Best Practices',
    description: 'Proven strategies for success',
    color: 'text-brand-accent1'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join our growing community',
    color: 'text-brand-secondary'
  },
]

export default function BlogUI() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  // Make sure this STRAPI_BASE_URL is correct for your Strapi instance
  // For local frontend targeting remote Strapi: 'http://139.59.64.136:54321'
  // For local frontend targeting local Strapi: 'http://localhost:1337' (or your Strapi's local port)
  const STRAPI_BASE_URL = 'https://blogadmin.cloudwise.co.ke'; 

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${STRAPI_BASE_URL}/api/posts?populate[category][fields][0]=name&populate[cover][fields][0]=url`)
        const json = await res.json()

        console.log("Raw API Response:", json)

        if (!json.data || !Array.isArray(json.data)) {
          console.error('Invalid data structure or empty data array:', json)
          setBlogPosts([])
          setLoading(false)
          return
        }

        const posts = json.data.map(item => {
          // *** FIX APPLIED HERE ***
          // Based on your console logs, the item itself contains the attributes directly.
          const postData = item || {}; 

          const blocks = postData.content || [];
          const rawDate = postData.date;
          
          const formattedDate = rawDate
            ? new Date(rawDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''

          // Access category and cover properties directly from postData,
          // then the 'name' and 'url' from within them.
          const categoryName = postData.category?.name || 'Uncategorized';
          const coverUrl = postData.cover?.url || null;

          console.log("Processing item (after adjustment):", postData) 
          console.log("Extracted title:", postData.title) 
          console.log("Extracted category:", categoryName)
          console.log("Extracted cover URL:", coverUrl)

          return {
            id: postData.id,
            title: postData.title || 'No Title',
            slug: postData.slug || '',
            readtime: postData.readtime || 'N/A',
            date: formattedDate,
            url: postData.url, 
            content: blocks,
            category: categoryName,
            coverUrl: coverUrl,
          }
        }).filter(post => post.id !== undefined) // Filter out any items without an ID

        console.log("Processed blogPosts state:", posts)

        setBlogPosts(posts)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setLoading(false)
      }
    }

    fetchPosts()
  }, []) // Empty dependency array means this effect runs once after the initial render

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter(post => post.category === selectedCategory)

  // Identify featured post and other posts for rendering
  const featuredTitle = 'The Future of AI in Business: Trends to Watch' // Ensure this title matches an existing post
  const featuredPost = filteredPosts.find(post => post.title === featuredTitle)
  const otherPosts = filteredPosts.filter(post => post.title !== featuredTitle)

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
            <span className="text-sm font-medium text-brand-secondary">Latest Tech Insights</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Our <span className="bg-gradient-to-r from-brand-secondary via-brand-accent1 to-brand-accent2 bg-clip-text text-transparent">Blog</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Stay updated with the latest insights, trends, and best practices in technology and digital transformation.
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
              <a href="#blog-posts">Read Articles</a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-3xl px-8 py-6 text-lg border-2 border-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-105"
            >
              <a href="/contact">Get Consultation</a>
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
            Why Read Our Blog?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We share our expertise and insights to help you stay ahead in the digital world
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

      {/* Enhanced Blog Posts Display */}
      <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-brand-accent1/5 to-brand-secondary/10" id="blog-posts">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insights, tutorials, and industry trends from our expert team
          </p>
        </motion.div>

        {loading ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </motion.div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-600 text-lg">No posts found.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Enhanced Featured Post */}
            {featuredPost && (
              <motion.div
                key={featuredPost.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="col-span-1 md:col-span-2 rounded-3xl overflow-hidden shadow-xl group relative"
                whileHover={{ y: -10 }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={featuredPost.coverUrl ? `${STRAPI_BASE_URL}${featuredPost.coverUrl}` : `https://source.unsplash.com/random/900x400?sig=${featuredPost.id}`}
                    alt="Featured post"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <motion.span 
                      className="inline-block text-xs font-medium bg-gradient-to-r from-brand-secondary to-brand-accent1 px-3 py-1 rounded-full shadow mb-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      Featured • {featuredPost.category}
                    </motion.span>
                    <h2 className="text-3xl font-bold mb-3">{featuredPost.title}</h2>
                    <p className="text-sm text-gray-200 mb-4">
                      {featuredPost.date} • {featuredPost.readtime} read
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild className="bg-gradient-to-r from-brand-secondary to-brand-accent1 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                        <a href={`/blog/${featuredPost.slug}`}>Read more →</a>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Other Posts */}
            {otherPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white group"
                whileHover={{ y: -10 }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.coverUrl ? `${STRAPI_BASE_URL}${post.coverUrl}` : `https://source.unsplash.com/random/600x400?sig=${post.id}`}
                    alt="Post image"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <motion.span 
                    className="absolute top-4 left-4 text-xs font-medium text-white bg-gradient-to-r from-brand-secondary to-brand-accent1 px-3 py-1 rounded-full shadow"
                    whileHover={{ scale: 1.05 }}
                  >
                    {post.category}
                  </motion.span>
                </div>
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-brand-primary mb-3">{post.title}</h2>
                  <p className="text-xs text-gray-500 mb-4">{post.date} • {post.readtime} read</p>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-6">
                    {post.content?.length ? (
                      <BlocksRenderer content={post.content} />
                    ) : (
                      "No preview available."
                    )}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button asChild className="w-full bg-gradient-to-r from-brand-secondary to-brand-accent1 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                      <a href={`/blog/${post.slug}`}>Read more →</a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
              Need Expert Guidance?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Ready to implement these insights in your business? Let's discuss how we can help you achieve your goals.
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
                <a href="/contact">Get Free Consultation</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}