import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

export default function AddProductForm({ token }) {
  const dispatch = useDispatch();
  const { loading: productLoading, error: productError } = useSelector(
    (state) => state.products
  );
  const { list: categories = [], loading: catLoading, error: catError } =
    useSelector((state) => state.categories);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleDetailChange = (idx, field, value) => {
    const details = [...formData.specifications.details];
    details[idx][field] = value;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, details },
    }));
  };

  const addDetailRow = () =>
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        details: [...prev.specifications.details, { key: "", value: "" }],
      },
    }));

  const removeDetailRow = (idx) =>
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        details: prev.specifications.details.filter((_, i) => i !== idx),
      },
    }));

  const handleAddSize = () => {
    if (!sizeRow.size || !sizeRow.price) return;
    setFormData((prev) => ({
      ...prev,
      availableSizes: [...prev.availableSizes, sizeRow],
    }));
    setSizeRow({ size: "", price: "", stock: "" });
  };

  const handleRemoveSize = (idx) => {
    setFormData((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.filter((_, i) => i !== idx),
    }));
  };

  const handleAddColor = () => {
    if (!colorRow.color) return;
    setFormData((prev) => ({
      ...prev,
      availableColors: [...prev.availableColors, colorRow],
    }));
    setColorRow({ color: "", stock: "", images: [] });
  };

  const handleRemoveColor = (idx) => {
    setFormData((prev) => ({
      ...prev,
      availableColors: prev.availableColors.filter((_, i) => i !== idx),
    }));
  };

  const handleAddVariant = () => {
    if (!variant.color || !variant.storage || !variant.price) return;
    setFormData((prev) => ({ ...prev, variants: [...prev.variants, variant] }));
    setVariant({ color: "", storage: "", price: "", stock: "" });
  };

  const handleRemoveVariant = (idx) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    formData.images.forEach((file) => data.append("images", file));

    const detailsObj = (formData.specifications.details || []).reduce((acc, d) => {
      if (d.key && d.value) acc[d.key] = d.value;
      return acc;
    }, {});

    const specsToSend = {
      ...formData.specifications,
      details: detailsObj,
    };
    data.append("specifications", JSON.stringify(specsToSend));

    data.append("availableSizes", JSON.stringify(formData.availableSizes));

    const colorsData = formData.availableColors.map((color, i) => {
      color.images.forEach((img, j) => {
        data.append(`colorImages_${i}_${j}`, img);
      });

      return { color: color.color, stock: color.stock, images: [] };
    });
    data.append("availableColors", JSON.stringify(colorsData));

    data.append("variants", JSON.stringify(formData.variants));

    dispatch(addProduct({ productData: data, token }));

    setFormData({
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
  };


  if (catLoading) return <p className="text-center">Loading categories...</p>;

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h2 className="h5 mb-3">Add Product</h2>

      <input type="text" name="name" placeholder="Product Name" value={formData.name}
        onChange={handleChange} required className="form-control mb-2" />

      <textarea name="description" placeholder="Description" value={formData.description}
        onChange={handleChange} required className="form-control mb-2" />

      <input type="number" name="price" placeholder="Base Price" value={formData.price}
        onChange={handleChange} required min="0" className="form-control mb-2" />

      <select name="category" value={formData.category} onChange={handleChange}
        required className="form-select mb-2">
        <option value="">Select Category</option>
        {categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock}
        onChange={handleChange} min="0" className="form-control mb-3" />

      <h5 className="mb-2">Specifications</h5>
      <input type="text" name="brand" placeholder="Brand" value={formData.specifications.brand}
        onChange={handleSpecChange} className="form-control mb-2" />
      <input type="text" name="model" placeholder="Model" value={formData.specifications.model}
        onChange={handleSpecChange} className="form-control mb-2" />
      <input type="text" name="material" placeholder="Material" value={formData.specifications.material}
        onChange={handleSpecChange} className="form-control mb-2" />
      <input type="text" name="warranty" placeholder="Warranty" value={formData.specifications.warranty}
        onChange={handleSpecChange} className="form-control mb-3" />

      <h6>Details (key → value)</h6>
      {formData.specifications.details.map((d, idx) => (
        <div key={idx} className="d-flex gap-2 mb-2">
          <input type="text" placeholder="Key" value={d.key}
            onChange={(e) => handleDetailChange(idx, "key", e.target.value)}
            className="form-control" />
          <input type="text" placeholder="Value" value={d.value}
            onChange={(e) => handleDetailChange(idx, "value", e.target.value)}
            className="form-control" />
          <button type="button" className="btn btn-danger" onClick={() => removeDetailRow(idx)}>×</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary mb-3" onClick={addDetailRow}>+ Add Detail</button>

      <h5>Available Sizes</h5>
      <div className="d-flex gap-2 mb-2">
        <input type="text" placeholder="Size" value={sizeRow.size}
          onChange={(e) => setSizeRow({ ...sizeRow, size: e.target.value })} className="form-control" />
        <input type="number" placeholder="Price" value={sizeRow.price}
          onChange={(e) => setSizeRow({ ...sizeRow, price: e.target.value })} className="form-control" />
        <input type="number" placeholder="Stock" value={sizeRow.stock}
          onChange={(e) => setSizeRow({ ...sizeRow, stock: e.target.value })} className="form-control" />
        <button type="button" onClick={handleAddSize} className="btn btn-success">+</button>
      </div>
      <ul className="list-group mb-3">
        {formData.availableSizes.map((s, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            {s.size} - ₹{s.price} ({s.stock || 0} in stock)
            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveSize(i)}>×</button>
          </li>
        ))}
      </ul>

      <h5>Available Colors</h5>
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Color"
          value={colorRow.color}
          onChange={(e) => setColorRow({ ...colorRow, color: e.target.value })}
          className="form-control"/>
        <input
          type="number"
          placeholder="Stock"
          value={colorRow.stock}
          onChange={(e) => setColorRow({ ...colorRow, stock: e.target.value })}
          className="form-control"/>
        <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) =>
          setColorRow((prev) => ({
            ...prev,
            images: [...prev.images, ...Array.from(e.target.files)],
          }))
        }
        className="form-control"/>
        <button type="button" onClick={handleAddColor} className="btn btn-success">+</button>
      </div>

      {colorRow.images.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {colorRow.images.map((file, idx) => (
            <div key={idx} style={{ position: "relative", display: "inline-block" }}>
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
              <button
                type="button"
                className="btn btn-sm btn-danger"
                style={{ position: "absolute", top: 0, right: 0, padding: "2px 5px" }}
                onClick={() =>
                  setColorRow((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== idx),
                  }))
                }>
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <ul className="list-group mb-3">
        {formData.availableColors.map((c, i) => (
          <li key={i} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {c.color} ({c.stock || 0} in stock) - {c.images.length} image(s)
                <div className="d-flex gap-1 mt-1 flex-wrap">
                  {c.images.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="color preview"
                      width={40}
                      height={40}
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleRemoveColor(i)}>
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h5>Variants</h5>
      <div className="d-flex gap-2 mb-2">
        <input type="text" placeholder="Color" value={variant.color}
          onChange={(e) => setVariant({ ...variant, color: e.target.value })} className="form-control" />
        <input type="text" placeholder="Storage" value={variant.storage}
          onChange={(e) => setVariant({ ...variant, storage: e.target.value })} className="form-control" />
        <input type="number" placeholder="Price" value={variant.price}
          onChange={(e) => setVariant({ ...variant, price: e.target.value })} className="form-control" />
        <input type="number" placeholder="Stock" value={variant.stock}
          onChange={(e) => setVariant({ ...variant, stock: e.target.value })} className="form-control" />
        <button type="button" onClick={handleAddVariant} className="btn btn-success">+</button>
      </div>
      {formData.variants.length > 0 && (
        <ul className="list-group mb-3">
          {formData.variants.map((v, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              {v.color} - {v.storage} - ₹{v.price} ({v.stock || 0} in stock)
              <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveVariant(i)}>×</button>
            </li>
          ))}
        </ul>
      )}

      <input type="file" name="images" multiple accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
        }} className="form-control mb-2" />
      <div className="d-flex flex-wrap gap-2 mb-3">
        {formData.images.map((file, idx) => (
          <div key={idx} style={{ position: "relative", display: "inline-block" }}>
            <img src={URL.createObjectURL(file)} alt="preview" width={70} height={70} />
            <button type="button" className="btn btn-sm btn-danger"
              style={{ position: "absolute", top: 0, right: 0, padding: "2px 5px" }}
              onClick={() => setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}>×</button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={productLoading} className="btn btn-primary w-100 rounded-4">
        {productLoading ? "Adding..." : "Add Product"}
      </button>
      {productError && <p className="text-danger mt-2">{productError}</p>}
      {catError && <p className="text-danger mt-2">{catError}</p>}
    </form>
  );
}
