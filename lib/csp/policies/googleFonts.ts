import type CspDev from 'csp-dev';

export default function generateGoogleFontsDescriptor(): CspDev.DirectiveDescriptor {
  // we use Inter and Poppins in the app

  return {
    'style-src': [
      'fonts.googleapis.com',
    ],
    'font-src': [
      'fonts.gstatic.com',
      'fonts.googleapis.com',
    ],
  };
}
