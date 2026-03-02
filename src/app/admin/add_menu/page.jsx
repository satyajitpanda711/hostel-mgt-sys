'use client';

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Save,
  ArrowLeft,
  Edit,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import Loading from "@/app/components/Loading";
import axios from "axios";

const API = "/api/admin/add_menu";

/* =========================
   Menu Card (Improved UI)
========================= */
const Card = ({ day, breakfast, lunch, snacks, dinner, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        {day}
      </h2>

      <div className="space-y-2 text-sm text-slate-700">
        <p><span className="font-medium text-slate-900">Breakfast:</span> {breakfast}</p>
        <p><span className="font-medium text-slate-900">Lunch:</span> {lunch}</p>
        <p><span className="font-medium text-slate-900">Snacks:</span> {snacks}</p>
        <p><span className="font-medium text-slate-900">Dinner:</span> {dinner}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Edit size={16} />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

/* =========================
   Edit Page (Improved)
========================= */
const FullPageEdit = ({ menuItem, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState(menuItem);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEditedItem({
      ...editedItem,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editedItem.breakfast || !editedItem.lunch || !editedItem.dinner) {
      setError("All required fields must be filled.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `/api/admin/add_menu?day=${editedItem.day}`,
        editedItem
      );

      if (response.data.success) {
        onSave(editedItem);
      } else {
        setError(response.data.message || "Failed to update.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold mb-6">
            Edit Menu – {editedItem.day}
          </h1>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {["breakfast", "lunch", "snacks", "dinner"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={editedItem[field]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Main Page (Improved Layout)
========================= */
const MenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [menu, setMenu] = useState({
    day: "",
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      if (response.data.success) {
        setMenuData(response.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menu.day || !menu.breakfast || !menu.lunch || !menu.dinner) {
      setError("Please fill required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API, menu);
      if (response.data.success) {
        setMenuData([...menuData, menu]);
        setMenu({
          day: "",
          breakfast: "",
          lunch: "",
          snacks: "",
          dinner: "",
        });
      } else {
        setError(response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (editItem) {
    return (
      <FullPageEdit
        menuItem={editItem}
        onSave={(updated) => {
          setMenuData(menuData.map((m) => (m.day === updated.day ? updated : m)));
          setEditItem(null);
        }}
        onCancel={() => setEditItem(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {loading && <Loading />}

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <PlusCircle size={22} />
            Weekly Menu Management
          </h1>
        </div>

        {/* Add Menu Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <select
              name="day"
              value={menu.day}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
            >
              <option value="">Select Day</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>

            {["breakfast", "lunch", "snacks", "dinner"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={menu[field]}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              />
            ))}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-500"
              >
                <Save size={16} />
                Save Menu
              </button>
            </div>
          </form>
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.map((item, index) => (
            <Card
              key={index}
              {...item}
              onEdit={() => setEditItem(item)}
              onDelete={() =>
                setMenuData(menuData.filter((_, i) => i !== index))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;