const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileId: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    diskPath: { type: String, required: true },
    password: { type: String, required: true }, // Hashed PIN
    iv: { type: String, required: true },       // For AES decryption
    authTag: { type: String, required: true },  // For AES integrity check
    downloadCount: { type: Number, default: 0 },
    downloadLimit: { type: Number, default: 1 },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Auto-expire index (Backup for the Cron job)
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('File', fileSchema);