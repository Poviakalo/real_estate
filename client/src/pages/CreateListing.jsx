import React from "react";

const CreateListing = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row px-3 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <label htmlFor="sell">
              <input type="checkbox" className="mr-2" id="sell" />
              Sell
            </label>

            <label htmlFor="rent">
              <input type="checkbox" className="mr-2" id="rent" />
              Rent
            </label>

            <label htmlFor="parking">
              <input type="checkbox" className="mr-2" id="parking" />
              Parking spot
            </label>

            <label htmlFor="furnished">
              <input type="checkbox" className="mr-2" id="furnished" />
              Furnished
            </label>

            <label htmlFor="offer">
              <input type="checkbox" className="mr-2" id="offer" />
              Offer
            </label>
          </div>

          <div className="flex flex-wrap gap-6">
            <label htmlFor="bedrooms" className="flex gap-2 items-center">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-3"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              Beds
            </label>

            <label htmlFor="bathrooms" className="flex gap-2 items-center">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-3"
                id="bathrooms"
                min={1}
                max={10}
                required
              />
              Baths
            </label>

            <label htmlFor="regularPrice" className="flex gap-2 items-center">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-3"
                id="regularPrice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center gap-2">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </label>

            <label htmlFor="discountPrice" className="flex gap-2 items-center">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-3"
                id="discountPrice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center gap-2">
                <p>Discount price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              type="file"
              className="p-3 border border-gray-300 rounded w-full"
              id="uploadImages"
              accept="image/*"
              multiple
            />

            <button
              className="p-3 text-green-700 border border-green-700 
              rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
