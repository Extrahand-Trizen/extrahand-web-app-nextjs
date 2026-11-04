"use client";

import Link from "next/link";
import Image from "next/image";
import {
   Headset,
   IndianRupee,
   LayoutGrid,
   MapPin,
   ShieldCheck,
   Star,
   Users,
   Wrench,
   Zap,
} from "lucide-react";
import {
   APP_STORE_URL,
   PLAY_STORE_URL,
} from "@/lib/openAppBridge";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import styles from "./ad.module.css";

function StoreLink({
   href,
   label,
   detail,
}: {
   href: string;
   label: string;
   detail: string;
}) {
   return (
      <a className={styles.storeLink} href={href} target="_blank" rel="noreferrer">
         <span className={styles.storeMark} aria-hidden="true">
            {label === "Google Play" ? (
               <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z"
                     fill="#4285F4"
                  />
                  <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#34A853" />
                  <path
                     d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z"
                     fill="#FBBC05"
                  />
                  <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="#EA4335" />
               </svg>
            ) : (
               <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
                     fill="white"
                  />
               </svg>
            )}
         </span>
         <span>
            <small>{detail}</small>
            <strong>{label}</strong>
         </span>
      </a>
   );
}

export default function AdLandingClient({
   categories,
   cities,
   partnerPlayStoreUrl,
}: {
   categories: CategoriesListItem[];
   cities: string[];
   partnerPlayStoreUrl: string;
}) {
   const stats = [
      { icon: Users, value: "1,000+", label: "Happy Customers" },
      { icon: Star, value: "4.8", label: "Average Rating", accent: true },
      {
         icon: Wrench,
         value: "10+",
         label: "Service Categories",
      },
      { icon: ShieldCheck, value: "Verified", label: "Service Partners" },
      {
         icon: MapPin,
         value: cities.length ? `${cities.length}+` : "Local",
         label: "Cities",
      },
   ];

   return (
      <main className={styles.adPage}>
         <header className={styles.header}>
            <div className={styles.headerInner}>
               <Link aria-label="ExtraHand home" className={styles.logo} href="/">
                  <Image alt="" height={34} src="/assets/images/extrahand-logo.webp" width={160} />
               </Link>
               <nav aria-label="Main navigation" className={styles.navigation}>
                  <a href="#services">Services</a>
                  <a href="#customers">How it works</a>
                  <a href="#partners">Become a Partner</a>
               </nav>
               <a className={styles.headerLocation} href="#locations">
                  <span aria-hidden="true">⌖</span>
                  {cities[0] || "Your city"}
               </a>
            </div>
         </header>

         <section className={styles.hero}>
            <div className={styles.heroInner}>
               <div className={styles.heroCopy}>
                  <p className={styles.eyebrow}>Home services, made easy</p>
                  <h1>
                     Book Home Services
                     <br />
                     or Grow Your Business
                     <br />
                     with <span>ExtraHand</span>
                  </h1>
                  <p className={styles.heroDescription}>
                     Find trusted local professionals for your home, or connect with customers
                     who need your skills.
                  </p>
                  <div className={styles.heroActions}>
                     <Link className={styles.primaryButton} href="/book-now">
                        Book a Service <span aria-hidden="true">→</span>
                     </Link>
                     <a className={styles.secondaryButton} href="#partners">
                        Join as a Partner <span aria-hidden="true">→</span>
                     </a>
                  </div>
                  <div className={styles.heroAppLinks}>
                     <strong>Get the Apps</strong>
                     <div className={styles.storeLinks}>
                        <StoreLink detail="GET IT ON" href={PLAY_STORE_URL} label="Google Play" />
                        <StoreLink detail="Download on the" href={APP_STORE_URL} label="App Store" />
                     </div>
                  </div>
                  <div className={styles.heroTrust}>
                     <span>✓ Verified professionals</span>
                     <span>✓ Secure payments</span>
                  </div>
               </div>
               <div className={styles.heroVisual}>
                  <Image
                     alt="A local service professional ready to help"
                     className={styles.heroImage}
                     src="/assets/ad/Friendly%20ExtraHand%20Service%20Team.png"
                     height={600}
                     priority
                     width={600}
                  />
                  <div className={styles.verifiedBadge}>
                     <span aria-hidden="true">✓</span>
                     <span>
                        <strong>Trusted locally</strong>
                        <small>Professionals for your everyday needs</small>
                     </span>
                  </div>
                  <div aria-hidden="true" className={styles.yellowArc} />
               </div>
            </div>
         </section>

         <section aria-label="ExtraHand at a glance" className={styles.stats}>
            {stats.map(({ icon: Icon, value, label, accent }) => (
               <div className={styles.stat} key={label}>
                  <Icon aria-hidden="true" className={styles.statIcon} />
                  <span className={styles.statCopy}>
                     <strong>
                        {value}
                        {accent && <span aria-hidden="true"> ★</span>}
                     </strong>
                     <small>{label}</small>
                  </span>
               </div>
            ))}
         </section>

         <section className={styles.servicesSection} id="services">
            <div className={styles.sectionHeading}>
               <div>
                  <h2>Our Services <span aria-hidden="true">↗</span></h2>
                  <p>Explore trusted home and everyday services near you.</p>
               </div>
            </div>
            {categories.length > 0 ? (
               <div className={styles.categoryGrid}>
                  {categories.map((category) => {
                     return (
                        <div
                           className={styles.categoryCard}
                           key={category.slug}
                        >
                           <span className={styles.categoryImageWrap}>
                              <Image
                                 alt=""
                                 fill
                                 loading="lazy"
                                 sizes="(max-width: 640px) 50vw, (max-width: 900px) 25vw, 25vw"
                                 src={category.heroImage || "/assets/mobilescreens/work.webp"}
                              />
                           </span>
                           <span className={styles.categoryName}>{category.name}</span>
                        </div>
                     );
                  })}
                  <div className={`${styles.categoryCard} ${styles.moreServices}`}>
                     <span className={styles.moreServicesIcon}>
                        <LayoutGrid aria-hidden="true" />
                     </span>
                     <span className={styles.categoryName}>
                        <strong>10+</strong>
                        More Services
                     </span>
                  </div>
               </div>
            ) : (
               <p className={styles.emptyCategories}>
                  No published service categories are available right now.
               </p>
            )}
         </section>

         <section className={styles.customerSection} id="customers">
            <div className={styles.customerCopy}>
               <p className={styles.sectionKicker}>For customers</p>
               <h2>How it works for customers</h2>
               <p className={styles.sectionDescription}>
                  Get the help you need in a few simple steps.
               </p>
               <ol className={styles.stepsList}>
                  <li>
                     <span>1</span>
                     <div><strong>Choose a service</strong><small>Browse categories and tell us what you need.</small></div>
                  </li>
                  <li>
                     <span>2</span>
                     <div><strong>Select date &amp; time</strong><small>Pick the time that works for you.</small></div>
                  </li>
                  <li>
                     <span>3</span>
                     <div><strong>Get the service</strong><small>Connect with a trusted professional.</small></div>
                  </li>
               </ol>
               <Link className={styles.primaryButton} href="/book-now">
                  Book a Service Now <span aria-hidden="true">→</span>
               </Link>
            </div>
            <div className={styles.customerScreens} aria-label="Customer app screenshots">
               <div className={styles.customerScreen}>
                  <Image
                     alt="Customer app home and services screen"
                     height={640}
                     loading="lazy"
                     src="/assets/Book-now/step1.jpeg"
                     width={360}
                  />
               </div>
               <div className={`${styles.customerScreen} ${styles.customerScreenRaised}`}>
                  <Image
                     alt="Customer app service booking screen"
                     height={640}
                     loading="lazy"
                     src="/assets/Book-now/step2.jpeg"
                     width={360}
                  />
               </div>
               <div className={styles.customerScreen}>
                  <Image
                     alt="Customer app date and time selection screen"
                     height={640}
                     loading="lazy"
                     src="/assets/Book-now/step3.jpeg"
                     width={360}
                  />
               </div>
            </div>
         </section>

         <section className={styles.partnerSection} id="partners">
            <div className={styles.partnerIntro}>
               <p className={styles.partnerEyebrow}>For Service Partners</p>
               <h2>Grow Your Business with ExtraHand</h2>
               <p className={styles.sectionDescription}>
                  Find more work, manage your bookings and build your local reputation.
               </p>
               <ul className={styles.benefitList}>
                  <li><span>✓</span> Get more work opportunities</li>
                  <li><span>✓</span> Manage your bookings easily</li>
                  <li><span>✓</span> Track your earnings and payouts</li>
                  <li><span>✓</span> Dedicated support team</li>
               </ul>
               <div className={styles.partnerActions}>
                  <a
                     className={styles.partnerStoreButton}
                     href={partnerPlayStoreUrl}
                     rel="noreferrer"
                     target="_blank"
                  >
                     <span aria-hidden="true">▶</span> Download Partner App
                  </a>
                  <Link
                     className={styles.callbackButton}
                     href="/ad/partner-interest"
                  >
                     <Headset aria-hidden="true" /> Request a Callback
                  </Link>
               </div>
            </div>
            <div className={styles.partnerVisual}>
               <Image
                  alt="ExtraHand partner app earnings and service professional"
                  className={styles.partnerBannerImage}
                  height={1024}
                  loading="lazy"
                  src="/assets/ad/ExtraHand%20Partner%20Earnings%20Showcase.png"
                  width={1536}
               />
            </div>
         </section>

         <section aria-label="Download the ExtraHand app" className={styles.appDownload}>
            <div aria-hidden="true" className={styles.downloadPhone}>
               <Image
                  alt=""
                  height={640}
                  loading="lazy"
                  src="/assets/Book-now/step1.jpeg"
                  width={360}
               />
            </div>
            <div className={styles.downloadCopy}>
               <h2>Get the ExtraHand App</h2>
               <p>Book services, track your bookings and get real-time updates.</p>
            </div>
            <div className={styles.storeLinks}>
               <StoreLink detail="GET IT ON" href={PLAY_STORE_URL} label="Google Play" />
               <StoreLink detail="Download on the" href={APP_STORE_URL} label="App Store" />
            </div>
         </section>

         <section aria-label="ExtraHand service benefits" className={styles.serviceBenefits}>
            <div className={styles.serviceBenefit}>
               <ShieldCheck aria-hidden="true" />
               <strong>Verified Partners</strong>
            </div>
            <div className={styles.serviceBenefit}>
               <Zap aria-hidden="true" />
               <strong>On-Time Service</strong>
            </div>
            <div className={styles.serviceBenefit}>
               <IndianRupee aria-hidden="true" />
               <strong>Transparent Pricing</strong>
            </div>
            <div className={styles.serviceBenefit}>
               <Headset aria-hidden="true" />
               <strong>Dedicated Support</strong>
            </div>
         </section>

         <footer className={styles.footer}>
            <Link aria-label="ExtraHand home" className={styles.logo} href="/">
               <Image alt="" height={32} src="/assets/images/extrahand-logo.webp" width={150} />
            </Link>
            <p>Trusted help for your everyday needs.</p>
            <div className={styles.footerLinks}>
               <a href="#services">Services</a>
               <a href="#customers">For Customers</a>
               <a href="#partners">For Partners</a>
               <Link href="/contact">Contact</Link>
            </div>
         </footer>
      </main>
   );
}
