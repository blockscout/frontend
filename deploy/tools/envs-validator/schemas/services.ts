import * as yup from 'yup';

// External services envs
export default yup.object({
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: yup.string(),
    NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY: yup.string(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID: yup.string(),
    NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY: yup.string(),
    NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: yup.string(),
});