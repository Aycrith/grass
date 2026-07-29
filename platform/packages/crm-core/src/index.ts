/**
 * @grass/crm-core — CRM service layer.
 *
 * Re-exports service functions and twin-model types from service.ts and lifecycle.ts.
 */

export {
  type Customer,
  type CustomerContact,
  type CustomerStatus,
  type Lead,
  type LeadStatus,
  type LifecycleStage,
  type Property,
  type Quote,
  type QuoteLineItem,
  type QuoteStatus,
  acceptQuote,
  addPropertyPhoto,
  convertLeadToCustomer,
  createCustomer,
  createLead,
  createProperty,
  createQuote,
  customerHasContact,
  churnCustomer,
  leadResponseTimeMs,
  pauseCustomer,
  propertyHasAddress,
  qualifyLead,
  resumeCustomer,
  sendQuote,
  updateCustomer,
  updateLeadAcknowledgement,
  updateProperty,
} from './service.ts';
export {
  type LifecycleInputs,
  type LifecycleInvoice,
  type LifecycleJob,
  leadLifecycleStage,
  setLifecycleOverride,
} from './lifecycle.ts';
