

import React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react';
const ContactInfo = ({data}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Contact</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
        <i className="fa-solid fa-location-dot w-5 h-5 text-purple-400 mt-1 flex-shrink-0"></i>
         
          <p className="text-gray-300">
          {data?.officeAddress}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <a 
            href={`tel:${data?.contactNumber}`} 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            {data?.contactNumber}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <a 
            href={`mailto:${data?.FooterEmail}`}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
             {data?.FooterEmail}
          </a>
        </div>
      </div>
    </div>

  )
}

export default ContactInfo
