export default function makePrettyLink(url: string | undefined): { url: string; domain: string } | undefined {
  try {
    const urlObj = new URL(url ?? '');
    return {
      url: urlObj.href,
      domain: urlObj.hostname,
    };
  } catch (error) {}
}
