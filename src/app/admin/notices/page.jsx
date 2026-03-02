'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PlusCircle,
  Edit,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingNotice, setEditingNotice] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     Fetch Notices
  ========================= */
  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/admin/notices');
      if (response.data.success) {
        setNotices(response.data.notices);
      } else {
        toast.error('Failed to fetch notices');
      }
    } catch {
      toast.error('Error fetching notices.');
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  /* =========================
     Post Notice
  ========================= */
  const postNotice = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and Description are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/admin/notices', {
        title,
        description,
      });

      if (res.data.success) {
        toast.success('Notice posted successfully');
        setNotices([res.data.notice, ...notices]);
        setTitle('');
        setDescription('');
      } else {
        toast.error(res.data.message || 'Error posting notice');
      }
    } catch {
      toast.error('Error posting notice.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Delete Notice
  ========================= */
  const deleteNotice = async (id) => {
    try {
      await axios.delete('/api/admin/notices', { data: { id } });
      toast.success('Notice deleted');
      setNotices(notices.filter((n) => n._id !== id));
    } catch {
      toast.error('Error deleting notice.');
    }
  };

  /* =========================
     Edit Notice
  ========================= */
  const editNotice = (notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setDescription(notice.description);
    setShowPopup(true);
  };

  const updateNotice = async () => {
    if (!editingNotice) return;

    if (!title.trim() || !description.trim()) {
      toast.error('Title and Description are required.');
      return;
    }

    try {
      const res = await axios.put('/api/admin/notices', {
        id: editingNotice._id,
        title,
        description,
      });

      if (res.data.success) {
        toast.success('Notice updated');
        setNotices(
          notices.map((n) =>
            n._id === editingNotice._id
              ? { ...n, title, description }
              : n
          )
        );
        setShowPopup(false);
        setEditingNotice(null);
        setTitle('');
        setDescription('');
      } else {
        toast.error(res.data.message || 'Error updating notice');
      }
    } catch {
      toast.error('Error updating notice.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <ToastContainer />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">
          <h1 className="text-2xl font-semibold">
            Notice Board Management
          </h1>
          <p className="text-blue-100 mt-2 text-sm">
            Post and manage hostel announcements
          </p>
        </div>

        {/* Post Notice Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <PlusCircle size={18} />
            Post a Notice
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Notice Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />

            <textarea
              placeholder="Notice Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />

            <button
              onClick={postNotice}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Notice'
              )}
            </button>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Previous Notices
          </h2>

          {notices.length === 0 && (
            <div className="text-slate-500 text-sm">
              No notices posted yet.
            </div>
          )}

          {notices.map((notice) => (
            <div
              key={notice._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {notice.title}
              </h3>

              <p className="text-sm text-slate-600 mt-2">
                {notice.description}
              </p>

              <p className="text-xs text-slate-400 mt-3">
                Posted by: {notice.admin}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => editNotice(notice)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                >
                  <Edit size={14} />
                  Edit
                </button>

                <button
                  onClick={() => deleteNotice(notice._id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Edit Notice
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={updateNotice}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-500"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;