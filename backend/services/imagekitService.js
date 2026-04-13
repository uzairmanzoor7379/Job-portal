const ImageKit = require('imagekit');

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file to ImageKit
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} fileName - Original file name
 * @param {string} folder - ImageKit folder path
 * @returns {Promise} ImageKit response with file details
 */
const uploadToImageKit = async (fileBuffer, fileName, folder = 'job-portal/resumes') => {
    try {
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: `${Date.now()}-${fileName}`,
            folder: folder,
            isPrivateFile: false, // Public file - directly accessible
            tags: ['resume', 'job-portal'],
        });

        return {
            fileId: response.fileId,
            fileName: response.name,
            filePath: response.filePath,
            url: response.url,
            privatePath: response.filePath, // For private file access
            isPrivateFile: response.isPrivateFile,
        };
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw new Error(`Failed to upload file to ImageKit: ${error.message}`);
    }
};

/**
 * Generate signed URL for private files
 * @param {string} filePath - The file path from ImageKit
 * @param {number} expireSeconds - URL expiration time in seconds (default 1 hour)
 * @returns {string} Signed URL
 */
const generateSignedUrl = (filePath, expireSeconds = 3600) => {
    try {
        const url = imagekit.getSignedUrl({
            path: filePath,
            expire: expireSeconds,
        });
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
};

/**
 * Delete file from ImageKit
 * @param {string} fileId - The ImageKit file ID
 * @returns {Promise}
 */
const deleteFromImageKit = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        console.error('ImageKit delete error:', error);
        throw new Error(`Failed to delete file from ImageKit: ${error.message}`);
    }
};

module.exports = {
    imagekit,
    uploadToImageKit,
    generateSignedUrl,
    deleteFromImageKit,
};
