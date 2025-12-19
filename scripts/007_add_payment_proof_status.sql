-- Add payment proof status column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_status text DEFAULT 'pending';

-- Add comment for clarity
COMMENT ON COLUMN orders.payment_proof_status IS 'Status of payment proof: pending, verified, rejected';

-- Update existing orders with payment proofs to have pending status
UPDATE orders SET payment_proof_status = 'pending' WHERE payment_proof_url IS NOT NULL AND payment_proof_status IS NULL;
