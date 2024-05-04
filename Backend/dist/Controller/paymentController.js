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
Object.defineProperty(exports, "__esModule", { value: true });
const paymentService_1 = require("../Service/paymentService");
const Stripe = require("stripe");
require("dotenv").config();
const handleError_1 = require("../Util/handleError");
class PaymentController {
    makePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stripeSecretKey = process.env.STRIPE_KEY;
            const stripe = new Stripe(stripeSecretKey, {
                apiVersion: "2023-10-16",
            });
            const userId = req.body.userId;
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'bdt',
                            product_data: {
                                name: req.body.name,
                                images: [req.body.logoUrl],
                                metadata: {
                                    vendorId: req.body._id,
                                    userId: userId
                                },
                            },
                            unit_amount: 1000 * 100,
                        },
                        quantity: 1
                    },
                ],
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/payment-success?id=${req.body.bookingId}`,
                cancel_url: `${process.env.CLIENT_URL}/profile/booking-details`,
            });
            req.session.payment = {
                amount: 1000,
                userId: req.body.userId,
                bookingId: req.body.bookingId,
                vendorId: req.body._id
            };
            res.send({ url: session.url });
        });
    }
    addPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentData = req.session.payment;
                const amount = paymentData.amount;
                const userId = paymentData.userId;
                const vendorId = paymentData.vendorId;
                const bookingId = paymentData.bookingId;
                const payment = yield (0, paymentService_1.addNewPayment)(amount, userId, vendorId, bookingId);
                yield (0, paymentService_1.updateAdminWallet)(amount);
                res.status(201).json({ payment });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "addPayment");
            }
        });
    }
    getAllPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 4;
                const skip = (page - 1) * pageSize;
                const totalPayements = yield (0, paymentService_1.CountTotalPayments)();
                const totalPages = Math.ceil(totalPayements / pageSize);
                const payment = yield (0, paymentService_1.getPayments)(skip, pageSize);
                res.status(200).json({ payment, totalPages });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getAllPayments");
            }
        });
    }
}
;
exports.default = new PaymentController();
