'use client';

/**
 * Poster Dashboard Page
 * Shows service categories, banners, and most booked services
 * Matches: web-apps/extrahand-web-app/src/PosterHomeScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const serviceCategories = [
  {
    id: 1,
    title: 'Home Services',
    image: '/assets/images/home.png',
    color: '#f4f4f4',
  },
  {
    id: 2,
    title: 'General Errands & Delivery',
    image: '/assets/images/delivery.png',
    color: '#f4f4f4',
  },
  {
    id: 3,
    title: 'Beauty & Personal Care',
    image: '/assets/images/beauty.png',
    color: '#f4f4f4',
  },
  {
    id: 4,
    title: 'Installation & Smart Solutions',
    image: '/assets/images/smart.png',
    color: '#f4f4f4',
  },
  {
    id: 5,
    title: 'Daily Help & Assistants',
    image: '/assets/images/assist.png',
    color: '#f4f4f4',
  },
  {
    id: 6,
    title: 'Tutoring & Education',
    image: '/assets/images/tutor.png',
    color: '#f4f4f4',
  },
  {
    id: 7,
    title: 'Creative & Technical Tasks',
    image: '/assets/images/creative.png',
    color: '#f4f4f4',
  },
  {
    id: 8,
    title: 'Administrative / Office Tasks',
    image: '/assets/images/office.png',
    color: '#f4f4f4',
  },
  {
    id: 9,
    title: 'Event Support',
    image: '/assets/images/events.png',
    color: '#f4f4f4',
  },
];

const bannerImages = [
  '/assets/images/banner1.png',
  '/assets/images/banner2.png',
  '/assets/images/banner3.png',
  '/assets/images/banner4.png',
  '/assets/images/banner5.png',
  '/assets/images/banner6.png',
  '/assets/images/banner7.png',
];

const mostBookedServices = [
  {
    id: 1,
    title: 'Parcel Pickup & Delivery',
    image: '/assets/mosted-booked-services/delivery.png',
    rating: '4.76',
    reviews: '98K',
    price: '₹199',
  },
  {
    id: 2,
    title: 'At-Home Haircut (Women)',
    image: '/assets/mosted-booked-services/homefacial.png',
    rating: '4.88',
    reviews: '132K',
    price: '₹699',
  },
  {
    id: 3,
    title: 'Home Deep Cleaning',
    image: '/assets/mosted-booked-services/homeclean.png',
    rating: '4.82',
    reviews: '45K',
    price: '₹399',
  },
  {
    id: 4,
    title: 'TV Mounting Service',
    image: '/assets/mosted-booked-services/tv-mounting.png',
    rating: '4.91',
    reviews: '67K',
    price: '₹299',
  },
  {
    id: 5,
    title: 'Online Tuition Classes',
    image: '/assets/mosted-booked-services/online-tution.png',
    rating: '4.85',
    reviews: '89K',
    price: '₹499',
  },
  {
    id: 6,
    title: 'Logo Design Service',
    image: '/assets/mosted-booked-services/logo-design.png',
    rating: '4.79',
    reviews: '34K',
    price: '₹899',
  },
];

export default function PosterPage() {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/tasks/new?category=${categoryId}`);
  };

  const handleCustomTask = () => {
    router.push('/tasks/new');
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Navigation Bar */}
        <NavBar />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Service Categories Grid */}
          <div className="flex flex-row flex-wrap justify-between p-4 gap-4">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-[31%] flex flex-col items-center mb-6"
              >
                <div
                  className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center mb-3 shadow-sm"
                  style={{ backgroundColor: category.color }}
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-gray-800 text-center font-medium leading-tight px-1">
                  {category.title}
                </p>
              </button>
            ))}
          </div>

          {/* Custom Task Button */}
          <div className="px-3 mb-5">
            <button
              onClick={handleCustomTask}
              className="w-full flex items-center justify-center bg-gray-100 py-3 px-5 rounded-full"
            >
              <span className="text-base text-gray-800 font-medium mr-2">Custom Task</span>
              <span className="text-base">📅</span>
            </button>
          </div>

          {/* Horizontal Scrollable Banners */}
          <div className="mb-5">
            <div className="flex overflow-x-auto gap-4 px-3 scrollbar-hide">
              {bannerImages.map((banner, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[280px] h-[160px] rounded-xl overflow-hidden shadow-sm"
                >
                  <Image
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    width={280}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Most Booked Services Section */}
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-3">Most Booked Services</h2>
            <div className="flex overflow-x-auto gap-4 px-3 scrollbar-hide">
              {mostBookedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
                >
                  <div className="w-full h-[160px] relative">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Title: {service.title}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm">⭐</span>
                      <span className="text-xs text-gray-600">
                        {service.rating} ({service.reviews})
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refer Section */}
          <div className="px-3 mb-5">
            <div className="flex items-center bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex-1 mr-4">
                <p className="text-lg font-bold text-gray-900 mb-1">Refer and get</p>
                <p className="text-lg font-bold text-gray-900 mb-2">free services</p>
                <p className="text-sm text-gray-600 mb-3">Invite and get ₹ 100*</p>
                <button className="bg-black text-white py-2 px-4 rounded-full text-sm font-semibold">
                  Book now
                </button>
              </div>
              <div className="w-[120px] h-[120px] relative">
                <Image
                  src="/assets/images/refer.png"
                  alt="Refer"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-1 px-5 pt-5">
        {/* Hero Section */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Services at your fingertips
          </h1>
        </div>

        {/* Categories Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-5">
          <h2 className="text-lg text-gray-600 mb-5">What are you looking for?</h2>
          <div className="flex flex-row flex-wrap justify-between gap-3">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-[31%] flex flex-col items-center mb-4"
              >
                <div
                  className="w-[90px] h-[90px] rounded-xl flex items-center justify-center mb-2.5 shadow-sm"
                  style={{ backgroundColor: category.color }}
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-800 text-center font-medium leading-tight mt-2 px-1">
                  {category.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Task Button */}
        <div className="mb-5">
          <button
            onClick={handleCustomTask}
            className="w-full flex items-center justify-center bg-gray-100 py-3 px-5 rounded-full"
          >
            <span className="text-base text-gray-800 font-medium mr-2">Custom Task</span>
            <span className="text-base">📅</span>
          </button>
        </div>

        {/* Horizontal Scrollable Banners */}
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {bannerImages.map((banner, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[500px] h-[280px] rounded-xl overflow-hidden shadow-sm"
              >
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  width={500}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Most Booked Services Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Most Booked Services</h2>
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {mostBookedServices.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-[320px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
              >
                <div className="w-full h-[180px] relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{service.title}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm">⭐</span>
                    <span className="text-xs text-gray-600">
                      {service.rating} ({service.reviews})
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refer Section */}
        <div className="mb-8">
          <div className="flex items-center bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <div className="flex-1 mr-5">
              <p className="text-xl font-bold text-gray-900 mb-1">Refer and get</p>
              <p className="text-xl font-bold text-gray-900 mb-2">free services</p>
              <p className="text-base text-gray-600 mb-4">Invite and get ₹ 100*</p>
              <button className="bg-black text-white py-2.5 px-5 rounded-full text-base font-semibold">
                Book now
              </button>
            </div>
            <div className="w-[140px] h-[140px] relative">
              <Image
                src="/assets/images/refer.png"
                alt="Refer"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
