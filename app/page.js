// app/page.js
"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [files, setFiles] = useState([]); // files selected but not uploaded yet
  const [uploadingFiles, setUploadingFiles] = useState([]); // { name, size, progress, status }
  const [email, setEmail] = useState("");
  const inputRef = useRef(null);

  // helper: validate basic email format
  const isValidEmail = (value) =>
    typeof value === "string" &&
    /\S+@\S+\.\S+/.test(value.trim());

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Uploads each file sequentially with progress via XMLHttpRequest
  const handleUpload = async () => {
    if (!isValidEmail(email) || files.length === 0) return;

    // initialize uploadingFiles state
    const initialUploads = files.map((f) => ({
      name: f.name,
      size: f.size,
      progress: 0,
      status: "queued", // queued | uploading | done | error
    }));
    setUploadingFiles(initialUploads);
    setFiles([]); // clear selection now we've queued uploads

    for (let i = 0; i < initialUploads.length; i++) {
      const fileEntry = initialUploads[i];
      await uploadSingleFile(fileEntry, i);
    }
  };

  // returns a Promise that resolves when upload completes (success or fail)
  const uploadSingleFile = (fileEntry, idx) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const fd = new FormData();

      // find the actual File object — we stored file objects in local state earlier,
      // but since we cleared files state we still have the file in fileEntry? To be safe,
      // let's keep a mapping: we'll assume fileEntry includes the file object if still present.
      // If not (we cleared files), we should keep the file object when creating initialUploads.
      // To avoid confusion, ensure initialUploads holds the file object. We'll update that above.

      // However to keep code reliable, let's store file object in initialUploads before clearing files.
      // (Implementation detail handled above in handleUpload - but here we assume fileEntry.file exists)

      const file = fileEntry.file;
      fd.append("file", file);
      fd.append("email", email);

      xhr.upload.addEventListener("progress", (e) => {
        if (!e.lengthComputable) return;
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadingFiles((prev) =>
          prev.map((f, i) => (i === idx ? { ...f, progress: percent, status: "uploading" } : f))
        );
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadingFiles((prev) =>
              prev.map((f, i) => (i === idx ? { ...f, progress: 100, status: "done" } : f))
            );
          } else {
            setUploadingFiles((prev) =>
              prev.map((f, i) => (i === idx ? { ...f, status: "error" } : f))
            );
          }
          resolve();
        }
      };

      xhr.open("POST", "/api/upload/receipts");
      // do not set Content-Type; browser will set multipart/form-data with boundary
      xhr.send(fd);
    });
  };

  // Improved handleUpload that keeps file objects in the queued state (so uploadSingleFile can access them)
  const handleUploadClick = async () => {
    if (!isValidEmail(email) || files.length === 0) return;

    // keep file objects in uploads
    const queued = files.map((f) => ({
      file: f.file,
      name: f.name,
      size: f.size,
      progress: 0,
      status: "queued",
    }));

    setUploadingFiles(queued);
    setFiles([]); // clear selected list (they are now in uploadingFiles)

    for (let i = 0; i < queued.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await uploadSingleFile(queued[i], i);
    }
  };

  // Quick UI helper to programmatically open file dialog
  const openFilePicker = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="min-h-screen justify-center overflow-hidden bg-receipts flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-6xl text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-1 font-exo">
          ExpenseEase
        </h1>
        <p className="text-gray-800 font-montserrat">Drag & drop receipts or select files to upload</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 z-10">
        {/* Left: Drag & Drop + Email */}
        <div
          className="flex-1 bg-white/85 rounded-lg shadow-lg min-h-[42vh] md:h-[60vh] flex flex-col p-6 border-2 border-dashed border-gray-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label className="text-sm text-gray-600 mb-2 font-montserrat">Your email (required)</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 rounded border border-gray-200 outline-none"
            required
          />

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-2">Drag & drop files here</p>
            <p className="text-gray-400 mb-4">PNG, JPEG, PDF</p>

            <input
              id="fileInput"
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <button
              onClick={openFilePicker}
              className="px-6 py-2 bg-custom-blue text-white rounded hover:bg-custom-blue transition font-montserrat"
            >
              Select Files
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Submit will be disabled until you provide an email and at least one file.
          </div>
        </div>

        {/* Right: Upload Queue */}
        <div className="flex-1 bg-white/85 rounded-lg shadow-lg min-h-[42vh] md:h-[60vh] p-6 overflow-y-auto">
          <h3 className="text-gray-700 font-semibold mb-4 font-exo text-lg md:text-xl">
            Files Ready to Submit
          </h3>

          {/* If there are selected (not queued) files */}
          {files.length > 0 &&
            files.map((file, idx) => (
              <div key={`selected-${idx}`} className="bg-gray-100 p-3 rounded mb-2 flex justify-between items-center">
                <span className="truncate max-w-[70%]">{file.name}</span>
                <span className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => removeFile(idx)}
                  className="ml-3 text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

          {/* Uploading / queued items */}
          {uploadingFiles.map((u, idx) => (
            <div key={`uploading-${idx}`} className="bg-gray-100 p-3 rounded mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="truncate max-w-[70%]">{u.name}</span>
                <span className="text-gray-500 text-sm">
                  {u.status === "uploading" ? `${u.progress}%` : u.status === "done" ? "Done" : u.status === "error" ? "Error" : "Queued"}
                </span>
              </div>
              <div className="w-full bg-gray-300 h-2 rounded">
                <div
                  className={`h-2 rounded transition-all ${u.status === "error" ? "bg-red-500" : "bg-green-600"}`}
                  style={{ width: `${u.progress ?? 0}%` }}
                />
              </div>
            </div>
          ))}

          {/* when nothing */}
          {files.length === 0 && uploadingFiles.length === 0 && (
            <p className="text-gray-400">No files yet</p>
          )}

          <button
            onClick={handleUploadClick}
            disabled={!isValidEmail(email) || (files.length === 0 && uploadingFiles.length === 0)}
            className={`mt-4 w-full px-4 py-2 rounded font-montserrat ${
              !isValidEmail(email) || (files.length === 0 && uploadingFiles.length === 0)
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
