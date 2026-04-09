import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function SavedPlacesPage({ theme, toggleTheme }) {
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState("");
  const [savingCommentId, setSavingCommentId] = useState(null);
  const [savingDateId, setSavingDateId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [dateDrafts, setDateDrafts] = useState({});

  const fetchPlaces = async () => {
    try {
      const res = await api.get("/places");
      setPlaces(res.data);

      const comments = {};
      const dates = {};

      res.data.forEach((p) => {
        comments[p.id] = "";
        dates[p.id] = p.visit_date || "";
      });

      setCommentDrafts(comments);
      setDateDrafts(dates);
    } catch (err) {
      console.error(err);
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
    } catch {
      setMessage("Failed to delete place.");
    }
  };

  const handleSaveComment = async (id) => {
    const text = commentDrafts[id];
    if (!text.trim()) return;

    try {
      setSavingCommentId(id);

      await api.patch(`/places/${id}/comment-log`, { text });

      setMessage("Comment saved.");
      fetchPlaces();
    } finally {
      setSavingCommentId(null);
    }
  };

  const handleSaveDate = async (id) => {
    try {
      setSavingDateId(id);

      await api.patch(`/places/${id}/visit-date`, {
        visitDate: dateDrafts[id] || null,
      });

      setMessage("Visit date saved.");
      fetchPlaces();
    } finally {
      setSavingDateId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="min-h-screen px-6 py-6 pb-10">
      <div className="max-w-[1320px] mx-auto">

        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* HEADER */}
        <div className="flex justify-between items-center mt-4 mb-6">
          <div>
            <p className="text-sm text-slate-500">Travel Archive</p>
            <h1 className="text-3xl font-bold">Saved Places</h1>
          </div>
        </div>

        {message && (
          <Badge className="mb-4">{message}</Badge>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {places.map((place) => (
            <Card key={place.id} className="p-4 space-y-4">

              <CardContent className="p-0 space-y-4">

                {/* IMAGE */}
                <div className="h-[180px] rounded-xl overflow-hidden bg-slate-100">
                  {place.image_url ? (
                    <img
                      src={place.image_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-slate-500">
                      No image
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{place.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    {place.country_name || "Unknown"}
                  </p>
                </div>

                {/* DATE */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">Visited on</p>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateDrafts[place.id] || ""}
                      onChange={(e) =>
                        setDateDrafts((p) => ({
                          ...p,
                          [place.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveDate(place.id)}
                    >
                      {savingDateId === place.id ? "..." : "Save"}
                    </Button>
                  </div>
                </div>

                {/* COMMENTS */}
                {place.comment_log?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Travel log</p>
                    {place.comment_log.map((c, i) => (
                      <div key={i} className="text-sm border-l pl-3">
                        <div className="text-xs text-slate-400">
                          {formatDate(c.created_at)}
                        </div>
                        {c.text}
                      </div>
                    ))}
                  </div>
                )}

                <Textarea
                  placeholder="Add a memory..."
                  value={commentDrafts[place.id] || ""}
                  onChange={(e) =>
                    setCommentDrafts((p) => ({
                      ...p,
                      [place.id]: e.target.value,
                    }))
                  }
                />

                <div className="flex justify-between">
                  <Button
                    onClick={() => handleSaveComment(place.id)}
                    size="sm"
                  >
                    {savingCommentId === place.id ? "Posting..." : "Post"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(place.id, place.name)}
                  >
                    DELETE PLACE
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}

          {/* ADD NEW */}
          <Link to="/map">
            <Card className="flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="text-3xl mb-2">＋</div>
              <div className="font-semibold">Add new place</div>
              <div className="text-sm text-slate-500">
                Go to map and discover
              </div>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default SavedPlacesPage;