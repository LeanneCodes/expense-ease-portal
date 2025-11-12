"use client";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState([]); // files selected but not uploaded yet
  const [uploadingFiles, setUploadingFiles] = useState([]); // track progress per file

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUpload = () => {
    if (files.length === 0) return;

    const newUploadState = files.map((file) => ({
      name: file.name,
      size: file.size,
      progress: 0,
    }));

    setUploadingFiles(newUploadState);

    // Mock upload with interval per file
    newUploadState.forEach((file) => {
      const interval = setInterval(() => {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 300);

      setTimeout(() => clearInterval(interval), 3300); // stop after mock upload
    });

    setFiles([]); // clear selection after starting upload
  };

  return (
    <div className="min-h-screen overflow-hidden bg-receipts flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="text-center mb-10 z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 font-exo">
          ExpenseEase
        </h1>
        <p className="text-gray-800 font-montserrat text-sm md:text-base">
          Drag & drop your receipts to upload
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 z-10">
        {/* Left: Drag & Drop Box */}
        <div
          className="flex-1 bg-white/80 rounded-lg shadow-lg h-[50vh] md:h-[60vh] flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-gray-500 mb-2 font-montserrat text-sm md:text-base">
            Drag & drop your files here
          </p>
          <p className="text-gray-400 mb-4 text-sm md:text-base">
            PNG, JPEG, PDF
          </p>

          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="px-6 py-2 bg-custom-blue text-white rounded hover:bg-custom-blue transition font-montserrat text-sm md:text-base"
          >
            Select Files
          </button>
        </div>

        {/* Right: Upload Queue */}
        <div className="flex-1 bg-white/80 rounded-lg shadow-lg h-[50vh] md:h-[60vh] p-6 overflow-y-auto">
          <h3 className="text-gray-700 font-semibold mb-4 font-exo text-lg md:text-xl">
            Files Ready to Submit
          </h3>

          {files.length === 0 && uploadingFiles.length === 0 && (
            <p className="text-gray-400 font-montserrat">No files yet</p>
          )}

          {/* Selected files waiting to upload */}
          {files.map((file, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-3 rounded mb-2 flex justify-between items-center"
            >
              <span className="truncate max-w-[70%]">{file.name}</span>
              <span className="text-gray-500 text-sm">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}

          {/* Mock uploading files with progress */}
          {uploadingFiles.map((file, idx) => (
            <div key={idx} className="bg-gray-100 p-3 rounded mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="truncate max-w-[70%]">{file.name}</span>
                <span className="text-gray-500 text-sm">{file.progress}%</span>
              </div>
              <div className="w-full bg-gray-300 h-2 rounded">
                <div
                  className="bg-green-600 h-2 rounded transition-all"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
            </div>
          ))}

          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`mt-4 w-full px-4 py-2 rounded font-montserrat ${
              files.length === 0
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
