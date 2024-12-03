import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const ListingCard = ({ item, index }) => {

    if (!item || !item.listing || !item.shopDetails) {
        return null;
      }
  return (
    <div>
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        to={`/Single-Listing/${item.listing._id}/${item.listing.Title.replace(/\s+/g, '-')}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.listing.Pictures[0]?.ImageUrl}
            alt={item.listing.Title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
          {item.shopDetails.ListingPlan !== 'Free' && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white py-1.5 px-3 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {item.listing.Title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.shopDetails.ShopAddress.NearByLandMark}, {item.shopDetails.ShopAddress.PinCode}
          </p>

          {item.listing.Items.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-sm font-medium">
                {item.listing.Items[0].Discount}% Off
              </span>
              <span className="text-sm text-gray-600 truncate">
                {item.listing.Items[0].itemName}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>

    </div>
  )
}

export default ListingCard
