angular.module('aurora')
  .constant('CONSTANTS', {
    OAUTH: {
      clientId: 'aurora',
      secret: 'QQsfDh5Q7S1BB8UHiB0Ni3okKn8lEEbeDx1k4k2OjT2jWuzr'
    },
    API_URIS : [
      {
        key: 'localhost',
        env: 'dev',
        ui: 'http://localhost:9000/#/',
        back: 'http://localhost:8082/api/v1/',
        oauth: 'http://localhost:8082/api/v1/oauth/token',
        restInIndex: 3,
        PAYPAL: {
          URL: 'https://api.sandbox.paypal.com',
          CLIENT_ID: 'AV-L9FN9F7MnBzERCohJCLT9w243foC__5k1uEZIydoHa0OEku-nOhVoeBjepfcjd_85EYo3d-S1iuy-',
          SECRET: 'ECB3NbiNOWAMbDW2ttMmGxJGLwFTj25HQtSTpbi4PX34glFAaCi9_GhpKmTEsrGEWpsr71fu9OZfDRzu'
        },
        CONEKTA : {
          KEY: 'key_PbzQyLLQMdBi6Him4sWushQ'
        }
      },
      {
        key: 'airsoftware-qc.com',
        env: 'qc',
        ui: 'https://airsoftware-qc.com/aurora/#/',
        back: 'https://airsoftware-qc.com/aurora/api/v1/',
        oauth: 'https://airsoftware-qc.com/aurora/api/v1/oauth/token',
        restInIndex: 4,
        PAYPAL: {
          URL: 'https://api.sandbox.paypal.com',
          CLIENT_ID: 'AV-L9FN9F7MnBzERCohJCLT9w243foC__5k1uEZIydoHa0OEku-nOhVoeBjepfcjd_85EYo3d-S1iuy-',
          SECRET: 'ECB3NbiNOWAMbDW2ttMmGxJGLwFTj25HQtSTpbi4PX34glFAaCi9_GhpKmTEsrGEWpsr71fu9OZfDRzu'
        },
        CONEKTA : {
          KEY: 'key_PbzQyLLQMdBi6Him4sWushQ'
        }
      },
      {
        key: 'reservatuconsultorio.com',
        env: 'prod',
        ui: 'https://reservatuconsultorio.com/#/',
        back: 'https://reservatuconsultorio.com/api/v1/',
        oauth: 'https://reservatuconsultorio.com/api/v1/oauth/token',
        restInIndex: 3,
        PAYPAL: {
          URL: 'https://api.paypal.com',
          CLIENT_ID: 'AcWWSfzucnMcvf0L8Q7HhjpcnLvOV4tyLPtpBULUqSz36dw5cexCFFvsfw_JxpEgZVr0jl-jIr1Te_Xl',
          SECRET: 'EDkAaCM1JaAKf-3J5vt_p_OKdY9ayJyGpelt9vX5GUNzt3NXvtPYT31Pa6v6cHX7W8ZlsqgMsHqUakj4'
        },
        CONEKTA : {
          KEY: 'key_QWWCBjePh6FqNvyXja1yZAw'
        }
      }
    ],
    ENVS: {
      DEV: 'dev',
      QC: 'qc',
      PROD: 'prod'
    },
    MAIL_DOMAIN: '@aurora.com',
    CALENDAR_BY_CUBICLE: 1,
    CALENDAR_BY_USER: 2,
    CALENDAR_TYPE_BY_HR: 1,
    CALENDAR_TYPE_BY_DAY: 2,
    CUBICLES:{
      MEDICAL: 1,
      DENTAL: 2
    },
    ROLES:{
      SUPER_ADMIN: 1,
      BRANCH_ADMIN: 2,
      SELLS: 3,
      CLIENT: 4,
      LEAD: 9999
    },
    PAYMENT_METHOD: {
      PAYPAL: 1,
      CC: 2,
      CASH: 3
    },
    APT: {
      CANCELED: 1,
      ALREADY_CANCELED: 2,
      ERROR_DATE: 3,
      NOT_FOUND: 4
    },
    CLOUD_SPACE: 1024 * 5,
    REPORTS: {
      FORMAT: {
        EXCEL: {
          KEY: 1,
          VALUE: 'xls'
        },
        PDF: {
          KEY: 2,
          VALUE: 'pdf'
        }
      }
    }
  });