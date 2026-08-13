// GENERATED FILE - do not edit by hand.
//
// Source: Smartlead official API reference, fetched 2026-08-14.
// Regenerate with the catalog generator described in docs/endpoint-coverage.md.
//
// Every entry's `capability` was reviewed by hand. Verb-based inference is
// unsafe here: Smartlead serves many searches over POST, and several DELETE
// routes are suppression-increasing rather than destructive.

import type { CatalogEntry } from './types.js';

export const CATALOG: readonly CatalogEntry[] = [
  {
    "tool": "smartdelivery_blacklists",
    "title": "IP Blacklist Check",
    "summary": "Check if sending IPs are listed on major email blacklists",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/blacklists",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/blacklist",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_create_automated_test",
    "title": "Create Automated Placement Test",
    "summary": "Create automated recurring spam test with scheduled monitoring",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/create-automated-test",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/schedule",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": []
  },
  {
    "tool": "smartdelivery_create_folder",
    "title": "Create Folder",
    "summary": "Create new folder for organizing spam tests",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/create-folder",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/folder",
    "capability": {
      "remoteMutation": true
    },
    "params": []
  },
  {
    "tool": "smartdelivery_create_manual_test",
    "title": "Create Manual Placement Test",
    "summary": "Create manual spam test where you send email to SmartLead test inboxes",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/create-manual-test",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/manual",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": []
  },
  {
    "tool": "smartdelivery_delete_folder",
    "title": "Delete Folder",
    "summary": "Delete an empty test folder",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/delete-folder",
    "host": "delivery",
    "method": "DELETE",
    "route": "/spam-test/folder/{folderId}",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": []
  },
  {
    "tool": "smartdelivery_delete_tests_bulk",
    "title": "Delete Tests in Bulk",
    "summary": "Delete multiple spam tests at once by test IDs",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/delete-tests-bulk",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/delete",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": []
  },
  {
    "tool": "smartdelivery_dkim_details",
    "title": "DKIM Details",
    "summary": "Check DKIM configuration status for sender domain authentication",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/dkim-details",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/dkim-details",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_domain_blacklist",
    "title": "Domain Blacklist",
    "summary": "Check if sending domain is blacklisted",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/domain-blacklist",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/domain-blacklist",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_geo_report",
    "title": "Geo-wise Report",
    "summary": "Analyze deliverability by geographic region",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/geo-report",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/report/{spamTestId}/groupwise",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_get_folder_by_id",
    "title": "Get Folder by ID",
    "summary": "Get details for a specific test folder",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/get-folder-by-id",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/folder/{folderId}",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_get_folders",
    "title": "Get All Folders",
    "summary": "List organizational folders for spam tests",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/get-folders",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/folder",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_ip_details",
    "title": "IP Details",
    "summary": "Get comprehensive information about sending IP addresses",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/ip-details",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/ip-analytics",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_list_tests",
    "title": "List All Tests",
    "summary": "List all spam tests with filtering by date, type, and status",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/list-tests",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/report",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_mailbox_count",
    "title": "Mailbox Count",
    "summary": "Get count of test mailboxes by provider",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/mailbox-count",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/mailboxes-count",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_mailbox_summary",
    "title": "Mailbox Summary",
    "summary": "Get high-level summary of all test mailboxes",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/mailbox-summary",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/mailboxes-summary",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_provider_ids",
    "title": "Get Provider IDs",
    "summary": "Get region-wise email provider IDs for spam testing configuration",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/provider-ids",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/seed/providers",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_provider_report",
    "title": "Provider-wise Report",
    "summary": "Get deliverability report by email provider (Gmail, Outlook, Yahoo)",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/provider-report",
    "host": "delivery",
    "method": "POST",
    "route": "/spam-test/report/{spamTestId}/providerwise",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_rdns_report",
    "title": "rDNS Report",
    "summary": "Check reverse DNS configuration for sending IP addresses",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/rdns-report",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/rdns-details",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_reply_headers",
    "title": "Email Reply Headers",
    "summary": "Analyze email headers from test replies for advanced diagnostics",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/reply-headers",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/sender-account-wise/{replyId}/email-headers",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_schedule_history",
    "title": "Schedule History",
    "summary": "Get send history for automated tests with execution log",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/schedule-history",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/schedule-history",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_sender_list",
    "title": "Sender Account List",
    "summary": "List all sender accounts available for spam testing",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/sender-list",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/sender-accounts",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_sender_report",
    "title": "Sender Account Report",
    "summary": "Get performance report by sender email account",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/sender-report",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/sender-account-wise",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_spam_filter_report",
    "title": "Spam Filter Report",
    "summary": "Detailed analysis of which spam filters triggered and why",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/spam-filter-report",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/spam-filter-details",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_spf_details",
    "title": "SPF Details",
    "summary": "Verify SPF record configuration for sender authorization",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/spf-details",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/spf-details",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_stop_automated_test",
    "title": "Stop Automated Test",
    "summary": "Stop a running automated spam test, preserves results",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/stop-automated-test",
    "host": "delivery",
    "method": "PUT",
    "route": "/spam-test/{spamTestId}/stop",
    "capability": {
      "remoteMutation": true
    },
    "params": []
  },
  {
    "tool": "smartdelivery_test_details",
    "title": "Get Spam Test Details",
    "summary": "Get complete spam test results including inbox placement and scores",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/test-details",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/{spamTestId}",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartdelivery_test_email_content",
    "title": "Test Email Content",
    "summary": "Get actual email content from a specific spam test",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-delivery/test-email-content",
    "host": "delivery",
    "method": "GET",
    "route": "/spam-test/report/{spamTestId}/email-content",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartlead_analytics_campaign_list",
    "title": "Get Campaign List",
    "summary": "Retrieve list of all campaigns for building selectors and filtering",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/campaign-list",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/list",
    "capability": {},
    "params": [
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_campaign_performance",
    "title": "Campaign Performance",
    "summary": "Get performance metrics for each campaign with engagement rates and lead counts",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/campaign-performance",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/overall-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "Timezone string (e.g. \"America/New\\_York\"), optional",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs (optional)",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs (optional)",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "Max number of results to return (optional)",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "Pagination offset (optional)",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set (optional)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_campaign_response_stats",
    "title": "Campaign Response Stats",
    "summary": "Get detailed response analysis per campaign with sentiment breakdown",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/campaign-response-stats",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/response-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_campaign_status_stats",
    "title": "Campaign Status Stats",
    "summary": "Get count of campaigns in each status for operational overview",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/campaign-status-stats",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/status-stats",
    "capability": {},
    "params": [
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_client_list",
    "title": "Get Client List",
    "summary": "Get list of all clients for agency account filtering and selection",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/client-list",
    "host": "core",
    "method": "GET",
    "route": "/analytics/client/list",
    "capability": {},
    "params": [
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_client_performance",
    "title": "Client Overall Stats",
    "summary": "Get performance metrics by client for agency reporting and analysis",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/client-performance",
    "host": "core",
    "method": "GET",
    "route": "/analytics/client/overall-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "filter",
        "type": "string",
        "required": false,
        "description": "Filter value for client results",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "Max number of results to return",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "Pagination offset",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_day_wise_positive_reply",
    "title": "Day-wise Positive Reply Stats",
    "summary": "Get daily positive reply metrics filtered to interested/positive categories only",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/day-wise-positive-reply",
    "host": "core",
    "method": "GET",
    "route": "/analytics/day-wise-positive-reply-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_day_wise_positive_sent_time",
    "title": "Positive Reply Stats by Sent Time",
    "summary": "Get positive replies by sent time to optimize sending schedule",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/day-wise-positive-sent-time",
    "host": "core",
    "method": "GET",
    "route": "/analytics/day-wise-positive-reply-stats-by-sent-time",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": true,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_day_wise_sent_time",
    "title": "Day-wise Stats by Sent Time",
    "summary": "Get daily breakdown organized by email sent time for schedule analysis",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/day-wise-sent-time",
    "host": "core",
    "method": "GET",
    "route": "/analytics/day-wise-overall-stats-by-sent-time",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": true,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_day_wise_stats",
    "title": "Get Day-wise Overall Stats",
    "summary": "Get day-by-day email engagement breakdown with daily metrics",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/day-wise-stats",
    "host": "core",
    "method": "GET",
    "route": "/analytics/day-wise-overall-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_domain_wise_health",
    "title": "Domain-wise Health Metrics",
    "summary": "Get performance metrics aggregated by email domain for domain analysis",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/domain-wise-health",
    "host": "core",
    "method": "GET",
    "route": "/analytics/mailbox/domain-wise-health-metrics",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "Max number of results to return",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "Pagination offset",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_email_wise_health",
    "title": "Email-ID-wise Health Metrics",
    "summary": "Get detailed health metrics by individual email account address",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/email-wise-health",
    "host": "core",
    "method": "GET",
    "route": "/analytics/mailbox/name-wise-health-metrics",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "Max number of results to return",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "Pagination offset",
        "in": "query"
      },
      {
        "name": "is_bounced",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" or \"false\" to filter by bounce status",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_followup_reply_rate",
    "title": "Follow-up Reply Rate",
    "summary": "Analyze reply rates specifically for follow-up sequences (2, 3, 4+)",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/followup-reply-rate",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/follow-up-reply-rate",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_lead_category_response",
    "title": "Lead Category-wise Response",
    "summary": "Get lead response breakdown by category type with sentiment distribution",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/lead-category-response",
    "host": "core",
    "method": "GET",
    "route": "/analytics/lead/category-wise-response",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_lead_stats",
    "title": "Lead Statistics",
    "summary": "Get comprehensive lead engagement statistics by status and category",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/lead-stats",
    "host": "core",
    "method": "GET",
    "route": "/analytics/lead/overall-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "Timezone string (e.g. \"America/New\\_York\"), optional",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs (optional)",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs (optional)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_lead_to_reply_time",
    "title": "Lead to Reply Time",
    "summary": "Measure average time from first email sent to first reply received",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/lead-to-reply-time",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/lead-to-reply-time",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_leads_for_first_reply",
    "title": "Leads Take for First Reply",
    "summary": "Calculate average leads contacted before receiving first reply",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/leads-for-first-reply",
    "host": "core",
    "method": "GET",
    "route": "/analytics/campaign/leads-take-for-first-reply",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_mailbox_health",
    "title": "Mailbox Overall Stats",
    "summary": "Get overall health and performance statistics for all mailboxes",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/mailbox-health",
    "host": "core",
    "method": "GET",
    "route": "/analytics/mailbox/overall-stats",
    "capability": {},
    "params": [
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_month_wise_client_count",
    "title": "Get Month-wise Client Count",
    "summary": "Get monthly breakdown of active clients showing growth trends",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/month-wise-client-count",
    "host": "core",
    "method": "GET",
    "route": "/analytics/client/month-wise-count",
    "capability": {},
    "params": [
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_overview",
    "title": "Get Overall Analytics",
    "summary": "Get account-wide overall statistics for date range with sent, opened, replied metrics",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/overview",
    "host": "core",
    "method": "GET",
    "route": "/analytics/overall-stats-v2",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "Timezone string (e.g. \"America/New\\_York\"), optional",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs (optional)",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs (optional)",
        "in": "query"
      },
      {
        "name": "is_agency",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to filter for agency accounts (optional)",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set (optional)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_provider_performance",
    "title": "Provider-wise Performance",
    "summary": "Compare performance across email service providers (Gmail, Outlook, SMTP)",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/provider-performance",
    "host": "core",
    "method": "GET",
    "route": "/analytics/mailbox/provider-wise-overall-performance",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_analytics_team_board_stats",
    "title": "Team Board Stats",
    "summary": "Get performance metrics by team member for collaboration features",
    "docUrl": "https://api.smartlead.ai/api-reference/analytics/team-board-stats",
    "host": "core",
    "method": "GET",
    "route": "/analytics/team-board/overall-stats",
    "capability": {},
    "params": [
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date (YYYY-MM-DD format)",
        "in": "query"
      },
      {
        "name": "timezone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g., \"America/New\\_York\")",
        "in": "query"
      },
      {
        "name": "client_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated client IDs",
        "in": "query"
      },
      {
        "name": "campaign_ids",
        "type": "string",
        "required": false,
        "description": "Comma-separated campaign IDs",
        "in": "query"
      },
      {
        "name": "full_data",
        "type": "string",
        "required": false,
        "description": "Set to \"true\" to return full data set",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaign_statistics_get_by_date_range",
    "title": "Fetch Campaign Statistics by Date Range",
    "summary": "Fetch campaign statistics using the campaign's ID filtered by date range",
    "docUrl": "https://api.smartlead.ai/api-reference/campaign-statistics/get-by-date-range",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/analytics-by-date",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "string",
        "required": true,
        "description": "The ID of the campaign",
        "in": "path"
      },
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "time_zone",
        "type": "string",
        "required": false,
        "description": "IANA timezone string (e.g. \"America/New\\_York\")",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaign_statistics_get_by_id",
    "title": "Fetch Campaign Statistics by Campaign ID",
    "summary": "Fetch campaign statistics using the campaign's ID",
    "docUrl": "https://api.smartlead.ai/api-reference/campaign-statistics/get-by-id",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/statistics",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "string",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "List offset",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "Max number of stats to return (max 1000)",
        "in": "query"
      },
      {
        "name": "email_sequence_number",
        "type": "string",
        "required": false,
        "description": "Single sequence number (min: 1, max: 20)",
        "in": "query"
      },
      {
        "name": "email_status",
        "type": "string",
        "required": false,
        "description": "Filter by email status. Possible values: `opened`, `clicked`, `replied`, `unsubscribed`, `bounced`",
        "enumValues": [
          "opened",
          "clicked",
          "replied",
          "unsubscribed",
          "bounced"
        ],
        "in": "query"
      },
      {
        "name": "sent_time_start_date",
        "type": "string",
        "required": false,
        "description": "Filters campaign stats with sent time greater than this date. Format: `2023-10-16 10:33:02.000Z`",
        "in": "query"
      },
      {
        "name": "sent_time_end_date",
        "type": "string",
        "required": false,
        "description": "Filters campaign stats with sent time less than this date. Format: `2023-10-16 10:33:02.000Z`",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaign_statistics_lead_statistics",
    "title": "Fetch Campaign Lead Statistics",
    "summary": "Fetch campaign lead statistics using the campaign's ID",
    "docUrl": "https://api.smartlead.ai/api-reference/campaign-statistics/lead-statistics",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/leads-statistics",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "string",
        "required": true,
        "description": "The ID of the campaign",
        "in": "path"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "The number of leads you want to fetch in one go (optional, max 100)",
        "in": "query"
      },
      {
        "name": "event_time_gt",
        "type": "string",
        "required": false,
        "description": "Replied/Sent at date in YYYY-MM-DD format. If you want to filter by when the last event for the lead was received by. This can be a reply event, send event etc (optional)",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "Used to paginate lead data (optional)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaign_statistics_mailbox_statistics",
    "title": "Fetch Campaign Mailbox Statistics",
    "summary": "Fetch mailbox statistics specific to a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaign-statistics/mailbox-statistics",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/mailbox-statistics",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "string",
        "required": true,
        "description": "The ID of the campaign",
        "in": "path"
      },
      {
        "name": "client_id",
        "type": "string",
        "required": false,
        "description": "The ID of your client if this campaign is client specific",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "string",
        "required": false,
        "description": "Pagination offset",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "string",
        "required": false,
        "description": "Number of results to return. Min 1, max 20.",
        "in": "query"
      },
      {
        "name": "start_date",
        "type": "string",
        "required": false,
        "description": "Start date for filtering in YYYY-MM-DD format. Both start\\_date and end\\_date must be provided, otherwise data will be for the full campaign length.",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": false,
        "description": "End date for filtering in YYYY-MM-DD format. Both start\\_date and end\\_date must be provided, otherwise data will be for the full campaign length.",
        "in": "query"
      },
      {
        "name": "time_zone",
        "type": "string",
        "required": false,
        "description": "The campaign timezone, e.g. `America/Los_Angeles`. Same format as shown in your campaign UI next to the date filter.",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaign_statistics_top_level_by_date",
    "title": "Fetch Campaign Top Level Analytics by Date Range",
    "summary": "Fetch campaign top-level analytics filtered by date range",
    "docUrl": "https://api.smartlead.ai/api-reference/campaign-statistics/top-level-by-date",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/top-level-analytics-by-date",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "string",
        "required": true,
        "description": "The ID of the campaign",
        "in": "path"
      },
      {
        "name": "start_date",
        "type": "string",
        "required": true,
        "description": "Start date in YYYY-MM-DD format",
        "in": "query"
      },
      {
        "name": "end_date",
        "type": "string",
        "required": true,
        "description": "End date in YYYY-MM-DD format",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_add_email_accounts",
    "title": "Add Email Accounts to Campaign",
    "summary": "Associates one or more email accounts with a campaign for automatic sender rotation.",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/add-email-accounts",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/email-accounts",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The campaign ID",
        "in": "path"
      },
      {
        "name": "email_account_ids",
        "type": "array",
        "required": true,
        "description": "Array of email account IDs to add to the campaign Example: `[456, 457, 458]`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_all_leads_activities",
    "title": "Get All Leads Activities",
    "summary": "Retrieve lead activities across all campaigns for the authenticated user",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/all-leads-activities",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/all-leads-activities",
    "capability": {},
    "params": [
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Pagination offset (min 0)",
        "in": "query"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Records per page (min 1, max 1000)",
        "in": "query"
      },
      {
        "name": "event_time_from",
        "type": "string",
        "required": false,
        "description": "Filter activities from this date (ISO 8601)",
        "in": "query"
      },
      {
        "name": "event_time_to",
        "type": "string",
        "required": false,
        "description": "Filter activities until this date (ISO 8601)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_create_subsequence",
    "title": "Create Subsequence Campaign",
    "summary": "Create a child campaign (subsequence) with conditional logic",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/create-subsequence",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/create-subsequence",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "parent_campaign_id",
        "type": "number",
        "required": true,
        "description": "Parent campaign ID",
        "in": "body"
      },
      {
        "name": "subsequence_name",
        "type": "string",
        "required": false,
        "description": "Name for the subsequence campaign",
        "in": "body"
      },
      {
        "name": "condition_events",
        "type": "array",
        "required": false,
        "description": "Events that trigger moving lead to subsequence",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_delete",
    "title": "Delete Campaign",
    "summary": "Permanently and irreversibly deletes a campaign and ALL associated data: sequences, lead-campaign mappings, email statis",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/delete",
    "host": "core",
    "method": "DELETE",
    "route": "/campaigns/{campaign_id}",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The ID of the campaign to delete",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_delete_lead",
    "title": "Delete Lead from Campaign",
    "summary": "Remove a lead from a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/delete-lead",
    "host": "core",
    "method": "DELETE",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID to delete",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_delete_webhook",
    "title": "Delete Campaign Webhook",
    "summary": "Remove a webhook from a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/delete-webhook",
    "host": "core",
    "method": "DELETE",
    "route": "/campaigns/{campaign_id}/webhooks/{webhook_id}",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "webhook_id",
        "type": "number",
        "required": true,
        "description": "Webhook ID to delete",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_duplicate",
    "title": "Duplicate Campaign",
    "summary": "Creates a copy of an existing campaign including sequences, settings, and optionally sub-sequences and client labels.",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/duplicate",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/duplicate",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "ID of the campaign to duplicate",
        "in": "path"
      },
      {
        "name": "duplicate_sub_sequence",
        "type": "boolean",
        "required": false,
        "description": "Whether to also duplicate sub-sequences (conditional follow-up sequences) attached to the campaign. Defaults to `false` if not provided.",
        "in": "body"
      },
      {
        "name": "duplicate_client_label",
        "type": "boolean",
        "required": false,
        "description": "Whether to retain the same client association on the duplicated campaign. Useful for agency accounts that want the copy assigned to the same client. Defaults to `false` if not provided.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_export_leads",
    "title": "Export Campaign Leads",
    "summary": "Export all campaign leads as CSV file",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/export-leads",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/leads-export",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_forward_email",
    "title": "Forward Campaign Email",
    "summary": "Forward a campaign email to other recipients",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/forward-email",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/forward-email",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_get_email_accounts",
    "title": "Get Campaign Email Accounts",
    "summary": "Retrieves all email accounts (sender accounts) associated with and actively rotating for this specific campaign.",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/get-email-accounts",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/email-accounts",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The campaign ID",
        "in": "path"
      },
      {
        "name": "include_tags",
        "type": "boolean",
        "required": false,
        "description": "Include email account tags in response",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_get_lead_by_id",
    "title": "Get Lead by ID",
    "summary": "Retrieve detailed information about a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/get-lead-by-id",
    "host": "core",
    "method": "GET",
    "route": "/leads/{lead_id}",
    "capability": {},
    "params": [
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_get_lead_history",
    "title": "Get Lead Message History",
    "summary": "Retrieve complete email conversation history for a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/get-lead-history",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}/message-history",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID",
        "in": "path"
      },
      {
        "name": "event_time_gt",
        "type": "string",
        "required": false,
        "description": "Filter messages after this timestamp (ISO 8601)",
        "in": "query"
      },
      {
        "name": "show_plain_text_response",
        "type": "boolean",
        "required": false,
        "description": "Include plain text version of emails",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_get_sequences",
    "title": "Get Campaign Sequences",
    "summary": "Retrieves all email sequences configured for a campaign, ordered by sequence number.",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/get-sequences",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/sequences",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The campaign ID",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_get_webhook_summary",
    "title": "Get Webhook Summary",
    "summary": "Get webhook execution summary and statistics for a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/get-webhook-summary",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaignId}/webhooks/summary",
    "capability": {},
    "params": [
      {
        "name": "campaignId",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "fromTime",
        "type": "string",
        "required": true,
        "description": "Start date in ISO format (e.g. `2024-01-01T00:00:00.000Z`)",
        "in": "query"
      },
      {
        "name": "toTime",
        "type": "string",
        "required": true,
        "description": "End date in ISO format (e.g. `2024-01-31T23:59:59.999Z`)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_get_webhooks",
    "title": "Get Campaign Webhooks",
    "summary": "Retrieve all webhooks configured for a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/get-webhooks",
    "host": "core",
    "method": "GET",
    "route": "/campaigns/{campaign_id}/webhooks",
    "capability": {},
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_mark_lead_complete",
    "title": "Mark Lead as Complete",
    "summary": "Manually mark a lead as completed in the campaign sequence",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/mark-lead-complete",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_map_id}/manual-complete",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead map ID (campaign\\_lead\\_map\\_id from other endpoints)",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_pause_lead",
    "title": "Pause Campaign Lead",
    "summary": "Temporarily pause a specific lead in a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/pause-lead",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}/pause",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID to pause",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_remove_email_accounts",
    "title": "Remove Email Accounts from Campaign",
    "summary": "Disassociates email accounts from a campaign's sender rotation pool.",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/remove-email-accounts",
    "host": "core",
    "method": "DELETE",
    "route": "/campaigns/{campaign_id}/email-accounts",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The campaign ID",
        "in": "path"
      },
      {
        "name": "email_account_ids",
        "type": "array",
        "required": true,
        "description": "Array of email account IDs to remove Example: `[456, 457]`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_reply_email_thread",
    "title": "Reply to Campaign Lead",
    "summary": "Send a reply email to a lead within campaign context",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/reply-email-thread",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/reply-email-thread",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "email_stats_id",
        "type": "string",
        "required": true,
        "description": "Email statistics ID of the message to reply to",
        "in": "body"
      },
      {
        "name": "email_body",
        "type": "string",
        "required": true,
        "description": "Reply email body content",
        "in": "body"
      },
      {
        "name": "to_email",
        "type": "string",
        "required": false,
        "description": "Recipient email (optional, defaults to lead email)",
        "in": "body"
      },
      {
        "name": "to_first_name",
        "type": "string",
        "required": false,
        "description": "Recipient first name",
        "in": "body"
      },
      {
        "name": "to_last_name",
        "type": "string",
        "required": false,
        "description": "Recipient last name",
        "in": "body"
      },
      {
        "name": "scheduled_time",
        "type": "string",
        "required": false,
        "description": "Schedule reply for later (ISO 8601)",
        "in": "body"
      },
      {
        "name": "reply_message_id",
        "type": "string",
        "required": false,
        "description": "Message ID being replied to",
        "in": "body"
      },
      {
        "name": "reply_email_body",
        "type": "string",
        "required": false,
        "description": "Original email body (for context)",
        "in": "body"
      },
      {
        "name": "reply_email_time",
        "type": "string",
        "required": false,
        "description": "Original email timestamp",
        "in": "body"
      },
      {
        "name": "cc",
        "type": "string",
        "required": false,
        "description": "CC recipients (comma-separated)",
        "in": "body"
      },
      {
        "name": "bcc",
        "type": "string",
        "required": false,
        "description": "BCC recipients (comma-separated)",
        "in": "body"
      },
      {
        "name": "schedule_condition",
        "type": "string",
        "required": false,
        "description": "Scheduling condition",
        "in": "body"
      },
      {
        "name": "add_signature",
        "type": "boolean",
        "required": false,
        "description": "Include email signature",
        "in": "body"
      },
      {
        "name": "seq_type",
        "type": "string",
        "required": false,
        "description": "Sequence type",
        "in": "body"
      },
      {
        "name": "attachments",
        "type": "array",
        "required": false,
        "description": "File attachments File name",
        "in": "body"
      },
      {
        "name": "file_url",
        "type": "string",
        "required": true,
        "description": "File URL",
        "in": "body"
      },
      {
        "name": "file_type",
        "type": "string",
        "required": false,
        "description": "MIME type",
        "in": "body"
      },
      {
        "name": "file_size",
        "type": "number",
        "required": false,
        "description": "File size in bytes",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_resume_lead",
    "title": "Resume Campaign Lead",
    "summary": "Resume a paused lead with optional delay",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/resume-lead",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}/resume",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID to resume",
        "in": "path"
      },
      {
        "name": "resume_lead_with_delay_days",
        "type": "number",
        "required": false,
        "description": "Optional delay in days before resuming (nullable)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_retrigger_webhooks",
    "title": "Retrigger Campaign Webhooks",
    "summary": "Manually retry failed webhook deliveries",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/retrigger-webhooks",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaignId}/webhooks/retrigger-failed-events",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaignId",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "fromTime",
        "type": "string",
        "required": true,
        "description": "Start date in ISO format (e.g. `2024-01-01T00:00:00.000Z`)",
        "in": "body"
      },
      {
        "name": "toTime",
        "type": "string",
        "required": true,
        "description": "End date in ISO format (e.g. `2024-01-31T23:59:59.999Z`)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_save_webhooks",
    "title": "Create/Update Campaign Webhook",
    "summary": "Create a new webhook or update existing webhook for campaign events",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/save-webhooks",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/webhooks",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "id",
        "type": "number",
        "required": false,
        "description": "Webhook ID (null for new webhook, number to update existing)",
        "in": "body"
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Webhook name for identification",
        "in": "body"
      },
      {
        "name": "webhook_url",
        "type": "string",
        "required": true,
        "description": "URL to receive webhook POST requests",
        "in": "body"
      },
      {
        "name": "event_types",
        "type": "array",
        "required": true,
        "description": "Array of event types to trigger webhook Common events: * `LEAD_REPLIED` * `LEAD_OPENED` * `LEAD_CLICKED` * `LEAD_BOUNCED` * `LEAD_UNSUBSCRIBED`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_send_test_email",
    "title": "Send Test Email",
    "summary": "Send a test email from a specific sequence to verify content and deliverability",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/send-test-email",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/send-test-email",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "leadId",
        "type": "number",
        "required": true,
        "description": "Lead ID to use for personalization variables",
        "in": "body"
      },
      {
        "name": "sequenceNumber",
        "type": "number",
        "required": true,
        "description": "Which sequence to test (1, 2, 3, etc.)",
        "in": "body"
      },
      {
        "name": "selectedEmailAccountId",
        "type": "number",
        "required": false,
        "description": "Specific email account to send from (optional)",
        "in": "body"
      },
      {
        "name": "customEmailAddress",
        "type": "string",
        "required": false,
        "description": "Custom recipient email (if different from lead's email)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_unsubscribe_lead",
    "title": "Unsubscribe Lead from Campaign",
    "summary": "Unsubscribe a lead from a campaign to stop all future emails",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/unsubscribe-lead",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}/unsubscribe",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID to unsubscribe",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_lead",
    "title": "Update Campaign Lead Details",
    "summary": "Update lead information including contact details and custom fields",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-lead",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}/",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID",
        "in": "path"
      },
      {
        "name": "email",
        "type": "string",
        "required": true,
        "description": "Lead email address",
        "in": "body"
      },
      {
        "name": "first_name",
        "type": "string",
        "required": false,
        "description": "First name",
        "in": "body"
      },
      {
        "name": "last_name",
        "type": "string",
        "required": false,
        "description": "Last name",
        "in": "body"
      },
      {
        "name": "company_name",
        "type": "string",
        "required": false,
        "description": "Company name",
        "in": "body"
      },
      {
        "name": "phone_number",
        "type": "string",
        "required": false,
        "description": "Phone number",
        "in": "body"
      },
      {
        "name": "website",
        "type": "string",
        "required": false,
        "description": "Website URL",
        "in": "body"
      },
      {
        "name": "location",
        "type": "string",
        "required": false,
        "description": "Geographic location",
        "in": "body"
      },
      {
        "name": "linkedin_profile",
        "type": "string",
        "required": false,
        "description": "LinkedIn profile URL",
        "in": "body"
      },
      {
        "name": "company_url",
        "type": "string",
        "required": false,
        "description": "Company website",
        "in": "body"
      },
      {
        "name": "custom_fields",
        "type": "object",
        "required": false,
        "description": "Custom field key-value pairs (max 200 fields)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_lead_category",
    "title": "Update Lead Category in Campaign",
    "summary": "Assign or change the category for a lead within a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-lead-category",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}/category",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID",
        "in": "path"
      },
      {
        "name": "category_id",
        "type": "number",
        "required": false,
        "description": "Category ID to assign (use `null` to remove category)",
        "in": "body"
      },
      {
        "name": "pause_lead",
        "type": "boolean",
        "required": false,
        "description": "Pause the lead after categorizing",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_lead_email_account",
    "title": "Update Lead Email Account",
    "summary": "Change which email account is used to send to a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-lead-email-account",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/update-lead-email-account",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "New email account ID to use",
        "in": "body"
      },
      {
        "name": "email_campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "body"
      },
      {
        "name": "email_lead_id",
        "type": "number",
        "required": true,
        "description": "Lead ID",
        "in": "body"
      },
      {
        "name": "override_lead_email_account",
        "type": "boolean",
        "required": false,
        "description": "Force override even if lead has specific account assigned",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_schedule",
    "title": "Update Campaign Schedule",
    "summary": "Configures when and how frequently campaign emails are sent.",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-schedule",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/schedule",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The ID of the campaign to update",
        "in": "path"
      },
      {
        "name": "schedule",
        "type": "object",
        "required": true,
        "description": "Sending schedule configuration IANA timezone (e.g., \"America/New\\_York\", \"Europe/London\")",
        "in": "body"
      },
      {
        "name": "days",
        "type": "array",
        "required": true,
        "description": "Days of week to send (0=Sunday, 1=Monday, ..., 6=Saturday) Example: `[1, 2, 3, 4, 5]` for Monday-Friday",
        "in": "body"
      },
      {
        "name": "start_hour",
        "type": "string",
        "required": true,
        "description": "Start sending time (24-hour format, e.g., \"09:00\")",
        "in": "body"
      },
      {
        "name": "end_hour",
        "type": "string",
        "required": true,
        "description": "Stop sending time (24-hour format, e.g., \"17:00\")",
        "in": "body"
      },
      {
        "name": "min_time_btw_emails",
        "type": "number",
        "required": false,
        "description": "Minimum minutes between consecutive emails",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_sequences",
    "title": "Update Campaign Sequences",
    "summary": "Create or update email sequences for multi-step campaigns",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-sequences",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/sequences",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The campaign ID",
        "in": "path"
      },
      {
        "name": "sequences",
        "type": "array",
        "required": true,
        "description": "Array of sequence objects Sequence ID (null for new, number for update)",
        "in": "body"
      },
      {
        "name": "seq_number",
        "type": "number",
        "required": true,
        "description": "Sequence position (1, 2, 3, etc.)",
        "in": "body"
      },
      {
        "name": "subject",
        "type": "string",
        "required": false,
        "description": "Email subject line (can include {{variables}})",
        "in": "body"
      },
      {
        "name": "email_body",
        "type": "string",
        "required": true,
        "description": "Email content (supports HTML and {{variables}})",
        "in": "body"
      },
      {
        "name": "seq_delay_details",
        "type": "object",
        "required": true,
        "description": "Delay configuration Days to wait before sending",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_settings",
    "title": "Update Campaign Settings",
    "summary": "Updates campaign configuration including: tracking settings (enable/disable opens and clicks - array format with DONT_EM",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-settings",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/settings",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The ID of the campaign to update",
        "in": "path"
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Campaign name",
        "in": "body"
      },
      {
        "name": "track_settings",
        "type": "array",
        "required": false,
        "description": "Email tracking configuration. Pass an array of string values to disable specific tracking. Allowed values: `DONT_TRACK_EMAIL_OPEN`, `DONT_TRACK_LINK_CLICK`, `DONT_TRACK_REPLY_TO_AN_EMAIL`. Pass an empty array `[]` to enable all tracking.",
        "in": "body"
      },
      {
        "name": "stop_lead_settings",
        "type": "string",
        "required": false,
        "description": "When to stop emailing a lead. Allowed values: `CLICK_ON_A_LINK`, `OPEN_AN_EMAIL`",
        "enumValues": [
          "CLICK_ON_A_LINK",
          "OPEN_AN_EMAIL"
        ],
        "in": "body"
      },
      {
        "name": "unsubscribe_text",
        "type": "string",
        "required": false,
        "description": "Unsubscribe text to append to emails",
        "in": "body"
      },
      {
        "name": "send_as_plain_text",
        "type": "boolean",
        "required": false,
        "description": "Send emails as plain text (no HTML)",
        "in": "body"
      },
      {
        "name": "force_plain_text",
        "type": "boolean",
        "required": false,
        "description": "Force convert all emails to plain text",
        "in": "body"
      },
      {
        "name": "follow_up_percentage",
        "type": "string",
        "required": false,
        "description": "Follow-up percentage (0-100)",
        "in": "body"
      },
      {
        "name": "client_id",
        "type": "string",
        "required": false,
        "description": "Client ID. Leave as null if not needed",
        "in": "body"
      },
      {
        "name": "enable_ai_esp_matching",
        "type": "boolean",
        "required": false,
        "description": "Use AI to match leads with best email accounts",
        "in": "body"
      },
      {
        "name": "auto_pause_domain_leads_on_reply",
        "type": "boolean",
        "required": false,
        "description": "Pause leads from same domain after reply",
        "in": "body"
      },
      {
        "name": "ignore_ss_mailbox_sending_limit",
        "type": "boolean",
        "required": false,
        "description": "Ignore SmartSenders mailbox sending limit",
        "in": "body"
      },
      {
        "name": "bounce_autopause_threshold",
        "type": "string",
        "required": false,
        "description": "Bounce auto-pause threshold",
        "in": "body"
      },
      {
        "name": "domain_level_rate_limit",
        "type": "boolean",
        "required": false,
        "description": "Enable domain-level rate limiting",
        "in": "body"
      },
      {
        "name": "out_of_office_detection_settings",
        "type": "object",
        "required": false,
        "description": "Out of office detection configuration When true, out-of-office responses are not counted as replies and will not stop the sequence",
        "in": "body"
      },
      {
        "name": "autoReactivateOOO",
        "type": "boolean",
        "required": false,
        "description": "Automatically reactivate leads after their out-of-office period ends",
        "in": "body"
      },
      {
        "name": "reactivateOOOwithDelay",
        "type": "number",
        "required": false,
        "description": "Number of days to wait before reactivating a lead after an out-of-office response",
        "in": "body"
      },
      {
        "name": "autoCategorizeOOO",
        "type": "boolean",
        "required": false,
        "description": "Automatically categorize out-of-office replies using AI",
        "in": "body"
      },
      {
        "name": "add_unsubscribe_tag",
        "type": "boolean",
        "required": false,
        "description": "Add an unsubscribe tag to outgoing emails",
        "in": "body"
      },
      {
        "name": "ai_categorisation_options",
        "type": "array",
        "required": false,
        "description": "AI categorisation options",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_campaigns_update_team_member",
    "title": "Update Campaign Team Member",
    "summary": "Assign or change the team member responsible for a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/campaigns/update-team-member",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/team-member",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID",
        "in": "path"
      },
      {
        "name": "teamMemberId",
        "type": "number",
        "required": false,
        "description": "Team member ID to assign (use `null` to unassign)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_clients_api_keys",
    "title": "Manage Client API Keys",
    "summary": "Create, list, delete, and reset API keys for client sub-accounts",
    "docUrl": "https://api.smartlead.ai/api-reference/clients/api-keys",
    "host": "core",
    "method": "POST",
    "route": "/client/api-key",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The ID of the API key to delete",
        "in": "path"
      },
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The ID of the API key to reset. This generates a new key value while keeping the same key record.",
        "in": "path"
      },
      {
        "name": "clientId",
        "type": "number",
        "required": false,
        "description": "Filter by client ID",
        "in": "query"
      },
      {
        "name": "status",
        "type": "string",
        "required": false,
        "description": "Filter by key status. Values: `active`, `inactive`",
        "enumValues": [
          "active",
          "inactive"
        ],
        "in": "query"
      },
      {
        "name": "keyName",
        "type": "string",
        "required": false,
        "description": "Filter by key name (partial match)",
        "in": "query"
      },
      {
        "name": "clientId",
        "type": "number",
        "required": true,
        "description": "The ID of the client to create the API key for",
        "in": "body"
      },
      {
        "name": "keyName",
        "type": "string",
        "required": true,
        "description": "A descriptive name for the API key. Must match pattern: letters, numbers, spaces, hyphens, and underscores only.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_clients_create",
    "title": "Create Client",
    "summary": "Create a new client (whitelabel sub-account) under your account",
    "docUrl": "https://api.smartlead.ai/api-reference/clients/create",
    "host": "core",
    "method": "POST",
    "route": "/client/save",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email",
        "type": "string",
        "required": true,
        "description": "Client email address. Must be unique across the platform.",
        "in": "body"
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Client display name (company or brand name)",
        "in": "body"
      },
      {
        "name": "logo",
        "type": "string",
        "required": false,
        "description": "Base64 encoded logo image for whitelabel branding",
        "in": "body"
      },
      {
        "name": "logo_url",
        "type": "string",
        "required": false,
        "description": "URL to the client logo image for whitelabel branding",
        "in": "body"
      },
      {
        "name": "permission",
        "type": "array",
        "required": false,
        "description": "Array of permission strings defining what the client can access. Controls feature visibility and access.",
        "in": "body"
      },
      {
        "name": "is_credit_assigned",
        "type": "boolean",
        "required": false,
        "description": "Whether email/lead credits are specifically assigned to this client",
        "in": "body"
      },
      {
        "name": "email_credits",
        "type": "number",
        "required": false,
        "description": "Number of email credits allocated to this client (when `is_credit_assigned` is true)",
        "in": "body"
      },
      {
        "name": "lead_credits",
        "type": "number",
        "required": false,
        "description": "Number of lead credits allocated to this client (when `is_credit_assigned` is true)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_clients_get_all",
    "title": "Get All Clients",
    "summary": "Retrieve all client sub-accounts under your main account",
    "docUrl": "https://api.smartlead.ai/api-reference/clients/get-all",
    "host": "core",
    "method": "GET",
    "route": "/client/",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartlead_email_account_tags_assign",
    "title": "Assign Tags to Email Accounts",
    "summary": "Add tags to one or more email accounts",
    "docUrl": "https://api.smartlead.ai/api-reference/email-account-tags/assign",
    "host": "core",
    "method": "POST",
    "route": "/email-accounts/tag-mapping",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_ids",
        "type": "array",
        "required": true,
        "description": "Array of email account IDs to tag. Minimum 1, maximum 25 accounts.",
        "in": "body"
      },
      {
        "name": "tag_ids",
        "type": "array",
        "required": true,
        "description": "Array of tag IDs to assign. Minimum 1 tag required.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_account_tags_create",
    "title": "Update Email Account Tag",
    "summary": "Update an existing email account tag's name and color",
    "docUrl": "https://api.smartlead.ai/api-reference/email-account-tags/create",
    "host": "core",
    "method": "POST",
    "route": "/email-accounts/tag-manager",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "Tag ID of the existing tag to update. Get tag IDs from [Get All Tags](/api-reference/email-account-tags/get-all).",
        "in": "body"
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Tag display name",
        "in": "body"
      },
      {
        "name": "color",
        "type": "string",
        "required": true,
        "description": "Hex color code for the tag (e.g., `#FF5733`). Must be a valid 6-character hex color with `#` prefix.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_account_tags_create_new",
    "title": "Create Tag",
    "summary": "Create a new email account tag with a name and optional color",
    "docUrl": "https://api.smartlead.ai/api-reference/email-account-tags/create-new",
    "host": "core",
    "method": "POST",
    "route": "/tags",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Display name for the tag",
        "in": "body"
      },
      {
        "name": "color",
        "type": "string",
        "required": false,
        "description": "Hex color code for the tag (e.g., `#FF5733`). Must be a valid 6-character hex color with `#` prefix. If not provided, a default color will be assigned.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_account_tags_get_all",
    "title": "Get Email Account Tags",
    "summary": "Get tags associated with specific email accounts by email address",
    "docUrl": "https://api.smartlead.ai/api-reference/email-account-tags/get-all",
    "host": "core",
    "method": "POST",
    "route": "/email-accounts/tag-list",
    "capability": {},
    "params": [
      {
        "name": "email_ids",
        "type": "array",
        "required": true,
        "description": "Array of email address strings to look up. Minimum 1 email required.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_account_tags_remove",
    "title": "Remove Tags from Email Accounts",
    "summary": "Remove tags from one or more email accounts",
    "docUrl": "https://api.smartlead.ai/api-reference/email-account-tags/remove",
    "host": "core",
    "method": "DELETE",
    "route": "/email-accounts/tag-mapping",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_ids",
        "type": "array",
        "required": true,
        "description": "Array of email account IDs to remove tags from. Minimum 1 required.",
        "in": "body"
      },
      {
        "name": "tag_ids",
        "type": "array",
        "required": true,
        "description": "Array of tag IDs to remove. Minimum 1 required.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_delete",
    "title": "Delete Email Account",
    "summary": "Delete an email account and remove it from all campaigns",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/delete",
    "host": "core",
    "method": "DELETE",
    "route": "/email-accounts/{email_account_id}",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to delete",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_get_by_id",
    "title": "Get Email Account by ID",
    "summary": "Retrieve complete configuration, credentials, and warmup details for a specific email account",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/get-by-id",
    "host": "core",
    "method": "GET",
    "route": "/email-accounts/{email_account_id}/",
    "capability": {},
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to retrieve",
        "in": "path"
      },
      {
        "name": "fetch_campaigns",
        "type": "boolean",
        "required": false,
        "description": "If `true`, includes array of campaign IDs using this email account",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_suspend",
    "title": "Suspend Email Account",
    "summary": "Temporarily suspend an email account from all sending activities including campaigns and warmup",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/suspend",
    "host": "core",
    "method": "PUT",
    "route": "/email-accounts/suspend/{email_account_id}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to suspend",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_tags",
    "title": "Get All Tags",
    "summary": "Retrieve all inbox tags belonging to the authenticated user",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/tags",
    "host": "core",
    "method": "GET",
    "route": "/email-accounts/tags",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartlead_email_accounts_unsuspend",
    "title": "Unsuspend Email Account",
    "summary": "Reactivate a suspended email account and restore sending capabilities",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/unsuspend",
    "host": "core",
    "method": "DELETE",
    "route": "/email-accounts/unsuspend/{email_account_id}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to unsuspend",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_update",
    "title": "Update Email Account",
    "summary": "Update email account settings including sending limits, tracking domain, signature, and client association",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/update",
    "host": "core",
    "method": "POST",
    "route": "/email-accounts/{email_account_id}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to update",
        "in": "path"
      },
      {
        "name": "max_email_per_day",
        "type": "number",
        "required": false,
        "description": "Maximum emails allowed per day (including warmup and campaign emails)",
        "in": "body"
      },
      {
        "name": "from_name",
        "type": "string",
        "required": false,
        "description": "Display name for outgoing emails",
        "in": "body"
      },
      {
        "name": "custom_tracking_url",
        "type": "string",
        "required": false,
        "description": "Custom domain for tracking links (e.g., \"track.yourdomain.com\")",
        "in": "body"
      },
      {
        "name": "bcc",
        "type": "string",
        "required": false,
        "description": "BCC email address for all outgoing emails",
        "in": "body"
      },
      {
        "name": "signature",
        "type": "string",
        "required": false,
        "description": "Email signature HTML",
        "in": "body"
      },
      {
        "name": "client_id",
        "type": "number",
        "required": false,
        "description": "Client ID to associate this email account with (for multi-tenant accounts)",
        "in": "body"
      },
      {
        "name": "time_to_wait_in_mins",
        "type": "number",
        "required": false,
        "description": "Minimum time to wait between emails in minutes",
        "in": "body"
      },
      {
        "name": "is_suspended",
        "type": "boolean",
        "required": false,
        "description": "Whether to suspend or unsuspend the account",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_warmup_settings",
    "title": "Update Warmup Settings",
    "summary": "Configure email warmup parameters to gradually build sender reputation",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/warmup-settings",
    "host": "core",
    "method": "POST",
    "route": "/email-accounts/{email_account_id}/warmup",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to configure warmup for",
        "in": "path"
      },
      {
        "name": "warmup_enabled",
        "type": "boolean",
        "required": true,
        "description": "Whether to enable or disable warmup for this account",
        "in": "body"
      },
      {
        "name": "total_warmup_per_day",
        "type": "number",
        "required": false,
        "description": "Number of warmup emails to send per day (minimum: 1, maximum: 50)",
        "min": 1,
        "max": 50,
        "in": "body"
      },
      {
        "name": "daily_rampup",
        "type": "number",
        "required": false,
        "description": "Daily increase in warmup email count (minimum: 5, maximum: 20)",
        "min": 5,
        "max": 20,
        "in": "body"
      },
      {
        "name": "reply_rate_percentage",
        "type": "number",
        "required": false,
        "description": "Target reply rate percentage for warmup emails (minimum: 20, maximum: 100)",
        "min": 20,
        "max": 100,
        "in": "body"
      },
      {
        "name": "warmup_key_id",
        "type": "string",
        "required": false,
        "description": "Warmup service key identifier",
        "in": "body"
      },
      {
        "name": "auto_adjust_warmup",
        "type": "boolean",
        "required": false,
        "description": "Whether to automatically adjust warmup volume based on performance",
        "in": "body"
      },
      {
        "name": "is_rampup_enabled",
        "type": "boolean",
        "required": false,
        "description": "Whether to enable gradual rampup of warmup volume",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_email_accounts_warmup_stats",
    "title": "Get Warmup Statistics",
    "summary": "Retrieve daily warmup performance statistics for the past 7 days",
    "docUrl": "https://api.smartlead.ai/api-reference/email-accounts/warmup-stats",
    "host": "core",
    "method": "GET",
    "route": "/email-accounts/{email_account_id}/warmup-stats",
    "capability": {},
    "params": [
      {
        "name": "email_account_id",
        "type": "number",
        "required": true,
        "description": "The email account ID to retrieve warmup stats for",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_block_domains",
    "title": "Block Email Domains",
    "summary": "Block one or more email domains to prevent future outreach",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/block-domains",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/block-domains",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "domains",
        "type": "array",
        "required": true,
        "description": "Array of domain strings to block (minimum 1 domain) Examples: `[\"spam.com\", \"invalid.com\", \"bounces.net\"]`",
        "in": "body"
      },
      {
        "name": "source",
        "type": "string",
        "required": false,
        "description": "Block source for tracking: `manual`, `bounce`, `complaint`, or `invalid`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_create_note",
    "title": "Create Lead Note",
    "summary": "Add a note to a lead's record for team collaboration and context",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/create-note",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/create-note",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead-campaign mapping ID",
        "in": "body"
      },
      {
        "name": "note_message",
        "type": "string",
        "required": true,
        "description": "Note content",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_create_task",
    "title": "Create Lead Task",
    "summary": "Create a task associated with a lead for follow-up management",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/create-task",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/create-task",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead-campaign mapping ID",
        "in": "body"
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Task title/name",
        "in": "body"
      },
      {
        "name": "description",
        "type": "string",
        "required": false,
        "description": "Detailed task notes (optional)",
        "in": "body"
      },
      {
        "name": "priority",
        "type": "string",
        "required": false,
        "description": "Task priority: `LOW`, `MEDIUM`, or `HIGH`",
        "in": "body"
      },
      {
        "name": "due_date",
        "type": "string",
        "required": false,
        "description": "Due date in ISO 8601 format (optional)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_archived",
    "title": "Get Archived Emails",
    "summary": "Retrieve archived conversations removed from active inbox",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-archived",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/archived",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full thread history",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Pagination offset",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Records per page (1-20)",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Standard inbox filters - campaignId max 5, emailAccountId max 10",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "`REPLY_TIME_DESC` or `SENT_TIME_DESC`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_assigned",
    "title": "Get Assigned to Me",
    "summary": "Retrieve all emails and conversations assigned to the authenticated user",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-assigned",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/assigned-me",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full email thread history. Set to `true` to get complete conversation context.",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Number of records to skip for pagination. Must be non-negative.",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Number of records to return per page. Must be between 1 and 20.",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Advanced filtering options Search term to filter emails by lead email, name, or content. Max 30 characters.",
        "in": "body"
      },
      {
        "name": "filters.leadCategories",
        "type": "object",
        "required": false,
        "description": "Filter by lead category assignment Include leads without category assignment",
        "in": "body"
      },
      {
        "name": "leadCategories.isAssigned",
        "type": "boolean",
        "required": false,
        "description": "Include leads with category assignment",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsNotIn",
        "type": "array",
        "required": false,
        "description": "Exclude specific category IDs (max 10 items)",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsIn",
        "type": "array",
        "required": false,
        "description": "Include only specific category IDs (max 10 items)",
        "in": "body"
      },
      {
        "name": "filters.emailStatus",
        "type": "string",
        "required": false,
        "description": "Filter by email engagement status. Valid values: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied`",
        "enumValues": [
          "Opened",
          "Clicked",
          "Replied",
          "Unsubscribed",
          "Bounced",
          "Accepted",
          "Not Replied"
        ],
        "in": "body"
      },
      {
        "name": "filters.campaignId",
        "type": "number",
        "required": false,
        "description": "Filter by specific campaign ID (single value only for this endpoint)",
        "in": "body"
      },
      {
        "name": "filters.emailAccountId",
        "type": "number",
        "required": false,
        "description": "Filter by specific email account ID (single value only)",
        "in": "body"
      },
      {
        "name": "filters.campaignTeamMemberId",
        "type": "number",
        "required": false,
        "description": "Filter by specific team member ID (single value only)",
        "in": "body"
      },
      {
        "name": "filters.campaignTagId",
        "type": "number",
        "required": false,
        "description": "Filter by campaign tag ID (single value only)",
        "in": "body"
      },
      {
        "name": "filters.campaignClientId",
        "type": "number",
        "required": false,
        "description": "Filter by client ID (single value only)",
        "in": "body"
      },
      {
        "name": "filters.replyTimeBetween",
        "type": "array",
        "required": false,
        "description": "Date range filter for reply times. Array of 2 ISO 8601 datetime strings: `[\"2025-01-01T00:00:00Z\", \"2025-01-31T23:59:59Z\"]`",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "Sort order for results * `REPLY_TIME_DESC`: Most recent replies first (default) * `SENT_TIME_DESC`: Most recently sent emails first",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_by_id",
    "title": "Get Inbox Item by ID",
    "summary": "Fetch a specific master inbox item by its unique identifier",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-by-id",
    "host": "core",
    "method": "GET",
    "route": "/master-inbox/{id}",
    "capability": {},
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The unique identifier of the master inbox item. This is the `campaign_lead_map_id` from other inbox endpoints.",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_important",
    "title": "Get Important Emails",
    "summary": "Retrieve emails marked as important to prioritize high-value conversations",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-important",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/important",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full email thread history * `false`: Only latest message (recommended for list views) * `true`: Complete conversation thread",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Number of records to skip for pagination",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Number of records per page (1-20)",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Advanced filtering options Search term (max 30 characters)",
        "in": "body"
      },
      {
        "name": "filters.leadCategories",
        "type": "object",
        "required": false,
        "description": "Filter by lead category Include uncategorized leads",
        "in": "body"
      },
      {
        "name": "leadCategories.isAssigned",
        "type": "boolean",
        "required": false,
        "description": "Include categorized leads",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsNotIn",
        "type": "array",
        "required": false,
        "description": "Exclude categories (max 10)",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsIn",
        "type": "array",
        "required": false,
        "description": "Include only specific categories (max 10)",
        "in": "body"
      },
      {
        "name": "filters.emailStatus",
        "type": "string",
        "required": false,
        "description": "Email engagement status: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied`",
        "in": "body"
      },
      {
        "name": "filters.campaignId",
        "type": "string",
        "required": false,
        "description": "Campaign ID(s) - max 5 campaigns",
        "in": "body"
      },
      {
        "name": "filters.emailAccountId",
        "type": "string",
        "required": false,
        "description": "Email account ID(s) - max 10 accounts",
        "in": "body"
      },
      {
        "name": "filters.campaignTeamMemberId",
        "type": "string",
        "required": false,
        "description": "Team member ID(s) - max 10 members",
        "in": "body"
      },
      {
        "name": "filters.campaignTagId",
        "type": "string",
        "required": false,
        "description": "Campaign tag ID(s) - max 10 tags",
        "in": "body"
      },
      {
        "name": "filters.campaignClientId",
        "type": "string",
        "required": false,
        "description": "Client ID(s) - max 10 clients",
        "in": "body"
      },
      {
        "name": "filters.replyTimeBetween",
        "type": "array",
        "required": false,
        "description": "Date range: `[\"start_datetime\", \"end_datetime\"]` in ISO 8601 format",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "Sort order: `REPLY_TIME_DESC` or `SENT_TIME_DESC`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_messages",
    "title": "Get Inbox Replies",
    "summary": "Retrieve all lead replies across all campaigns in your unified inbox",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-messages",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/inbox-replies",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full email thread history. * `true`: Returns complete conversation thread (slower, more data) * `false`: Returns only latest message (faster, recommended for list views) **Performance tip**: Use `false` for list views, `true` only when viewing individual conversations.",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Number of records to skip for pagination. Must be non-negative.",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Number of records to return per page. Must be between 1 and 20.",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Advanced filtering options Search term to filter replies by lead email, name, or message content. Maximum 30 characters.",
        "in": "body"
      },
      {
        "name": "filters.leadCategories",
        "type": "object",
        "required": false,
        "description": "Filter by lead category assignment Include leads without category assignment",
        "in": "body"
      },
      {
        "name": "leadCategories.isAssigned",
        "type": "boolean",
        "required": false,
        "description": "Include leads with category assignment",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsNotIn",
        "type": "array",
        "required": false,
        "description": "Exclude specific category IDs (max 10 items)",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsIn",
        "type": "array",
        "required": false,
        "description": "Include only specific category IDs (max 10 items)",
        "in": "body"
      },
      {
        "name": "filters.emailStatus",
        "type": "string",
        "required": false,
        "description": "Filter by email engagement status. Can be a single status or array. Valid values: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied` Examples: * Single: `\"Replied\"` * Multiple: `[\"Replied\", \"Clicked\"]`",
        "enumValues": [
          "Opened",
          "Clicked",
          "Replied",
          "Unsubscribed",
          "Bounced",
          "Accepted",
          "Not Replied"
        ],
        "in": "body"
      },
      {
        "name": "filters.campaignId",
        "type": "string",
        "required": false,
        "description": "Filter by campaign ID(s). * Single: `12345` * Multiple: `[12345, 12346, 12347]` (max 5 campaigns for this endpoint)",
        "in": "body"
      },
      {
        "name": "filters.emailAccountId",
        "type": "string",
        "required": false,
        "description": "Filter by email account ID(s). * Single: `789` * Multiple: `[789, 790, 791, ...]` (max 20 accounts)",
        "in": "body"
      },
      {
        "name": "filters.campaignTeamMemberId",
        "type": "string",
        "required": false,
        "description": "Filter by assigned team member(s). * Single: `456` * Multiple: `[456, 457, 458]` (max 10 members)",
        "in": "body"
      },
      {
        "name": "filters.campaignTagId",
        "type": "string",
        "required": false,
        "description": "Filter by campaign tag(s). * Single: `5` * Multiple: `[5, 6, 7]` (max 10 tags)",
        "in": "body"
      },
      {
        "name": "filters.campaignClientId",
        "type": "string",
        "required": false,
        "description": "Filter by client ID(s). * Single: `100` * Multiple: `[100, 101, 102]` (max 10 clients)",
        "in": "body"
      },
      {
        "name": "filters.replyTimeBetween",
        "type": "array",
        "required": false,
        "description": "Filter by reply date range. Array of 2 ISO 8601 datetime strings. Format: `[\"start_datetime\", \"end_datetime\"]` Example: `[\"2025-01-01T00:00:00Z\", \"2025-01-31T23:59:59Z\"]`",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "Sort order for results * `REPLY_TIME_DESC`: Most recent replies first (default) * `SENT_TIME_DESC`: Most recently sent emails first",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_reminders",
    "title": "Get Reminder Emails",
    "summary": "Retrieve emails with active reminders sorted by reminder time",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-reminders",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/reminders",
    "capability": {},
    "params": [
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Pagination offset",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Records per page (1-20)",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Filter object with the following optional fields: `search` (string), `campaignId` (number or array, max 5), `emailAccountId` (number or array, max 10), `emailStatus` (string or array — valid values: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied`), `leadCategorie",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "**Unique Sort Options:** * `REMINDER_TIME_ASC`: Earliest reminders first (overdue → upcoming) * `REMINDER_TIME_DESC`: Latest reminders first (upcoming → overdue)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_scheduled",
    "title": "Get Scheduled Emails",
    "summary": "Retrieve emails queued for future sending with schedule time sorting",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-scheduled",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/scheduled",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full thread history",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Pagination offset",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Records per page (1-20)",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Standard inbox filters - campaignId max 5, emailAccountId max 10",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "**Unique Options**: `SCHEDULED_TIME_ASC` or `SCHEDULED_TIME_DESC`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_sent",
    "title": "Get Sent Emails",
    "summary": "Retrieve all sent emails across campaigns with comprehensive filtering and pagination",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-sent",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/sent",
    "capability": {},
    "params": [
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Number of records to skip for pagination. Must be non-negative.",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Number of records to return per page. Must be between 1 and 20.",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Advanced filtering options to segment your sent emails Search term to filter emails. Searches across: * Lead email addresses * Lead names * Email content Maximum 30 characters.",
        "in": "body"
      },
      {
        "name": "filters.leadCategories",
        "type": "object",
        "required": false,
        "description": "Filter by lead category assignment status and specific categories Include leads without category assignment. Set to `true` to include uncategorized leads.",
        "in": "body"
      },
      {
        "name": "leadCategories.isAssigned",
        "type": "boolean",
        "required": false,
        "description": "Include leads with category assignment. Set to `true` to include categorized leads.",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsNotIn",
        "type": "array",
        "required": false,
        "description": "Exclude specific category IDs. Array of numbers, maximum 10 items. Example: `[3, 4]` to exclude \"Not Interested\" and \"Do Not Contact\"",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsIn",
        "type": "array",
        "required": false,
        "description": "Include only specific category IDs. Array of numbers, maximum 10 items. Example: `[1, 2]` to show only \"Interested\" and \"Meeting Request\"",
        "in": "body"
      },
      {
        "name": "filters.emailStatus",
        "type": "string",
        "required": false,
        "description": "Filter by email engagement status. Can be a single status or array of statuses. **Valid statuses**: * `Opened`: Email was opened by recipient * `Clicked`: Recipient clicked a link in the email * `Replied`: Recipient sent a reply * `Unsubscribed`: Recipient unsubscribed * `Bounced`: Email bounced (ha",
        "in": "body"
      },
      {
        "name": "filters.campaignId",
        "type": "string",
        "required": false,
        "description": "Filter by campaign ID(s). Can be a single campaign or array of campaigns. * Single campaign: `12345` * Multiple campaigns: `[12345, 12346, 12347]` (max 15 campaigns)",
        "in": "body"
      },
      {
        "name": "filters.emailAccountId",
        "type": "string",
        "required": false,
        "description": "Filter by email account ID(s). Can be a single account or array of accounts. * Single account: `789` * Multiple accounts: `[789, 790, 791]` (no limit on array size)",
        "in": "body"
      },
      {
        "name": "filters.campaignTeamMemberId",
        "type": "string",
        "required": false,
        "description": "Filter by team member assignment. Can be a single member or array of members. * Single member: `456` * Multiple members: `[456, 457, 458]` (no limit on array size)",
        "in": "body"
      },
      {
        "name": "filters.campaignTagId",
        "type": "string",
        "required": false,
        "description": "Filter by campaign tag. Can be a single tag or array of tags. * Single tag: `5` * Multiple tags: `[5, 6, 7]` (no limit on array size)",
        "in": "body"
      },
      {
        "name": "filters.campaignClientId",
        "type": "string",
        "required": false,
        "description": "Filter by client ID. Can be a single client or array of clients. * Single client: `100` * Multiple clients: `[100, 101, 102]` (no limit on array size)",
        "in": "body"
      },
      {
        "name": "filters.replyTimeBetween",
        "type": "array",
        "required": false,
        "description": "Filter by reply time date range. Array of 2 ISO 8601 datetime strings. Format: `[\"start_datetime\", \"end_datetime\"]` Example: `[\"2025-01-01T00:00:00Z\", \"2025-01-31T23:59:59Z\"]`",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "Sort order for results * `REPLY_TIME_DESC`: Most recent replies first (default, best for active conversations) * `SENT_TIME_DESC`: Most recently sent emails first (best for tracking recent outreach)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_snoozed",
    "title": "Get Snoozed Emails",
    "summary": "Retrieve emails temporarily snoozed for later follow-up",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-snoozed",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/snoozed",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full email thread history",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Pagination offset",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Records per page (1-20)",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Filter object with the following optional fields: `search` (string), `campaignId` (number or array, max 5), `emailAccountId` (number or array, max 10), `emailStatus` (string or array — valid values: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied`), `leadCategorie",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "`REPLY_TIME_DESC` or `SENT_TIME_DESC`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_unread",
    "title": "Get Unread Replies",
    "summary": "Retrieve all unread replies from leads to ensure no important responses are missed",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-unread",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/unread-replies",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full email thread history * `false`: Only latest message (recommended for list views) * `true`: Complete conversation thread (use for detail views)",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Number of records to skip for pagination. Must be non-negative.",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Number of records to return per page. Must be between 1 and 20.",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Advanced filtering options to segment unread replies Search term to filter by lead email, name, or message content. Maximum 30 characters.",
        "in": "body"
      },
      {
        "name": "filters.leadCategories",
        "type": "object",
        "required": false,
        "description": "Filter by lead category assignment Include leads without category assignment",
        "in": "body"
      },
      {
        "name": "leadCategories.isAssigned",
        "type": "boolean",
        "required": false,
        "description": "Include leads with category assignment",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsNotIn",
        "type": "array",
        "required": false,
        "description": "Exclude specific category IDs (max 10 items)",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsIn",
        "type": "array",
        "required": false,
        "description": "Include only specific category IDs (max 10 items)",
        "in": "body"
      },
      {
        "name": "filters.emailStatus",
        "type": "string",
        "required": false,
        "description": "Filter by email engagement status. Can be a single status or array. Valid values: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied` **Note**: For unread endpoint, typically use `Replied` status",
        "enumValues": [
          "Opened",
          "Clicked",
          "Replied",
          "Unsubscribed",
          "Bounced",
          "Accepted",
          "Not Replied"
        ],
        "in": "body"
      },
      {
        "name": "filters.campaignId",
        "type": "string",
        "required": false,
        "description": "Filter by campaign ID(s) * Single: `12345` * Multiple: `[12345, 12346, 12347]` (max 5 campaigns)",
        "in": "body"
      },
      {
        "name": "filters.emailAccountId",
        "type": "string",
        "required": false,
        "description": "Filter by email account ID(s) * Single: `789` * Multiple: `[789, 790, 791, ...]` (max 10 accounts)",
        "in": "body"
      },
      {
        "name": "filters.campaignTeamMemberId",
        "type": "string",
        "required": false,
        "description": "Filter by assigned team member(s) * Single: `456` * Multiple: `[456, 457, 458]` (max 10 members)",
        "in": "body"
      },
      {
        "name": "filters.campaignTagId",
        "type": "string",
        "required": false,
        "description": "Filter by campaign tag(s) * Single: `5` * Multiple: `[5, 6, 7]` (max 10 tags)",
        "in": "body"
      },
      {
        "name": "filters.campaignClientId",
        "type": "string",
        "required": false,
        "description": "Filter by client ID(s) * Single: `100` * Multiple: `[100, 101, 102]` (max 10 clients)",
        "in": "body"
      },
      {
        "name": "filters.replyTimeBetween",
        "type": "array",
        "required": false,
        "description": "Filter by reply date range. Array of 2 ISO 8601 datetime strings. Format: `[\"start_datetime\", \"end_datetime\"]` Example: `[\"2025-01-01T00:00:00Z\", \"2025-01-31T23:59:59Z\"]`",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "Sort order for results * `REPLY_TIME_DESC`: Most recent replies first (default, recommended) * `SENT_TIME_DESC`: Most recently sent emails first",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_untracked",
    "title": "Get Untracked Replies",
    "summary": "Retrieve replies not tracked by SmartLead campaigns",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-untracked",
    "host": "core",
    "method": "GET",
    "route": "/master-inbox/untracked-replies",
    "capability": {},
    "params": [
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Results per page (1-100)",
        "min": 1,
        "max": 100,
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Pagination offset",
        "in": "query"
      },
      {
        "name": "fetchAttachments",
        "type": "boolean",
        "required": false,
        "description": "Include attachment metadata. **Performance tip**: Keep false for list views",
        "in": "query"
      },
      {
        "name": "fetchBody",
        "type": "boolean",
        "required": false,
        "description": "Include full email body. **Performance tip**: Keep false for list views",
        "in": "query"
      },
      {
        "name": "from_email",
        "type": "string",
        "required": false,
        "description": "Filter by sender email address",
        "in": "query"
      },
      {
        "name": "to_email",
        "type": "string",
        "required": false,
        "description": "Filter by recipient email address",
        "in": "query"
      },
      {
        "name": "subject_line",
        "type": "string",
        "required": false,
        "description": "Filter by email subject line (partial match)",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_get_views",
    "title": "Get Custom View Emails",
    "summary": "Retrieve emails based on saved custom filter views",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/get-views",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/views",
    "capability": {},
    "params": [
      {
        "name": "fetch_message_history",
        "type": "boolean",
        "required": false,
        "description": "Include full email thread history",
        "in": "query"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "Number of records to skip for pagination",
        "in": "body"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Number of records per page (1-20)",
        "min": 1,
        "max": 20,
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Custom view filter configuration Search term (max 30 characters)",
        "in": "body"
      },
      {
        "name": "filters.leadCategories",
        "type": "object",
        "required": false,
        "description": "Lead category filters Include uncategorized leads",
        "in": "body"
      },
      {
        "name": "leadCategories.isAssigned",
        "type": "boolean",
        "required": false,
        "description": "Include categorized leads",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsNotIn",
        "type": "array",
        "required": false,
        "description": "Exclude specific category IDs (max 10)",
        "in": "body"
      },
      {
        "name": "leadCategories.categoryIdsIn",
        "type": "array",
        "required": false,
        "description": "Include only specific category IDs (max 10)",
        "in": "body"
      },
      {
        "name": "filters.emailStatus",
        "type": "string",
        "required": false,
        "description": "Email engagement status: `Opened`, `Clicked`, `Replied`, `Unsubscribed`, `Bounced`, `Accepted`, `Not Replied`",
        "in": "body"
      },
      {
        "name": "filters.campaignId",
        "type": "number",
        "required": false,
        "description": "Filter by campaign ID (single value only for views)",
        "in": "body"
      },
      {
        "name": "filters.emailAccountId",
        "type": "number",
        "required": false,
        "description": "Filter by email account ID (single value)",
        "in": "body"
      },
      {
        "name": "filters.campaignTeamMemberId",
        "type": "number",
        "required": false,
        "description": "Filter by team member assignment (single value)",
        "in": "body"
      },
      {
        "name": "filters.campaignTagId",
        "type": "number",
        "required": false,
        "description": "Filter by campaign tag (single value)",
        "in": "body"
      },
      {
        "name": "filters.campaignClientId",
        "type": "number",
        "required": false,
        "description": "Filter by client ID (single value)",
        "in": "body"
      },
      {
        "name": "filters.subSequenceId",
        "type": "number",
        "required": false,
        "description": "**Unique to views**: Filter by subsequence ID to track leads in specific child campaigns",
        "in": "body"
      },
      {
        "name": "filters.replyTimeBetween",
        "type": "array",
        "required": false,
        "description": "Date range for reply times: `[\"start_date\", \"end_date\"]` in ISO 8601 format",
        "in": "body"
      },
      {
        "name": "sortBy",
        "type": "string",
        "required": false,
        "description": "Sort order: `REPLY_TIME_DESC` or `SENT_TIME_DESC`",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_mark_read",
    "title": "Change Read Status",
    "summary": "Mark emails as read or unread",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/mark-read",
    "host": "core",
    "method": "PATCH",
    "route": "/master-inbox/change-read-status",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "The ID of the lead-campaign mapping. This is the `campaign_lead_map_id` from inbox endpoints.",
        "in": "body"
      },
      {
        "name": "read_status",
        "type": "boolean",
        "required": true,
        "description": "Target read status: * `true`: Mark as read * `false`: Mark as unread",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_push_to_subsequence",
    "title": "Push Lead to Subsequence",
    "summary": "Move a lead to a subsequence (child campaign) for targeted follow-up",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/push-to-subsequence",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/push-to-subsequence",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead-campaign mapping ID from parent campaign",
        "in": "body"
      },
      {
        "name": "sub_sequence_id",
        "type": "number",
        "required": true,
        "description": "Target subsequence (child campaign) ID",
        "in": "body"
      },
      {
        "name": "sub_sequence_delay_time",
        "type": "number",
        "required": false,
        "description": "Delay in seconds before starting subsequence (min 0, default: immediate)",
        "in": "body"
      },
      {
        "name": "stop_lead_on_parent_campaign_reply",
        "type": "boolean",
        "required": false,
        "description": "If `true`, stop subsequence if lead replies to parent campaign",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_reply_status",
    "title": "Get Reply Status",
    "summary": "Check the delivery status of a sent reply from the unified inbox",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/reply-status",
    "host": "core",
    "method": "GET",
    "route": "/master-inbox/reply-status",
    "capability": {},
    "params": [
      {
        "name": "message_id",
        "type": "string",
        "required": true,
        "description": "The email Message-ID header value of the reply you want to check. This is the RFC 5322 Message-ID assigned to the email, typically in angle bracket format: ` ` Example: ` `",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_resume_lead",
    "title": "Resume Paused Lead",
    "summary": "Resume a paused lead in a campaign with optional delay",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/resume-lead",
    "host": "core",
    "method": "PATCH",
    "route": "/master-inbox/resume-lead",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "Campaign ID to resume lead in",
        "in": "body"
      },
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead-campaign mapping ID",
        "in": "body"
      },
      {
        "name": "resume_delay_days",
        "type": "number",
        "required": false,
        "description": "Optional delay in days before resuming (min 0, default immediate)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_set_reminder",
    "title": "Set Lead Reminder",
    "summary": "Set a reminder for a specific lead conversation",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/set-reminder",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/set-reminder",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead-campaign mapping ID",
        "in": "body"
      },
      {
        "name": "email_stats_id",
        "type": "string",
        "required": true,
        "description": "Specific email/message ID to set reminder for",
        "in": "body"
      },
      {
        "name": "message",
        "type": "string",
        "required": true,
        "description": "Reminder note/description",
        "in": "body"
      },
      {
        "name": "reminder_time",
        "type": "string",
        "required": true,
        "description": "Reminder timestamp in ISO 8601 format",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_update_category",
    "title": "Update Lead Category",
    "summary": "Assign or change the category for a lead (Interested, Not Interested, etc.)",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/update-category",
    "host": "core",
    "method": "PATCH",
    "route": "/master-inbox/update-category",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "The ID of the lead-campaign mapping to update. This is the `campaign_lead_map_id` from inbox or campaign leads endpoints.",
        "in": "body"
      },
      {
        "name": "category_id",
        "type": "number",
        "required": true,
        "description": "The category ID to assign. Use `null` to remove category assignment. **Common Categories**: * `1` - Interested * `2` - Meeting Request * `3` - Not Interested * `4` - Do Not Contact * `5` - Information Request * Custom categories (your defined IDs)",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_update_revenue",
    "title": "Update Lead Revenue",
    "summary": "Update the revenue value associated with a lead for ROI tracking",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/update-revenue",
    "host": "core",
    "method": "PATCH",
    "route": "/master-inbox/update-revenue",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "Lead-campaign mapping ID",
        "in": "body"
      },
      {
        "name": "revenue",
        "type": "number",
        "required": true,
        "description": "Revenue amount (must be non-negative). Currency based on account settings.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_inbox_update_team_member",
    "title": "Assign Team Member",
    "summary": "Assign or reassign a lead to a specific team member",
    "docUrl": "https://api.smartlead.ai/api-reference/inbox/update-team-member",
    "host": "core",
    "method": "POST",
    "route": "/master-inbox/update-team-member",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "email_lead_map_id",
        "type": "number",
        "required": true,
        "description": "The ID of the lead-campaign mapping to update. This is the `campaign_lead_map_id` from inbox or campaign leads endpoints.",
        "in": "body"
      },
      {
        "name": "team_member_id",
        "type": "number",
        "required": true,
        "description": "The ID of the team member to assign this lead to. Get team member IDs from your team management settings.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_assign_tags",
    "title": "Assign Tags to Lead Lists",
    "summary": "Add or remove tags from one or more lead lists",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/assign-tags",
    "host": "core",
    "method": "POST",
    "route": "/lead-list/assign-tags",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "listIds",
        "type": "array",
        "required": true,
        "description": "Array of lead list IDs to tag. 1-10 lists allowed.",
        "in": "body"
      },
      {
        "name": "tagIds",
        "type": "array",
        "required": true,
        "description": "Array of tag IDs to assign. 1-10 tags allowed.",
        "in": "body"
      },
      {
        "name": "removeTagIds",
        "type": "array",
        "required": false,
        "description": "Array of tag IDs to remove. 1-10 tags allowed.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_create",
    "title": "Create Lead List",
    "summary": "Create a new lead list for organizing and segmenting your leads",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/create",
    "host": "core",
    "method": "POST",
    "route": "/lead-list/",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "listName",
        "type": "string",
        "required": true,
        "description": "Name for the new lead list",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_delete",
    "title": "Delete Lead List",
    "summary": "Delete a lead list by its ID",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/delete",
    "host": "core",
    "method": "DELETE",
    "route": "/lead-list/{id}",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The unique ID of the lead list to delete",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_get_by_id",
    "title": "Get Lead List by ID",
    "summary": "Retrieve details of a specific lead list by its ID",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/get-by-id",
    "host": "core",
    "method": "GET",
    "route": "/lead-list/{id}",
    "capability": {},
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The unique ID of the lead list",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_import_leads",
    "title": "Import Leads to List",
    "summary": "Import leads into a specific lead list",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/import-leads",
    "host": "core",
    "method": "POST",
    "route": "/lead-list/{id}/import",
    "capability": {
      "remoteMutation": true,
      "leadImport": true
    },
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The ID of the lead list to import into",
        "in": "path"
      },
      {
        "name": "leadList",
        "type": "array",
        "required": true,
        "description": "Array of lead objects to import. Each lead should contain at minimum an email field, plus any additional fields like first\\_name, last\\_name, company, etc.",
        "in": "body"
      },
      {
        "name": "fileName",
        "type": "string",
        "required": true,
        "description": "A name to identify this import batch (e.g., the source CSV filename)",
        "in": "body"
      },
      {
        "name": "emailFieldsAdded",
        "type": "object",
        "required": false,
        "description": "Mapping of email fields in your data",
        "in": "body"
      },
      {
        "name": "customFields",
        "type": "object",
        "required": false,
        "description": "Custom field definitions for your lead data",
        "in": "body"
      },
      {
        "name": "csvSettings",
        "type": "object",
        "required": false,
        "description": "Import settings including `ignoreGlobalBlockList` (boolean) to skip blocked domain checking",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_push_between_lists",
    "title": "Move Leads Between Lists",
    "summary": "Copy or move leads from one list to another",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/push-between-lists",
    "host": "core",
    "method": "POST",
    "route": "/leads/leads/push-between-lists",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "action",
        "type": "string",
        "required": true,
        "description": "Operation type: `copy` or `move`",
        "in": "body"
      },
      {
        "name": "leadIds",
        "type": "array",
        "required": false,
        "description": "Specific lead IDs to transfer. Array of numbers, 1-10,000 items. Provide either `leadIds` or `fromListId`.",
        "in": "body"
      },
      {
        "name": "fromListId",
        "type": "number",
        "required": false,
        "description": "Source list ID to transfer all leads from. Provide either `leadIds` or `fromListId`.",
        "in": "body"
      },
      {
        "name": "toListId",
        "type": "number",
        "required": true,
        "description": "Destination list ID to transfer leads to",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_push_to_campaign",
    "title": "Push Leads to Campaign",
    "summary": "Push leads from a list or by IDs to a campaign",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/push-to-campaign",
    "host": "core",
    "method": "POST",
    "route": "/leads/push-to-campaign",
    "capability": {
      "remoteMutation": true,
      "leadImport": true
    },
    "params": [
      {
        "name": "campaignId",
        "type": "number",
        "required": false,
        "description": "Target campaign ID. Either `campaignId` or `campaignName` must be provided.",
        "in": "body"
      },
      {
        "name": "campaignName",
        "type": "string",
        "required": false,
        "description": "Target campaign name. If campaign doesn't exist, a new one is created.",
        "in": "body"
      },
      {
        "name": "action",
        "type": "string",
        "required": true,
        "description": "Whether to `copy` or `move` leads. Move removes them from the source.",
        "in": "body"
      },
      {
        "name": "leadList",
        "type": "object",
        "required": false,
        "description": "Lead selection criteria",
        "in": "body"
      },
      {
        "name": "leadList.listId",
        "type": "number",
        "required": false,
        "description": "Source list ID to push leads from",
        "in": "body"
      },
      {
        "name": "leadList.leadIds",
        "type": "array",
        "required": false,
        "description": "Specific lead IDs to push. Array of numbers, 1-10,000 items.",
        "in": "body"
      },
      {
        "name": "leadList.allLeads",
        "type": "boolean",
        "required": false,
        "description": "Set to `true` to push all leads. When true, `listId` and `leadIds` should not be provided.",
        "in": "body"
      },
      {
        "name": "csvSettings",
        "type": "object",
        "required": false,
        "description": "Import settings for the campaign (e.g., block list handling)",
        "in": "body"
      },
      {
        "name": "filters",
        "type": "object",
        "required": false,
        "description": "Additional filters to apply when selecting leads",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_lists_update",
    "title": "Update Lead List",
    "summary": "Update the name of an existing lead list",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-lists/update",
    "host": "core",
    "method": "PUT",
    "route": "/lead-list/{id}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The unique ID of the lead list to update",
        "in": "path"
      },
      {
        "name": "listName",
        "type": "string",
        "required": true,
        "description": "New name for the lead list",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_notes_get_all",
    "title": "Get Lead Notes",
    "summary": "Retrieve all notes for a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-notes/get-all",
    "host": "core",
    "method": "GET",
    "route": "/crm/leads/notes/{id}",
    "capability": {},
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The lead ID to retrieve notes for",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_lead_tags_add_to_lead",
    "title": "Add Tags to Lead",
    "summary": "Assign one or more tags to a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-tags/add-to-lead",
    "host": "core",
    "method": "POST",
    "route": "/crm/leads/tags",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "leadId",
        "type": "number",
        "required": true,
        "description": "The lead ID to add tags to",
        "in": "body"
      },
      {
        "name": "tagIds",
        "type": "array",
        "required": true,
        "description": "Array of tag IDs to assign to the lead",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_lead_tags_get_all",
    "title": "Get Lead Tags",
    "summary": "Get tags associated with a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-tags/get-all",
    "host": "core",
    "method": "GET",
    "route": "/crm/leads/tags",
    "capability": {},
    "params": [
      {
        "name": "leadId",
        "type": "number",
        "required": false,
        "description": "The lead ID to retrieve tags for. If omitted, returns all available tags.",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartlead_lead_tags_remove_from_lead",
    "title": "Remove Tag from Lead",
    "summary": "Remove a specific tag mapping from a lead",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-tags/remove-from-lead",
    "host": "core",
    "method": "DELETE",
    "route": "/crm/leads/tags/{tagMappingId}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "tagMappingId",
        "type": "number",
        "required": true,
        "description": "The tag mapping ID (not the tag ID). Get this from the Get Lead Tags response.",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_lead_tasks_get_all",
    "title": "Get Lead Tasks",
    "summary": "Retrieve all tasks for a specific lead",
    "docUrl": "https://api.smartlead.ai/api-reference/lead-tasks/get-all",
    "host": "core",
    "method": "GET",
    "route": "/crm/leads/tasks/{id}",
    "capability": {},
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The lead ID to retrieve tasks for",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_leads_categories",
    "title": "Get Lead Categories",
    "summary": "Retrieve all available lead categories including global and user-specific categories",
    "docUrl": "https://api.smartlead.ai/api-reference/leads/categories",
    "host": "core",
    "method": "GET",
    "route": "/leads/fetch-categories",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartlead_leads_unsubscribe",
    "title": "Unsubscribe Lead Globally",
    "summary": "Globally unsubscribe a lead from all current and future campaigns",
    "docUrl": "https://api.smartlead.ai/api-reference/leads/unsubscribe",
    "host": "core",
    "method": "POST",
    "route": "/leads/{lead_id}/unsubscribe",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "The lead ID to unsubscribe globally",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_leads_update",
    "title": "Update Lead",
    "summary": "Update lead contact information and custom fields. Changes apply globally across all campaigns.",
    "docUrl": "https://api.smartlead.ai/api-reference/leads/update",
    "host": "core",
    "method": "POST",
    "route": "/campaigns/{campaign_id}/leads/{lead_id}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "campaign_id",
        "type": "number",
        "required": true,
        "description": "The campaign ID (used for validation and audit logging)",
        "in": "path"
      },
      {
        "name": "lead_id",
        "type": "number",
        "required": true,
        "description": "The lead ID to update",
        "in": "path"
      },
      {
        "name": "email",
        "type": "string",
        "required": true,
        "description": "Lead's email address (required field, even if not being changed)",
        "in": "body"
      },
      {
        "name": "first_name",
        "type": "string",
        "required": false,
        "description": "Lead's first name",
        "in": "body"
      },
      {
        "name": "last_name",
        "type": "string",
        "required": false,
        "description": "Lead's last name",
        "in": "body"
      },
      {
        "name": "phone_number",
        "type": "string",
        "required": false,
        "description": "Lead's phone number",
        "in": "body"
      },
      {
        "name": "company_name",
        "type": "string",
        "required": false,
        "description": "Company name",
        "in": "body"
      },
      {
        "name": "website",
        "type": "string",
        "required": false,
        "description": "Company website",
        "in": "body"
      },
      {
        "name": "location",
        "type": "string",
        "required": false,
        "description": "Lead's location",
        "in": "body"
      },
      {
        "name": "linkedin_profile",
        "type": "string",
        "required": false,
        "description": "LinkedIn profile URL",
        "in": "body"
      },
      {
        "name": "company_url",
        "type": "string",
        "required": false,
        "description": "Company URL",
        "in": "body"
      },
      {
        "name": "custom_fields",
        "type": "object",
        "required": false,
        "description": "Custom fields object (maximum 200 key-value pairs). Custom fields are merged with existing fields, not replaced.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_utilities_send_single_email",
    "title": "Send Single Email",
    "summary": "Send one-off transactional email outside of campaigns with attachments",
    "docUrl": "https://api.smartlead.ai/api-reference/utilities/send-single-email",
    "host": "core",
    "method": "POST",
    "route": "/send-email/initiate",
    "capability": {
      "remoteMutation": true,
      "sending": true
    },
    "params": [
      {
        "name": "to",
        "type": "string",
        "required": true,
        "description": "Recipient email address",
        "in": "body"
      },
      {
        "name": "subject",
        "type": "string",
        "required": true,
        "description": "Email subject line",
        "in": "body"
      },
      {
        "name": "body",
        "type": "string",
        "required": true,
        "description": "Email body content (HTML or plain text)",
        "in": "body"
      },
      {
        "name": "fromEmail",
        "type": "string",
        "required": false,
        "description": "Sender email address. Either `fromEmail` or `fromEmailId` is required",
        "in": "body"
      },
      {
        "name": "fromEmailId",
        "type": "number",
        "required": false,
        "description": "ID of the sender email account. Either `fromEmail` or `fromEmailId` is required",
        "in": "body"
      },
      {
        "name": "fromName",
        "type": "string",
        "required": false,
        "description": "Display name for the sender (optional)",
        "in": "body"
      },
      {
        "name": "replyTo",
        "type": "string",
        "required": false,
        "description": "Reply-to email address (optional)",
        "in": "body"
      },
      {
        "name": "attachments",
        "type": "array",
        "required": false,
        "description": "Array of attachment objects (optional). Each attachment requires: * `filename` (string): Name of the file * `content` (string): Base64-encoded file content * `mimeType` (string): MIME type of the file (e.g., \"application/pdf\")",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_webhooks_create",
    "title": "Create Webhook",
    "summary": "Create webhook to receive real-time notifications for campaign events like opens, clicks, and replies",
    "docUrl": "https://api.smartlead.ai/api-reference/webhooks/create",
    "host": "core",
    "method": "POST",
    "route": "/webhook/create",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "webhook_url",
        "type": "string",
        "required": true,
        "description": "The URL where webhook notifications will be sent via HTTP POST",
        "in": "body"
      },
      {
        "name": "association_type",
        "type": "string",
        "required": true,
        "description": "Scope of the webhook. Valid values: * `user` - User level (all campaigns) * `client` - Client level (all campaigns for a client) * `campaign` - Campaign level (single campaign)",
        "enumValues": [
          "user",
          "client",
          "campaign"
        ],
        "in": "body"
      },
      {
        "name": "email_campaign_id",
        "type": "number",
        "required": false,
        "description": "Campaign ID (required when association\\_type=3)",
        "in": "body"
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Webhook name for identification",
        "in": "body"
      },
      {
        "name": "event_type_map",
        "type": "object",
        "required": false,
        "description": "Map of events to subscribe to. Set each event key to `true` to enable. Available events: * `EMAIL_SENT` - Email sent * `FIRST_EMAIL_SENT` - First email of sequence sent * `EMAIL_OPEN` - Email opened * `EMAIL_LINK_CLICK` - Link clicked * `EMAIL_REPLY` - Lead replied * `EMAIL_BOUNCE` - Email bounced *",
        "in": "body"
      },
      {
        "name": "category_id_map",
        "type": "object",
        "required": false,
        "description": "Map of category IDs to filter events by lead category",
        "in": "body"
      },
      {
        "name": "client_id",
        "type": "number",
        "required": false,
        "description": "Client ID (required when association\\_type=2)",
        "in": "body"
      },
      {
        "name": "event_type",
        "type": "string",
        "required": false,
        "description": "Specific event type to subscribe to",
        "in": "body"
      },
      {
        "name": "category_id",
        "type": "number",
        "required": false,
        "description": "Specific lead category ID to filter events by",
        "in": "body"
      },
      {
        "name": "webhook_type",
        "type": "string",
        "required": false,
        "description": "Webhook type identifier",
        "in": "body"
      },
      {
        "name": "force_create",
        "type": "boolean",
        "required": false,
        "description": "Force creation even if a similar webhook exists",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_webhooks_delete",
    "title": "Delete Campaign Webhook",
    "summary": "Permanently delete a campaign webhook and stop all event notifications",
    "docUrl": "https://api.smartlead.ai/api-reference/webhooks/delete",
    "host": "core",
    "method": "DELETE",
    "route": "/webhook/delete",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": "The webhook ID to delete",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartlead_webhooks_get",
    "title": "Get Webhook",
    "summary": "Get configuration details for a specific webhook by ID",
    "docUrl": "https://api.smartlead.ai/api-reference/webhooks/get",
    "host": "core",
    "method": "GET",
    "route": "/webhook/{webhook_id}",
    "capability": {},
    "params": [
      {
        "name": "webhook_id",
        "type": "number",
        "required": true,
        "description": "The webhook id",
        "in": "path"
      }
    ]
  },
  {
    "tool": "smartlead_webhooks_update",
    "title": "Update Webhook",
    "summary": "Update the configuration of an existing webhook",
    "docUrl": "https://api.smartlead.ai/api-reference/webhooks/update",
    "host": "core",
    "method": "PUT",
    "route": "/webhook/update/{webhook_id}",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "webhook_id",
        "type": "number",
        "required": true,
        "description": "The webhook ID to update",
        "in": "path"
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "A descriptive name for the webhook",
        "in": "body"
      },
      {
        "name": "webhook_url",
        "type": "string",
        "required": false,
        "description": "The URL to receive webhook events",
        "in": "body"
      },
      {
        "name": "event_types",
        "type": "array",
        "required": false,
        "description": "Array of event types to subscribe to (e.g. `EMAIL_SENT`, `EMAIL_OPENED`, `EMAIL_REPLIED`, `EMAIL_CLICKED`, `LEAD_UNSUBSCRIBED`, `EMAIL_BOUNCED`)",
        "in": "body"
      },
      {
        "name": "categories",
        "type": "array",
        "required": false,
        "description": "Array of lead categories to filter events by",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartsenders_auto_generate",
    "title": "Auto Generate Mailboxes",
    "summary": "Auto-generate professional mailbox email addresses for one or more domains",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/auto-generate",
    "host": "senders",
    "method": "POST",
    "route": "/smart-senders/auto-generate-mailboxes",
    "capability": {
      "remoteMutation": true
    },
    "params": [
      {
        "name": "vendor_id",
        "type": "string",
        "required": true,
        "description": "Unique identifier of the vendor whose mailbox generation logic will be used.",
        "in": "body"
      },
      {
        "name": "domains",
        "type": "object",
        "required": false,
        "description": "List of domains for which mailboxes need to be generated.",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartsenders_domain_list",
    "title": "Get Purchased Domain List",
    "summary": "Get the list of domains purchased through Smart Senders",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/domain-list",
    "host": "senders",
    "method": "GET",
    "route": "/smart-senders/get-domain-list",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartsenders_get_otp",
    "title": "Get OTP for Admin Mailbox",
    "summary": "Fetch a one-time password for an admin mailbox",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/get-otp",
    "host": "senders",
    "method": "GET",
    "route": "/smart-senders/auth-secret",
    "capability": {},
    "params": [
      {
        "name": "email_account",
        "type": "string",
        "required": true,
        "description": "The email address for which the OTP should be generated.",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartsenders_get_vendors",
    "title": "Get Vendors",
    "summary": "Get list of active mailbox vendors with pricing and service details",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/get-vendors",
    "host": "senders",
    "method": "GET",
    "route": "/smart-senders/get-vendors",
    "capability": {},
    "params": []
  },
  {
    "tool": "smartsenders_order_details",
    "title": "Get Order Details",
    "summary": "Retrieve the status and details of a specific order placed through Smart Senders",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/order-details",
    "host": "senders",
    "method": "GET",
    "route": "/smart-senders/order-details",
    "capability": {},
    "params": [
      {
        "name": "order_id",
        "type": "string",
        "required": true,
        "description": "Unique order reference ID for which details are being requested.",
        "in": "query"
      }
    ]
  },
  {
    "tool": "smartsenders_place_order",
    "title": "Place Order",
    "summary": "Place an order to purchase domains and provision mailboxes through a Smart Senders vendor",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/place-order",
    "host": "senders",
    "method": "POST",
    "route": "/smart-senders/place-order",
    "capability": {
      "remoteMutation": true,
      "destructive": true
    },
    "params": [
      {
        "name": "vendor_id",
        "type": "string",
        "required": true,
        "description": "Unique identifier of the vendor with whom the order will be placed.",
        "in": "body"
      },
      {
        "name": "forwarding_domain",
        "type": "string",
        "required": true,
        "description": "Domain to which purchased domains will be configured to forward (e.g., `example.com` or customer's tracking domain).",
        "in": "body"
      },
      {
        "name": "user_details",
        "type": "object",
        "required": true,
        "description": "Customer billing/contact details required by the vendor for domain purchase and provisioning. Fields include: * `email` (string) — Contact email * `firstName` (string) — First name * `lastName` (string) — Last name * `company` (string) — Company name * `country` (string) — Country * `city` (string) ",
        "in": "body"
      },
      {
        "name": "domains",
        "type": "array",
        "required": true,
        "description": "Array of domain objects. Each object contains: * `domain_name` (string) — The domain to purchase * `mailbox_details` (array) — Array of mailbox objects, each containing: * `mailbox` (string, required) — Full email address for the mailbox * `first_name` (string, required) — First name for the mailbox",
        "in": "body"
      }
    ]
  },
  {
    "tool": "smartsenders_search_domain",
    "title": "Search Domain",
    "summary": "Search for available domains in Smart Senders marketplace",
    "docUrl": "https://api.smartlead.ai/api-reference/smart-senders/search-domain",
    "host": "senders",
    "method": "GET",
    "route": "/smart-senders/search-domain",
    "capability": {},
    "params": [
      {
        "name": "domain_name",
        "type": "string",
        "required": false,
        "description": "The domain name for which availability or related operations are being requested.",
        "in": "query"
      },
      {
        "name": "vendor_id",
        "type": "string",
        "required": false,
        "description": "The unique identifier of the vendor whose service will be used to process the domain request.",
        "in": "query"
      }
    ]
  }
] as const;
