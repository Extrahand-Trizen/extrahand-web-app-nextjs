'use client';

/**
 * Role Selection Page
 * User selects their role (tasker/poster) and completes onboarding
 * Matches: web-apps/extrahand-web-app/src/RoleSelectionScreen.tsx
 * NO API CALLS - Just routing
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function RoleSelectionPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<'get' | 'earn' | ''>('');
  const [userType, setUserType] = useState<'individual' | 'business' | ''>('');
  const [agreeUpdates, setAgreeUpdates] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const canComplete = goal && userType && agreeTerms;

  const handleComplete = () => {
    if (!canComplete) return;

    // Navigate based on goal selection
    if (goal === 'earn') {
      // Navigate to Performer Home (tasker)
      router.push('/performer');
    } else if (goal === 'get') {
      // Navigate to Poster Home (poster)
      router.push('/poster');
    }
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-white p-6 pt-20 relative">
        {/* Back Button */}
        <Link 
          href="/onboarding/location-confirmation" 
          className="absolute top-10 left-4 flex items-center gap-2 z-10"
        >
          <span className="text-2xl" style={{ color: DARK }}>‹</span>
          <span className="text-base font-bold" style={{ color: DARK }}>Back</span>
        </Link>

        <div className="flex flex-col items-center justify-center flex-1 pt-5 pb-5">
          <p 
            className="text-base font-medium mb-4 self-start w-full"
            style={{ color: DARK }}
          >
            What is your main goal on Extrahand? *
          </p>
          <div className="flex w-full justify-between mb-6">
            <button
              onClick={() => setGoal('get')}
              className={`
                flex-1 flex flex-col items-center p-5 rounded-xl border mx-1 min-h-[100px]
                ${goal === 'get'
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-white border-gray-300'
                }
              `}
              style={goal === 'get' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
            >
              <span 
                className={`text-2xl mb-3 ${goal === 'get' ? 'text-white' : ''}`}
                style={goal === 'get' ? { color: '#fff' } : { color: DARK }}
              >
                ✔
              </span>
              <span
                className={`text-base font-medium text-center ${goal === 'get' ? 'text-white font-bold' : ''}`}
                style={goal === 'get' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
              >
                Get things done
              </span>
            </button>
            <button
              onClick={() => setGoal('earn')}
              className={`
                flex-1 flex flex-col items-center p-5 rounded-xl border mx-1 min-h-[100px]
                ${goal === 'earn'
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-white border-gray-300'
                }
              `}
              style={goal === 'earn' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
            >
              <span 
                className={`text-2xl mb-3 ${goal === 'earn' ? 'text-white' : ''}`}
                style={goal === 'earn' ? { color: '#fff' } : { color: DARK }}
              >
                ₹
              </span>
              <span
                className={`text-base font-medium text-center ${goal === 'earn' ? 'text-white font-bold' : ''}`}
                style={goal === 'earn' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
              >
                Earn Money
              </span>
            </button>
          </div>

          <p 
            className="text-base font-medium mb-4 self-start w-full"
            style={{ color: DARK }}
          >
            Tell us about your self *
          </p>
          <div className="flex w-full justify-between mb-6">
            <button
              onClick={() => setUserType('individual')}
              className={`
                flex-1 flex flex-col items-center p-5 rounded-xl border mx-1 min-h-[100px]
                ${userType === 'individual'
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-white border-gray-300'
                }
              `}
              style={userType === 'individual' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
            >
              <span 
                className={`text-2xl mb-3 ${userType === 'individual' ? 'text-white' : ''}`}
                style={userType === 'individual' ? { color: '#fff' } : { color: DARK }}
              >
                👤
              </span>
              <span
                className={`text-base font-medium text-center ${userType === 'individual' ? 'text-white font-bold' : ''}`}
                style={userType === 'individual' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
              >
                Individual
              </span>
            </button>
            <button
              onClick={() => setUserType('business')}
              className={`
                flex-1 flex flex-col items-center p-5 rounded-xl border mx-1 min-h-[100px]
                ${userType === 'business'
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-white border-gray-300'
                }
              `}
              style={userType === 'business' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
            >
              <span 
                className={`text-2xl mb-3 ${userType === 'business' ? 'text-white' : ''}`}
                style={userType === 'business' ? { color: '#fff' } : { color: DARK }}
              >
                🏢
              </span>
              <span
                className={`text-base font-medium text-center ${userType === 'business' ? 'text-white font-bold' : ''}`}
                style={userType === 'business' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
              >
                Business user
              </span>
            </button>
          </div>

          <div className="flex items-start mb-4 w-full">
            <button
              onClick={() => setAgreeUpdates(!agreeUpdates)}
              className={`
                w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3
                ${agreeUpdates ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-500'}
              `}
              style={agreeUpdates ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
            >
              {agreeUpdates && (
                <span className="text-primary-500 text-lg font-bold" style={{ color: PRIMARY_YELLOW }}>
                  ✔
                </span>
              )}
            </button>
            <label className="flex-1 text-sm font-normal leading-5" style={{ color: DARK }}>
              I agree to receive product updates, marketing materials and special offers via email, SMS, and push notifications
            </label>
          </div>

          <div className="flex items-start mb-6 w-full">
            <button
              onClick={() => setAgreeTerms(!agreeTerms)}
              className={`
                w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3
                ${agreeTerms ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-500'}
              `}
              style={agreeTerms ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
            >
              {agreeTerms && (
                <span className="text-primary-500 text-lg font-bold" style={{ color: PRIMARY_YELLOW }}>
                  ✔
                </span>
              )}
            </button>
            <label className="flex-1 text-sm font-normal leading-5" style={{ color: DARK }}>
              I agree to the Extrahand Terms & Conditions Community Guidelines, and Privacy Policy *
            </label>
          </div>

          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className={`
              w-full rounded-xl py-4 text-center font-bold text-base mt-6
              ${!canComplete ? 'opacity-50' : ''}
            `}
            style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
          >
            Complete
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center flex-1 pt-15">
        <p 
          className="text-base font-medium mb-2 self-start w-full"
          style={{ color: DARK }}
        >
          What is your main goal on Extrahand? *
        </p>
        <div className="flex w-full justify-between mb-4">
          <button
            onClick={() => setGoal('get')}
            className={`
              flex-1 flex flex-col items-center p-4 rounded-xl border mx-1
              ${goal === 'get'
                ? 'bg-primary-500 border-primary-500'
                : 'bg-white border-gray-300'
              }
            `}
            style={goal === 'get' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
          >
            <span 
              className={`text-xl mb-2 ${goal === 'get' ? 'text-white' : ''}`}
              style={goal === 'get' ? { color: '#fff' } : { color: DARK }}
            >
              ✔
            </span>
            <span
              className={`text-[15px] font-medium ${goal === 'get' ? 'text-white font-bold' : ''}`}
              style={goal === 'get' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
            >
              Get things done
            </span>
          </button>
          <button
            onClick={() => setGoal('earn')}
            className={`
              flex-1 flex flex-col items-center p-4 rounded-xl border mx-1
              ${goal === 'earn'
                ? 'bg-primary-500 border-primary-500'
                : 'bg-white border-gray-300'
              }
            `}
            style={goal === 'earn' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
          >
            <span 
              className={`text-xl mb-2 ${goal === 'earn' ? 'text-white' : ''}`}
              style={goal === 'earn' ? { color: '#fff' } : { color: DARK }}
            >
              ₹
            </span>
            <span
              className={`text-[15px] font-medium ${goal === 'earn' ? 'text-white font-bold' : ''}`}
              style={goal === 'earn' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
            >
              Earn Money
            </span>
          </button>
        </div>

        <p 
          className="text-base font-medium mb-2 self-start w-full"
          style={{ color: DARK }}
        >
          Tell us about your self *
        </p>
        <div className="flex w-full justify-between mb-4">
          <button
            onClick={() => setUserType('individual')}
            className={`
              flex-1 flex flex-col items-center p-4 rounded-xl border mx-1
              ${userType === 'individual'
                ? 'bg-primary-500 border-primary-500'
                : 'bg-white border-gray-300'
              }
            `}
            style={userType === 'individual' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
          >
            <span 
              className={`text-xl mb-2 ${userType === 'individual' ? 'text-white' : ''}`}
              style={userType === 'individual' ? { color: '#fff' } : { color: DARK }}
            >
              👤
            </span>
            <span
              className={`text-[15px] font-medium ${userType === 'individual' ? 'text-white font-bold' : ''}`}
              style={userType === 'individual' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
            >
              Individual
            </span>
          </button>
          <button
            onClick={() => setUserType('business')}
            className={`
              flex-1 flex flex-col items-center p-4 rounded-xl border mx-1
              ${userType === 'business'
                ? 'bg-primary-500 border-primary-500'
                : 'bg-white border-gray-300'
              }
            `}
            style={userType === 'business' ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
          >
            <span 
              className={`text-xl mb-2 ${userType === 'business' ? 'text-white' : ''}`}
              style={userType === 'business' ? { color: '#fff' } : { color: DARK }}
            >
              🏢
            </span>
            <span
              className={`text-[15px] font-medium ${userType === 'business' ? 'text-white font-bold' : ''}`}
              style={userType === 'business' ? { color: '#fff', fontWeight: 'bold' } : { color: DARK, fontWeight: '500' }}
            >
              Business user
            </span>
          </button>
        </div>

        <div className="flex items-start mb-2 w-full px-1">
          <button
            onClick={() => setAgreeUpdates(!agreeUpdates)}
            className={`
              w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2
              ${agreeUpdates ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-500'}
            `}
            style={agreeUpdates ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
          >
            {agreeUpdates && (
              <span className="text-lg font-bold" style={{ color: PRIMARY_YELLOW }}>
                ✔
              </span>
            )}
          </button>
          <label className="flex-1 text-sm font-normal" style={{ color: DARK }}>
            I agree to receive product updates, marketing materials and special offers via email, SMS, and push notifications
          </label>
        </div>

        <div className="flex items-start mb-4 w-full px-1">
          <button
            onClick={() => setAgreeTerms(!agreeTerms)}
            className={`
              w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2
              ${agreeTerms ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-500'}
            `}
            style={agreeTerms ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
          >
            {agreeTerms && (
              <span className="text-lg font-bold" style={{ color: PRIMARY_YELLOW }}>
                ✔
              </span>
            )}
          </button>
          <label className="flex-1 text-sm font-normal" style={{ color: DARK }}>
            I agree to the Extrahand Terms & Conditions Community Guidelines, and Privacy Policy *
          </label>
        </div>

        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className={`
            w-full rounded-lg py-4 text-center font-bold text-base mt-4
            ${!canComplete ? 'opacity-50' : ''}
          `}
          style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
        >
          Complete
        </button>
      </div>
    </div>
  );
}
