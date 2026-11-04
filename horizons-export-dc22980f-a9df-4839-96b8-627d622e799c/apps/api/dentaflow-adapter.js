/**
 * SS Dental Care — DentaFlow External EHR / Patient Management Adapter
 * 
 * BOUNDARY DESIGN:
 * DentaFlow is an independent external application for dental patient tracking.
 * This adapter decouples the SS Dental Care website booking pipeline from DentaFlow.
 * 
 * - The website functions 100% independently regardless of DentaFlow status.
 * - When DentaFlow API credentials and specifications are provided in the future,
 *   set DENTAFLOW_ENABLED=true and configure DENTAFLOW_API_URL and DENTAFLOW_API_KEY.
 * - This module logs cleanly in mock/passthrough mode without network errors.
 */

class DentaFlowAdapter {
  constructor() {
    this.enabled = process.env.DENTAFLOW_ENABLED === 'true';
    this.apiUrl = process.env.DENTAFLOW_API_URL || null;
    this.apiKey = process.env.DENTAFLOW_API_KEY || null;
  }

  /**
   * Sync a confirmed appointment to DentaFlow
   * @param {Object} appointment
   * @returns {Promise<{success: boolean, syncStatus: 'synced'|'disabled'|'queued'|'error', externalId?: string}>}
   */
  async syncAppointment(appointment) {
    if (!this.enabled || !this.apiUrl) {
      // Clean passthrough: independent website architecture
      return {
        success: true,
        syncStatus: 'disabled',
        note: 'DentaFlow integration is currently disabled; website operating in standalone mode.'
      };
    }

    try {
      console.log(`[DentaFlow Adapter]: Attempting sync for appointment ${appointment.id}...`);

      const payload = {
        externalReference: appointment.id,
        patient: {
          name: appointment.patient_name,
          phone: appointment.patient_phone,
          email: appointment.patient_email
        },
        appointment: {
          date: appointment.appointment_date,
          time: appointment.appointment_time,
          doctor: appointment.doctor_name,
          treatment: appointment.treatment,
          paymentStatus: appointment.payment_status,
          amount: appointment.amount
        },
        notes: appointment.notes || ''
      };

      const response = await fetch(`${this.apiUrl}/v1/appointments/external-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'ssdentalcare-web'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ [DentaFlow Sync Success]: External ID ${data.patientId || data.id}`);
        return {
          success: true,
          syncStatus: 'synced',
          externalId: data.patientId || data.id
        };
      } else {
        console.warn(`⚠️ [DentaFlow Sync Warning]: HTTP ${response.status} from DentaFlow`);
        return {
          success: false,
          syncStatus: 'queued',
          error: `HTTP ${response.status}`
        };
      }
    } catch (err) {
      console.warn('⚠️ [DentaFlow Adapter Exception]:', err.message);
      return {
        success: false,
        syncStatus: 'queued',
        error: err.message
      };
    }
  }
}

module.exports = new DentaFlowAdapter();

