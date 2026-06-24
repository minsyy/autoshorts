document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('uploadForm');
	const fileInput = document.getElementById('fileInput');
	const submitBtn = document.getElementById('submitBtn');
	const statusDiv = document.getElementById('status');
	const progressBar = document.getElementById('progressBar');
	const progressText = document.getElementById('progressText');
	const fileLabel = document.querySelector('.file-label');

	fileInput.addEventListener('change', () => {
		if (fileInput.files && fileInput.files[0]) {
			fileLabel.textContent = fileInput.files[0].name;
		} else {
			fileLabel.textContent = 'Choose a video or audio file';
		}
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		if (!fileInput.files || !fileInput.files[0]) {
			statusDiv.className = 'status error';
			statusDiv.textContent = 'Please select a file first.';
			return;
		}

		submitBtn.disabled = true;
		statusDiv.className = 'status info';
		statusDiv.textContent = 'Uploading...';
		progressBar.style.width = '0%';
		progressText.textContent = '';

		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/transcribe');

		xhr.upload.onprogress = (evt) => {
			if (evt.lengthComputable) {
				const pct = Math.round((evt.loaded / evt.total) * 100);
				progressBar.style.width = pct + '%';
				progressText.textContent = pct + '%';
			}
		};

		xhr.onload = () => {
			submitBtn.disabled = false;
			try {
				const res = JSON.parse(xhr.responseText || '{}');
				if (xhr.status >= 200 && xhr.status < 300) {
					statusDiv.className = 'status success';
					statusDiv.textContent = res.message || 'Success — transcript generated.';
				} else {
					statusDiv.className = 'status error';
					statusDiv.textContent = res.error || ('Upload failed (status ' + xhr.status + ')');
				}
			} catch (err) {
				statusDiv.className = 'status error';
				statusDiv.textContent = 'Unexpected server response.';
				console.error(err, xhr.responseText);
			}
		};

		xhr.onerror = () => {
			submitBtn.disabled = false;
			statusDiv.className = 'status error';
			statusDiv.textContent = 'Network error during upload.';
		};

		const data = new FormData(form);
		xhr.send(data);
	});
});
