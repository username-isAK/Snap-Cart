import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress
} from "../../redux/slices/addressSlice";

export default function AddressManager() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.addresses);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
const [editData, setEditData] = useState({});

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    houseno:"",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    tag: "Home",
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleChange = (e) =>
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addAddress(newAddress));
    setNewAddress({
      fullName: "",
      phone: "",
      houseno: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      tag: "Home",
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Manage Addresses</h3>

      <form onSubmit={handleAdd} className="row g-2 mb-4">
        <label className="form-label fw-bold">Add New Address:</label>
        {Object.keys(newAddress).map(
          (key) =>
            key !== "tag" && (
              <div className="col-md-4" key={key}>
                <label className="form-label text-capitalize">{key}</label>
                <input
                  className="form-control"
                  placeholder={key}
                  name={key}
                  value={newAddress[key]}
                  onChange={handleChange}
                  required
                />
              </div>
            )
        )}

        <div className="col-md-4">
          <label className="form-label">Tag</label>
          <select
            className="form-select"
            name="tag"
            value={newAddress.tag}
            onChange={handleChange}
          >
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary mt-2 ms-auto">Add address</button>
        </div>
      </form>

      <div className="list-group">
        {Array.isArray(list) && list.length > 0 ? (
          list.map((addr) => (
            <div
        key={addr._id}
        className={`list-group-item d-flex justify-content-between align-items-center mb-2 
          ${addr.isDefault ? "border-success" : ""}
          ${selectedAddress === addr._id ? "border border-primary bg-primary bg-opacity-10" : ""}
        `}
        style={{ cursor: "pointer" }}
        onClick={() => setSelectedAddress(addr._id)}>
            <div>
              <strong>{addr.fullName}</strong>{" "}
              <span className="badge bg-secondary">{addr.tag}</span>
              <div>
                {addr.street}, {addr.city}, {addr.state} —{" "}
                <small>{addr.phone}</small>
              </div>

              {addr.isDefault && (
                <span className="badge bg-success mt-1">Currently using</span>
              )}
            </div>

            <div className="d-flex">
              {!addr.isDefault && (
                <button
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setDefaultAddress(addr._id));
                  }}
                >
                  Use
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTarget(addr._id);
                  setEditData(addr);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(addr._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
          ))
        ) : (
          <div className="text-muted">No addresses found.</div>
        )}
      </div>

      {deleteTarget && (
        <div className="modal-backdrop fade show"></div>
      )}

      <div
        className={`modal fade ${deleteTarget ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                className="btn-close"
                onClick={() => setDeleteTarget(null)}
              ></button>
            </div>

            <div className="modal-body">
              Are you sure you want to delete this address?
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  dispatch(deleteAddress(deleteTarget));
                  setDeleteTarget(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {editTarget && <div className="modal-backdrop fade show"></div>}

      <div className={`modal fade ${editTarget ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Update Address</h5>
              <button className="btn-close" onClick={() => setEditTarget(null)}></button>
            </div>

            <div className="modal-body">
              {Object.keys(editData).map(
                (key) =>
                  key !== "_id" &&
                  key !== "isDefault" &&
                  key !== "__v" &&
                  key !== "tag" && (
                    <input
                      key={key}
                      name={key}
                      className="form-control mb-2"
                      value={editData[key]}
                      onChange={(e) =>
                        setEditData({ ...editData, [e.target.name]: e.target.value })
                      }
                    />
                  )
              )}

              <select
                className="form-select"
                name="tag"
                value={editData.tag}
                onChange={(e) => setEditData({ ...editData, tag: e.target.value })}
              >
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditTarget(null)}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  dispatch(updateAddress({ id: editTarget, updatedData: editData }));
                  setEditTarget(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
