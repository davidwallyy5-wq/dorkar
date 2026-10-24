import React from 'react';
import {
  ShoppingBag,
  Pill,
  Utensils,
  Smartphone,
  FileText,
  PackagePlus,
  ArrowUpRight,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../utils/mockData';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  ShoppingBag,
  Pill,
  Utensils,
  Smartphone,
  FileText,
  PackagePlus,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-16 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Bento Indicator */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-9 bg-[#F5A623] rounded-full shrink-0"></div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#003366] tracking-tight">
              আমাদের সেবা সমূহ
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
              নিত্যদিনের কাঁচাবাজার থেকে জরুরি ওষুধ—সবকিছুই কিনবে ও পৌঁছে দেবে দরকার
            </p>
          </div>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_SERVICES.map((service) => {
            const IconComponent = iconMap[service.iconName] || ShoppingBag;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative bg-[#F8FAFC] hover:bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:border-blue-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 text-[#003366] group-hover:bg-[#003366] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/50">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#003366] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Quick Examples Badges */}
                  <div className="space-y-1 mb-5">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">
                      সাধারণ পণ্য:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.examples.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Click to Order action */}
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-[#003366] bg-white group-hover:bg-[#003366] group-hover:text-white border border-gray-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>এই ক্যাটাগরিতে অর্ডার করুন</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F5A623]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
