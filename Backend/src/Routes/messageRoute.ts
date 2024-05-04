import express from 'express';
import messageController from '../Controller/messageController';

export const router = express.Router();

router.post('/', messageController.createMessage);
router.get('/', messageController.getMessages);


export default router;
