document.addEventListener('DOMContentLoaded', () => {
    const trackForm = document.getElementById('trackForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnIcon = document.querySelector('.btn-icon');
    const loader = document.querySelector('.loader');
    
    const resultSection = document.getElementById('resultSection');
    const errorState = document.getElementById('errorState');
    const errorMsg = document.getElementById('errorMsg');
    
    // Summary elements
    const resStatus = document.getElementById('resStatus');
    const resCourier = document.getElementById('resCourier');
    const resAwb = document.getElementById('resAwb');
    const resShipper = document.getElementById('resShipper');
    const resReceiver = document.getElementById('resReceiver');
    const timelineList = document.getElementById('timelineList');

    trackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courier = document.getElementById('courier').value;
        const awb = document.getElementById('awb').value.trim();
        
        if (!courier || !awb) return;

        // UI Loading State
        setLoading(true);
        resultSection.classList.add('hidden');
        errorState.classList.add('hidden');

        try {
            // Fetch from local Node.js API
            const response = await fetch(`/api/track?courier=${encodeURIComponent(courier)}&awb=${encodeURIComponent(awb)}`);
            const data = await response.json();

            if (data.status === 200) {
                renderResult(data.data);
            } else {
                showError(data.error || 'Resi tidak ditemukan atau terjadi kesalahan server.');
            }
        } catch (error) {
            console.error('Tracking Error:', error);
            showError('Koneksi terputus. Gagal mengambil data resi.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            btnText.classList.add('hidden');
            btnIcon.classList.add('hidden');
            loader.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnIcon.classList.remove('hidden');
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorState.classList.remove('hidden');
    }

    function renderResult(data) {
        // Populate Summary
        resStatus.textContent = data.summary.status;
        resCourier.textContent = data.summary.courier;
        resAwb.textContent = data.summary.awb;
        resShipper.textContent = data.detail.shipper;
        resReceiver.textContent = data.detail.receiver;

        // Setup badge color based on status
        const statusBadge = document.querySelector('.status-badge');
        statusBadge.className = 'status-badge'; // reset
        if (data.summary.status.toLowerCase() === 'delivered') {
            statusBadge.classList.add('success');
            statusBadge.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span id="resStatus">${data.summary.status}</span>`;
        } else {
            // Processing status styling
            statusBadge.style.color = '#ffeb3b';
            statusBadge.style.borderColor = 'rgba(255, 235, 59, 0.3)';
            statusBadge.style.background = 'rgba(255, 235, 59, 0.1)';
            statusBadge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span id="resStatus">${data.summary.status}</span>`;
        }

        // Clear existing timeline
        timelineList.innerHTML = '';

        // Render Timeline items
        data.history.forEach((item, index) => {
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const tlItem = document.createElement('div');
            tlItem.className = `timeline-item ${index === 0 ? 'active' : ''}`;
            tlItem.innerHTML = `
                <div class="timeline-icon"></div>
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-desc">${item.desc}</div>
                <div class="timeline-loc"><i class="fa-solid fa-location-dot"></i> ${item.location}</div>
            `;
            timelineList.appendChild(tlItem);
        });

        // Show results with animation
        resultSection.classList.remove('hidden');
        
        // Retrigger animations
        const panels = resultSection.querySelectorAll('.fade-in');
        panels.forEach(panel => {
            panel.classList.remove('fade-in');
            void panel.offsetWidth; // trigger reflow
            panel.classList.add('fade-in');
        });
    }
});
