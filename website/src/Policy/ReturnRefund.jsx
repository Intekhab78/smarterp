import { Helmet } from "react-helmet";

function ReturnRefund() {
  return (
    <>
      <Helmet>
        <title>Returns & Refund Policy | Islamic Book Zone</title>
      </Helmet>

      {/* Full Screen Wrapper */}
      <div className="min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-6 py-12 w-full">

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">

            {/* Header with Icon */}
            <div className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="text-xl font-semibold text-gray-800">
                Returns & Refund Policy
              </h1>
            </div>

            {/* Policy Statement */}
            <p className="text-sm text-gray-700 mb-4">
              <strong>All sales are final.</strong> No returns, no exchanges, and no refunds once payment is completed.
            </p>

            {/* Notice Box */}
            <div className="!bg-yellow-50 border !border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm !text-yellow-800">
                Please check all items carefully before making payment.
              </p>
            </div>

            {/* Simple Points */}
            <ul className="text-sm text-gray-600 space-y-2 !list-disc !pl-4">
              <li>Verify product condition before payment.</li>
              <li>Confirm items, quantity, and price at checkout.</li>
              <li>No changes allowed after payment.</li>
            </ul>

            {/* Footer */}
            <div className="mt-6 border-t pt-4 text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ReturnRefund;
