/**
 * SS Dental Care — Database Watcher (Legacy Module Superseded)
 * 
 * ARCHITECTURE NOTE:
 * Database polling for email dispatch has been superseded by the durable
 * Transactional Outbox Worker (`outbox-worker.js`).
 * 
 * Having both API triggers and database polling sent duplicate emails.
 * The system now uses the unified, authoritative `notification_outbox` table.
 * 
 * This file retains backward-compatible function signatures for existing imports.
 */

function startWatcher() {
  console.log('ℹ️ [Watcher Notice]: Direct DB polling watcher retired in favor of durable outbox worker pipeline.');
}

function markAsProcessed(table, id) {
  // Retained for backward compatibility
}

module.exports = {
  startWatcher,
  markAsProcessed
};
