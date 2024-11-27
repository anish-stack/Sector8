import React, { useEffect } from 'react';

const TermsAndConditions = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })
    },[])
    return (
        <div className="p-6 bg-gray-100 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
            <p className="mb-4">
                Welcome to Naideal.com. By accessing and using our platform, you agree to comply with the following terms and conditions.
            </p>
            <h2 className="text-xl font-semibold mb-2">Platform Use</h2>
            <p>
                Users are responsible for providing accurate information and adhering to our guidelines. Misuse of the platform may result in account termination.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Intellectual Property</h2>
            <p>
                All content on this platform, including logos and text, is protected by copyright laws. Unauthorized use is prohibited.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Liability</h2>
            <p>
                Naideal.com is not responsible for damages arising from platform misuse or third-party actions.
            </p>
        </div>
    );
};

export default TermsAndConditions;
