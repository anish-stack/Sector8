import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })
    },[])
    return (
        <div className="p-6 bg-gray-100 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
            <p className="mb-4">
                At Naideal.com, we are committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
            </p>
            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <p>
                We collect personal information such as your name, email address, and contact number when you register, make purchases, or interact with our platform. We also gather usage data to improve your experience.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">How We Use Your Information</h2>
            <p>
                Your information is used to provide services, process orders, send updates, and improve our offerings. We do not sell your data to third parties.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Data Security</h2>
            <p>
                We implement robust security measures to protect your information. However, no system is entirely secure, and we encourage users to take precautions.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
