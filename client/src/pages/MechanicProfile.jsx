import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaWrench, FaStar, FaUser, FaPhone, FaMapMarkerAlt, 
  FaArrowLeft, FaCheckCircle, FaAward, FaTools, FaRegClock,
  FaEnvelope, FaIdBadge
} from 'react-icons/fa'
import axios from 'axios'
import { useToast } from '../context/ToastContext'

export default function MechanicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [mechanic, setMechanic] = useState(null)
  const [reviewsData, setReviewsData] = useState({ averageRating: 0, totalReviews: 0, reviews: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE = '/api';
        const [mechRes, revRes] = await Promise.all([
          axios.get(`${BASE}/users/mechanic/${id}`),
          axios.get(`${BASE}/reviews/mechanic/${id}`)
        ])
        setMechanic(mechRes.data)
        
        // Normalize reviewsData safely
        const rawReviews = revRes.data
        if (rawReviews && typeof rawReviews === 'object') {
          setReviewsData({
            averageRating: rawReviews.averageRating || 0,
            totalReviews: rawReviews.totalReviews || 0,
            reviews: Array.isArray(rawReviews.reviews) ? rawReviews.reviews : []
          })
        } else {
          setReviewsData({ averageRating: 0, totalReviews: 0, reviews: [] })
        }
      } catch (err) {
        console.error('Failed to load mechanic profile details:', err)
        addToast('Failed to load mechanic details', 'error')
        navigate(-1)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!mechanic) return null

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20 px-6 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-10 flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-gold transition-colors"
        >
          <FaArrowLeft /> Back to Request
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visual Profile (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gold/20 blur-3xl opacity-30 rounded-full" />
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-2xl">
                {mechanic.profilePhoto ? (
                  <img src={mechanic.profilePhoto} alt={mechanic.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-soft-dark flex items-center justify-center text-6xl text-white/10">
                    <FaUser />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-gold text-deep-black text-[10px] font-black rounded-full uppercase tracking-widest">Elite Mechanic</span>
                    {mechanic.isVerified && <FaCheckCircle className="text-emerald-400 text-sm" />}
                  </div>
                  <h1 className="text-4xl font-heading font-black text-white italic">{mechanic.name}</h1>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-soft-dark/50 p-6 rounded-3xl border border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 text-gold mb-2">
                  <FaStar className="text-sm" />
                  <span className="text-xl font-bold">{reviewsData.averageRating > 0 ? reviewsData.averageRating : '5.0'}</span>
                </div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{reviewsData.totalReviews || 0} Platform Reviews</p>
              </div>
              <div className="bg-soft-dark/50 p-6 rounded-3xl border border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 text-gold mb-2">
                  <FaAward className="text-sm" />
                  <span className="text-xl font-bold">{mechanic.experience || '5'}+</span>
                </div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Years Experience</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-4 bg-gold rounded-full" /> Verified Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20"><FaPhone /></div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Primary Line</p>
                    <p className="text-sm font-bold text-white tracking-wide">{mechanic.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20"><FaEnvelope /></div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Internal Mail</p>
                    <p className="text-sm font-bold text-white tracking-wide">{mechanic.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Bio (7 cols) */}
          <div className="lg:col-span-7 space-y-10 pt-4">
            <div>
              <h2 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Professional Overview</h2>
              <div className="p-8 bg-soft-dark/30 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-gold/5 text-8xl"><FaTools /></div>
                <p className="text-lg text-text-gray leading-relaxed italic relative z-10">
                  "{mechanic.name} is a certified master technician at AutoMend, specializing in high-precision automotive repairs. With a commitment to excellence and years of hands-on experience, ensuring your vehicle returns to its peak performance is our top priority."
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-6">Expert Skills & Masteries</h2>
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(mechanic.skills) ? mechanic.skills : []).map((skill, i) => (
                  <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group hover:border-gold/30 transition-all">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#C9A84C]" />
                    <span className="text-sm font-bold text-white">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-xs font-black text-gold uppercase tracking-[0.3em]">Credentials</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-5 bg-soft-dark/50 rounded-2xl border border-white/5">
                    <FaIdBadge className="text-gold" />
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">ID Reference</p>
                      <p className="text-xs font-bold text-white">{mechanic._id.slice(-10).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-soft-dark/50 rounded-2xl border border-white/5">
                    <FaRegClock className="text-gold" />
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Member Since</p>
                      <p className="text-xs font-bold text-white">{new Date(mechanic.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xs font-black text-gold uppercase tracking-[0.3em]">Home Base</h2>
                <div className="p-6 bg-gold/5 border border-gold/20 rounded-2xl flex gap-4">
                  <FaMapMarkerAlt className="text-gold mt-1" />
                  <p className="text-sm text-text-gray font-medium italic leading-relaxed">
                    {mechanic.address || 'AutoMend Central Garage, Mumbai Hub'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5">
              <div className="flex items-center justify-between p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Verification Status</h4>
                    <p className="text-xs text-emerald-400 font-bold">Background Checked & Approved</p>
                  </div>
                </div>
                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">AutoMend Certified</div>
              </div>
            </div>

            {/* Public Reviews Block */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <h2 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Customer Reviews</h2>
              <div className="space-y-4">
                {Array.isArray(reviewsData?.reviews) && reviewsData.reviews.length > 0 ? (
                  reviewsData.reviews.map((rev, idx) => (
                    <div key={rev._id || idx} className="p-6 bg-soft-dark/20 border border-white/5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                            {rev.customerId?.name?.slice(0, 2).toUpperCase() || "CU"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{rev.customerId?.name || "Customer"}</p>
                            <p className="text-[10px] text-text-muted">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gold text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(rev.mechanicRating) ? 'text-gold' : 'text-white/10'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text-gray italic leading-relaxed">
                        "{rev.mechanicComment || 'Excellent, highly professional repair work!'}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-soft-dark/10 border border-white/5 rounded-2xl text-center text-sm text-text-muted italic">
                    No public reviews available for this mechanic yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
