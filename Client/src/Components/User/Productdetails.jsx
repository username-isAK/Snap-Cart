import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductById } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import Footer from "./Footer";

export default function Productdetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading } = useSelector(
    (state) => state.products
  );

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      const defaultColor = product.availableColors?.[0] || null;
      setSelectedColor(defaultColor);
      setSelectedSize(product.availableSizes?.[0] || null);
      const imgs =
        defaultColor?.images?.length > 0 ? defaultColor.images : product.images;
      setMainImage(imgs?.[0] || null);
    }
  }, [product]);

  if (loading || !product)
    return (
      <div className="text-center mt-5">
        <img src="spinner.gif" alt="Loading..." />
      </div>
    );

  const {
    name,
    description,
    specifications = {},
    availableColors = [],
    availableSizes = [],
    price,
    stock,
  } = product;

  const getImageSrc = (path) => {
    if (!path) return "https://via.placeholder.com/300";
    const normalized = path.replace(/\\/g, "/");
    const relativePath = normalized.startsWith("uploads/")
      ? normalized
      : `uploads/${normalized}`;
    return `http://localhost:5000/${relativePath}`;
  };

  const handleAddToCart = (prod) => {
    if (!prod?._id) {
      console.error("Product ID missing", prod);
      return;
    }

    dispatch(
      addToCart({
        productId: prod._id,
        quantity: 1,
        selectedSize: selectedSize?._id || null,
        selectedColor: selectedColor?.color || null,
      })
    );

    const cartBtn = document.getElementById("goToCartBtn");
    if (cartBtn) {
      cartBtn.style.display = "block";
      setTimeout(() => (cartBtn.style.display = "none"), 3000);
    }
  };

  const handleBuyNow = (prod) => {
    if (!prod?._id) {
      console.error("Product ID missing", prod);
      return;
    }

    dispatch(
      addToCart({
        productId: prod._id,
        quantity: 1,
        selectedSize: selectedSize?._id || null,
        selectedColor: selectedColor?.color || null,
      })
    );

    navigate("/client/checkout");
  };
  
  const formatLabel = (key) =>
    String(key)
      .replace(/_/g, " ")
      .split(/\s+/)
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");

  const specEntries = Object.entries(specifications || {});
  const mainSpecs = specEntries.filter(
    ([key]) => !["details", "other", "misc"].includes(key.toLowerCase())
  );
  const detailsEntries = specEntries.filter(([key]) =>
    ["details", "other", "misc"].includes(key.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container my-5">
        <div className="row g-5">
          <div className="col-md-6 text-center">
            <div
              className="border rounded-4 overflow-hidden mb-3"
              style={{
                width: "90%",
                maxWidth: "500px",
                aspectRatio: "4 / 3",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={getImageSrc(mainImage)}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">
              {selectedColor?.images?.map((img, i) => (
                <div
                  key={`${img}-${i}`}
                  className={`border rounded-3 overflow-hidden ${
                    mainImage === img ? "border-primary border-3" : ""
                  }`}
                  style={{ width: "60px", height: "60px", cursor: "pointer" }}
                  onClick={() => setMainImage(img)}
                >
                  <img
                    src={getImageSrc(img)}
                    alt={`thumb-${i}`}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ))}
            </div>

            <div className="d-flex gap-3 justify-content-center mt-5">
              <button
                onClick={() => handleAddToCart(product)}
                className="btn btn-warning rounded-0 px-3 fw-semibold"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                <i className="bi bi-cart3"></i> Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(product)}
                className="btn btn-success rounded-0 px-3 fw-semibold"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                <i className="bi bi-bag-fill"></i> Buy Now
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold">{name}</h2>
            <p className="text-muted">{description}</p>

            {availableColors.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-semibold">Available Colors:</h6>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {availableColors.map((color, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-3 overflow-hidden ${
                        selectedColor === color ? "border-primary border-3" : ""
                      }`}
                      style={{ width: "50px", height: "50px", cursor: "pointer" }}
                      onClick={() => {
                        setSelectedColor(color);
                        const imgs =
                          color.images?.length > 0
                            ? color.images
                            : product.images;
                        setMainImage(imgs[0]);
                      }}
                    >
                      <img
                        src={getImageSrc(color.images?.[0])}
                        alt={color.colorName || `Color ${idx + 1}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="mb-3">
                <h6>Size:</h6>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size._id}
                      className={`btn btn-outline-secondary ${
                        selectedSize?._id === size._id
                          ? "btn-primary text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h4 className="text-success fw-bold mb-2">
              ₹{selectedSize?.price ?? price}
            </h4>

            <p className="d-flex flex-row">
              <strong>Stock</strong>:{" "}
              {(() => {
                const s =
                  selectedSize?.stock ?? selectedColor?.stock ?? stock ?? 0;
                return s > 0 ? (
                  s
                ) : (
                  <span className="text-danger ms-1 mb-0">Out of stock</span>
                );
              })()}
            </p>

            {selectedColor && (
              <p>
                <strong>Color:</strong> {selectedColor.color}
              </p>
            )}

          {mainSpecs.length > 0 && (
            <div className="mb-3">
              {mainSpecs.map(([key, value]) => {
                if (value === "NA") return null; 

                if (typeof value === "object") {
                  const entries = Object.entries(value).filter(([, sv]) => sv !== "NA");
                  if (entries.length === 0) return null;
                  return (
                    <p key={key} className="mb-1">
                      <strong>{formatLabel(key)}:</strong>{" "}
                      {entries.map(([sk, sv]) => (
                        <span key={sk} className="me-2">
                          {formatLabel(sk)}: {sv}
                        </span>
                      ))}
                    </p>
                  );
                }

                return (
                  <p key={key} className="mb-1">
                    <strong>{formatLabel(key)}:</strong> {value}
                  </p>
                );
              })}
            </div>
          )}

          {detailsEntries.length > 0 && (
            <div className="mt-3">
              <h6 className="fw-bold mb-2">Details:</h6>
              <div className="p-3 border rounded-3 bg-light">
                {detailsEntries.map(([dKey, dVal]) => {
                  if (dVal === "NA") return null; 

                  if (typeof dVal === "object") {
                    const validEntries = Object.entries(dVal).filter(([, sv]) => sv !== "NA");
                    if (validEntries.length === 0) return null;

                    return (
                      <div key={dKey} className="mb-2">
                        {validEntries.map(([sk, sv]) => (
                          <p key={sk} className="mb-1">
                            <strong>{formatLabel(sk)}:</strong> {sv}
                          </p>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <p key={dKey} className="mb-2">
                      <strong>{formatLabel(dKey)}:</strong> {dVal}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
