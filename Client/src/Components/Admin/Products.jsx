import { fetchProducts, deleteProduct, updateProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Confirm from "./Confirm";

const Products = () => {
  const { token } = useSelector((state) => state.user);
  const { list: products = [] } = useSelector((state) => state.products);
  const { list: categories = [] } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    specifications: {
      brand: "",
      model: "",
      material: "",
      warranty: "",
      details: [{ key: "", value: "" }],
    },
    availableColors: [],
    availableSizes: [],
    variants: [],
  });

  const refOpen = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (prod) => {
    const detailsArray = prod.specifications?.details
      ? Array.isArray(prod.specifications.details)
        ? prod.specifications.details
        : Object.entries(prod.specifications.details).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }];

    setCurrentProduct(prod);
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price || "",
      stock: prod.stock || "",
      category: prod.category?._id || "",
      images: prod.images || [],
      specifications: {
        ...prod.specifications,
        details: detailsArray,
      },
      availableColors: prod.availableColors || [],
      availableSizes: prod.availableSizes || [],
      variants: prod.variants || [],
    });
    refOpen.current.click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleDetailChange = (idx, field, value) => {
    const updated = [...formData.specifications.details];
    updated[idx][field] = value;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, details: updated },
    }));
  };

  const addDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        details: [...prev.specifications.details, { key: "", value: "" }],
      },
    }));
  };

  const removeDetailRow = (idx) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        details: prev.specifications.details.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleColorChange = (idx, field, value) => {
    const arr = [...formData.availableColors];
    if (field === "color") arr[idx].color = value;
    if (field === "images") arr[idx].images = [...(arr[idx].images || []), ...value];
    setFormData((p) => ({ ...p, availableColors: arr }));
  };

  const addColor = () => setFormData((p) => ({ ...p, availableColors: [...p.availableColors, { color: "", images: [] }] }));
  const removeColor = (idx) => setFormData((p) => ({ ...p, availableColors: p.availableColors.filter((_, i) => i !== idx) }));
  const removeColorImage = (colorIdx, imgIdx) => {
    const arr = [...formData.availableColors];
    arr[colorIdx].images.splice(imgIdx, 1);
    setFormData((p) => ({ ...p, availableColors: arr }));
  };

  const handleSizeChange = (idx, field, value) => {
  const arr = [...formData.availableSizes];
  arr[idx] = { ...arr[idx], [field]: value };
  setFormData((p) => ({ ...p, availableSizes: arr }));
};

  const addSize = () => setFormData((p) => ({ ...p, availableSizes: [...p.availableSizes, ""] }));
  const removeSize = (idx) => setFormData((p) => ({ ...p, availableSizes: p.availableSizes.filter((_, i) => i !== idx) }));

  const handleVariantChange = (idx, field, value) => {
    const arr = [...formData.variants];
    arr[idx][field] = value;
    setFormData((p) => ({ ...p, variants: arr }));
  };
  const addVariant = () => setFormData((p) => ({ ...p, variants: [...p.variants, { color: "", storage: "", price: "", stock: "" }] }));
  const removeVariant = (idx) => setFormData((p) => ({ ...p, variants: p.variants.filter((_, i) => i !== idx) }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((p) => ({ ...p, images: [...p.images, ...files] }));
  };
  const removeImage = (idx) => setFormData((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const handleUpdate = () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);
    fd.append("category", formData.category);

    const detailsObj = (formData.specifications.details || [])
      .filter((d) => d.key && d.value)
      .reduce((acc, d) => {
        acc[d.key] = d.value;
        return acc;
      }, {});

    fd.append(
      "specifications",
      JSON.stringify({ ...formData.specifications, details: detailsObj })
    );
    fd.append("availableColors", JSON.stringify(formData.availableColors));
    fd.append("availableSizes", JSON.stringify(formData.availableSizes));
    fd.append("variants", JSON.stringify(formData.variants));

    const oldImages = formData.images.filter((img) => typeof img === "string");
    fd.append("oldImages", JSON.stringify(oldImages));

    formData.images.forEach((img) => {
      if (img instanceof File) fd.append("images", img);
    });

    dispatch(updateProduct({ id: currentProduct._id, productData: fd, token }));
    refClose.current.click();
  };

  const getImageSrc = (img) => {
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === "string") return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
    return "";
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? prod.category?._id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h4
        className="mt-4 mb-4 rounded-4 p-2"
        style={{ backgroundColor: "rgba(255,255,255,0.7)", display: "inline-block" }}>
        All Products
      </h4>

      <div className="d-flex mb-3 gap-2">
        <i className="bi bi-search py-2"></i>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control rounded-3 shadow-sm"
          style={{ width: "clamp(100px, 20vw, 250px)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}/>
        <i className="bi bi-funnel py-2 ms-2"></i>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-control rounded-3 shadow-sm"
          style={{ width: "clamp(110px, 10vw, 170px)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
          <option value="">All Categories</option>
          {categories
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        {selectedProducts.length > 0 && (
          <button
            className="btn btn-danger ms-2 shadow-sm"
            onClick={() => setShowBulkConfirm(true)}
            style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
            <i className="bi bi-trash me-1"></i> Delete Selected ({selectedProducts.length})
          </button>
        )}
      </div>

      <ul className="list-group">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <div key={prod._id} className="d-flex flex-row mb-2">
              <input
                type="checkbox"
                checked={selectedProducts.includes(prod._id)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedProducts((prev) => [...prev, prod._id]);
                  else setSelectedProducts((prev) => prev.filter((id) => id !== prod._id));
                }}
                className="form-check-input me-2 shadow-sm"/>
              <li
                className="list-group-item d-flex justify-content-between align-items-center fw-bold rounded-3 shadow-sm"
                style={{ backgroundColor: "rgb(255, 251, 249)", width: "95%" }}>
                <div>
                  {prod.name}{" "}
                  <div
                    className={
                      prod.stock < 3
                        ? "fw-normal mt-2 text-danger"
                        : "fw-normal mt-2 text-secondary"
                    }>
                    Currently in stock: {prod.stock}
                  </div>
                </div>
                <div>
                  <button className="btn btn-secondary me-2" onClick={() => handleEdit(prod)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setDeleteId(prod._id);
                      setShowConfirm(true);
                    }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </ul>

      <button
        ref={refOpen}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#updateModal">
        Launch Modal
      </button>

      <div className="modal fade" id="updateModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Product</h5>
              <button ref={refClose} type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {["name", "description", "price", "stock"].map((field) => (
                <div key={field} className="mb-2">
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {field === "description" ? (
                    <textarea
                      className="form-control"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    ></textarea>
                  ) : (
                    <input
                      className="form-control"
                      type={field === "price" || field === "stock" ? "number" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}/>
                  )}
                </div>
              ))}

              <label className="form-label">Category</label>
              <select
                className="form-control mb-3"
                name="category"
                value={formData.category}
                onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <h6>Specifications</h6>
              {["brand", "model", "material", "warranty"].map((f) => (
                <input
                  key={f}
                  className="form-control mb-2"
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  name={f}
                  value={formData.specifications[f] || ""}
                  onChange={handleSpecChange}/>
              ))}

              <h6>Details</h6>
              {formData.specifications.details.map((d, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={d.key}
                    onChange={(e) => handleDetailChange(i, "key", e.target.value)}
                    className="form-control"/>
                  <input
                    type="text"
                    placeholder="Value"
                    value={d.value}
                    onChange={(e) => handleDetailChange(i, "value", e.target.value)}
                    className="form-control"/>
                  <button type="button" className="btn btn-danger" onClick={() => removeDetailRow(i)}>
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mb-3" onClick={addDetailRow}>
                + Add Detail
              </button>

              <h6>Available Colors</h6>
              <div className="mb-3">
                {formData.availableColors.map((cObj, i) => (
                  <div key={i} className="mb-2 border p-2 rounded">
                    <div className="d-flex align-items-center mb-1">
                      <input
                        value={cObj.color}
                        onChange={(e) => handleColorChange(i, "color", e.target.value)}
                        className="form-control me-2"
                        style={{ width: "150px" }}/>
                      <button className="btn btn-sm btn-danger" onClick={() => removeColor(i)}>×</button>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleColorChange(i, "images", Array.from(e.target.files))}
                      className="form-control mb-2"/>

                    <div className="d-flex flex-wrap gap-2">
                      {cObj.images.map((img, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img src={getImageSrc(img)} alt="preview" width={70} height={70} />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            style={{ position: "absolute", top: 0, right: 0, padding: "2px 5px" }}
                            onClick={() => removeColorImage(i, idx)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline-primary btn-sm mb-3" onClick={addColor}>+ Add Color</button>

              <h6>Available Sizes</h6>
              <div className="d-flex flex-wrap mb-3">
                {formData.availableSizes.map((s, i) => (
                  <div key={i} className="me-2 mb-2 d-flex align-items-center">
                    <input
                      value={s.size}
                      placeholder="Size"
                      onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                      className="form-control me-2"
                      style={{ width: "120px" }}/>
                    <input
                      value={s.price}
                      placeholder="Price"
                      onChange={(e) => handleSizeChange(i, "price", e.target.value)}
                      className="form-control me-2"
                      style={{ width: "80px" }}/>
                    <input
                      value={s.stock}
                      placeholder="Stock"
                      onChange={(e) => handleSizeChange(i, "stock", e.target.value)}
                      className="form-control me-2"
                      style={{ width: "80px" }}/>
                    <button className="btn btn-sm btn-danger" onClick={() => removeSize(i)}>×</button>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline-primary btn-sm mb-3" onClick={addSize}>+ Add Size</button>

              <h6>Variants</h6>
              {formData.variants.map((v, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <input
                    placeholder="Color"
                    value={v.color || ""}
                    onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                    className="form-control"/>
                  <input
                    placeholder="Storage"
                    value={v.storage || ""}
                    onChange={(e) => handleVariantChange(i, "storage", e.target.value)}
                    className="form-control"/>
                  <input
                    placeholder="Price"
                    type="number"
                    value={v.price || ""}
                    onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                    className="form-control"/>
                  <input
                    placeholder="Stock"
                    type="number"
                    value={v.stock || ""}
                    onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                    className="form-control"/>
                  <button className="btn btn-sm btn-danger" onClick={() => removeVariant(i)}>×</button>
                </div>
              ))}
              <button className="btn btn-outline-primary btn-sm mb-3" onClick={addVariant}>+ Add Variant</button>

              <h6>Images</h6>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="form-control mb-2"/>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <img
                      src={getImageSrc(img)}
                      alt="preview"
                      width={70}
                      height={70}/>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{ position: "absolute", top: 0, right: 0, padding: "2px 5px" }}
                      onClick={() => removeImage(idx)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-success" onClick={handleUpdate}>
                <i className="bi bi-save2 me-1"></i> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Confirm
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            dispatch(deleteProduct({ id: deleteId, token }));
            setShowConfirm(false);
          }}
          message="Are you sure you want to delete this product?"
        />
      )}

      {showBulkConfirm && (
        <Confirm
          show={showBulkConfirm}
          onClose={() => setShowBulkConfirm(false)}
          onConfirm={() => {
            selectedProducts.forEach((id) => dispatch(deleteProduct({ id, token })));
            setSelectedProducts([]);
            setShowBulkConfirm(false);
          }}
          message={`Are you sure you want to delete ${selectedProducts.length} products?`}
        />
      )}
    </div>
  );
};

export default Products;
