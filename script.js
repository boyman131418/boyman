document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const resultContainer = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    const WEBHOOK_URL = 'https://hook.eu2.make.com/98c390bbbr42l7ugl14us7051kzb6srl';

    // 點擊上傳
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // 文件選擇處理
    fileInput.addEventListener('change', handleFileSelect);

    // 拖放處理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = 'var(--accent-color)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = 'var(--primary-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = 'var(--primary-color)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleFile(file) {
        if (!file.type.includes('audio/mp3') && !file.type.includes('audio/mpeg')) {
            showStatus('請上傳MP3檔案', 'error');
            hideResult();
            return;
        }

        showStatus('正在處理檔案...', '');
        hideResult();

        const reader = new FileReader();
        reader.onload = async (e) => {
            const binaryData = e.target.result;
            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    body: binaryData,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                });

                if (response.ok) {
                    const responseData = await response.text();
                    showStatus('檔案處理成功！', 'success');
                    showResult(responseData);
                } else {
                    throw new Error('處理失敗');
                }
            } catch (error) {
                showStatus('檔案處理失敗，請稍後再試', 'error');
                hideResult();
                console.error('Error:', error);
            }
        };

        reader.readAsArrayBuffer(file);
    }

    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'status';
        if (type) {
            status.classList.add(type);
        }
    }

    function showResult(data) {
        try {
            const formattedData = typeof data === 'string' ? 
                (JSON.parse(data) ? JSON.stringify(JSON.parse(data), null, 2) : data) 
                : JSON.stringify(data, null, 2);
            resultContent.textContent = formattedData;
        } catch (e) {
            resultContent.textContent = data;
        }
        resultContainer.style.display = 'block';
    }

    function hideResult() {
        resultContainer.style.display = 'none';
        resultContent.textContent = '';
    }
});
