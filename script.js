class PhotoApp {
  constructor() {
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.capturedPhoto = document.getElementById("captured-photo");
    this.takePhotoBtn = document.getElementById("take-photo-btn");
    this.takeAnotherBtn = document.getElementById("take-another-btn");
    this.cameraSection = document.getElementById("camera-section");
    this.photoSection = document.getElementById("photo-section");

    this.stream = null;
    this.init();
  }

  async init() {
    await this.setupCamera();
    this.setupEventListeners();
  }

  async setupCamera() {
    try {
      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user", // Front camera for selfies
        },
        audio: false,
      });

      this.video.srcObject = this.stream;
      this.video.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
      this.showCameraError();
    }
  }

  setupEventListeners() {
    this.takePhotoBtn.addEventListener("click", () => this.takePhoto());
    this.takeAnotherBtn.addEventListener("click", () =>
      this.takeAnotherPhoto()
    );
  }

  takePhoto() {
    // Create flash effect
    this.createFlashEffect();

    // Set up canvas dimensions
    const context = this.canvas.getContext("2d");
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Convert canvas to image data
    const imageData = this.canvas.toDataURL("image/png");

    // Display the photo
    this.displayPhoto(imageData);

    // Stop camera stream
    this.stopCamera();
  }

  createFlashEffect() {
    const flash = document.createElement("div");
    flash.className = "flash-effect";
    document.body.appendChild(flash);

    setTimeout(() => {
      document.body.removeChild(flash);
    }, 300);
  }

  displayPhoto(imageData) {
    // Set the captured photo
    this.capturedPhoto.src = imageData;

    // Hide camera section and show photo section
    this.cameraSection.style.display = "none";
    this.photoSection.style.display = "block";

    // Add celebration effect
    this.addCelebrationEffect();
  }

  addCelebrationEffect() {
    // Create temporary celebration hearts
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.createCelebrationHeart();
      }, i * 100);
    }
  }

  createCelebrationHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = this.getRandomHeart();
    heart.style.position = "fixed";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = window.innerHeight + "px";
    heart.style.fontSize = Math.random() * 20 + 20 + "px";
    heart.style.color = this.getRandomColor();
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "1000";
    heart.style.animation = "float-up 3s ease-out forwards";

    document.body.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) {
        document.body.removeChild(heart);
      }
    }, 3000);
  }

  getRandomHeart() {
    const hearts = ["💕", "💖", "💗", "💝", "💘", "❤️", "💓", "💞"];
    return hearts[Math.floor(Math.random() * hearts.length)];
  }

  getRandomColor() {
    const colors = ["#ff1493", "#ff69b4", "#ff1493", "#c71585", "#db7093"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  takeAnotherPhoto() {
    // Hide photo section and show camera section
    this.photoSection.style.display = "none";
    this.cameraSection.style.display = "block";

    // Restart camera
    this.setupCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  showCameraError() {
    const errorMessage = document.createElement("div");
    errorMessage.innerHTML = `
            <div style="
                background: rgba(255, 255, 255, 0.9);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
                border: 3px solid #ff69b4;
                margin: 20px;
            ">
                <h2 style="color: #d63384; margin-bottom: 15px;">📱 Camera Access Needed</h2>
                <p style="color: #666; margin-bottom: 15px;">
                    To take beautiful photos, please allow camera access when prompted, or:
                </p>
                <ul style="text-align: left; color: #666; margin-bottom: 15px;">
                    <li>Click on the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera permissions</li>
                    <li>Refresh the page</li>
                </ul>
                <button onclick="location.reload()" style="
                    background: linear-gradient(45deg, #ff1493, #ff69b4);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 1rem;
                ">🔄 Try Again</button>
            </div>
        `;

    this.cameraSection.innerHTML = "";
    this.cameraSection.appendChild(errorMessage);
  }
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new PhotoApp();
});

// Add some extra romantic touches
