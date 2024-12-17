import React from "react";

const ReturnAndRefundPolicy = () => {
  return (
    <div className="bg-gray-50 text-gray-800 p-6 md:p-12 lg:p-16">
      <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
          Refund Policy
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          <strong>Effective Date:</strong> December 2024
        </p>
        <p className="mb-4 text-gray-700">
          At Naideal.com, we are committed to providing exceptional service to
          businesses using our platform to post listings, offers, deals, and
          promote their brands. We understand that sometimes situations arise
          where a refund may be necessary. This Refund Policy outlines the terms
          and conditions under which refunds may be requested and issued for
          services rendered on our website.
        </p>
        <p className="mb-6 text-gray-700">
          By using Naideal.com and purchasing our premium listing services or
          posting offers and deals, you agree to the terms of this Refund Policy.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            1. Services We Provide
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Premium Listing Services:</strong> Businesses can pay to
              have their listings promoted on our website for increased
              visibility and exposure.
            </li>
            <li>
              <strong>Offer and Deal Postings:</strong> Businesses can pay to
              post special offers and deals on our platform to attract potential
              customers.
            </li>
            <li>
              <strong>Brand, Product, and Business Promotion:</strong> Businesses
              can utilize our platform to increase the visibility of their
              brands, products, and services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            2. Payment Processing
          </h2>
          <p className="mb-4 text-gray-700">
            Naideal.com accepts payments through secure third-party payment
            processors, Razorpay and CCAvenue. These platforms are responsible
            for securely processing payments and storing sensitive payment
            information, including credit card details. We do not store any
            payment information on our servers. By using our website and making
            payments, you agree to the terms and privacy policies of these
            payment processors.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Razorpay:</strong> A secure payment gateway for processing
              payments on our website.
            </li>
            <li>
              <strong>CCAvenue:</strong> Another trusted and secure payment
              processor for transactions.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            3. Refund Eligibility
          </h2>
          <p className="mb-4 text-gray-700">
            Refund requests will be considered under the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Technical Issues:</strong> If a technical error on
              Naideal.com prevents the listing, offer, or deal from being
              displayed or functioning properly for an extended period (more
              than 48 hours), you may be eligible for a refund.
            </li>
            <li>
              <strong>Duplicate Payment:</strong> If you have been charged more
              than once for the same service due to an error in the payment
              system, you are eligible for a full refund.
            </li>
            <li>
              <strong>Unapproved Listings or Offers:</strong> If a listing or
              offer was not approved due to non-compliance with our guidelines
              or terms, and you have already made a payment, you may be eligible
              for a refund.
            </li>
          </ul>
          <p className="mt-4 mb-2 text-gray-700">
            Refunds will not be issued under the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Change of Mind:</strong> If you change your mind about
              using our premium listing or promotion services, we will not issue
              a refund once the service has been activated.
            </li>
            <li>
              <strong>Service Already Rendered:</strong> If the service has
              already been completed and the listing, offer, or deal has been
              published or displayed as per the agreement, no refund will be
              provided.
            </li>
            <li>
              <strong>Customer Errors:</strong> If the listing or deal was
              incorrectly submitted by the customer, refunds will not be
              provided.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            4. How to Request a Refund
          </h2>
          <p className="mb-4 text-gray-700">
            To request a refund, please follow these steps:
          </p>
          <ul className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Contact us at care@naideal.com with your request.</li>
            <li>
              Provide the service purchased, proof of payment, and a description
              of the issue.
            </li>
          </ul>
        </section>

        <section className="text-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Contact Us
          </h2>
          <p>
            If you have any questions, reach us at:
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:care@naideal.com" className="text-blue-500">
              care@naideal.com
            </a>
            <br />
            <strong>Phone:</strong> 099-5382-5382
          </p>
        </section>

        <p className="mt-6 text-sm text-gray-600 text-center">
          <em>Last Revised: December 2024</em>
        </p>
      </div>
    </div>
  );
};

export default ReturnAndRefundPolicy;
