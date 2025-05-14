'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnimatedCardProps {
  children: React.ReactNode;
  index: number;
  featured?: boolean;
}

interface FadeInSectionProps {
  children: React.ReactNode;
  delay: number;
}

const AnimatedCard = ({ children, index, featured }: AnimatedCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200);
    
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-3xl transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${featured ? 'shadow-2xl border-green-400 border-2' : 'shadow-lg border border-gray-100 hover:shadow-xl'}`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-bold px-6 py-2 rounded-full shadow-lg z-10">
          {/* Most Popular */}
        </div>
      )}
      {children}
    </div>
  );
};

const FadeInSection = ({ children, delay }: FadeInSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function ModernPricingPage(): React.ReactElement {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [highlightYearly, setHighlightYearly] = useState(false);
  
  interface Plan {
    key: string;
    title: string;
    description: string;
    monthly: number | null;
    yearly: number | null;
    features: string[];
    cta: {
      label: string;
      href: string;
    };
    gradient: string;
    buttonClass: string;
    featured?: boolean;
    [key: string]: any; 
  }

  const plans: Plan[] = [
    {
      key: 'starter',
      title: 'Starter',
      description: 'Perfect for new TikTok Shops generating under $10k monthly GMV.',
      monthly: 199,
      yearly: 199 * 12 * 0.8,
      features: [
        'Up to 10k messages per month',
        'Basic CRM access',
        'One free affiliate video',
        'Discord customer support',
      ],
      cta: { label: 'Start 7-Day Free Trial', href: '/signup?plan=starter' },
      gradient: 'from-blue-50 to-blue-100',
      buttonClass: 'bg-white text-green-500 border border-green-500 hover:bg-green-50',
    },
    {
      key: 'growth',
      title: 'Growth',
      description: 'Ideal for TikTok Shops surpassing $10k monthly GMV.',
      monthly: 479,
      yearly: 479 * 12 * 0.8,
      features: [
        'Unlimited messages, invites & emails',
        'Premium CRM access',
        'Automated Spark code collections',
        'AI-powered creator search',
        'Competitor creator outreach',
        'Automated creative briefs',
        'Social intelligence dashboard',
        'AI video generation tools',
        'Free strategy sessions',
        'Advanced reporting',
        'Email & WhatsApp support',
      ],
      featured: true,
      cta: { label: 'Choose Growth Plan', href: '/signup?plan=growth' },
      gradient: 'from-green-50 to-green-100',
      buttonClass: 'bg-green-500 hover:bg-green-600 text-white',
    },
    {
      key: 'agency',
      title: 'Agency',
      description: 'Scale across multiple TikTok Shops with dedicated support.',
      monthly: null,
      yearly: null,
      features: [
        'Unlimited platform access',
        'Volume-based discounts',
        'Dedicated account manager',
        'VIP Slack support',
      ],
      cta: { label: 'Contact Sales', href: '/contact' },
      gradient: 'from-purple-50 to-purple-100',
      buttonClass: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    },
  ];
  
  useEffect(() => {
    if (billing === 'yearly') {
      setHighlightYearly(true);
      const timer = setTimeout(() => {
        setHighlightYearly(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [billing]);

  // Handle plan selection and redirect to signup with plan parameter
  const handlePlanSelect = (plan: Plan) => {
    // For agency plan, go to contact page
    if (plan.key === 'agency') {
      router.push('/contact');
      return;
    }
    
    // For other plans, redirect to signup with plan and billing period
    const billingParam = billing === 'yearly' ? '&billing=yearly' : '';
    router.push(`/signup?plan=${plan.key}${billingParam}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-70"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2325d366' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        
        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInSection delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900">
              Simple & Transparent Pricing
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={300}>
            <p className="mt-4 text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Scale your TikTok Shop business with our powerful affiliate management platform
            </p>
          </FadeInSection>
          
          <FadeInSection delay={500}>
            <div className="flex justify-center mt-10">
              <div className="bg-white p-1 rounded-full shadow-md flex items-center">
                <button
                  onClick={() => setBilling('monthly')}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition ${
                    billing === 'monthly'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('yearly')}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition flex items-center ${
                    billing === 'yearly'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Yearly{' '}
                  <span
                    className={`ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full transition ${
                      highlightYearly ? 'animate-pulse' : ''
                    }`}
                  >
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <AnimatedCard key={plan.key} index={i} featured={plan.featured}>
              <div className={`h-full flex flex-col p-8 ${plan.featured ? 'pt-10' : 'pt-8'} bg-gradient-to-br ${plan.gradient}`}>
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
                  {plan.featured && (
                    <span className="inline-flex items-center mt-1 text-green-600 text-sm font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Recommended Plan
                    </span>
                  )}
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                </div>
                
                {/* Pricing */}
                <div className="mt-6">
                  {plan[billing] != null ? (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">
                          ${typeof plan[billing] === 'number' ? plan[billing]?.toFixed(0) : ''}
                        </span>
                        <span className="ml-1 text-base text-gray-500">
                          /{billing === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      {billing === 'yearly' && plan.monthly !== null && plan.yearly !== null && (
                        <p className="mt-1 text-sm text-green-600">
                          Save ${(plan.monthly * 12 - plan.yearly).toFixed(0)} with annual billing
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-4xl font-extrabold text-gray-900">Custom</div>
                  )}
                </div>
                
                {/* Features */}
                <div className="mt-6 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={`${plan.key}-feature-${idx}`} className="flex items-start">
                        <CheckIcon />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* CTA */}
                <div className="mt-8">
                  <button 
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${plan.buttonClass}`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.cta.label}
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

    </div>
  );
}