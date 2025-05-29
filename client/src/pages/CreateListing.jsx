import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { app } from "../firebase.js";

const initialState = {
  imageUrls: [],
  name: "",
  description: "",
  address: "",
  regularPrice: 0,
  discountPrice: 0,
  bathrooms: 1,
  bedrooms: 1,
  furnished: false,
  parking: false,
  type: "rent",
  offer: false,
  userRef: "",
};

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload 6 images per listing!");

      setTimeout(() => {
        setImageUploadError("");
      }, 5000);
    } else {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }

      setUploading(true);

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError("");
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 Mb max per image)!");
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const handleImageRemove = (indexRemove) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, index) => {
        return index !== indexRemove;
      }),
    });
  };

  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length === 0) {
      return setError("You must upload at least one image!");
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      return setError("Discount price must be lower than regular price!");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      setLoading(false);
      setError("");

      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`); 
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
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
            required
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength={62}
            minLength={10}
            required
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex gap-6 flex-wrap">
            <label htmlFor="sell">
              <input
                type="checkbox"
                className="mr-2"
                id="sell"
                checked={formData.type === "sell"}
                onChange={handleChange}
              />
              Sell
            </label>

            <label htmlFor="rent">
              <input
                type="checkbox"
                className="mr-2"
                id="rent"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              Rent
            </label>

            <label htmlFor="parking">
              <input
                type="checkbox"
                className="mr-2"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              Parking spot
            </label>

            <label htmlFor="furnished">
              <input
                type="checkbox"
                className="mr-2"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>

            <label htmlFor="offer">
              <input
                type="checkbox"
                className="mr-2"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
              />
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
                checked={formData.bedrooms}
                onChange={handleChange}
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
                checked={formData.bathrooms}
                onChange={handleChange}
              />
              Baths
            </label>

            <label htmlFor="regularPrice" className="flex gap-2 items-center">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-3"
                id="regularPrice"
                min={50}
                max={100000}
                step={100}
                required
                checked={formData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center gap-2">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </label>

            {formData.offer && (
              <label
                htmlFor="discountPrice"
                className="flex gap-2 items-center"
              >
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg p-3"
                  id="discountPrice"
                  min={50}
                  max={100000}
                  step={10}
                  required
                  checked={formData.discountPrice}
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <p>Discount price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </label>
            )}
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
              className="p-3 border border-gray-300 rounded w-full cursor-pointer hover:bg-gray-200 transition-[0.3s]"
              id="uploadImages"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 
              rounded uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer"
              disabled={uploading || loading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-600 text-sm">{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div key={url} className="flex justify-between items-center">
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="text-red-700 uppercase hover:opacity-85 disabled:opacity-80 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              );
            })}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-800 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
