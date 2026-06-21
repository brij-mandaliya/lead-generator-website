# UPI QR Code Integration Validation Checklist

## Unit Testing
- [ ] Test razorpay service createUPIOrder method
- [ ] Test UPI order creation API endpoint (/api/payments/create-upi-order)
- [ ] Test webhook identification of UPI payments (payment_method: "upi")
- [ ] Test existing razorpay service methods still work
- [ ] Test existing payment endpoints still work

## Integration Testing
- [ ] Test API endpoints return correct UPI data (qrCode, intentUrl, vpa)
- [ ] Verify frontend receives and processes UPI order data correctly
- [ ] Test webhook processing for UPI payment events (payment.captured with upi data)
- [ ] Test that UPI payments update user plans correctly
- [ ] Test that UPI payment records are created in database

## Manual End-to-End Testing (with Razorpay test credentials)
- [ ] Start development servers (db, api-server, frontend)
- [ ] Log in as test user (demo@leadforge.app / demo123)
- [ ] Navigate to plan upgrade/dashboard page
- [ ] Select UPI payment option for a plan
- [ ] Verify UPI payment button shows appropriate message/toast
- [ ] Complete UPI test payment using Razorpay test credentials
- [ ] Verify user's plan is updated in database after payment
- [ ] Verify payment record is created with UPI markers
- [ ] Test webhook handling with simulated UPI events
- [ ] Test error cases (invalid plan IDs, etc.)

## Cross-Platform Testing
- [ ] Test UPI payment flow on desktop browsers
- [ ] Verify responsive design for UPI payment options
- [ ] Test accessibility of UPI payment button

## Security Validation
- [ ] Verify credentials are not exposed in client-side code
- [ ] Confirm webhook signature verification prevents spoofing for UPI payments
- [ ] Check that UPI payment amounts are validated properly
- [ ] Validate environment-specific credential usage for UPI (test vs live)
- [ ] Verify that UPI payments use same security measures as card payments

## Files Modified/Created
### Task 1: Razorpay Service Enhancement
- Modified: `artifacts/api-server/src/lib/razorpay.ts` (added createUPIOrder method)
- Modified: `artifacts/api-server/src/lib/__tests__/razorpay.test.ts` (added UPI tests)

### Task 2: Payment Controller Updates
- Modified: `artifacts/api-server/src/routes/payments.ts` (added /create-upi-order endpoint, enhanced webhook logging)

### Task 3: Frontend Enhancement
- Modified: `artifacts/leadgen-saas/src/lib/razorpay.ts` (added createUPIOrder, showUPIPaymentOptions functions)
- Modified: `artifacts/leadgen-saas/src/pages/dashboard/PlanPage.tsx` (added UPI payment button)

### Task 4: Environment Configuration and Documentation
- Updated: `.env.example` (added UPI notes and documentation)

## Global Constraints Verification
- [x] Uses existing `@workspace/db` connection and Drizzle ORM patterns
- [x] Follows existing Zod schema validation patterns from codebase
- [x] Reuses existing `requireAuth`, `requireAdmin` middleware from `@workspace/lib/auth`
- [x] Stores Razorpay credentials in environment variables only (never in code)
- [x] Supports both test and live Razorpay UPI environments via configuration
- [x] Implements proper webhook signature verification for security
- [x] Follows existing error handling patterns in the Express.js API
- [x] Maintains consistency with existing code styling and conventions
- [x] All database usage is backward compatible with existing schema
- [x] Environment detection via `NODE_ENV` and `RAZORPAY_ENVIRONMENT` variables

## Test Credentials for Manual Testing
When testing with Razorpay test environment:
- **Test Card Number**: 4111 1111 1111 1111
- **Test Expiry**: Any future date (e.g., 12/34)
- **Test CVV**: 000
- **Test OTP**: 000000 (for 3DS simulation)
- **Test UPI ID**: Any valid UPI ID format (e.g., test@upi)

## Success Criteria
1. Users can select UPI payment option alongside existing Razorpay option
2. UPI payment flow completes successfully using Razorpay test credentials
3. Payment records are correctly stored in database with UPI markers
4. User plans are updated correctly after successful UPI payments
5. Webhook signature verification works for UPI payments
6. No regression in existing Razorpay card/netbanking payment flow
