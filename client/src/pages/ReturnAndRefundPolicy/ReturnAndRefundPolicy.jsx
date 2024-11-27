import React, { useEffect } from 'react';

const ReturnAndRefundPolicy = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })
    },[])
    return (
        <div className="p-6 bg-gray-100 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Return and Refund Policy</h1>
            <p className="mb-4">
                Thank you for shopping with Naideal.com. We appreciate your trust in our platform. Please read our return and refund policy carefully before making any purchase.
            </p>
            <h2 className="text-xl font-semibold mb-2">No Returns or Refunds</h2>
            <p className="mb-4">
                At Naideal.com, all sales are considered final. Due to the nature of our products and services, we do not accept returns or provide refunds for any orders. We strongly encourage our customers to review product descriptions, images, and other details carefully before making a purchase.
            </p>
            <h2 className="text-xl font-semibold mb-2">Exceptions</h2>
            <p className="mb-4">
                In the rare event of a damaged or defective product, please contact us within 48 hours of delivery. Our team will evaluate your concern, and if approved, we will provide a replacement for the defective item.
            </p>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="mb-4">
                If you have any questions or concerns about this policy, feel free to reach out to us:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Email: <a href="mailto:care@naideal.com" className="text-blue-500 hover:underline">care@naideal.com</a></li>
                <li>Phone: <a href="tel:+919953825382" className="text-blue-500 hover:underline">+91 99538 25382</a></li>
            </ul>
            <p className="mb-4">
                By making a purchase on Naideal.com, you agree to this policy and acknowledge that no returns or refunds will be provided under normal circumstances.
            </p>
        </div>
    );
};

export default ReturnAndRefundPolicy;
