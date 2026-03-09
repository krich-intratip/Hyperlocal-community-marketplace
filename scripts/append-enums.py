"""
append-enums.py — Append new enums for commission/invite/delivery features to shared-types/enums.ts
Run once: python scripts/append-enums.py
"""
from pathlib import Path

TARGET = Path(__file__).parent.parent / 'packages' / 'shared-types' / 'src' / 'enums.ts'
text = TARGET.read_text(encoding='utf-8')

NEW_ENUMS = """
/**
 * Approval status for a community member joining via invite or direct sign-up.
 * Only applies to provider/trader accounts; customers are auto-approved (APPROVED on signup).
 */
export enum MemberApprovalStatus {
  PENDING  = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Lifecycle of a single commission ledger entry (one entry per completed booking).
 * PENDING   = booking paid but not yet completed.
 * SETTLED   = booking COMPLETED — commission is recognised.
 * CANCELLED = booking refunded — no commission.
 */
export enum CommissionLedgerStatus {
  PENDING   = 'PENDING',
  SETTLED   = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

/**
 * Lifecycle of a monthly payout to a Community Admin (franchise revenue share).
 * Flow: DRAFT -> PENDING_APPROVAL -> APPROVED -> PROCESSING -> PAID | FAILED
 */
export enum PayoutStatus {
  DRAFT            = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED         = 'APPROVED',
  PROCESSING       = 'PROCESSING',
  PAID             = 'PAID',
  FAILED           = 'FAILED',
}

/**
 * Delivery / shipping status for cross-community orders.
 * NOT_APPLICABLE = no delivery needed (in-person service or same-community order).
 */
export enum DeliveryStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING        = 'PENDING',
  PICKED_UP      = 'PICKED_UP',
  IN_TRANSIT     = 'IN_TRANSIT',
  DELIVERED      = 'DELIVERED',
  FAILED         = 'FAILED',
}
"""

checks = ['MemberApprovalStatus', 'CommissionLedgerStatus', 'PayoutStatus', 'DeliveryStatus']
missing = [c for c in checks if c not in text]

if not missing:
    print('SKIP: all enums already present')
else:
    TARGET.write_text(text + NEW_ENUMS, encoding='utf-8')
    print(f'OK: appended enums: {missing}')
