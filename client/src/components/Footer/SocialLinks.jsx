import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

// Default social media links
const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://linkedin.com", label: "Youtube" },

];

// SocialLinks component
const SocialLinks = ({ data = [] }) => {
  // Check if data is empty or invalid
  const linksToRender = (Array.isArray(data) && data.length > 0) ? data : socialLinks;

  return (
    <div>
      <div className="space-y-4 text-center">
        {/* Section Header */}
        <h3 className="text-lg font-bold text-white">Follow Us</h3>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-4">
          {linksToRender.map(({ appName, appLink, _id }) => (
            <a
              key={_id || appName} // Use _id if available, otherwise use appName
              href={appLink} // Use the dynamic appLink from data or socialLinks
              aria-label={appName} // Use the dynamic appName from data or socialLinks
              target="_blank" // Open links in a new tab
              rel="noopener noreferrer" // Prevent security risks when opening new tabs
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
            >
              {/* Check if the appName matches a known icon in socialLinks */}
              {appName === 'Facebook' && <Facebook className="w-5 h-5 text-white" />}
              {appName === 'Twitter' && <Twitter className="w-5 h-5 text-white" />}
              {appName === 'Instagram' && <Instagram className="w-5 h-5 text-white" />}
              {appName === 'LinkedIn' && <Linkedin className="w-5 h-5 text-white" />}
              {appName === 'Youtube' && <Youtube className="w-5 h-5 text-white" />}

            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
