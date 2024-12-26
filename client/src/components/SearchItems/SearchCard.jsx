import React from 'react';
import { MapPin, Phone, Tag, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SearchCard = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <a
          href={`/Single-Listing/${item?._id}/${item.Title.replace(/\s+/g, '-')}}`}
          key={item._id}
          className="group cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
        >

          <div className="relative h-48 overflow-hidden">
            <img
              src={item.Pictures[0]?.ImageUrl || item.Items[0]?.dishImages[0]?.ImageUrl}
              alt={item.Title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

          </div>


          <div className="p-4">
            <div className="mb-3">
              <h3 className="mb-1 text-xl font-semibold text-gray-800">{item.Title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{item.Details}</p>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <img
                src={item.ShopId.ProfilePic}
                alt={item.ShopId.ShopName}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">{item.ShopId.ShopName}</p>
                <p className="text-sm text-gray-600">{item.ShopId?.ShopCategory?.CategoriesName || "no cat"}</p>
              </div>
            </div>

            {item.Items && item.Items.length > 0 && (
              <div className="mb-3 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.Items[0].itemName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">₹{item.Items[0].MrpPrice}</span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                      {item.Items[0].Discount}% OFF
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{item.ShopId.ShopAddress.City}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SearchCard;