const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const File = require('../models/File');
const { v4: uuidv4 } = require('uuid');
const { pipeline } = require('stream/promises');

const ALGORITHM = 'aes-256-gcm';

exports.uploadFile = async (req, res) => {
    try {
        const { password, downloadLimit, expiry } = req.body;
        if (!password || password === "undefined" || password === "") {
            return res.status(400).json({ error: "PIN is mandatory for security." });
        }

        const fileId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(process.env.APP_SECRET), iv);
        
        const outputPath = path.join(__dirname, '../uploads', fileId);
        await pipeline(fs.createReadStream(req.file.path), cipher, fs.createWriteStream(outputPath));

        const authTag = cipher.getAuthTag().toString('hex');

        const newFile = new File({
            fileId,
            originalName: req.file.originalname,
            diskPath: outputPath,
            iv: iv.toString('hex'),
            authTag: authTag,
            password: hashedPassword,
            downloadLimit: parseInt(downloadLimit) || 1,
            expiresAt: new Date(Date.now() + (parseInt(expiry) || 1) * 3600000)
        });

        await newFile.save();
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        return res.status(200).json({ fileId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed." });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const file = await File.findOne({ fileId: req.params.id });
        if (!file) return res.status(404).send("Link expired or invalid.");

        const match = await bcrypt.compare(req.query.pin || "", file.password);
        if (!match) return res.status(401).send("Invalid PIN.");

        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(process.env.APP_SECRET), Buffer.from(file.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(file.authTag, 'hex'));

        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        await pipeline(fs.createReadStream(file.diskPath), decipher, res);

        file.downloadCount += 1;
        if (file.downloadCount >= file.downloadLimit) {
            if (fs.existsSync(file.diskPath)) fs.unlinkSync(file.diskPath);
            await File.deleteOne({ _id: file._id });
        } else {
            await file.save();
        }
    } catch (err) {
        if (!res.headersSent) res.status(500).send("Decryption Error.");
    }
};