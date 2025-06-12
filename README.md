Image Upload API
A simple RESTful API for uploading and retrieving images using Node.js, Express, and Multer. Images are stored locally and served publicly.
Setup Instructions

Clone the Repository:
git clone <repository-url>
cd image-upload-api


Install Dependencies:
npm install


Create Uploads Directory:

The server automatically creates an uploads/ directory on startup if it doesn't exist.


Run the Server:
npm start


The server runs on http://localhost:3000 by default (configurable via PORT environment variable).



API Usage
Endpoints

POST /api/upload

Description: Upload an image (JPEG, PNG, or GIF, max 5MB).
Content-Type: multipart/form-data
Form Data:
Key: image
Value: Image file


Response:
Success (201):{
  "message": "Image uploaded successfully",
  "fileName": "<generated-filename>",
  "url": "http://localhost:3000/uploads/<generated-filename>"
}


Error (400): Invalid file type, size exceeded, or no file uploaded.
Error (500): Server error.




GET /api/images/:filename

Description: Retrieve an image by filename.

Parameters:

filename: Name of the uploaded file (e.g., 1234567890-123456789.jpg).


Response:

Success: Image file is served.
Error (404): Image not found.


Alternative: Images are also accessible directly via http://localhost:3000/uploads/<filename>.




Testing with Postman

Upload Image:

Create a new POST request to http://localhost:3000/api/upload.
Set the request body to form-data.
Add a key named image and select a file (JPEG, PNG, or GIF).
Send the request and note the url in the response.
Test error cases:
Upload a non-image file (e.g., .txt) → 400 error.
Upload a file >5MB → 400 error.
Omit the image field → 400 error.




Retrieve Image:

Create a new GET request to http://localhost:3000/api/images/<filename> (use the fileName from the upload response).
Alternatively, open the url from the upload response in a browser.
Test error case:
Use a non-existent filename → 404 error.





Sample curl Commands
# Upload image
curl -X POST http://localhost:3000/api/upload -F "image=@/path/to/image.jpg"

# Retrieve image (open in browser or use curl)
curl http://localhost:3000/uploads/<filename> --output image.jpg

Project Structure
image-upload-api/
├── app.js          # Main application code
├── package.json    # Project dependencies and scripts
├── uploads/        # Directory for stored images (auto-created)
├── .gitignore      # Git ignore file
└── README.md       # Project documentation

Notes

Storage: Images are stored in the uploads/ directory on the server. Ensure sufficient disk space.
File Naming: Multer generates unique filenames using timestamps and random numbers to avoid conflicts.
Security: Only JPEG, PNG, and GIF images are allowed, with a 5MB size limit.
Production: For production, consider:
Adding authentication to protect uploads.
Using cloud storage (e.g., AWS S3) instead of local storage.
Implementing rate limiting and additional security measures.



GitHub Repository
The code is hosted on GitHub at <repository-url> (replace with your actual repository URL after pushing).
