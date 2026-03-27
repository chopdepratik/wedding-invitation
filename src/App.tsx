import { useState, useEffect, useRef } from 'react';

// Falling Petals Component
const FallingPetals = () => {
  const petals = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 10 + Math.random() * 10,
    size: 12 + Math.random() * 16,
    emoji: ['🌸', '🌺', '✿', '🌷', '💮', '❀'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute animate-petal-fall opacity-0"
          style={{
            left: `${petal.left}%`,
            top: '-50px',
            fontSize: `${petal.size}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          {petal.emoji}
        </div>
      ))}
    </div>
  );
};

// Countdown Component
const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance > 0) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      };
    }
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-6 justify-center mt-8 md:mt-10">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.mins, label: 'Mins' },
        { value: timeLeft.secs, label: 'Secs' },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-white/80 backdrop-blur-sm border border-rose-200/50 rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] shadow-lg shadow-rose-100/50">
            <span className="block text-3xl md:text-4xl font-light text-rose-400" style={{ fontFamily: 'Playfair Display' }}>
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs tracking-[3px] text-rose-300 uppercase mt-1 block" style={{ fontFamily: 'Josefin Sans' }}>
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Scroll Animation Hook
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Animated Section Component
const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
};

// Event Card Component
const EventCard = ({ icon, name, date, time, venue }: { icon: string; name: string; date: string; time: string; venue: string }) => (
  <div className="group bg-white/70 backdrop-blur-sm border border-rose-100/80 rounded-3xl p-6 md:p-8 text-center hover:bg-white hover:shadow-2xl hover:shadow-rose-100/50 transition-all duration-500 hover:-translate-y-2">
    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-5 bg-gradient-to-br from-rose-50 to-rose-100 rounded-full flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-medium text-rose-400 mb-3" style={{ fontFamily: 'Playfair Display' }}>
      {name}
    </h3>
    <p className="text-sm md:text-base text-gray-600 mb-1" style={{ fontFamily: 'Josefin Sans' }}>{date}</p>
    <p className="text-rose-400 font-medium text-sm md:text-base mb-2">{time}</p>
    <p className="text-xs md:text-sm text-gray-400 italic">{venue}</p>
  </div>
);

function App() {
  const weddingDate = new Date('2026-05-13T10:00:00');
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', wishes: '' });

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Timeline' },
    { id: 'events', label: 'Events' },
    { id: 'venue', label: 'Venue' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'wishes', label: 'Wishes' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveNav(id);
      setMobileMenuOpen(false);
    }
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', wishes: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50/30 overflow-x-hidden">
      <FallingPetals />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl md:text-3xl text-rose-400" style={{ fontFamily: 'Great Vibes' }}>
              B & A
            </span>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-xs tracking-[2px] uppercase transition-all duration-300 ${activeNav === item.id ? 'text-rose-400' : 'text-gray-400 hover:text-rose-300'
                    }`}
                  style={{ fontFamily: 'Josefin Sans' }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-rose-400 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-rose-400 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-rose-400 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-rose-100 mt-2 pt-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 text-sm tracking-[2px] uppercase text-gray-500 hover:text-rose-400"
                  style={{ fontFamily: 'Josefin Sans' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 pb-12 px-4">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-32 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 text-center max-w-3xl mx-auto">
          <div className="mb-8 md:mb-12">
            <span className="text-[10px] md:text-sm tracking-[6px] text-gray-400 font-bold uppercase" style={{ fontFamily: 'Josefin Sans' }}>
              We Are Tying The Knot
            </span>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full border-[8px] border-white shadow-[0_0_40px_rgba(251,113,133,0.3)] overflow-hidden bg-rose-50 flex items-center justify-center">
              <img
                src="/image copy.png"
                alt="Bharti & Abhishek"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/image.png";
                }}
              />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl text-rose-400 leading-none mb-2" style={{ fontFamily: 'Great Vibes' }}>
            Bharti
          </h1>

          <p className="text-4xl md:text-5xl text-amber-400 my-3 md:my-4" style={{ fontFamily: 'Great Vibes' }}>
            &
          </p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl text-rose-400 leading-none mb-6" style={{ fontFamily: 'Great Vibes' }}>
            Abhishek
          </h1>

          <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-rose-200" />
            <span className="text-amber-400">✿</span>
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-rose-200" />
          </div>

          <div className="mb-2">
            <p className="text-base md:text-lg tracking-[4px] text-gray-500" style={{ fontFamily: 'Playfair Display' }}>
              Wednesday · 13th May 2026
            </p>
            <p className="text-sm md:text-base text-rose-300 italic mt-2">
              Two souls, one heart, a beautiful journey begins
            </p>
          </div>

          <Countdown targetDate={weddingDate} />

          <button
            onClick={() => scrollToSection('wishes')}
            className="mt-10 md:mt-12 px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-rose-400 to-rose-300 text-white text-xs md:text-sm tracking-[3px] uppercase rounded-full hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-500 hover:-translate-y-1"
            style={{ fontFamily: 'Josefin Sans' }}
          >
            Send Wishes ✨
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-[3px] text-rose-300 uppercase" style={{ fontFamily: 'Josefin Sans' }}>Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-rose-300 to-transparent" />
        </div>
      </section>

      {/* Wedding Timeline Section */}
      <section id="story" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs tracking-[5px] text-rose-300 uppercase mb-3" style={{ fontFamily: 'Josefin Sans' }}>
                The Celebration
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-rose-400 mb-4" style={{ fontFamily: 'Great Vibes' }}>
                Wedding Timeline
              </h2>
              <div className="flex items-center justify-center gap-3 text-rose-200 text-lg">
                <span>✿</span><span>❀</span><span>✿</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-100 via-rose-200 to-rose-100 hidden md:block" />

            {/* Timeline Items */}
            {[
              {
                year: 'Completed',
                title: 'Engagement Ceremony',
                desc: 'The beautiful beginning where our families exchanged promises and rings to seal our future together.',
                icon: '💍',
                side: 'left'
              },
              {
                year: '11 May 2026',
                title: 'Mehendi Ceremony',
                desc: 'A vibrant afternoon filled with intricate henna designs, folk songs, and the beginning of festivities.',
                icon: '🌿',
                side: 'right'
              },
              {
                year: '12 May 2026',
                title: 'Sangeet Night',
                desc: 'An evening of dance, music, and joyful celebration as both families come together to celebrate our union.',
                icon: '🎵',
                side: 'left'
              },
              {
                year: '13 May 2026',
                title: 'The Wedding Day',
                desc: 'The sacred ceremony and Pheras, followed by dinner. Our journey of a lifetime begins here.',
                icon: '🌸',
                side: 'right'
              }
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12 md:mb-16 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 text-center ${item.side === 'right' ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-xs tracking-[3px] text-rose-300 uppercase" style={{ fontFamily: 'Josefin Sans' }}>
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl text-rose-400 mt-2 mb-3" style={{ fontFamily: 'Playfair Display' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-rose-100 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-rose-100/50 z-10">
                    {item.icon}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 md:py-24 px-4 bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs tracking-[5px] text-rose-300 uppercase mb-3" style={{ fontFamily: 'Josefin Sans' }}>
                Join Us For
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-rose-400 mb-4" style={{ fontFamily: 'Great Vibes' }}>
                Wedding Celebrations
              </h2>
              <div className="flex items-center justify-center gap-3 text-rose-200 text-lg">
                <span>🌸</span><span>✿</span><span>🌸</span><span>✿</span><span>🌸</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <AnimatedSection>
              <EventCard
                icon="🌿"
                name="Mehendi Ceremony"
                date="Sunday · 11 May 2026"
                time="5:00 PM Onwards"
                venue="Bride's Residence"
              />
            </AnimatedSection>
            <AnimatedSection>
              <EventCard
                icon="🎵"
                name="Sangeet Night"
                date="Monday · 12 May 2026"
                time="7:00 PM Onwards"
                venue="Celebration Hall"
              />
            </AnimatedSection>
            <AnimatedSection>
              <EventCard
                icon="🪷"
                name="Wedding Ceremony"
                date="Tuesday · 13 May 2026"
                time="Muhurat: 10:00 AM"
                venue="Bhoyar pawar sabhagruh"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs tracking-[5px] text-rose-300 uppercase mb-3" style={{ fontFamily: 'Josefin Sans' }}>
                Where To Find Us
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-rose-400 mb-4" style={{ fontFamily: 'Great Vibes' }}>
                Venue Details
              </h2>
              <div className="flex items-center justify-center gap-3 text-rose-200 text-lg">
                <span>🌸</span><span>✿</span><span>🌸</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100/80 rounded-3xl p-6 md:p-10 shadow-xl shadow-rose-100/20">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h3 className="text-xl md:text-2xl text-rose-400 mb-6" style={{ fontFamily: 'Playfair Display' }}>
                    Royal Celebration Grounds
                  </h3>

                  {[
                    { label: 'Address', value: '5C67+J89 Bhoyar pawar sabhagruh,\nKaranja (Ghadge), Maharashtra 442203' },
                    { label: 'Wedding Date', value: 'Wednesday, 13th May 2026' },
                    { label: 'Guest Arrival', value: 'Welcome from 9:00 AM' },
                    { label: 'Dress Code', value: 'Traditional & Festive Attire' },
                    { label: 'Contact', value: '+91 9021289506' }
                  ].map((item, i) => (
                    <div key={i} className="mb-4 md:mb-5">
                      <p className="text-[10px] md:text-xs tracking-[2px] text-rose-300 uppercase mb-1" style={{ fontFamily: 'Josefin Sans' }}>
                        {item.label}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 whitespace-pre-line">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="bg-gradient-to-br from-rose-50 to-amber-50/30 border-2 border-dashed border-rose-200 rounded-2xl h-64 md:h-full flex flex-col items-center justify-center cursor-pointer hover:bg-rose-100/50 transition-all group"
                  onClick={() => window.open('https://www.google.com/maps?q=5C67+J89,+Karanja+(Ghadge),+Maharashtra+442203', '_blank')}
                >
                  <span className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">📍</span>
                  <p className="text-xs md:text-sm tracking-[3px] text-rose-300 uppercase" style={{ fontFamily: 'Josefin Sans' }}>
                    View on Google Maps
                  </p>
                  <p className="text-xs text-rose-200 mt-2 italic">Tap for directions</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 md:py-24 px-4 bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs tracking-[5px] text-rose-300 uppercase mb-3" style={{ fontFamily: 'Josefin Sans' }}>
                Cherished Moments
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-rose-400 mb-4" style={{ fontFamily: 'Great Vibes' }}>
                Photo Gallery
              </h2>
              <div className="flex items-center justify-center gap-3 text-rose-200 text-lg">
                <span>🌸</span><span>✿</span><span>🌸</span><span>✿</span><span>🌸</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              '/DSC_0416.JPG',

              '/DSC_0751.JPG',
              '/DSC_0776.JPG',
              '/DSC_0787.JPG', '/DSC_0420.JPG'
            ].map((img, i) => (
              <AnimatedSection key={i}>
                <div className="aspect-square bg-white/60 border border-rose-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-rose-100/30 hover:scale-[1.02] transition-all cursor-pointer group shadow-lg shadow-rose-100/10">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Wishes Section */}
      <section id="wishes" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs tracking-[5px] text-rose-300 uppercase mb-3" style={{ fontFamily: 'Josefin Sans' }}>
                Share Your Love
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-rose-400 mb-4" style={{ fontFamily: 'Great Vibes' }}>
                Send Your Wishes
              </h2>
              <div className="flex items-center justify-center gap-3 text-rose-200 text-lg">
                <span>🌸</span><span>✿</span><span>🌸</span>
              </div>
              <p className="text-sm md:text-base text-gray-500 mt-4">
                Your blessings mean the world to us
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-3xl shadow-xl shadow-rose-100/20 overflow-hidden flex flex-col md:flex-row items-stretch">
              <div className="hidden md:block w-2/5 relative">
                <img src="/DSC_0751.JPG" alt="Couple" className="absolute inset-0 w-full h-full object-cover" />
              </div>

              <div className="w-full md:w-3/5 p-6 md:p-10">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">💕</div>
                    <h3 className="text-2xl md:text-3xl text-rose-400 mb-3" style={{ fontFamily: 'Playfair Display' }}>
                      Thank You!
                    </h3>
                    <p className="text-gray-500">
                      Your beautiful wishes have been received. May your blessings bring joy to our special day!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-rose-200 text-lg mt-6">
                      <span>🌸</span><span>✿</span><span>🌸</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-5 md:space-y-6">
                      <div>
                        <label className="text-[10px] md:text-xs tracking-[2px] text-rose-300 uppercase mb-2 block" style={{ fontFamily: 'Josefin Sans' }}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 md:px-5 py-3 md:py-4 bg-rose-50/50 border border-rose-100 rounded-xl text-sm md:text-base text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] md:text-xs tracking-[2px] text-rose-300 uppercase mb-2 block" style={{ fontFamily: 'Josefin Sans' }}>
                          Your Wishes & Blessings
                        </label>
                        <textarea
                          rows={5}
                          required
                          value={formData.wishes}
                          onChange={e => setFormData({ ...formData, wishes: e.target.value })}
                          className="w-full px-4 md:px-5 py-3 md:py-4 bg-rose-50/50 border border-rose-100 rounded-xl text-sm md:text-base text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                          placeholder="Share your heartfelt wishes, blessings, or a message for the couple..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 md:py-5 bg-gradient-to-r from-rose-400 to-rose-300 text-white text-xs md:text-sm tracking-[3px] uppercase rounded-xl hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-500 hover:-translate-y-1"
                        style={{ fontFamily: 'Josefin Sans' }}
                      >
                        Send Wishes ✨
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-rose-50 to-rose-100/50 border-t border-rose-100 py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 text-rose-200 text-lg mb-6 md:mb-8">
            <span>🌸</span><span>✿</span><span>🌸</span><span>✿</span><span>🌸</span>
          </div>

          <h2 className="text-5xl md:text-6xl text-rose-400 mb-4" style={{ fontFamily: 'Great Vibes' }}>
            Bharti & Abhishek
          </h2>

          <p className="text-xs tracking-[5px] text-rose-300 uppercase mb-6" style={{ fontFamily: 'Josefin Sans' }}>
            13 · May · 2026 · Nagpur
          </p>

          <p className="text-base md:text-lg text-gray-400 italic mb-8">
            "Together is a beautiful place to be"
          </p>

          <div className="flex items-center justify-center gap-3 text-rose-200 text-lg">
            <span>✿</span><span>🌸</span><span>✿</span><span>🌸</span><span>✿</span>
          </div>

          <p className="text-xs text-rose-300/60 mt-8">
            Made with 💕 for our special day
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
