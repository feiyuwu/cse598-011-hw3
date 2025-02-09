const IMAGE_COUNT = 200;
const IMAGES_TO_SHOW = 10;
const REASONS = {
  ai: [
    'Unnatural textures',
    'Illogical shadows',
    'Anatomy issues',
    'Surreal details',
    'Repeating patterns',
  ],
  real: [
    'Natural lighting',
    'Real imperfections',
    'Believable context',
    'Texture variation',
    'Consistent depth',
  ],
};

function initialize() {
  const container = document.getElementById('imageContainer');
  const images = getRandomImages();

  images.forEach((imgNumber, index) => {
    const card = createImageCard(imgNumber, index);
    container.appendChild(card);
  });

  // Set up submit button
  document
    .getElementById('submitBtn')
    .addEventListener('click', handleSubmission);
}

function getRandomImages() {
  const images = new Set();
  while (images.size < IMAGES_TO_SHOW) {
    images.add(Math.floor(Math.random() * IMAGE_COUNT) + 1);
  }
  return Array.from(images);
}

function createImageCard(imgNumber, index) {
  const card = document.createElement('div');
  card.className = 'col-md-6';
  card.innerHTML = `
        <div class="image-card">
            <img src="data/images/${imgNumber}.png" 
                 class="image-preview w-100" 
                 alt="Image ${imgNumber}">
            
            <div class="confidence-container">
                <div class="slider-labels">
                    <span>Real Photo</span>
                    <span>AI Generated</span>
                </div>
                <input type="range" 
                       class="form-range" 
                       min="0" 
                       max="100" 
                       value="50"
                       oninput="updateConfidence(${index}, this.value)">
                <div class="confidence-display">
                    Confidence: <span id="confidence${index}">50%</span>
                </div>
            </div>

            <div class="reason-section">
                <div class="ai-reasons">
                    <div class="small text-muted mb-2">Select AI indicators if observed</div>
                    ${REASONS.ai
                      .map(
                        (reason) => `
                        <div class="form-check form-check-inline">
                            <input type="checkbox" 
                                   class="form-check-input" 
                                   id="ai_${index}_${reason}">
                            <label class="form-check-label">${reason}</label>
                        </div>
                    `
                      )
                      .join('')}
                </div>

                <hr class="my-3">

                <div class="real-reasons">
                    <div class="small text-muted mb-2">Select real photo indicators if observed</div>
                    ${REASONS.real
                      .map(
                        (reason) => `
                        <div class="form-check form-check-inline">
                            <input type="checkbox" 
                                   class="form-check-input" 
                                   id="real_${index}_${reason}">
                            <label class="form-check-label">${reason}</label>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        </div>
    `;
  return card;
}

function updateConfidence(index, value) {
  document.getElementById(`confidence${index}`).textContent = `${value}%`;
}

function handleSubmission() {
  // Hide main content
  document.getElementById('mainContent').style.display = 'none';

  // Show and center completion page
  const completionPage = document.getElementById('completionPage');
  completionPage.style.display = 'flex';

  // Generate and display key
  const verificationKey = generateVerificationKey();
  document.getElementById('verificationKey').textContent = verificationKey;

  // Add keyboard shortcut for better UX
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') location.reload();
  });
}

function generateVerificationKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let key = '';
  for (let i = 0; i < 12; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) key += '-';
  }
  return key;
}

// Clipboard functionality
document.getElementById('copyButton').addEventListener('click', () => {
  const key = document.getElementById('verificationKey').textContent;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        showCopyFeedback();
      })
      .catch(() => {
        manualCopyFallback(key);
      });
  } else {
    manualCopyFallback(key);
  }
});

function manualCopyFallback(key) {
  const textArea = document.createElement('textarea');
  textArea.value = key;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    showCopyFeedback();
  } catch (err) {
    alert('Please manually copy the key');
  }
  document.body.removeChild(textArea);
}

function showCopyFeedback() {
  const btn = document.getElementById('copyButton');
  btn.innerHTML = '<span class="copied-feedback">✓ Copied!</span>';
  setTimeout(() => {
    btn.textContent = 'Copy Key';
  }, 2000);
}

// Initialize app
window.onload = initialize;
