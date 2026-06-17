import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { Brain, Code, Smartphone, ShoppingBag, Cloud, Database, Bot, LineChart } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { CtaBand } from '@/components/CtaBand';
import { SITE_URL } from '@/lib/constants';

const SERVICES = [
  { id: 'ai', icon: Brain, title: 'AI Agent Development', description: 'Leverage AI to revolutionize your business through intelligent products and seamless integrations.', longDescription: 'We deploy intelligent agents that understand, learn and make decisions. From customer-service automation to predictive analytics and personalized recommendations, we craft AI tailored to your needs using modern NLP, machine learning and automation.', features: ['Custom AI Model Development', 'Natural Language Processing', 'Machine Learning Integration', 'AI-Powered Automation'] },
  { id: 'web', icon: Code, title: 'Web Development', description: 'Stunning, high-performance websites that captivate visitors and drive conversions.', longDescription: 'We build robust, scalable and visually striking websites following the latest standards. From front-end interfaces to powerful back-ends, we deliver seamless experiences across every device.', features: ['Custom Web Applications', 'Progressive Web Apps', 'Responsive Design', 'Performance Optimization'] },
  { id: 'mobile', icon: Smartphone, title: 'Mobile App Development', description: 'Engaging, user-friendly mobile apps that deliver exceptional experiences on the go.', longDescription: 'We build responsive, high-performance native and cross-platform apps with intuitive interfaces, optimized functionality and reliable backends — keeping you connected to mobile users everywhere.', features: ['iOS App Development', 'Android App Development', 'Cross-Platform Solutions', 'Mobile UI/UX Design'] },
  { id: 'ecommerce', icon: ShoppingBag, title: 'E-commerce Solutions', description: 'Comprehensive, conversion-focused e-commerce platforms that maximize online sales.', longDescription: 'We build scalable stores that make managing products, inventory and customers effortless — from seamless checkout to sales analytics and admin dashboards.', features: ['Custom E-commerce Platforms', 'Payment Gateway Integration', 'Inventory Management', 'Analytics & Reporting'] },
  { id: 'cloud', icon: Cloud, title: 'Cloud Solutions', description: 'Deploy and scale efficiently with modern cloud infrastructure and migration.', longDescription: 'From infrastructure planning to deployment and scaling, we specialize in AWS, Azure and Google Cloud — improving performance, reliability and cost-efficiency with optimized architecture and DevOps.', features: ['Cloud Migration', 'Infrastructure Setup', 'DevOps Implementation', 'Continuous Integration'] },
  { id: 'data', icon: Database, title: 'Data Services', description: 'Transform raw data into actionable insight with analytics and visualization.', longDescription: 'We help organizations harness their data through strategic analytics and visualization — from business dashboards to large-scale processing — delivering clarity and predictive insight.', features: ['Data Analytics', 'Business Intelligence', 'Data Visualization', 'ETL Processing'] },
  { id: 'automation', icon: Bot, title: 'Process Automation', description: 'Streamline operations with intelligent, reliable automation.', longDescription: 'We eliminate repetitive tasks and optimize workflows using RPA, custom bots and integrations — analyzing your processes and implementing automation that saves time and cuts cost.', features: ['Workflow Automation', 'RPA Implementation', 'Business Process Optimization', 'Integration Services'] },
  { id: 'consulting', icon: LineChart, title: 'Tech Consulting', description: 'Expert guidance on your digital transformation journey.', longDescription: 'We give you a clear technology roadmap aligned with your goals — from evaluating current systems to planning scalable, secure architecture — so you can innovate with confidence.', features: ['Technology Assessment', 'Digital Strategy', 'Architecture Planning', 'Security Consulting'] },
];

const FEATURE_DESC = {
  'Custom AI Model Development': 'Tailor-made AI models aligned with your business logic and objectives.',
  'Natural Language Processing': 'Empower apps to understand and generate human language effectively.',
  'Machine Learning Integration': 'Systems that learn from data and improve over time.',
  'AI-Powered Automation': 'Automate tasks with smart agents that reduce manual effort.',
  'Custom Web Applications': 'Scalable, secure and fast web apps built from the ground up.',
  'Progressive Web Apps': 'App-like experiences that work offline and load instantly.',
  'Responsive Design': 'Flawless viewing across all devices and screen sizes.',
  'Performance Optimization': 'Faster sites with better SEO and user experience.',
  'iOS App Development': 'Smooth, polished apps for Apple devices.',
  'Android App Development': 'Robust, feature-rich apps for Android users.',
  'Cross-Platform Solutions': 'Build once, deploy everywhere with unified codebases.',
  'Mobile UI/UX Design': 'Intuitive interfaces tailored for mobile interactions.',
  'Custom E-commerce Platforms': 'Online stores with tailored features and branding.',
  'Payment Gateway Integration': 'Secure and flexible online transactions.',
  'Inventory Management': 'Track stock and automate restocking.',
  'Analytics & Reporting': 'Real-time dashboards to monitor performance.',
  'Cloud Migration': 'Seamlessly move infrastructure to scalable cloud platforms.',
  'Infrastructure Setup': 'High-availability, high-performance cloud environments.',
  'DevOps Implementation': 'Faster deployments with CI/CD and automation.',
  'Continuous Integration': 'Ship faster with automated testing and integration.',
  'Data Analytics': 'Extract meaningful insight from raw datasets.',
  'Business Intelligence': 'Turn data into strategic decisions through clear reporting.',
  'Data Visualization': 'Communicate trends clearly with charts and dashboards.',
  'ETL Processing': 'Clean, transform and load data efficiently.',
  'Workflow Automation': 'Automate repeatable processes to save time.',
  'RPA Implementation': 'Bots that handle repetitive data tasks.',
  'Business Process Optimization': 'Refine operations for speed and lower cost.',
  'Integration Services': 'Connect tools and platforms for seamless data flow.',
  'Technology Assessment': 'Evaluate current systems and stacks for improvement.',
  'Digital Strategy': 'Plan long-term technology adoption aligned with goals.',
  'Architecture Planning': 'Design robust, scalable system architectures.',
  'Security Consulting': 'Find and fix vulnerabilities before they become threats.',
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }) {
  const s = SERVICES.find((x) => x.id === params.slug);
  if (!s) return {};
  return {
    title: `${s.title}`,
    description: s.description,
    alternates: { canonical: `/services/${s.id}` },
  };
}

export default function ServiceDetailPage({ params }) {
  const service = SERVICES.find((s) => s.id === params.slug);
  if (!service) notFound();
  const Icon = service.icon;

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-25" />
        <div className="container-px relative">
          <Link href="/services" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft size={16} /> Back to services
          </Link>
          <Reveal className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-ember/10 text-ember">
            <Icon size={26} />
          </Reveal>
          <Reveal as="h1" delay={0.05} className="mt-6 max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl">
            {service.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-2xl text-lg text-white/60">{service.description}</Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink-800/30 py-20 md:py-28">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow mb-4">Overview</p>
            <p className="text-lg leading-relaxed text-white/70">{service.longDescription}</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <Reveal key={f} delay={i * 0.05}>
                <div className="card-dark h-full p-6">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-ember/15 text-ember">
                    <Check size={16} />
                  </div>
                  <h3 className="mb-1.5 font-display font-semibold text-white">{f}</h3>
                  <p className="text-sm text-white/55">{FEATURE_DESC[f]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Let’s build with ${service.title.toLowerCase()}.`}
        subtitle="Ready to get started? Tell us about your project for a free consultation."
        primary={{ label: 'Contact us', href: '/contact' }}
      />
    </>
  );
}
