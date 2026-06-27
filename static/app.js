```javascript
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const submitBtn = document.getElementById("submitBtn");
    const statusDiv = document.getElementById("status");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const fileLabel = document.querySelector(".file-label");

    // -----------------------------
    // Display Selected File Name
    // -----------------------------

    fileInput.addEventListener("change", () => {

        if (fileInput.files.length > 0) {

            fileLabel.textContent = fileInput.files[0].name;

            statusDiv.className = "status info";
            statusDiv.textContent = "File selected successfully.";

        } else {

            fileLabel.textContent = "Choose a video or audio file";

            statusDiv.textContent = "";

        }

    });

    // -----------------------------
    // Upload Form Submit
    // -----------------------------

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        if (!fileInput.files.length) {

            statusDiv.className = "status error";
            statusDiv.textContent = "Please select a file before uploading.";

            return;

        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Uploading...";

        progressBar.style.width = "0%";
        progressText.textContent = "0%";

        statusDiv.className = "status info";
        statusDiv.textContent = "Uploading file...";

        const formData = new FormData(form);

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/api/transcribe", true);

        // -----------------------------
        // Upload Progress
        // -----------------------------

        xhr.upload.addEventListener("progress", (event) => {

            if (event.lengthComputable) {

                const percent = Math.round((event.loaded / event.total) * 100);

                progressBar.style.width = percent + "%";

                progressText.textContent = percent + "%";

            }

        });

        // -----------------------------
        // Upload Success
        // -----------------------------

        xhr.onload = () => {

            submitBtn.disabled = false;
            submitBtn.textContent = "Upload & Generate";

            if (xhr.status >= 200 && xhr.status < 300) {

                progressBar.style.width = "100%";
                progressText.textContent = "Completed";

                try {

                    const response = JSON.parse(xhr.responseText);

                    statusDiv.className = "status success";

                    statusDiv.textContent =
                        response.message ||
                        "Upload completed successfully.";

                } catch {

                    statusDiv.className = "status success";

                    statusDiv.textContent =
                        "Upload completed successfully.";

                }

            } else {

                progressBar.style.width = "0%";

                progressText.textContent = "";

                try {

                    const response = JSON.parse(xhr.responseText);

                    statusDiv.className = "status error";

                    statusDiv.textContent =
                        response.error ||
                        "Upload failed.";

                } catch {

                    statusDiv.className = "status error";

                    statusDiv.textContent =
                        "Server returned an unexpected response.";

                }

            }

        };

        // -----------------------------
        // Network Error
        // -----------------------------

        xhr.onerror = () => {

            submitBtn.disabled = false;

            submitBtn.textContent = "Upload & Generate";

            progressBar.style.width = "0%";

            progressText.textContent = "";

            statusDiv.className = "status error";

            statusDiv.textContent =
                "Network error. Please check your connection and try again.";

        };

        // -----------------------------
        // Upload Abort
        // -----------------------------

        xhr.onabort = () => {

            submitBtn.disabled = false;

            submitBtn.textContent = "Upload & Generate";

            progressBar.style.width = "0%";

            progressText.textContent = "";

            statusDiv.className = "status error";

            statusDiv.textContent = "Upload cancelled.";

        };

        // -----------------------------
        // Send Request
        // -----------------------------

        xhr.send(formData);

    });

});
```
