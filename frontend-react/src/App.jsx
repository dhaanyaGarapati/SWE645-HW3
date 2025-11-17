// Team Members:
// Lasya Reddy Mekala (G01473683)
// Supraja Naraharisetty(G01507868)
// Trinaya Kodavati (G01506073)
// Dhaanya S Garapati (G01512900)

import { useEffect, useRef, useState } from "react";
import { SurveyAPI } from "./api";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

const empty = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  telephone: "",
  email: "",
  dateOfSurvey: "",
  likes: [],
  interest: "",
  recommend: "",
  raffleNumbers: "",
  comments: "",
};

export default function App() {
  const [surveys, setSurveys] = useState([]);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // <-- track if editing
  const dateRef = useRef(null);

  const load = async () => {
    const data = await SurveyAPI.list();
    setSurveys(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  // init calendar once
  useEffect(() => {
    if (!dateRef.current) return;
    const fp = flatpickr(dateRef.current, {
      dateFormat: "Y-m-d",
      allowInput: true,
      onChange: (sel) => {
        const v = sel?.[0] ? sel[0].toISOString().slice(0, 10) : "";
        setForm((f) => ({ ...f, dateOfSurvey: v }));
      },
    });
    return () => fp.destroy();
  }, []);

  const toggleLike = (v) =>
    setForm((f) => ({
      ...f,
      likes: f.likes.includes(v)
        ? f.likes.filter((x) => x !== v)
        : [...f.likes, v],
    }));

  // start editing an existing survey
  const startEdit = (s) => {
    setError("");
    setEditingId(s.id);

    setForm({
      firstName: s.firstName || "",
      lastName: s.lastName || "",
      street: s.street || "",
      city: s.city || "",
      state: s.state || "",
      zip: s.zip || "",
      telephone: s.telephone || "",
      email: s.email || "",
      dateOfSurvey: s.dateOfSurvey || "",
      likes: s.likes || [],
      interest: s.interest || "",
      recommend: s.recommend || "",
      raffleNumbers: Array.isArray(s.raffleNumbers)
        ? s.raffleNumbers.join(",")
        : s.raffleNumbers || "",
      comments: s.comments || "",
    });

    if (dateRef.current?._flatpickr && s.dateOfSurvey) {
      dateRef.current._flatpickr.setDate(s.dateOfSurvey, true, "Y-m-d");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const nums = String(form.raffleNumbers || "")
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));

    if (nums.length < 10 || !nums.every((n) => n >= 1 && n <= 100)) {
      setBusy(false);
      setError("Raffle must include ≥10 numbers between 1–100.");
      return;
    }

    const payload = { ...form, raffleNumbers: nums };

    try {
      if (editingId != null) {
        await SurveyAPI.update(editingId, payload);
        alert(" Survey updated successfully!");
      } else {
        await SurveyAPI.create(payload);
        alert(" Survey submitted successfully!");
      }

      setForm(empty);
      setEditingId(null);
      dateRef.current?._flatpickr?.clear();
      await load();
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this survey?")) return;
    await SurveyAPI.remove(id);
    if (editingId === id) {
      setEditingId(null);
      setForm(empty);
      dateRef.current?._flatpickr?.clear();
    }
    await load();
  };

  const cancelForm = () => {
    setForm(empty);
    setEditingId(null);
    dateRef.current?._flatpickr?.clear();
  };

  return (
    <div className="gmu-bg" style={{ minHeight: "100vh" }}>
      <div className="w3-content w3-margin-top" style={{ maxWidth: 980 }}>
        <div className="w3-card gmu-card">
          <div className="gmu-card-header">
            <h2>Student Survey Form</h2>
            {editingId != null && (
              <p style={{ marginTop: 4, fontSize: 13 }}>
                Editing survey ID <strong>{editingId}</strong>
              </p>
            )}
          </div>

          <form className="w3-container gmu-form" onSubmit={submit}>
            <div className="gmu-grid">
              <div>
                <label className="required">First Name</label>
                <input
                  className="gmu-input"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="required">Last Name</label>
                <input
                  className="gmu-input"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="span-2">
                <label className="required">Street Address</label>
                <input
                  className="gmu-input"
                  value={form.street}
                  onChange={(e) =>
                    setForm({ ...form, street: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="required">City</label>
                <input
                  className="gmu-input"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="required">State</label>
                <input
                  className="gmu-input"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="required">Zip</label>
                <input
                  className="gmu-input"
                  value={form.zip}
                  onChange={(e) =>
                    setForm({ ...form, zip: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="required">Telephone Number</label>
                <input
                  className="gmu-input"
                  type="tel"
                  value={form.telephone}
                  onChange={(e) =>
                    setForm({ ...form, telephone: e.target.value })
                  }
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  title="Please enter a 10-digit phone number (numbers only)."
                />
              </div>
              <div>
                <label className="required">E-mail</label>
                <input
                  className="gmu-input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="required">Date of Survey</label>
                <input
                  ref={dateRef}
                  className="gmu-input"
                  placeholder="YYYY-MM-DD"
                  value={form.dateOfSurvey}
                  onChange={(e) =>
                    setForm({ ...form, dateOfSurvey: e.target.value })
                  }
                  readOnly
                />
              </div>
            </div>

            <hr className="gmu-hr" />

            <p className="gmu-section-title">
              What did you like most about the campus?
            </p>
            <div className="gmu-chips">
              {["students", "location", "campus", "atmosphere", "dorms", "sports"].map(
                (v) => (
                  <label
                    key={v}
                    className={`gmu-chip ${
                      form.likes.includes(v) ? "on" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.likes.includes(v)}
                      onChange={() => toggleLike(v)}
                    />
                    <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                  </label>
                )
              )}
            </div>

            <hr className="gmu-hr" />

            <p className="gmu-section-title">
              How did you become interested in the university?
            </p>
            <div className="gmu-radios">
              {["friends", "television", "internet", "other"].map((v) => (
                <label key={v} className="gmu-radio">
                  <input
                    type="radio"
                    name="interest"
                    checked={form.interest === v}
                    onChange={() => setForm({ ...form, interest: v })}
                  />
                  <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </label>
              ))}
            </div>

            <hr className="gmu-hr" />

            <label className="gmu-section-title">
              Likelihood of recommending this school
            </label>
            <select
              className="gmu-input"
              value={form.recommend}
              onChange={(e) =>
                setForm({ ...form, recommend: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="verylikely">Very Likely</option>
              <option value="likely">Likely</option>
              <option value="unlikely">Unlikely</option>
            </select>

            <hr className="gmu-hr" />

            <label className="required">
              Raffle (enter 10+ numbers, comma separated, 1–100)
            </label>
            <input
              className="gmu-input"
              placeholder="e.g., 5,12,33,47,58,66,72,81,95,100"
              value={form.raffleNumbers}
              onChange={(e) =>
                setForm({ ...form, raffleNumbers: e.target.value })
              }
              required
            />

            <label>Additional Comments</label>
            <textarea
              className="gmu-input"
              rows={4}
              value={form.comments}
              onChange={(e) =>
                setForm({ ...form, comments: e.target.value })
              }
            />

            {error && (
              <p className="w3-text-red" style={{ marginTop: 8 }}>
                {error}
              </p>
            )}

            <div className="gmu-actions">
              <button className="gmu-btn" disabled={busy}>
                {busy
                  ? editingId != null
                    ? "Updating..."
                    : "Submitting..."
                  : editingId != null
                  ? "Update Survey"
                  : "Submit"}
              </button>
              <button
                type="reset"
                className="gmu-btn-outline"
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="w3-card gmu-card w3-margin-top">
          <div className="gmu-card-header">
            <h3>All Surveys</h3>
          </div>
          <div className="w3-responsive">
            <table className="w3-table-all w3-small">
              <thead>
                <tr className="gmu-table-head">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Recommend</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      {s.firstName} {s.lastName}
                    </td>
                    <td>{s.dateOfSurvey}</td>
                    <td>{s.recommend}</td>
                    <td>
                      <button
                        className="gmu-btn-small"
                        style={{ marginRight: 4 }}
                        onClick={() => startEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="gmu-btn-small"
                        onClick={() => del(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {surveys.length === 0 && (
                  <tr>
                    <td colSpan="5" className="w3-center">
                      No surveys yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="gmu-footer">
          <p>
            Back to{" "}
            <a href="/" className="gmu-footer-link">
              Homepage
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
