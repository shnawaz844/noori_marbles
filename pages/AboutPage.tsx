import React from 'react';
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Hero banner */}
            <div
                style={{
                    position: 'relative',
                    height: '480px',
                    overflow: 'hidden',
                    backgroundColor: '#1a1c1c',
                }}
            >
                <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000"
                    alt="Noori Marbles Showroom"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '64px 80px',
                    }}
                    className="px-6 md:px-[80px]"
                >
                    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                        <p className="label-caps" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                            Our Story
                        </p>
                        <h1
                            className="font-caslon"
                            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.05 }}
                        >
                            About Noori Marbles
                        </h1>
                    </div>
                </div>
            </div>

            {/* About detail section */}
            <AboutSection />

            {/* Values section */}
            <section
                style={{ backgroundColor: '#1a1c1c', padding: '120px 80px' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
                        What Sets Us Apart
                    </p>
                    <h2
                        className="font-caslon"
                        style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.2, marginBottom: '80px' }}
                    >
                        Our Commitment<br />to Excellence.
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}
                        className="grid-cols-1 md:grid-cols-3"
                    >
                        {[
                            {
                                num: '01',
                                title: 'Curated Selection',
                                desc: 'Every product in our showroom is handpicked from global leaders to ensure only the finest quality reaches your home.',
                            },
                            {
                                num: '02',
                                title: 'Expert Guidance',
                                desc: 'Our team of design specialists provides personalised consultations, helping you realise your vision with confidence.',
                            },
                            {
                                num: '03',
                                title: 'End-to-End Service',
                                desc: 'From material selection to installation support, we partner with you at every stage of your interior project.',
                            },
                        ].map((item) => (
                            <div
                                key={item.num}
                                style={{
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '48px 40px',
                                }}
                            >
                                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }}>
                                    {item.num}
                                </p>
                                <p
                                    className="font-caslon"
                                    style={{ fontSize: '22px', color: '#ffffff', marginBottom: '16px', lineHeight: 1.3 }}
                                >
                                    {item.title}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '24px' }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
