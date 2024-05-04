"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const postService_1 = require("../Service/postService");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CustomError_1 = require("../Error/CustomError");
const handleError_1 = require("../Util/handleError");
//configuring s3
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});
const randomImage = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
class PostController {
    addNewPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const caption = req.body.caption;
                const vendor_id = req.query.vendorid;
                const buffer = yield (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
                    .resize({ height: 1920, width: 1080, fit: "contain" })
                    .toBuffer();
                const imageName = randomImage();
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: imageName,
                    Body: buffer,
                    ContentType: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
                };
                const command = new client_s3_1.PutObjectCommand(params);
                yield s3.send(command);
                const post = yield (0, postService_1.createPost)(caption, imageName, vendor_id);
                return res.status(201).json(post);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "addNewPost");
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor_id = req.query.vendorid;
                const posts = yield (0, postService_1.getAllPosts)(vendor_id);
                for (const post of posts) {
                    const getObjectParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: post.image,
                    };
                    const command = new client_s3_1.GetObjectCommand(getObjectParams);
                    const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
                    post.imageUrl = url;
                }
                console.log(posts);
                return res.status(201).json(posts);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getPosts");
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const post = yield (0, postService_1.getPostById)(id);
                if (!post) {
                    throw new CustomError_1.CustomError('Post not found!', 404);
                }
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: post.image,
                };
                const command = new client_s3_1.DeleteObjectCommand(params);
                yield s3.send(command);
                yield (0, postService_1.deletePost)(id);
                return res.status(200).json({ message: "Post deleted successfully" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "deletePost");
            }
        });
    }
}
;
exports.default = new PostController();
