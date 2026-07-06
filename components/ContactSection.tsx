import React from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import EnquiryForm from './EnquiryForm';
import { SHOWROOM_DETAILS } from '../constants';

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      style={{ backgroundColor: 'var(--surface-white)', padding: '160px 80px', transition: 'background-color 0.4s ease' }}
      className="px-6 md:px-[80px]"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}
          className="grid-cols-1 lg:grid-cols-[1fr_2fr]">

          {/* Left — Info */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '24px' }}>
              Get in Touch
            </p>
            <h2
              className="font-caslon"
              style={{
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 400,
                color: 'var(--on-surface)',
                lineHeight: 1.2,
                marginBottom: '48px',
              }}
            >
              Visit Our<br />Showroom.
            </h2>

            {/* Contact info items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                {
                  icon: <MapPin size={14} strokeWidth={1.5} />,
                  label: 'Address',
                  value: SHOWROOM_DETAILS.address,
                },
                {
                  icon: <Phone size={14} strokeWidth={1.5} />,
                  label: 'Phone',
                  value: SHOWROOM_DETAILS.phone,
                },
                {
                  icon: <Clock size={14} strokeWidth={1.5} />,
                  label: 'Hours',
                  value: SHOWROOM_DETAILS.timings,
                },
              ].map((item, idx, arr) => (
                <div
                  key={item.label}
                  style={{
                    padding: '20px 0',
                    borderBottom: idx < arr.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--outline)' }}>{item.icon}</span>
                    <span className="label-caps" style={{ color: 'var(--outline)' }}>{item.label}</span>
                  </div>
                  <p style={{ color: 'var(--on-surface)', fontSize: '14px', lineHeight: '22px', paddingLeft: '22px' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--outline-variant)' }}>
              <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>Follow</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '1px solid var(--on-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--on-surface)',
                      textDecoration: 'none',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'var(--on-surface)';
                      e.currentTarget.style.color = 'var(--surface-white)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--on-surface)';
                    }}
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form + Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            <EnquiryForm />
            <div style={{ width: '100%', overflow: 'hidden', height: '360px' }}>
              <iframe
                title="Noori Marbles Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500!2d79.4259156!3d28.4192157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0064b98ff630b%3A0xfcddf2868ce0c4f5!2sNoori%20Marbles!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', filter: 'grayscale(100%)' }}
                allowFullScreen={true}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
