const express = require("express");
const db = require("../db/database");
const axios = require("axios");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

const router = express.Router();

// const uploadsDir = path.join(__dirname, "..", "uploads");

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     const safeName = file.originalname.replace(/\s+/g, "-");
//     cb(null, `${Date.now()}-${safeName}`);
//   },
// });

// const upload = multer({ storage });

async function fetchUnsplashImage(place) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return { imageUrl: null, imageAlt: null };
  }

  const searchQuery =
    place.type === "city"
      ? `${place.name} ${place.countryName || ""} travel city`
      : `${place.name} country travel landscape`;

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      params: {
        query: searchQuery,
        per_page: 1,
        orientation: "landscape",
        content_filter: "high",
      },
    });

    const firstPhoto = response.data?.results?.[0];

    if (!firstPhoto) {
      return { imageUrl: null, imageAlt: null };
    }

    return {
      imageUrl: firstPhoto.urls?.regular || null,
      imageAlt: firstPhoto.alt_description || place.name,
    };
  } catch (error) {
    console.error(
      "Unsplash image fetch failed:",
      error.response?.data || error.message
    );
    return { imageUrl: null, imageAlt: null };
  }
}

function parseCommentLog(raw) {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// GET all saved places
router.get("/", (req, res) => {
  const sql = `SELECT * FROM places ORDER BY created_at DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching places:", err.message);
      return res.status(500).json({ error: "Failed to fetch places." });
    }

    const normalizedRows = rows.map((row) => ({
      ...row,
      comment_log: parseCommentLog(row.comment_log),
    }));

    res.json(normalizedRows);
  });
});

// POST a new place
router.post("/", async (req, res) => {
  const { name, type, countryName, latitude, longitude, externalId } = req.body;

  if (!name || !type || latitude == null || longitude == null || !externalId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const checkSql = `SELECT * FROM places WHERE external_id = ?`;

  db.get(checkSql, [externalId], async (checkErr, existingPlace) => {
    if (checkErr) {
      console.error("Error checking duplicates:", checkErr.message);
      return res.status(500).json({ error: "Failed to check duplicates." });
    }

    if (existingPlace) {
      return res.status(409).json({ error: "This place is already saved." });
    }

    const { imageUrl, imageAlt } = await fetchUnsplashImage({
      name,
      type,
      countryName,
    });

    const insertSql = `
      INSERT INTO places (
        name,
        type,
        country_name,
        latitude,
        longitude,
        external_id,
        image_url,
        image_alt,
        comment_log,
        visit_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      insertSql,
      [
        name,
        type,
        countryName || null,
        latitude,
        longitude,
        externalId,
        imageUrl,
        imageAlt,
        JSON.stringify([]),
        null,
      ],
      function (insertErr) {
        if (insertErr) {
          console.error("Error saving place:", insertErr.message);
          return res.status(500).json({ error: "Failed to save place." });
        }

        res.status(201).json({
          id: this.lastID,
          message: "Place saved successfully.",
        });
      }
    );
  });
});

// // UPLOAD attachment
// router.patch("/:id/attachment", upload.single("attachment"), (req, res) => {
//   const { id } = req.params;

//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded." });
//   }

//   const attachmentName = req.file.originalname;
//   const attachmentUrl = `http://localhost:3001/uploads/${req.file.filename}`;

//   const sql = `
//     UPDATE places
//     SET attachment_name = ?, attachment_url = ?
//     WHERE id = ?
//   `;

//   db.run(sql, [attachmentName, attachmentUrl, id], function (err) {
//     if (err) {
//       console.error("Error saving attachment:", err.message);
//       return res.status(500).json({ error: "Failed to save attachment." });
//     }

//     if (this.changes === 0) {
//       return res.status(404).json({ error: "Place not found." });
//     }

//     res.json({
//       message: "Attachment uploaded successfully.",
//       attachment_name: attachmentName,
//       attachment_url: attachmentUrl,
//     });
//   });
// });

// REMOVE attachment
// router.patch("/:id/remove-attachment", (req, res) => {
//   const { id } = req.params;

//   const getSql = `SELECT attachment_url FROM places WHERE id = ?`;

//   db.get(getSql, [id], (getErr, place) => {
//     if (getErr) {
//       console.error("Error fetching attachment:", getErr.message);
//       return res.status(500).json({ error: "Failed to fetch attachment." });
//     }

//     if (!place) {
//       return res.status(404).json({ error: "Place not found." });
//     }

//     if (place.attachment_url) {
//       const filename = place.attachment_url.split("/uploads/")[1];
//       if (filename) {
//         const filePath = path.join(uploadsDir, filename);
//         if (fs.existsSync(filePath)) {
//           fs.unlink(filePath, () => {});
//         }
//       }
//     }

//     const updateSql = `
//       UPDATE places
//       SET attachment_name = NULL, attachment_url = NULL
//       WHERE id = ?
//     `;

//     db.run(updateSql, [id], function (updateErr) {
//       if (updateErr) {
//         console.error("Error removing attachment:", updateErr.message);
//         return res.status(500).json({ error: "Failed to remove attachment." });
//       }

//       res.json({ message: "Attachment removed successfully." });
//     });
//   });
// });

// ADD comment entry to log
router.patch("/:id/comment-log", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Comment text is required." });
  }

  const getSql = `SELECT comment_log FROM places WHERE id = ?`;

  db.get(getSql, [id], (getErr, place) => {
    if (getErr) {
      console.error("Error fetching comment log:", getErr.message);
      return res.status(500).json({ error: "Failed to fetch comment log." });
    }

    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    const existingLog = parseCommentLog(place.comment_log);
    const nextLog = [
      {
        text: text.trim(),
        created_at: new Date().toISOString(),
      },
      ...existingLog,
    ];

    const updateSql = `
      UPDATE places
      SET comment_log = ?
      WHERE id = ?
    `;

    db.run(updateSql, [JSON.stringify(nextLog), id], function (updateErr) {
      if (updateErr) {
        console.error("Error saving comment log:", updateErr.message);
        return res.status(500).json({ error: "Failed to save comment." });
      }

      res.json({ message: "Comment saved successfully." });
    });
  });
});

// SAVE visit date
router.patch("/:id/visit-date", (req, res) => {
  const { id } = req.params;
  const { visitDate } = req.body;

  const sql = `
    UPDATE places
    SET visit_date = ?
    WHERE id = ?
  `;

  db.run(sql, [visitDate || null, id], function (err) {
    if (err) {
      console.error("Error saving visit date:", err.message);
      return res.status(500).json({ error: "Failed to save visit date." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Place not found." });
    }

    res.json({ message: "Visit date saved successfully." });
  });
});

// DELETE place
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM places WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error("Error deleting place:", err.message);
      return res.status(500).json({ error: "Failed to delete place." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Place not found." });
    }
    res.json({ message: "Place deleted successfully." });
  });
});

module.exports = router;