import type { NavGroup, NavItem } from '@/types';
import { CATEGORIES } from './courses';

export const topBarLinks: NavItem[] = [
  { label: 'About NextGen', to: '/about' },
  { label: 'Academic Programs', to: '/programs' },
  { label: 'Student Resources', to: '/resources/help-center' },
  { label: 'Teach with Us', to: '/contact' },
  { label: 'Contact Us', to: '/contact' },
];

export const mainNav: NavGroup[] = [
  {
    label: 'Courses',
    to: '/courses',
    match: ['/courses'],
    items: CATEGORIES.map((c) => ({
      label: c,
      to: c === 'All Courses' ? '/courses' : `/courses?category=${encodeURIComponent(c)}`,
    })),
  },
  {
    label: 'Programs',
    to: '/programs',
    match: ['/programs'],
    items: ['Undergraduate Programs', 'Professional Programs', 'Short Courses', 'Self-Paced Learning'].map((label) => ({ label, to: '/programs' })),
  },
  {
    label: 'Certifications',
    to: '/certificates',
    match: ['/certificates', '/verify'],
    items: [
      { label: 'Available Certificates', to: '/certificates' },
      { label: 'Certificate Verification', to: '/verify' },
    ],
  },
  {
    label: 'Learning Resources',
    to: '/resources/learning-guides',
    match: ['/resources'],
    items: [
      { label: 'Learning Guides', to: '/resources/learning-guides' },
      { label: 'Help Center', to: '/resources/help-center' },
      { label: 'Frequently Asked Questions', to: '/resources/faq' },
    ],
  },
  { label: 'About Us', to: '/about', match: ['/about'] },
  { label: 'Contact', to: '/contact', match: ['/contact'] },
];

export const footerColumns: { title: string; items: NavItem[] }[] = [
  { title: 'NextGen Academy', items: [{ label: 'About Us', to: '/about' }, { label: 'Our Mission', to: '/about' }, { label: 'Contact Us', to: '/contact' }] },
  { title: 'Learning', items: [{ label: 'All Courses', to: '/courses' }, { label: 'Programs', to: '/programs' }, { label: 'Certifications', to: '/certificates' }, { label: 'Learning Resources', to: '/resources/learning-guides' }] },
  { title: 'Student Support', items: [{ label: 'Student Login', to: '/login' }, { label: 'Help Center', to: '/resources/help-center' }, { label: 'Frequently Asked Questions', to: '/resources/faq' }, { label: 'Contact Support', to: '/contact' }] },
  { title: 'Legal', items: [{ label: 'Privacy Policy', to: '/resources/privacy' }, { label: 'Terms and Conditions', to: '/resources/terms' }] },
];