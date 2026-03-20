import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function SavedPlacesPage({ theme, toggleTheme }) {
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [uploadingId, setUploadingId] = useState(null);
  const [savingCommentId, setSavingCommentId] = useState(null);
  const [savingDateId, setSavingDateId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [dateDrafts, setDateDrafts] = useState({});

  const fetchPlaces = async () => {
    try {
      const response = await api.get("/places");
      setPlaces(response.data);

      const nextCommentDrafts = {};
      const nextDateDrafts = {};

      response.data.forEach((place) => {
        nextCommentDrafts[place.id] = "";
        nextDateDrafts[place.id] = place.visit_date || "";
      });

      setCommentDrafts(nextCommentDrafts);
      setDateDrafts(nextDateDrafts);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/places/${id}`);
      setMessage(`Deleted ${name}`);
      fetchPlaces();
    } catch (error) {
      console.error("Failed to delete place:", error);
      setMessage("Failed to delete place.");
    }
  };

  const handleAttachmentUpload = async (placeId, file) => {
    if (!file) return;

    try {
      setUploadingId(placeId);

      const formData = new FormData();
      formData.append("attachment", file);

      await api.patch(`/places/${placeId}/attachment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(`Uploaded ${file.name}`);
      fetchPlaces();
    } catch (error) {
      console.error("Failed to upload attachment:", error);
      setMessage("Failed to upload attachment.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemoveAttachment = async (placeId) => {
    try {
      await api.patch(`/places/${placeId}/remove-attachment`);
      setMessage("Attachment removed.");
      fetchPlaces();
    } catch (error) {
      console.error("Failed to remove attachment:", error);
      setMessage("Failed to remove attachment.");
    }
  };

  const handleSaveComment = async (placeId) => {
    const text = commentDrafts[placeId] || "";

    if (!text.trim()) return;

    try {
      setSavingCommentId(placeId);

      await api.patch(`/places/${placeId}/comment-log`, {
        text,
      });

      setMessage("Comment saved.");
      await fetchPlaces();
    } catch (error) {
      console.error("Failed to save comment:", error);
      setMessage("Failed to save comment.");
    } finally {
      setSavingCommentId(null);
    }
  };

  const handleSaveVisitDate = async (placeId) => {
    try {
      setSavingDateId(placeId);

      await api.patch(`/places/${placeId}/visit-date`, {
        visitDate: dateDrafts[placeId] || null,
      });

      setMessage("Visit date saved.");
      await fetchPlaces();
    } catch (error) {
      console.error("Failed to save visit date:", error);
      setMessage("Failed to save visit date.");
    } finally {
      setSavingDateId(null);
    }
  };

  const isImageAttachment = (url = "", name = "") => {
    const value = `${url} ${name}`.toLowerCase();
    return (
      value.includes(".png") ||
      value.includes(".jpg") ||
      value.includes(".jpeg") ||
      value.includes(".gif") ||
      value.includes(".webp")
    );
  };

  const formatLogDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPlaces =
    filter === "all" ? places : places.filter((place) => place.type === filter);

  return (
    <div className="page-shell">
      <div className="page-container">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <div className="saved-header-row">
          <div>
            <div className="saved-kicker">Travel Archive</div>
            <h1 className="saved-title">SavedPlaces</h1>
          </div>

          <div className="saved-filter-pills">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "country" ? "active" : ""}`}
              onClick={() => setFilter("country")}
            >
              Countries
            </button>
            <button
              className={`filter-btn ${filter === "city" ? "active" : ""}`}
              onClick={() => setFilter("city")}
            >
              Cities
            </button>
          </div>
        </div>

        {message && <div className="info-pill" style={{ marginBottom: 18 }}>{message}</div>}

        <div className="saved-gallery-grid">
          {filteredPlaces.map((place) => (
            <div key={place.id} className="editorial-card photo-card-real">
              <div className="editorial-top">
                <div className="editorial-tag">{place.type}</div>
                <div className="editorial-dot">•</div>
              </div>

              <div className="editorial-image real-saved-image-wrap">
                {place.image_url ? (
                  <img
                    src={place.image_url}
                    alt={place.image_alt || place.name}
                    className="real-saved-image"
                  />
                ) : (
                  <div className="fallback-image">No image</div>
                )}
              </div>

              <div className="editorial-body">
                <div className="editorial-name">{place.name}</div>
                <div className="editorial-meta">
                  {place.country_name || "Unknown region"}
                </div>

                <div className="visit-date-wrap">
                  <label className="visit-date-label">Visited on</label>
                  <div className="visit-date-row">
                    <input
                      type="date"
                      className="visit-date-input"
                      value={dateDrafts[place.id] || ""}
                      onChange={(e) =>
                        setDateDrafts((prev) => ({
                          ...prev,
                          [place.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="save-date-btn"
                      onClick={() => handleSaveVisitDate(place.id)}
                    >
                      {savingDateId === place.id ? "Saving..." : "Save Date"}
                    </button>
                  </div>
                </div>

                {place.comment_log?.length > 0 && (
                  <div className="comment-log-wrap">
                    <div className="comment-log-title">Travel log</div>

                    {place.comment_log.map((entry, index) => (
                      <div key={`${place.id}-${index}`} className="comment-log-entry">
                        <div className="comment-log-date">
                          {formatLogDate(entry.created_at)}
                        </div>
                        <div className="comment-log-text">{entry.text}</div>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  className="comment-box"
                  placeholder="Add another memory about this place..."
                  value={commentDrafts[place.id] || ""}
                  onChange={(e) =>
                    setCommentDrafts((prev) => ({
                      ...prev,
                      [place.id]: e.target.value,
                    }))
                  }
                />

                <button
                  className="save-comment-btn"
                  onClick={() => handleSaveComment(place.id)}
                >
                  {savingCommentId === place.id ? "Posting..." : "Post Comment"}
                </button>

                {place.attachment_url ? (
                  <div className="attachment-preview-wrap">
                    <div className="attachment-title">Attachment</div>

                    {isImageAttachment(place.attachment_url, place.attachment_name) ? (
                      <a
                        href={place.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="attachment-image-link"
                      >
                        <img
                          src={place.attachment_url}
                          alt={place.attachment_name || "attachment"}
                          className="attachment-preview-image"
                        />
                      </a>
                    ) : (
                      <a
                        href={place.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="attachment-file-card"
                      >
                        <div className="attachment-file-icon">📎</div>
                        <div className="attachment-file-name">
                          {place.attachment_name || "Open attachment"}
                        </div>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="no-attachment-text">No attachment yet</div>
                )}
              </div>

              <div className="attachment-actions">
                <label className="upload-btn">
                  {uploadingId === place.id ? "Uploading..." : "Add Attachment"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleAttachmentUpload(place.id, e.target.files?.[0])
                    }
                  />
                </label>

                {place.attachment_url && (
                  <button
                    className="remove-attachment-btn"
                    onClick={() => handleRemoveAttachment(place.id)}
                  >
                    Remove Attachment
                  </button>
                )}

                <button
                  className="delete-btn editorial-delete"
                  onClick={() => handleDelete(place.id, place.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="editorial-card discovery-card">
            <div className="discovery-icon">＋</div>
            <div className="discovery-title">Save a new discovery</div>
            <div className="discovery-text">
              Pick your next city or country from the map page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedPlacesPage;