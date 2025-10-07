const cloudwiseClient = {
  name: 'Cloudwise Limited',
  about:
    'Cloudwise is a technology company established in 2019 and registered in 2022, committed to empowering organizations through innovative digital solutions.',
  services: [
    'AI products and integrations',
    'Software maintenance',
    'Digital transformation consulting',
  ],
}

export const projects = [
  {
    slug: 'ai-customer-platform',
    title: 'AI-Powered Customer Service Platform',
    category: 'AI Development',
    description:
      'An intelligent customer service platform that uses natural language processing to automate responses and improve customer satisfaction.',
    image: '/agent.png',
    technologies: ['Python', 'TensorFlow', 'React', 'Node.js'],
    results: {
      metric1: '85% reduction in response time',
      metric2: '95% customer satisfaction rate',
      metric3: '60% cost reduction',
    },
    client: cloudwiseClient,
  },
  {
    slug: 'ecommerce-mobile-app',
    title: 'E-commerce Mobile App',
    category: 'Mobile Apps',
    description:
      'A feature-rich mobile shopping app with personalized recommendations and seamless payment integration.',
    image: '/shopping.jpg',
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    results: {
      metric1: '200% increase in mobile sales',
      metric2: '50k+ downloads',
      metric3: '4.8/5 app rating',
    },
    client: cloudwiseClient,
  },
  {
    slug: 'enterprise-web-portal',
    title: 'Enterprise Web Portal',
    category: 'Web Development',
    description:
      'A comprehensive web portal for managing business operations, analytics, and customer relationships.',
    image: '/dashboard.jpg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
    results: {
      metric1: '40% improvement in efficiency',
      metric2: '99.9% uptime',
      metric3: '500+ daily active users',
    },
    client: cloudwiseClient,
  },
  {
    slug: 'multi-vendor-marketplace',
    title: 'Multi-vendor Marketplace',
    category: 'E-commerce',
    description:
      'A scalable marketplace platform connecting vendors with customers, featuring real-time inventory management.',
    image: '/marketplace.jpg',
    technologies: ['React', 'Node.js', 'Redis'],
    results: {
      metric1: '$2M+ in transactions',
      metric2: '1000+ vendors onboarded',
      metric3: '30% month-over-month growth',
    },
    client: cloudwiseClient,
  },
]
