import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';

export default function FloatingWidget() {
  return (
    <div className="floating-widget no-print">
      <a 
        href="https://wa.me/8801325165451?text=Hello%20Media%20Scope%20IT%20Ltd,%20I%20want%20to%20know%20about%20your%20courses%20and%20services." 
        target="_blank" 
        rel="noreferrer" 
        className="float-btn float-whatsapp no-print"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={26} />
      </a>

      <a 
        href="tel:+8801325165451" 
        className="float-btn float-phone no-print"
        title="Call Admission Hotline"
      >
        <PhoneCall size={24} />
      </a>
    </div>
  );
}
