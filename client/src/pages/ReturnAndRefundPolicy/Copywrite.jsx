import React from "react";

const Copywrite = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-gray-100 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900">
        Brand Trademark & Copyright Disclaimer
      </h1>
      <p className="text-sm text-gray-600 text-center mb-8">
        Effective Date: December 2024
      </p>
      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            1. Use of Third-Party Logos and Trademarks
          </h2>
          <p className="leading-relaxed">
            Naideal.com is not the owner or license holder of the logos, brand
            names, or trademarks of any third-party companies that may be
            displayed on our website. We utilize these logos, brand names, and
            trademarks solely to promote offers, deals, and business promotions
            for the respective companies and businesses who provide them.
          </p>
          <p>
            By posting listings and deals on Naideal.com, businesses may provide
            us with the necessary assets (logos, brand names, trademarks) for
            promotion, but we do not claim ownership or affiliation with any of
            these third-party brands, unless explicitly stated.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            2. Copyright Disclaimer
          </h2>
          <p>
            All third-party logos, trademarks, and brand names displayed on
            Naideal.com are the property of their respective owners. These
            trademarks, logos, and brand names are used for the sole purpose of
            promoting offers, deals, and business opportunities for the
            respective brands or businesses.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            3. No License to Use Trademarks
          </h2>
          <p>
            Naideal.com does not hold any license or right to use any
            third-party trademarks, logos, or brand names. The use of these logos
            and trademarks does not imply any endorsement or affiliation unless
            specifically stated.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            4. Fair Use of Trademarks
          </h2>
          <p>
            The use of third-party logos, trademarks, and brand names is
            intended for informational and promotional purposes only. The
            content on our site falls within the scope of "fair use" under
            applicable copyright laws.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            5. Intellectual Property Rights
          </h2>
          <p>
            All content created and owned by Naideal.com, including website
            design, graphics, text, software, and other elements, is protected
            by copyright and intellectual property laws.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            6. Infringement Notification
          </h2>
          <p>
            If you are a trademark or copyright owner and believe that any
            content on Naideal.com infringes your rights, please contact us at:
          </p>
          <ul className="list-disc list-inside ml-4 mt-3">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:care@naideal.com"
                className="text-blue-500 hover:underline"
              >
                care@naideal.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:09953825382"
                className="text-blue-500 hover:underline"
              >
                099-5382-5382
              </a>
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            7. Disclaimer of Liability
          </h2>
          <p>
            Naideal.com disclaims any responsibility for disputes, claims, or
            legal issues arising from the use of third-party trademarks or logos
            displayed on our site.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            8. Changes to This Disclaimer
          </h2>
          <p>
            Naideal.com reserves the right to update this Brand Trademark &
            Copyright Disclaimer at any time. Please check back periodically for
            updates.
          </p>
          <p className="text-gray-600 mt-3">Last Revised: December 2024</p>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center">
        <p className="text-gray-700">
          By using Naideal.com, you acknowledge and agree to this disclaimer.
        </p>
      </footer>
    </div>
  );
};

export default Copywrite;
