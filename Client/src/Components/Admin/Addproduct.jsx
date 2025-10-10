import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

export default function AddProductForm({ token }) {
  const dispatch = useDispatch();
  const { loading: productLoading, error: productError } = useSelector((s) => s.products);
  const { list: categories = [], loading: catLoading, error: catError } = useSelector((s) => s.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    images: [],
    specifications: {
      brand: "",
      model: "",
      material: "",
      warranty: "",
      details: [{ key: "", value: "" }],
    },
    availableSizes: [],
    availableColors: [],
    variants: [],
  });

  const [sizeRow, setSizeRow] = useState({ size: "", price: "", stock: "" });
  const [colorRow, setColorRow] = useState({ color: "", stock: "", images: [] });
  const [variant, setVariant] = useState({ color: "", storage: "", price: "", stock: "" });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, specifications: { ...p.specifications, [name]: value } }));
  };

  const handleDetailChange = (i, field, value) => {
    const details = [...formData.specifications.details];
    details[i][field] = value;
    setFormData((p) => ({ ...p, specifications: { ...p.specifications, details } }));
  };

  const addDetailRow = () => {
    setFormData((p) => ({
      ...p,
      specifications: { ...p.specifications, details: [...p.specifications.details, { key: "", value: "" }] },
    }));
  };

  const removeDetailRow = (i) => {
    setFormData((p) => ({
      ...p,
      specifications: { ...p.specifications, details: p.specifications.details.filter((_, idx) => idx !== i) },
    }));
  };

  const handleAddSize = () => {
    if (!sizeRow.size || !sizeRow.price) return;
    setFormData((p) => ({ ...p, availableSizes: [...p.availableSizes, sizeRow] }));
    setSizeRow({ size: "", price: "", stock: "" });
  };

  const handleRemoveSize = (i) =>
    setFormData((p) => ({ ...p, availableSizes: p.availableSizes.filter((_, idx) => idx !== i) }));

  const handleAddColor = () => {
    if (!colorRow.color) return;
    setFormData((p) => ({
      ...p,
      availableColors: [...p.availableColors, colorRow],
    }));
    setColorRow({ color: "", stock: "", images: [] });
  };

  const handleRemoveColor = (i) =>
    setFormData((p) => ({ ...p, availableColors: p.availableColors.filter((_, idx) => idx !== i) }));

  const handleAddVariant = () => {
    if (!variant.color || !variant.storage || !variant.price) return;
    setFormData((p) => ({ ...p, variants: [...p.variants, variant] }));
    setVariant({ color: "", storage: "", price: "", stock: "" });
  };

  const handleRemoveVariant = (i) =>
    setFormData((p) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();

    ["name", "description", "price", "category", "stock"].forEach((key) => fd.append(key, formData[key]));

    formData.images.forEach((file) => fd.append("images", file));

    const detailsObj = formData.specifications.details.reduce((acc, d) => {
      if (d.key && d.value) acc[d.key] = d.value;
      return acc;
    }, {});
    const specs = { ...formData.specifications, details: detailsObj };
    fd.append("specifications", JSON.stringify(specs));

    fd.append("availableSizes", JSON.stringify(formData.availableSizes));

    const colorsData = formData.availableColors.map((c) => ({
      color: c.color,
      stock: c.stock,
    }));
    fd.append("availableColors", JSON.stringify(colorsData));

    formData.availableColors.forEach((c, i) => {
      (c.images || []).forEach((file, j) => fd.append(`colorImages_${i}_${j}`, file));
    });

    fd.append("variants", JSON.stringify(formData.variants));

    dispatch(addProduct({ productData: fd, token }));

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: 0,
      images: [],
      specifications: { brand: "", model: "", material: "", warranty: "", details: [{ key: "", value: "" }] },
      availableSizes: [],
      availableColors: [],
      variants: [],
    });
  };

  if (catLoading) return <p className="text-center">Loading categories...</p>;

  return (
    <div>
      <h3 className="mb-0 p-2 rounded-2 shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.7)", display: "inline-block" }}>
        Add Product
      </h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm" style={{backgroundColor:"rgba(255,255,255,0.5)"}}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="form-control mb-2" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="form-control mb-2" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Base Price" required min="0" className="form-control mb-2" />

        <select name="category" value={formData.category} onChange={handleChange} required className="form-select mb-2">
          <option value="">Select Category</option>
          {categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock Quantity" min="0" className="form-control mb-3" />

        <h5>Specifications</h5>
        {["brand", "model", "material", "warranty"].map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key[0].toUpperCase() + key.slice(1)}
            value={formData.specifications[key]}
            onChange={handleSpecChange}
            className="form-control mb-2"
          />
        ))}

        <h6>Details (key → value)</h6>
        {formData.specifications.details.map((d, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <input className="form-control" placeholder="Key" value={d.key} onChange={(e) => handleDetailChange(i, "key", e.target.value)} />
            <input className="form-control" placeholder="Value" value={d.value} onChange={(e) => handleDetailChange(i, "value", e.target.value)} />
            <button type="button" className="btn btn-danger" onClick={() => removeDetailRow(i)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3 w-50 d-block mx-auto" onClick={addDetailRow}>
          + Add Detail
        </button>

        <h5>Available Sizes</h5>
        <div className="d-flex gap-2 mb-2">
          {["size", "price", "stock"].map((f) => (
            <input key={f} type={f === "size" ? "text" : "number"} placeholder={f} value={sizeRow[f]} onChange={(e) => setSizeRow({ ...sizeRow, [f]: e.target.value })} className="form-control" />
          ))}
          <button type="button" onClick={handleAddSize} className="btn btn-success">
            +
          </button>
        </div>
        {formData.availableSizes.length > 0 && (
          <ul className="list-group mb-3">
            {formData.availableSizes.map((s, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                {s.size} - ₹{s.price} ({s.stock || 0} in stock)
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveSize(i)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <h5>Available Colors</h5>
        <div className="d-flex gap-2 mb-2">
          <input type="text" placeholder="Color" value={colorRow.color} onChange={(e) => setColorRow({ ...colorRow, color: e.target.value })} className="form-control" />
          <input type="number" placeholder="Stock" value={colorRow.stock} onChange={(e) => setColorRow({ ...colorRow, stock: e.target.value })} className="form-control" />
          <input type="file" multiple accept="image/*" onChange={(e) => setColorRow((p) => ({ ...p, images: [...p.images, ...Array.from(e.target.files)] }))} className="form-control" />
          <button type="button" onClick={handleAddColor} className="btn btn-success">
            +
          </button>
        </div>

        {colorRow.images.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-2">
            {colorRow.images.map((file, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={URL.createObjectURL(file)} alt="preview" width={50} height={50} style={{ objectFit: "cover", borderRadius: 4 }} />
                <button type="button" className="btn btn-sm btn-danger" style={{ position: "absolute", top: 0, right: 0 }} onClick={() => setColorRow((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.availableColors.length > 0 && (
          <ul className="list-group mb-3">
            {formData.availableColors.map((c, i) => (
              <li key={i} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {c.color} ({c.stock || 0} in stock) - {c.images.length} image(s)
                    <div className="d-flex gap-1 mt-1 flex-wrap">
                      {c.images.map((file, idx) => (
                        <img key={idx} src={URL.createObjectURL(file)} alt="color preview" width={40} height={40} style={{ objectFit: "cover", borderRadius: 4 }} />
                      ))}
                    </div>
                  </div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveColor(i)}>
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h5>Variants</h5>
        <div className="d-flex gap-2 mb-2">
          {["color", "storage", "price", "stock"].map((f) => (
            <input key={f} type={f === "storage" || f === "color" ? "text" : "number"} placeholder={f} value={variant[f]} onChange={(e) => setVariant({ ...variant, [f]: e.target.value })} className="form-control" />
          ))}
          <button type="button" onClick={handleAddVariant} className="btn btn-success">
            +
          </button>
        </div>
        {formData.variants.length > 0 && (
          <ul className="list-group mb-3">
            {formData.variants.map((v, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                {v.color} - {v.storage} - ₹{v.price} ({v.stock || 0} in stock)
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveVariant(i)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <h5>Images</h5>
        <input type="file" multiple accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, images: [...p.images, ...Array.from(e.target.files)] }))} className="form-control mb-2" />
        {formData.images.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {formData.images.map((file, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={URL.createObjectURL(file)} alt="preview" width={70} height={70} style={{ objectFit: "cover" }} />
                <button type="button" className="btn btn-sm btn-danger" style={{ position: "absolute", top: 0, right: 0 }} onClick={() => setFormData((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={productLoading} className="btn btn-primary w-50 rounded-4 d-block mx-auto">
          {productLoading ? "Adding..." : "Add Product"}
        </button>

        {productError && <p className="text-danger mt-2">{productError}</p>}
        {catError && <p className="text-danger mt-2">{catError}</p>}
      </form>
    </div>
  );
}
