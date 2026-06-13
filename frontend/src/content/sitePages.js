import { trustedServiceLabel } from '../utils/company';

/** Static page content sourced from pakkarent.com */
export const SITE_PAGES = {
  about: {
    title: 'About Us',
    subtitle: 'Live life bigger @ affordable price. Happy Renting!',
    seoDescription:
      'Learn about PakkaRent — Chennai, Bangalore and Hyderabad\'s trusted rental platform for appliances, camping gear, event items and baby props since 2014.',
    sections: [
      {
        heading: 'Who we are',
        body: `PakkaRent (Pakka Rent) is a rental service provider helping families and businesses access premium products without the cost of ownership. From camping tents and home appliances to silver cradles, backdrops, birthday props and team-building games — we make renting simple, affordable and reliable.`,
      },
      {
        heading: trustedServiceLabel(),
        body: `Founded in December 2014, PakkaRent has grown into one of South India's most trusted rental brands. We serve customers across Chennai, Bangalore and Hyderabad with verified, well-maintained products and doorstep delivery.`,
      },
      {
        heading: 'What we rent',
        list: [
          'Camping Rental — tents, sleeping bags, barbeque grills, life jackets',
          'Home Appliances — washing machines, fridges, AC, LED TV',
          'Event Rental — cradles, oonjal swings, chairs, urli, royal sofa',
          'Backdrop Rental — decorations and setups for functions',
          'Birthday Rental — cake stands, combos, baby car and props',
          'Baby Props — car seats, strollers, cribs, high chairs',
          'Kids Toys on Rent — slides, swings, remote cars and jeeps',
          'Games Rental — tug of war, moonwalk, bouncy castle, team games',
        ],
      },
      {
        heading: 'Our promise',
        body: `Every item goes through quality checks and cleaning before delivery. We offer flexible rental periods, transparent pricing, and friendly support — so you can focus on your event, trip or everyday life while we handle the rest.`,
      },
    ],
  },

  'how-it-works': {
    title: 'How It Works',
    subtitle: 'Rent in three simple steps',
    seoDescription:
      'How PakkaRent works — browse products, confirm your booking with our team, and get doorstep delivery in Chennai, Bangalore or Hyderabad.',
    sections: [
      {
        heading: '1. Browse & select',
        body: `Explore our catalogue by category and city. Add items to your cart, choose your rental period (monthly for appliances or date range for events and camping), and submit your order with delivery details.`,
      },
      {
        heading: '2. Team confirms your booking',
        body: `Our team verifies availability and contacts you to confirm the order. A reservation is confirmed only after receipt of the required advance payment, as per our booking policy.`,
      },
      {
        heading: '3. Delivery & return',
        body: `Products are inspected before delivery. Items arrive at your doorstep on your chosen date. At the end of the rental period, notify us for pickup. After return and condition check, security deposit refunds are processed within 2 days.`,
      },
      {
        heading: 'Need to change dates?',
        body: `Contact our executive for date changes or cancellations. Refund terms depend on how far in advance you notify us — see our Terms of Service for full details.`,
      },
    ],
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'For a quicker response, chat with us on WhatsApp',
    seoDescription:
      'Contact PakkaRent — call +91 94038 90901 or WhatsApp for rentals in Chennai, Bangalore and Hyderabad.',
    sections: [
      {
        heading: 'Phone',
        body: 'Speak with our team for availability, pricing and booking.',
        links: [
          { label: '+91 94038 90901', href: 'tel:+919403890901' },
          { label: '+91 95660 72527', href: 'tel:+919566072527' },
        ],
      },
      {
        heading: 'WhatsApp',
        body: 'Fastest way to get a quote and confirm your order.',
        links: [{ label: 'Chat on WhatsApp', href: 'https://wa.me/919361432697', external: true }],
      },
      {
        heading: 'Email',
        body: 'Send order enquiries and general questions to our team.',
        links: [{ label: 'pakkarent@gmail.com', href: 'mailto:pakkarent@gmail.com' }],
      },
      {
        heading: 'Cities we serve',
        list: ['Chennai', 'Bangalore (Bengaluru)', 'Hyderabad'],
      },
      {
        heading: 'Place an order online',
        body: `Add products to your cart on this website, enter your address and phone number, and tap Send order on WhatsApp. Tap Send in WhatsApp so our team receives your details — we will call you to confirm availability and payment.`,
        links: [{ label: 'Browse products', href: '/products' }],
      },
    ],
  },

  faq: {
    title: 'FAQs',
    subtitle: 'Common questions about renting with PakkaRent',
    seoDescription: 'PakkaRent FAQs — booking, payments, delivery, cancellation and returns.',
    faqs: [
      {
        q: 'How do I confirm a booking?',
        a: 'Our team confirms availability first. The reservation is confirmed only after we receive the required advance payment.',
      },
      {
        q: 'When will I get my security deposit back?',
        a: 'After the product is returned, we assess its condition and initiate the refund. Refunds are processed within 2 days of return.',
      },
      {
        q: 'What is the cancellation policy?',
        a: 'Contact our staff to cancel. 15+ days before the booked date: 100% advance refund. 7–14 days: 50% refund. Less than 7 days: no advance refund.',
      },
      {
        q: 'Can I change my rental dates?',
        a: 'Yes — contact our executive. The product is re-confirmed only after we verify availability on the new dates.',
      },
      {
        q: 'What if there is a problem at delivery?',
        a: 'Products are inspected before delivery. If you notice any issue, notify us immediately at the time of delivery.',
      },
      {
        q: 'Are discounts available on listed prices?',
        a: 'Pricing reflects market rates and maintenance costs. Prices on the website are final — no additional discounts apply.',
      },
      {
        q: 'Do I need to create an account to order?',
        a: 'No. Add items to your cart, fill in your name, phone, address and city, and place your order. We will call you to confirm.',
      },
    ],
  },

  delivery: {
    title: 'Delivery Info',
    subtitle: 'Doorstep delivery across Chennai, Bangalore & Hyderabad',
    seoDescription:
      'PakkaRent delivery information — free delivery zones, transport charges and installation for rentals in South India.',
    sections: [
      {
        heading: 'Delivery areas',
        body: `We deliver across Chennai, Bangalore and Hyderabad. Select your city when browsing products to see items available in your area.`,
      },
      {
        heading: 'Event & prop rentals',
        body: `Many event items include free transport up to 10 km from Velachery, Chennai (as noted on individual products). For other locations, transport charges may apply — our team will confirm when you book.`,
      },
      {
        heading: 'Home appliances',
        body: `Washing machines, fridges, AC and LED TVs include doorstep delivery. One-time transportation and installation charges may apply for certain appliances (e.g. AC installation). Monthly rental rates vary by tenure — shorter rentals may have higher per-month rates.`,
      },
      {
        heading: 'Camping & outdoor gear',
        body: `Camping equipment is available for rent in Chennai. Pick your rental dates in the cart; we deliver before your trip and arrange pickup after.`,
      },
      {
        heading: 'At delivery',
        list: [
          'Products are inspected before they leave our warehouse',
          'Check items at delivery and report any issues immediately',
          'Some products may show minor scratches from transportation — this is normal',
          'Return items in the same condition as delivered',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    subtitle: 'Pakka Rent rental policies',
    seoDescription: 'PakkaRent terms of service — booking, cancellation, refunds and product policies.',
    sections: [
      {
        heading: 'Booking policy',
        list: [
          'Confirmation of availability will be provided by our team.',
          'The reservation is considered confirmed only upon receipt of the required advance payment.',
        ],
      },
      {
        heading: 'Advance refund',
        list: [
          'After the product is returned, we assess its condition and initiate the refund.',
          'The refund is processed within 2 days following the return of the product.',
        ],
      },
      {
        heading: 'Cancellation policy',
        list: [
          'To cancel, kindly get in touch with our staff.',
          '15+ days before the booked date: 100% advance refund.',
          '7–14 days before the booked date: 50% advance refund.',
          'Less than 7 days before the event date: no advance refund.',
        ],
      },
      {
        heading: 'Date change',
        list: [
          'Contact our executive for a date change.',
          'The product is confirmed only after verification of availability on the rescheduled date.',
        ],
      },
      {
        heading: 'Product',
        list: [
          'Products undergo inspection prior to delivery. Notify us promptly if any issues are found at delivery.',
          'The product must be returned in the same condition as delivered.',
          'Certain products may incur scratches during transportation.',
          'Images on the website are original photographs or pictures from customer locations.',
        ],
      },
      {
        heading: 'Discounts',
        body: 'Product pricing is determined by comparing market rates and maintenance costs. No discounts are available beyond prices listed on the website.',
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we handle your information',
    seoDescription: 'PakkaRent privacy policy — how we collect, use and protect your personal data.',
    sections: [
      {
        heading: 'Information we collect',
        body: 'When you place an order or contact us, we may collect:',
        list: [
          'Name, phone number and email address',
          'Delivery address and city',
          'Order details — products, rental dates and quantities',
          'Account information if you register on the website',
        ],
      },
      {
        heading: 'How we use your information',
        list: [
          'To confirm bookings and coordinate delivery and pickup',
          'To contact you about your order status',
          'To process security deposits and refunds',
          'To improve our products and customer service',
        ],
      },
      {
        heading: 'Sharing your information',
        body: `We do not sell your personal data. Order details may be shared with delivery partners only as needed to fulfil your rental. Inquiry emails are sent to our team at pakkarent@gmail.com.`,
      },
      {
        heading: 'Data retention',
        body: 'We retain order and contact records as long as needed to fulfil rentals, handle refunds and meet legal obligations.',
      },
      {
        heading: 'Your rights',
        body: 'You may request access to or correction of your personal information by contacting us.',
      },
      {
        heading: 'Contact',
        body: 'For privacy-related questions:',
        links: [
          { label: 'pakkarent@gmail.com', href: 'mailto:pakkarent@gmail.com' },
          { label: '+91 94038 90901', href: 'tel:+919403890901' },
        ],
      },
    ],
  },
};

export const SITE_PAGE_SLUGS = Object.keys(SITE_PAGES);
