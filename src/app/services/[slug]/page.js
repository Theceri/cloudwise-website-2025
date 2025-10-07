// // 'use client'

// // import { useParams } from 'next/navigation'
// // import { motion } from 'framer-motion'
// // import { 
// //   Brain, Code, Smartphone, ShoppingBag, 
// //   Cloud, Database, Bot, LineChart,
// //   Check, ArrowRight, Users, Zap, 
// //   BarChart, Shield, Clock, Award
// // } from 'lucide-react'
// // import { Section } from '@/components/ui/Section'
// // import { Card } from '@/components/ui/Card'
// // import { Button } from '@/components/ui/button'

// // const services = {
// //   'ai-development': {
// //     icon: Brain,
// //     title: 'AI Agent Development',
// //     description: 'Leverage the power of AI to revolutionize your business through intelligent products and seamless AI integrations.',
// //     longDescription: 'Our AI development services help businesses harness the transformative power of artificial intelligence. We create custom AI solutions that automate processes, enhance decision-making, and deliver exceptional user experiences.',
// //     features: [
// //       'Custom AI Model Development',
// //       'Natural Language Processing',
// //       'Machine Learning Integration',
// //       'AI-Powered Automation',
// //       'Predictive Analytics',
// //       'Computer Vision Solutions',
// //       'Chatbot Development',
// //       'AI Strategy Consulting'
// //     ],
// //     benefits: [
// //       {
// //         icon: Zap,
// //         title: 'Increased Efficiency',
// //         description: 'Automate repetitive tasks and streamline operations with intelligent AI solutions.'
// //       },
// //       {
// //         icon: Users,
// //         title: 'Enhanced User Experience',
// //         description: 'Deliver personalized experiences that adapt to user preferences and behaviors.'
// //       },
// //       {
// //         icon: BarChart,
// //         title: 'Data-Driven Insights',
// //         description: 'Make informed decisions with AI-powered analytics and predictions.'
// //       },
// //       {
// //         icon: Shield,
// //         title: 'Improved Accuracy',
// //         description: 'Reduce human error and increase precision in critical processes.'
// //       }
// //     ],
// //     process: [
// //       {
// //         title: 'Discovery & Analysis',
// //         description: 'We analyze your business needs and identify opportunities for AI integration.'
// //       },
// //       {
// //         title: 'Solution Design',
// //         description: 'Our experts design a custom AI solution tailored to your requirements.'
// //       },
// //       {
// //         title: 'Development & Training',
// //         description: 'We develop and train AI models using your data and industry best practices.'
// //       },
// //       {
// //         title: 'Testing & Validation',
// //         description: 'Rigorous testing ensures accuracy and reliability of AI solutions.'
// //       },
// //       {
// //         title: 'Deployment & Integration',
// //         description: 'Seamless integration of AI solutions into your existing systems.'
// //       },
// //       {
// //         title: 'Monitoring & Optimization',
// //         description: 'Continuous monitoring and optimization for peak performance.'
// //       }
// //     ],
// //     technologies: [
// //       'TensorFlow',
// //       'PyTorch',
// //       'OpenAI',
// //       'scikit-learn',
// //       'NLTK',
// //       'Computer Vision',
// //       'Deep Learning',
// //       'Neural Networks'
// //     ],
// //     caseStudies: [
// //       {
// //         title: 'AI-Powered Customer Service Platform',
// //         results: [
// //           '85% reduction in response time',
// //           '95% customer satisfaction rate',
// //           '60% cost reduction in customer service operations'
// //         ]
// //       }
// //     ]
// //   },
// //   // Add other services here...
// // }

// // export default function ServicePage() {
// //   const params = useParams()
// //   const service = services[params.slug]

// //   if (!service) return null

// //   return (
// //     <main>
// //       {/* Hero Section */}
// //       <Section className="pt-32 pb-16 md:pt-40 md:pb-24">
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
// //           <motion.div
// //             initial={{ opacity: 0, x: -20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ duration: 0.6 }}
// //           >
// //             <h1 className="text-4xl md:text-6xl font-bold text-brand-primary mb-6">
// //               {service.title}
// //             </h1>
// //             <p className="text-text-body text-lg mb-8">
// //               {service.longDescription}
// //             </p>
// //             <Button size="lg">
// //               Get Started
// //               <ArrowRight className="ml-2" size={20} />
// //             </Button>
// //           </motion.div>
// //           <motion.div
// //             initial={{ opacity: 0, scale: 0.9 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             transition={{ duration: 0.6, delay: 0.2 }}
// //             className="relative"
// //           >
// //             <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-accent1/20 to-brand-accent2/20 p-8 flex items-center justify-center">
// //               <service.icon className="w-48 h-48 text-brand-secondary opacity-90" />
// //             </div>
// //           </motion.div>
// //         </div>
// //       </Section>

// //       {/* Features Grid */}
// //       <Section className="bg-gradient-to-b from-white to-brand-accent1/10">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
// //             Key Features
// //           </h2>
// //           <p className="text-text-body text-lg max-w-2xl mx-auto">
// //             Comprehensive solutions designed to meet your business needs
// //           </p>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {service.features.map((feature, index) => (
// //             <motion.div
// //               key={feature}
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //             >
// //               <Card className="h-full">
// //                 <div className="flex items-start space-x-3">
// //                   <Check className="w-5 h-5 text-brand-secondary mt-1 flex-shrink-0" />
// //                   <p className="text-text-subheading">{feature}</p>
// //                 </div>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </Section>

// //       {/* Benefits Section */}
// //       <Section>
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
// //             Benefits
// //           </h2>
// //           <p className="text-text-body text-lg max-w-2xl mx-auto">
// //             Transform your business with our cutting-edge solutions
// //           </p>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //           {service.benefits.map((benefit, index) => (
// //             <motion.div
// //               key={benefit.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //             >
// //               <Card className="h-full">
// //                 <benefit.icon className="w-12 h-12 text-brand-secondary mb-4" />
// //                 <h3 className="text-xl font-semibold text-brand-primary mb-2">
// //                   {benefit.title}
// //                 </h3>
// //                 <p className="text-text-body">
// //                   {benefit.description}
// //                 </p>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </Section>

// //       {/* Process Section */}
// //       <Section className="bg-gradient-to-b from-white to-brand-accent1/10">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
// //             Our Process
// //           </h2>
// //           <p className="text-text-body text-lg max-w-2xl mx-auto">
// //             A systematic approach to delivering exceptional results
// //           </p>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {service.process.map((step, index) => (
// //             <motion.div
// //               key={step.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //             >
// //               <Card className="h-full relative overflow-hidden group">
// //                 <div className="absolute top-0 left-0 w-16 h-16 bg-brand-secondary/10 rounded-br-2xl flex items-center justify-center text-2xl font-bold text-brand-secondary transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:opacity-10">
// //                   {index + 1}
// //                 </div>
// //                 <div className="relative z-10">
// //                   <h3 className="text-xl font-semibold text-brand-primary mb-2">
// //                     {step.title}
// //                   </h3>
// //                   <p className="text-text-body">
// //                     {step.description}
// //                   </p>
// //                 </div>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </Section>

// //       {/* Technologies Section */}
// //       <Section>
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
// //             Technologies We Use
// //           </h2>
// //           <p className="text-text-body text-lg max-w-2xl mx-auto">
// //             Industry-leading tools and frameworks for optimal results
// //           </p>
// //         </div>
// //         <div className="flex flex-wrap justify-center gap-4">
// //           {service.technologies.map((tech, index) => (
// //             <motion.div
// //               key={tech}
// //               initial={{ opacity: 0, scale: 0.9 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               transition={{ delay: index * 0.1 }}
// //             >
// //               <span className="px-6 py-3 bg-white rounded-full shadow-md text-brand-primary font-medium hover:shadow-lg transition-shadow">
// //                 {tech}
// //               </span>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </Section>

// //       {/* Case Studies Section */}
// //       <Section className="bg-gradient-to-b from-white to-brand-accent1/10">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
// //             Success Stories
// //           </h2>
// //           <p className="text-text-body text-lg max-w-2xl mx-auto">
// //             Real results from our satisfied clients
// //           </p>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {service.caseStudies.map((study, index) => (
// //             <motion.div
// //               key={study.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //             >
// //               <Card className="h-full">
// //                 <h3 className="text-xl font-semibold text-brand-primary mb-4">
// //                   {study.title}
// //                 </h3>
// //                 <ul className="space-y-3">
// //                   {study.results.map((result) => (
// //                     <li key={result} className="flex items-center text-text-subheading">
// //                       <Award className="w-5 h-5 text-brand-secondary mr-2 flex-shrink-0" />
// //                       {result}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </Section>

// //       {/* CTA Section */}
// //       <Section>
// //         <div className="bg-brand-primary rounded-2xl p-8 md:p-12">
// //           <div className="max-w-3xl mx-auto text-center">
// //             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
// //               Ready to Transform Your Business?
// //             </h2>
// //             <p className="text-gray-300 text-lg mb-8">
// //               Let's discuss how our {service.title} solutions can help you achieve your goals.
// //             </p>
// //             <Button size="lg" className="bg-brand-secondary hover:bg-brand-secondary/90">
// //               Get Started
// //               <ArrowRight className="ml-2" size={20} />
// //             </Button>
// //           </div>
// //         </div>
// //       </Section>
// //     </main>
// //   )
// // }

// import { notFound } from 'next/navigation'
// import { services } from '@/lib/data/services'
// import { Section } from '@/components/ui/Section'
// import { Button } from '@/components/ui/button'

// export async function generateStaticParams() {
//   return services.map(service => ({ slug: service.id }))
// }

// export default function ServicePage({ params }) {
//   const service = services.find(s => s.id === params.slug)

//   if (!service) {
//     return notFound()
//   }

//   const Icon = service.icon

//   return (
//     <main className="min-h-screen pt-32 pb-16 md:pt-40 md:pb-24">
//       <Section>
//         <div className="max-w-3xl mx-auto text-center">
//           <Icon className="w-16 h-16 mx-auto text-brand-secondary mb-6" />
//           <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">
//             {service.title}
//           </h1>
//           <p className="text-text-body text-lg mb-8">{service.description}</p>
//           <ul className="text-left list-disc list-inside mb-10 text-text-subheading">
//             {service.features.map((feature, i) => (
//               <li key={i}>{feature}</li>
//             ))}
//           </ul>
//           <Button size="lg">Get Started</Button>
//         </div>
//       </Section>
//     </main>
//   )
// }


import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import {
  Brain, Code, Smartphone, ShoppingBag,
  Cloud, Database, Bot, LineChart
} from 'lucide-react'
import { ArrowLeft } from 'lucide-react'

const services = [
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Agent Development',
    description: 'Leverage the power of AI to revolutionize your business through intelligent products and seamless AI integrations.',
    longDescription:
      'Our AI Agent Development services enable businesses to deploy intelligent agents that understand, learn, and make decisions. We specialize in crafting AI models tailored to your specific needs, whether it’s for customer service automation, predictive analytics, or personalized recommendations. Using advanced NLP, machine learning, and automation tools, we help you integrate smart agents that enhance user experience and operational efficiency.',
    features: [
      'Custom AI Model Development',
      'Natural Language Processing',
      'Machine Learning Integration',
      'AI-Powered Automation',
    ],
  },
  {
    id: 'web',
    icon: Code,
    title: 'Web Development',
    description: 'Elevate your online presence with stunning websites that captivate visitors and drive conversions.',
    longDescription:
      'We build robust, scalable, and visually appealing websites tailored to your business needs. Our team follows the latest web standards and best practices to ensure your site is secure, fast, and user-friendly. From front-end interfaces to powerful back-end systems, we deliver seamless digital experiences across devices and platforms.',
    features: [
      'Custom Web Applications',
      'Progressive Web Apps',
      'Responsive Design',
      'Performance Optimization',
    ],
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Reach your audience on the go with engaging and user-friendly mobile apps that deliver exceptional experiences.',
    longDescription:
      'Our mobile development services focus on building responsive, high-performance applications that provide an intuitive user experience. We develop native and cross-platform apps with sleek interfaces, optimized functionality, and robust backends, helping your business stay connected with mobile users at every step.',
    features: [
      'iOS App Development',
      'Android App Development',
      'Cross-Platform Solutions',
      'Mobile UI/UX Design',
    ],
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    description: 'Maximize your online sales potential with comprehensive e-commerce solutions that drive conversions.',
    longDescription:
      'We build scalable e-commerce platforms that empower businesses to manage products, inventory, and customers with ease. From seamless checkout experiences to backend dashboards and sales analytics, we provide full-stack solutions that enhance your online store’s performance and customer satisfaction.',
    features: [
      'Custom E-commerce Platforms',
      'Payment Gateway Integration',
      'Inventory Management',
      'Analytics & Reporting',
    ],
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Deploy and scale your applications efficiently with our cloud infrastructure and migration services.',
    longDescription:
      'Our cloud services cover everything from initial infrastructure planning to seamless deployment and scaling. We specialize in AWS, Azure, and Google Cloud platforms, helping you improve performance, reliability, and cost-efficiency through optimized cloud architecture and DevOps pipelines.',
    features: [
      'Cloud Migration',
      'Infrastructure Setup',
      'DevOps Implementation',
      'Continuous Integration',
    ],
  },
  {
    id: 'data',
    icon: Database,
    title: 'Data Services',
    description: 'Transform raw data into actionable insights with our comprehensive data services.',
    longDescription:
      'We help organizations harness the power of their data through strategic analytics and visualization. Whether you’re looking to implement business dashboards or process large datasets, our solutions offer clarity, trends, and predictive insights that drive informed decision-making.',
    features: [
      'Data Analytics',
      'Business Intelligence',
      'Data Visualization',
      'ETL Processing',
    ],
  },
  {
    id: 'automation',
    icon: Bot,
    title: 'Process Automation',
    description: 'Streamline your business operations with intelligent automation solutions.',
    longDescription:
      'Our automation services help eliminate repetitive tasks and optimize your workflows using Robotic Process Automation (RPA), custom bots, and third-party integrations. We analyze your current processes and implement scalable automation that saves time and reduces operational costs.',
    features: [
      'Workflow Automation',
      'RPA Implementation',
      'Business Process Optimization',
      'Integration Services',
    ],
  },
  {
    id: 'consulting',
    icon: LineChart,
    title: 'Tech Consulting',
    description: 'Get expert guidance on your digital transformation journey.',
    longDescription:
      'Our consulting services provide you with a clear technology roadmap aligned with your business goals. From evaluating your current systems to planning a scalable, secure tech architecture, we offer strategic insights that help you innovate and transform effectively in a fast-paced digital landscape.',
    features: [
      'Technology Assessment',
      'Digital Strategy',
      'Architecture Planning',
      'Security Consulting',
    ],
  },
]

export default function ServiceDetailPage({ params }) {
  const service = services.find((s) => s.id === params.slug)

  if (!service) {
    notFound()
  }

  const Icon = service.icon

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-24">
      <Section className="pt-6 pb-2">
        <div className="">
          {/* <div className="max-w-3xl mx-auto"> */}
          <div className="max-w-6xl mx-auto px-4 ">
          <Link href="/services" className="inline-flex items-center text-brand-primary hover:text-brand-secondary transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>
        </div>
      </Section>

      <Section className="pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <Icon className="w-14 h-14 text-brand-secondary mb-4 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-6">
            {service.title}
          </h1>
          <p className="text-lg text-text-body mb-6">{service.description}</p>
          <p className="text-text-subheading">{service.longDescription}</p>
        </div>
      </Section>


      <Section className="bg-white">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          {service.features.map((feature) => {
            const descriptions = {
              'Custom AI Model Development': 'Tailor-made AI models that align with your business logic and objectives.',
              'Natural Language Processing': 'Empower apps to understand and generate human language effectively.',
              'Machine Learning Integration': 'Implement systems that learn from data and improve over time.',
              'AI-Powered Automation': 'Automate tasks with smart AI agents that reduce manual effort.',

              'Custom Web Applications': 'Build scalable, secure, and fast web apps from the ground up.',
              'Progressive Web Apps': 'Deliver app-like experiences that work offline and load instantly.',
              'Responsive Design': 'Ensure flawless viewing across all devices and screen sizes.',
              'Performance Optimization': 'Speed up your site and improve SEO and user experience.',

              'iOS App Development': 'Craft smooth and polished apps for Apple devices.',
              'Android App Development': 'Reach Android users with robust, feature-rich mobile apps.',
              'Cross-Platform Solutions': 'Build once, deploy everywhere with unified mobile codebases.',
              'Mobile UI/UX Design': 'Design intuitive interfaces tailored for mobile interactions.',

              'Custom E-commerce Platforms': 'Launch online stores with tailored features and branding.',
              'Payment Gateway Integration': 'Enable secure and flexible online transactions.',
              'Inventory Management': 'Track stock levels and automate restocking processes.',
              'Analytics & Reporting': 'Monitor sales performance with real-time dashboards.',

              'Cloud Migration': 'Seamlessly move your infrastructure to scalable cloud platforms.',
              'Infrastructure Setup': 'Configure cloud environments for high availability and performance.',
              'DevOps Implementation': 'Accelerate deployments with CI/CD pipelines and automation.',
              'Continuous Integration': 'Ship faster with automated testing and code integration.',

              'Data Analytics': 'Extract meaningful insights from raw datasets.',
              'Business Intelligence': 'Turn data into strategic decisions through clear reporting.',
              'Data Visualization': 'Use charts and dashboards to communicate trends clearly.',
              'ETL Processing': 'Clean, transform, and load data efficiently from various sources.',

              'Workflow Automation': 'Automate repeatable business processes to save time.',
              'RPA Implementation': 'Use bots to handle repetitive tasks like form filling and data entry.',
              'Business Process Optimization': 'Refine operations for speed and reduced cost.',
              'Integration Services': 'Connect tools and platforms for seamless data flow.',

              'Technology Assessment': 'Evaluate current systems and tech stacks for improvement.',
              'Digital Strategy': 'Plan long-term technology adoption aligned with your goals.',
              'Architecture Planning': 'Design robust, scalable system architectures.',
              'Security Consulting': 'Identify and fix vulnerabilities before they become threats.',
            }

            return (
              <Card key={feature} className="p-6">
                <h3 className="text-xl font-semibold text-brand-primary mb-2">
                  {feature}
                </h3>
                <p className="text-text-subheading">{descriptions[feature]}</p>
              </Card>
            )
          })}

        </div>
      </Section>

      <Section>
        <div className="bg-brand-primary rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Let’s Build Something Great Together
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Ready to get started with {service.title.toLowerCase()}? We're here to help.
          </p>
          <Button size="lg" className="bg-brand-secondary hover:bg-brand-secondary/90">
            Contact Us
          </Button>
        </div>
      </Section>
    </main>
  )
}
