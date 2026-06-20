import { motion } from "framer-motion";

const ShippingAddressPopup = ({ onClose, loading, error, address }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading address...</p>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Address */}
        {address && !loading && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Shipping Address
              </h2>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {address.address_type}
              </span>
            </div>

            {/* Name */}
            <p className="text-base font-medium text-gray-900 mb-1">
              {address.full_name}
            </p>

            {/* Address */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {address.address_line1}
              {address.address_line2 && (
                <>
                  <br />
                  {address.address_line2}
                </>
              )}
              <br />
              {address.city}, {address.state} - {address.pincode}
              <br />
              {address.country}
            </p>

            {/* Divider */}
            <div className="border-t my-4" />

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{address.phone_number}</p>
              </div>

              {address.alternate_phone_number && (
                <div>
                  <p className="text-gray-500">Alternate Phone</p>
                  <p className="font-medium">
                    {address.alternate_phone_number}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-5">
              {address.is_default && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Default Address
                </span>
              )}

              <span className="text-xs text-gray-400">
                Status: {address.status}
              </span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ShippingAddressPopup;
