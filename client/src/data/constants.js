import { FaTools, FaOilCan, FaCar, FaBatteryFull, FaExclamationTriangle, FaCogs, FaWrench } from 'react-icons/fa'

export const SERVICES = [
  { id: 1, title: 'Engine Repair', price: '$299', desc: 'Complete engine diagnostics, rebuild & performance tuning by certified experts.', icon: FaCogs, gradient: 'from-orange-500/20 to-gold/20' },
  { id: 2, title: 'Oil Change', price: '$49', desc: 'Premium synthetic oil change with multi-point inspection included.', icon: FaOilCan, gradient: 'from-gold/20 to-yellow-500/20' },
  { id: 3, title: 'Tire Service', price: '$89', desc: 'Alignment, balancing, rotation & replacement with top-tier brands.', icon: FaCar, gradient: 'from-amber-500/20 to-gold/20' },
  { id: 4, title: 'Battery Replacement', price: '$129', desc: 'Quick battery testing & replacement with warranty-backed products.', icon: FaBatteryFull, gradient: 'from-yellow-600/20 to-gold/20' },
  { id: 5, title: 'Brake Service', price: '$149', desc: 'Brake pad replacement, rotor resurfacing & fluid flush.', icon: FaWrench, gradient: 'from-orange-600/20 to-gold/20' },
  { id: 6, title: 'Emergency Breakdown', price: '$99', desc: '24/7 roadside assistance & emergency towing to our premium facility.', icon: FaExclamationTriangle, gradient: 'from-red-500/20 to-gold/20' },
]

export const MECHANICS = [
  { id: 1, name: 'James Rodriguez', experience: '12 Years', rating: 4.9, reviews: 324, specialty: 'Engine Specialist', desc: 'ASE-certified master technician specializing in high-performance engines.', avatar: 'JR' },
  { id: 2, name: 'Sarah Chen', experience: '8 Years', rating: 4.8, reviews: 256, specialty: 'Electrical Systems', desc: 'Expert in hybrid & electric vehicle systems with advanced diagnostic skills.', avatar: 'SC' },
  { id: 3, name: 'Marcus Williams', experience: '15 Years', rating: 5.0, reviews: 512, specialty: 'Full Service Expert', desc: 'Award-winning mechanic with expertise across all vehicle makes and models.', avatar: 'MW' },
]

export const STATS = [
  { label: 'Happy Customers', value: '15,000+' },
  { label: 'Expert Mechanics', value: '50+' },
  { label: 'Awards Won', value: '25+' },
  { label: 'Vehicles Repaired', value: '50,000+' },
]

export const MOCK_REQUESTS = [
  { id: 'REQ-1024', customer: 'Alex Johnson', vehicle: '2024 BMW X5', issue: 'Engine making weird noise', date: '2026-04-20', status: 'pending', service: 'Engine Repair' },
  { id: 'REQ-1023', customer: 'Samantha Lee', vehicle: '2023 Tesla Model 3', issue: 'Battery warning light', date: '2026-04-19', status: 'accepted', service: 'Battery Check' },
  { id: 'REQ-1022', customer: 'Michael Brown', vehicle: '2021 Porsche Macan', issue: 'Routine oil change', date: '2026-04-18', status: 'completed', service: 'Oil Change' },
]

export const MOCK_VEHICLES = [
  { id: 1, brand: 'BMW', model: 'X5', plate: 'MH-01-AB-1234', type: 'SUV', fuel: 'Petrol' },
  { id: 2, brand: 'Tesla', model: 'Model 3', plate: 'DL-04-EV-9999', type: 'Sedan', fuel: 'Electric' },
]
