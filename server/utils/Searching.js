const listing = require('../models/listing.model');
const CategoreiesModel = require('../models/CategoreiesModel');

exports.SearchByAnyThing = async (req, res) => {
    try {
        const searchQuery = req.query.q || "";
        const stopWords = ["in", "on", "at", "near", "by", "from", "to", "of", "and", "the"];

        const keywords = searchQuery.split(/\s+/).filter(word => !stopWords.includes(word.toLowerCase()));
        const searchQueryString = keywords.join("\\b|\\b");

        const filter = {
            $or: [
                { Title: { $regex: `\\b${searchQueryString}\\b`, $options: "i" } },
                { Details: { $regex: `\\b${searchQueryString}\\b`, $options: "i" } }
            ]
        };

        let listingData = await listing
            .find(filter)
            .populate({
                path: 'ShopId',
                populate: {
                    path: 'ShopCategory',
                    model: CategoreiesModel
                }
            }).sort({ createdAt: -1 });

        let searchSource = 'search query';

        if (!listingData || listingData.length === 0) {
            console.log('No matching listings found in Title or Details. Checking tags...');

            listingData = await listing
                .find({
                    tags: { $regex: `\\b${searchQueryString}\\b`, $options: "i" }
                })
                .populate({
                    path: 'ShopId',
                    populate: {
                        path: 'ShopCategory',
                        model: CategoreiesModel
                    }
                });

            if (listingData.length > 0) {
                searchSource = 'search query (tags)';
            } else {
                console.log('No matching listings found with tags. Fetching all listings...');
                listingData = await listing
                    .find()
                    .populate({
                        path: 'ShopId',
                        populate: {
                            path: 'ShopCategory',
                            model: CategoreiesModel
                        }
                    });

                listingData = listingData.filter(item => {
                    const categoryName = item.ShopId.ShopCategory ? item.ShopId.ShopCategory.CategoriesName : '';
                    const shopName = item.ShopId ? item.ShopId.ShopName : '';
                    const shopAddress = item.ShopId.ShopAddress ? item.ShopId.ShopAddress : '';

                    const categoryMatch = categoryName && categoryName.toLowerCase().includes(searchQuery.toLowerCase());
                    const shopNameMatch = shopName && shopName.toLowerCase().includes(searchQuery.toLowerCase());
                    const shopAddressMatch = shopAddress && (
                        shopAddress.ShopAddressStreet.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        shopAddress.City.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        shopAddress.NearByLandMark.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    // If any of the fields match, we update the searchSource to show which matched
                    if (categoryMatch || shopNameMatch || shopAddressMatch) {
                        searchSource = 'db search (ShopName, ShopCategory, ShopAddress)';
                    }

                    return categoryMatch || shopNameMatch || shopAddressMatch;
                });
            }
        }

        const fallbackListings = await listing
            .find()
            .populate({
                path: 'ShopId',
                populate: {
                    path: 'ShopCategory',
                    model: CategoreiesModel
                }
            }).sort({ createdAt: -1 });
        // If no data found after fallback
        if (!listingData || listingData.length === 0) {
            return res.status(200).json({
                success: true,
                show:true,
                count: fallbackListings.length,
                message: `Looks like there are no offers available right now. But don't worry, we'll notify you as soon as something exciting comes up! These Offers are available right now !!`,
                searchSource: searchSource,
                data: fallbackListings
            });
        }

        // Return search results
        res.status(200).json({
            success: true,
            count: listingData.length,
            searchSource: searchSource,
            message: 'Search results found',
            data: listingData,
        });

    } catch (error) {
        console.error('Error searching for listings:', error);
        res.status(500).json({
            success: false,
            message: 'Search results failed',
            error: error.message,
            searchSource: 'error',  // Indicate an error in the search
        });
    }
};
