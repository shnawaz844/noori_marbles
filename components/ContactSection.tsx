import React from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import EnquiryForm from './EnquiryForm';
import { SHOWROOM_DETAILS } from '../constants';

const ContactSection: React.FC = () => {
    return (
        <section id="contact" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Contact Us</h2>
                            <p className="text-slate-500 mb-8">We invite you to experience our collection in person at our showroom.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Showroom Address</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{SHOWROOM_DETAILS.address}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Call Us</h4>
                                    <p className="text-slate-500 text-sm">{SHOWROOM_DETAILS.phone}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Business Hours</h4>
                                    <p className="text-slate-500 text-sm">{SHOWROOM_DETAILS.timings}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4">Follow Our Designs</h4>
                            <div className="flex gap-4">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-amber-500 hover:text-white transition-all">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <EnquiryForm />
                        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                title="Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14041.547144703887!2d79.444733!3d28.370487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDIyJzEzLjgiTiA3OcKwMjYnNDEuMCJF!5e0!3m2!1sen!2sin!4v1625471900000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
