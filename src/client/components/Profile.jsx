import React, { useEffect, useState } from 'react';
import { profileAPI } from '../services/api.js';

export default function Profile({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    bakeryName: '',
    bakeryAddress: '',
    bakeryPhone: '',
    bakeryEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    profileAPI.getProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || '',
          bakeryName: data.bakeryName || '',
          bakeryAddress: data.bakeryAddress || '',
          bakeryPhone: data.bakeryPhone || '',
          bakeryEmail: data.bakeryEmail || '',
        });
      })
      .catch((err) => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await profileAPI.updateProfile(form);
      setProfile(updated);
      setEdit(false);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Profile</h2>
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-800">{profile.name}</div>
          <div className="text-gray-500">{profile.email}</div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bakery Name</label>
            <input
              type="text"
              name="bakeryName"
              value={form.bakeryName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={!edit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bakery Address</label>
            <input
              type="text"
              name="bakeryAddress"
              value={form.bakeryAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={!edit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bakery Phone</label>
            <input
              type="text"
              name="bakeryPhone"
              value={form.bakeryPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={!edit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bakery Email</label>
            <input
              type="email"
              name="bakeryEmail"
              value={form.bakeryEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={!edit}
            />
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => setEdit((e) => !e)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              disabled={edit}
            >
              Edit
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
              disabled={!edit || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
          {success && <div className="text-green-600 text-center mt-2">Profile updated!</div>}
        </form>
      </div>
    </div>
  );
} 