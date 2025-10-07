// src/lib/servicesData.js

import {
  Brain, Code, Smartphone, ShoppingBag,
  Cloud, Database, Bot, LineChart, Wrench, Laptop
} from 'lucide-react'

export const services = [
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
    longDescription: 'We build intelligent agents that can learn, adapt, and deliver personalized customer experiences. Our AI services help businesses streamline operations, make data-driven decisions, and stay competitive.',
    benefits: [
      'Faster decision-making',
      'Cost-effective automation',
      'Enhanced customer engagement',
    ],
    useCases: [
      'AI-powered chatbots for customer support',
      'Smart recommendation systems',
      'Automated document analysis',
    ],
    cta: {
      label: 'Start Building with AI',
      link: '/services/ai'
    }
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
    longDescription: 'We create high-performance websites tailored to your brand and business goals. From simple landing pages to complex applications, we ensure speed, responsiveness, and accessibility.',
    benefits: [
      'Responsive across all devices',
      'SEO-optimized',
      'Custom features and integrations',
    ],
    useCases: [
      'Marketing sites',
      'Internal dashboards',
      'Client portals',
    ],
    cta: {
      label: 'Launch Your Website',
      link: '/services/web'
    }
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Deliver seamless mobile experiences across iOS and Android devices with robust and intuitive applications.',
    features: [
      'Cross-Platform Development',
      'Native App Features',
      'App Store Deployment',
      'User-Centered Design',
    ],
    longDescription: 'We create mobile apps that engage users and scale with your business. Whether it’s a native iOS or Android app or a cross-platform solution, we deliver polished experiences.',
    benefits: [
      'Reach a wider audience',
      'Enhanced customer loyalty',
      'Monetization potential',
    ],
    useCases: [
      'E-commerce apps',
      'On-demand services',
      'Event or booking platforms',
    ],
    cta: {
      label: 'Build Your App',
      link: '/services/mobile'
    }
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    description: 'Boost online sales with secure, scalable, and customizable e-commerce platforms.',
    features: [
      'Shopping Cart Integration',
      'Payment Gateway Setup',
      'Product Management Tools',
      'Customer Reviews & Analytics',
    ],
    longDescription: 'From product discovery to checkout, we design and build e-commerce platforms that are user-friendly, conversion-focused, and optimized for growth.',
    benefits: [
      'Increased sales',
      'Improved UX/UI',
      'Seamless integration with tools',
    ],
    useCases: [
      'Online retail stores',
      'Subscription services',
      'Digital product platforms',
    ],
    cta: {
      label: 'Launch Your Store',
      link: '/services/ecommerce'
    }
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Migrate, manage, and scale with confidence using modern cloud architecture.',
    features: [
      'Cloud Migration',
      'DevOps & CI/CD',
      'Scalable Hosting',
      'Disaster Recovery Solutions',
    ],
    longDescription: 'Our cloud services enable your systems to run reliably and securely at scale. We help you adopt cloud-native practices for cost-effectiveness and agility.',
    benefits: [
      'Reduced infrastructure costs',
      'Faster deployment cycles',
      'Improved system reliability',
    ],
    useCases: [
      'SaaS platforms',
      'Data processing pipelines',
      'Scalable web hosting',
    ],
    cta: {
      label: 'Go Cloud-Native',
      link: '/services/cloud'
    }
  },
  {
    id: 'data',
    icon: Database,
    title: 'Data Engineering',
    description: 'Organize, clean, and leverage your data for actionable insights and business intelligence.',
    features: [
      'Data Pipeline Design',
      'ETL Processes',
      'Data Warehousing',
      'Analytics Dashboards',
    ],
    longDescription: 'We turn raw data into valuable insights through robust pipelines and analytics tools, helping you drive decisions with confidence.',
    benefits: [
      'Data-driven strategies',
      'Improved operational efficiency',
      'Centralized data visibility',
    ],
    useCases: [
      'Customer behavior analysis',
      'Operational reporting',
      'Data-backed marketing strategies',
    ],
    cta: {
      label: 'Unlock Your Data',
      link: '/services/data'
    }
  },
  {
    id: 'automation',
    icon: Bot,
    title: 'Process Automation',
    description: 'Automate repetitive tasks to save time, reduce errors, and improve productivity.',
    features: [
      'Workflow Automation',
      'Scripted Bots',
      'API Integration',
      'Task Scheduling',
    ],
    longDescription: 'From internal workflows to customer-facing operations, we implement automation tools that free up your team for higher-value work.',
    benefits: [
      'Lower operating costs',
      'Consistency in processes',
      'Real-time notifications and tracking',
    ],
    useCases: [
      'Invoice generation',
      'HR onboarding',
      'Automated reporting',
    ],
    cta: {
      label: 'Automate Today',
      link: '/services/automation'
    }
  },
  {
    id: 'analytics',
    icon: LineChart,
    title: 'Analytics & Insights',
    description: 'Turn data into decisions with advanced analytics, dashboards, and reporting tools.',
    features: [
      'Real-time Dashboards',
      'Business Intelligence',
      'Customer Analytics',
      'A/B Testing & Insights',
    ],
    longDescription: 'We help you understand your customers, performance, and opportunities through powerful data visualizations and predictive analytics.',
    benefits: [
      'Smarter business decisions',
      'Increased ROI on campaigns',
      'Targeted marketing strategies',
    ],
    useCases: [
      'Sales forecasting',
      'Campaign optimization',
      'Product performance analysis',
    ],
    cta: {
      label: 'See the Numbers',
      link: '/services/analytics'
    }
  },
  {
    id: 'devops',
    icon: Wrench,
    title: 'DevOps & Engineering',
    description: 'Streamline your development workflow with modern DevOps practices and infrastructure as code.',
    features: [
      'CI/CD Pipelines',
      'Infrastructure as Code',
      'Monitoring & Logging',
      'Cloud Native Engineering',
    ],
    longDescription: 'We bring speed and reliability to your software delivery by bridging the gap between development and operations.',
    benefits: [
      'Reduced deployment time',
      'Improved system stability',
      'Better collaboration',
    ],
    useCases: [
      'Continuous deployment',
      'Platform reliability',
      'Release automation',
    ],
    cta: {
      label: 'Optimize Engineering',
      link: '/services/devops'
    }
  },
  {
    id: 'consulting',
    icon: Laptop,
    title: 'Tech Consulting',
    description: 'Get expert guidance on technology choices, system design, and product strategy to set your team up for success.',
    features: [
      'Architecture Reviews',
      'Tooling Recommendations',
      'Technology Roadmapping',
      'Project Scoping',
    ],
    longDescription: 'Whether you’re launching a new product or scaling an existing platform, our consulting services give you the technical clarity you need.',
    benefits: [
      'Avoid costly mistakes',
      'Faster time to market',
      'Aligned business and tech goals',
    ],
    useCases: [
      'Startup MVP planning',
      'System modernization',
      'Cost-reduction strategies',
    ],
    cta: {
      label: 'Book a Consultation',
      link: '/services/consulting'
    }
  }
] 
